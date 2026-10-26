import { createClient } from "@/lib/supabase/client";
import {
  StudentEnquiry,
  VisitRequest,
  BookingRecord,
  PaymentRecord,
  InAppNotification,
  MessageThread,
} from "@/types";
import { getGokakProperties } from "@/lib/api/properties";

// Client session store for interactive testing of enquiries, visits, and bookings
const sessionEnquiries: StudentEnquiry[] = [];
const sessionVisits: VisitRequest[] = [];
const sessionBookings: BookingRecord[] = [];

const STORAGE_KEY_ENQUIRIES = "nestnova_local_enquiries";
const STORAGE_KEY_VISITS = "nestnova_local_visits";
const STORAGE_KEY_BOOKINGS = "nestnova_local_bookings";
const STORAGE_KEY_SAVED = "nestnova_local_saved_properties";

function loadFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// Fast timeout helper to prevent hanging on cold Supabase connections
async function withFastTimeout<T>(promise: PromiseLike<T>, ms = 1200): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([Promise.resolve(promise), timeout]);
}

/* ========================================================
   ENQUIRIES
   ======================================================== */
export async function getStudentEnquiries(studentId?: string): Promise<StudentEnquiry[]> {
  const supabase = createClient();
  let dbEnquiries: StudentEnquiry[] = [];

  try {
    const res = await withFastTimeout(
      supabase
        .from("enquiries")
        .select(`
          id,
          student_id,
          property_id,
          message,
          status,
          created_at,
          properties ( name, locality, owner_id )
        `)
        .order("created_at", { ascending: false })
    );
    const data = res?.data;

    if (data && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dbEnquiries = data.map((e: any) => ({
        id: e.id,
        student_id: e.student_id,
        property_id: e.property_id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property_name: (e.properties as any)?.name || "Gokak Stay",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property_locality: (e.properties as any)?.locality || "Gokak",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner_id: (e.properties as any)?.owner_id || "",
        message: e.message,
        status: (e.status as "open" | "closed" | "replied") || "open",
        created_at: e.created_at,
      }));
    }
  } catch {
    dbEnquiries = [];
  }

  const stored = loadFromStorage<StudentEnquiry>(STORAGE_KEY_ENQUIRIES);
  const combined = [...sessionEnquiries, ...stored, ...dbEnquiries];
  const uniqueMap = new Map<string, StudentEnquiry>();
  for (const item of combined) {
    if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
  }
  let results = Array.from(uniqueMap.values());
  if (studentId) {
    results = results.filter((e) => e.student_id === studentId);
  }
  return results;
}

export async function submitEnquiry(input: {
  propertyId: string;
  propertyName: string;
  propertyLocality: string;
  ownerId?: string;
  studentId?: string;
  studentName?: string;
  studentPhone?: string;
  message: string;
}): Promise<{ ok: boolean; data?: StudentEnquiry; error?: string }> {
  const supabase = createClient();
  const enquiryItem: StudentEnquiry = {
    id: "enq-" + Date.now(),
    student_id: input.studentId || "student-current",
    property_id: input.propertyId,
    property_name: input.propertyName,
    property_locality: input.propertyLocality,
    owner_id: input.ownerId || "owner-1",
    message: input.message,
    status: "open",
    student_name: input.studentName || "Student Renter",
    student_phone: input.studentPhone || "",
    created_at: new Date().toISOString(),
  };

  try {
    const { data: userRes } = await supabase.auth.getUser();
    if (userRes.user) {
      await supabase.from("enquiries").insert({
        property_id: input.propertyId,
        student_id: userRes.user.id,
        message: input.message,
        status: "open",
      });
    }
  } catch {
    // If offline or not signed in, session storage keeps local flow interactive
  }

  sessionEnquiries.unshift(enquiryItem);
  const existing = loadFromStorage<StudentEnquiry>(STORAGE_KEY_ENQUIRIES);
  saveToStorage(STORAGE_KEY_ENQUIRIES, [enquiryItem, ...existing.filter((e) => e.id !== enquiryItem.id)]);
  return { ok: true, data: enquiryItem };
}

export async function updateEnquiryStatus(id: string, status: StudentEnquiry["status"]): Promise<boolean> {
  const existing = loadFromStorage<StudentEnquiry>(STORAGE_KEY_ENQUIRIES);
  const updated = existing.map((e) => (e.id === id ? { ...e, status } : e));
  saveToStorage(STORAGE_KEY_ENQUIRIES, updated);
  const sessionItem = sessionEnquiries.find((e) => e.id === id);
  if (sessionItem) sessionItem.status = status;

  try {
    const supabase = createClient();
    await supabase.from("enquiries").update({ status }).eq("id", id);
  } catch {}
  return true;
}

/* ========================================================
   VISITS (STRICTLY SEPARATE FROM BOOKINGS)
   ======================================================== */
export async function getStudentVisits(studentId?: string): Promise<VisitRequest[]> {
  const supabase = createClient();
  let dbVisits: VisitRequest[] = [];

  try {
    const res = await withFastTimeout(
      supabase
        .from("visit_requests")
        .select(`
          id,
          student_id,
          property_id,
          status,
          scheduled_at,
          student_notes,
          owner_notes,
          created_at,
          properties ( name, locality, owner_id )
        `)
        .order("created_at", { ascending: false })
    );
    const data = res?.data;

    if (data && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dbVisits = data.map((v: any) => ({
        id: v.id,
        student_id: v.student_id,
        property_id: v.property_id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property_name: (v.properties as any)?.name || "Gokak Stay",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property_locality: (v.properties as any)?.locality || "Gokak",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner_id: (v.properties as any)?.owner_id || "",
        status: v.status || "pending",
        scheduled_at: v.scheduled_at,
        student_notes: v.student_notes,
        owner_notes: v.owner_notes,
        created_at: v.created_at,
      }));
    }
  } catch {
    dbVisits = [];
  }

  const stored = loadFromStorage<VisitRequest>(STORAGE_KEY_VISITS);
  const combined = [...sessionVisits, ...stored, ...dbVisits];
  const uniqueMap = new Map<string, VisitRequest>();
  for (const item of combined) {
    if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
  }
  let results = Array.from(uniqueMap.values());
  if (studentId) {
    results = results.filter((v) => v.student_id === studentId);
  }
  return results;
}

export async function submitVisitRequest(input: {
  propertyId: string;
  propertyName: string;
  propertyLocality: string;
  ownerId?: string;
  studentId?: string;
  studentName?: string;
  studentPhone?: string;
  scheduledAt: string;
  notes?: string;
}): Promise<{ ok: boolean; data?: VisitRequest; error?: string }> {
  const supabase = createClient();
  const visitItem: VisitRequest = {
    id: "vis-" + Date.now(),
    student_id: input.studentId || "student-current",
    property_id: input.propertyId,
    property_name: input.propertyName,
    property_locality: input.propertyLocality,
    owner_id: input.ownerId || "owner-1",
    status: "pending",
    scheduled_at: input.scheduledAt,
    student_notes: input.notes || null,
    student_name: input.studentName || "Student Renter",
    student_phone: input.studentPhone || "",
    created_at: new Date().toISOString(),
  };

  try {
    const { data: userRes } = await supabase.auth.getUser();
    if (userRes.user) {
      await supabase.from("visit_requests").insert({
        property_id: input.propertyId,
        student_id: userRes.user.id,
        scheduled_at: input.scheduledAt,
        student_notes: input.notes,
        status: "pending",
      });
    }
  } catch {
    // Graceful offline fallback
  }

  sessionVisits.unshift(visitItem);
  const existing = loadFromStorage<VisitRequest>(STORAGE_KEY_VISITS);
  saveToStorage(STORAGE_KEY_VISITS, [visitItem, ...existing.filter((v) => v.id !== visitItem.id)]);
  return { ok: true, data: visitItem };
}

export async function updateVisitStatus(id: string, status: VisitRequest["status"]): Promise<boolean> {
  const existing = loadFromStorage<VisitRequest>(STORAGE_KEY_VISITS);
  const updated = existing.map((v) => (v.id === id ? { ...v, status } : v));
  saveToStorage(STORAGE_KEY_VISITS, updated);
  const sessionItem = sessionVisits.find((v) => v.id === id);
  if (sessionItem) sessionItem.status = status;

  try {
    const supabase = createClient();
    await supabase.from("visit_requests").update({ status }).eq("id", id);
  } catch {}
  return true;
}

/* ========================================================
   BOOKINGS (ROOM / BED RESERVATION)
   ======================================================== */
export async function getStudentBookings(studentId?: string): Promise<BookingRecord[]> {
  const supabase = createClient();
  let dbBookings: BookingRecord[] = [];

  try {
    const res = await withFastTimeout(
      supabase
        .from("stay_records")
        .select(`
          id,
          student_id,
          property_id,
          start_date,
          end_date,
          status,
          created_at,
          properties ( name, locality )
        `)
        .order("created_at", { ascending: false })
    );
    const data = res?.data;

    if (data && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dbBookings = data.map((b: any) => ({
        id: b.id,
        student_id: b.student_id,
        property_id: b.property_id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property_name: (b.properties as any)?.name || "Gokak Stay",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        property_locality: (b.properties as any)?.locality || "Gokak",
        room_type: "Standard Room",
        monthly_rent: 4500,
        deposit_amount: 5000,
        status: (b.status as BookingRecord["status"]) || "pending",
        start_date: b.start_date,
        end_date: b.end_date,
        created_at: b.created_at,
      }));
    }
  } catch {
    dbBookings = [];
  }

  const stored = loadFromStorage<BookingRecord>(STORAGE_KEY_BOOKINGS);
  const combined = [...sessionBookings, ...stored, ...dbBookings];
  const uniqueMap = new Map<string, BookingRecord>();
  for (const item of combined) {
    if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
  }
  let results = Array.from(uniqueMap.values());
  if (studentId) {
    results = results.filter((b) => b.student_id === studentId);
  }
  return results;
}

export async function submitBooking(input: {
  propertyId: string;
  propertyName: string;
  propertyLocality: string;
  roomType: string;
  monthlyRent: number;
  depositAmount: number;
  startDate: string;
  studentId?: string;
  studentName?: string;
  studentPhone?: string;
}): Promise<{ ok: boolean; data?: BookingRecord; error?: string }> {
  const supabase = createClient();
  const bookingItem: BookingRecord = {
    id: "bk-" + Date.now(),
    student_id: input.studentId || "student-current",
    property_id: input.propertyId,
    property_name: input.propertyName,
    property_locality: input.propertyLocality,
    room_type: input.roomType,
    monthly_rent: input.monthlyRent,
    deposit_amount: input.depositAmount,
    status: "pending",
    start_date: input.startDate,
    student_name: input.studentName || "Student Renter",
    student_phone: input.studentPhone || "",
    created_at: new Date().toISOString(),
  };

  try {
    const { data: userRes } = await supabase.auth.getUser();
    if (userRes.user) {
      await supabase.from("stay_records").insert({
        property_id: input.propertyId,
        student_id: userRes.user.id,
        start_date: input.startDate,
        status: "pending",
      });
    }
  } catch {
    // Fallback
  }

  sessionBookings.unshift(bookingItem);
  const existing = loadFromStorage<BookingRecord>(STORAGE_KEY_BOOKINGS);
  saveToStorage(STORAGE_KEY_BOOKINGS, [bookingItem, ...existing.filter((b) => b.id !== bookingItem.id)]);
  return { ok: true, data: bookingItem };
}

export async function updateBookingStatus(id: string, status: BookingRecord["status"]): Promise<boolean> {
  const existing = loadFromStorage<BookingRecord>(STORAGE_KEY_BOOKINGS);
  const updated = existing.map((b) => (b.id === id ? { ...b, status } : b));
  saveToStorage(STORAGE_KEY_BOOKINGS, updated);
  const sessionItem = sessionBookings.find((b) => b.id === id);
  if (sessionItem) sessionItem.status = status;

  try {
    const supabase = createClient();
    await supabase.from("stay_records").update({ status }).eq("id", id);
  } catch {}
  return true;
}

/* ========================================================
   PAYMENTS
   ======================================================== */
export async function getStudentPayments(): Promise<PaymentRecord[]> {
  const supabase = createClient();
  try {
    const res = await withFastTimeout(
      supabase.from("payments").select("*").order("created_at", { ascending: false })
    );
    const data = res?.data;
    if (data && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        order_id: p.order_id,
        amount: Number(p.amount) || 0,
        status: p.status || "pending",
        created_at: p.created_at,
      }));
    }
  } catch {
    // Return empty list if no payments or offline
  }
  return [];
}

/* ========================================================
   NOTIFICATIONS
   ======================================================== */
export async function getStudentNotifications(): Promise<InAppNotification[]> {
  const supabase = createClient();
  try {
    const res = await withFastTimeout(
      supabase.from("notifications").select("*").order("created_at", { ascending: false })
    );
    const data = res?.data;
    if (data && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((n: any) => ({
        id: n.id,
        user_id: n.user_id,
        title: n.title,
        message: n.message,
        category: "booking",
        is_read: !!n.is_read,
        created_at: n.created_at,
      }));
    }
  } catch {
    // Return empty list
  }
  return [];
}

/* ========================================================
   SAVED PROPERTIES (WISHLIST)
   ======================================================== */
const sessionSavedPropertyIds: string[] = [];

export function toggleSavedProperty(id: string): string[] {
  const current = getSavedPropertyIds();
  const idx = current.indexOf(id);
  let updated: string[];
  if (idx >= 0) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
  }
  saveToStorage(STORAGE_KEY_SAVED, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
  return updated;
}

export function getSavedPropertyIds(): string[] {
  const stored = loadFromStorage<string>(STORAGE_KEY_SAVED);
  if (stored.length > 0) return stored;
  return [...sessionSavedPropertyIds];
}

/* ========================================================
   OWNER OVERVIEW METRICS
   ======================================================== */
export async function getOwnerOverviewMetrics(): Promise<{
  activeProperties: number;
  availableBeds: number;
  totalBeds: number;
  pendingEnquiries: number;
  pendingVisits: number;
  pendingBookings: number;
}> {
  const [allEnquiries, allVisits, allBookings, { properties }] = await Promise.all([
    getStudentEnquiries(),
    getStudentVisits(),
    getStudentBookings(),
    getGokakProperties(),
  ]);

  const totalBeds = properties.reduce(
    (acc, p) => acc + (p.rooms?.reduce((rAcc, r) => rAcc + (r.beds?.length || r.sharing_capacity), 0) || 0),
    0
  );
  const availableBeds = properties.reduce(
    (acc, p) =>
      acc + (p.rooms?.reduce((rAcc, r) => rAcc + (r.beds?.filter((b) => b.status === "available").length || Math.max(1, r.sharing_capacity - 1)), 0) || 0),
    0
  );

  return {
    activeProperties: properties.length,
    availableBeds,
    totalBeds,
    pendingEnquiries: allEnquiries.filter((e) => e.status === "open").length,
    pendingVisits: allVisits.filter((v) => v.status === "pending").length,
    pendingBookings: allBookings.filter((b) => b.status === "pending").length,
  };
}

/* ========================================================
   MESSAGES
   ======================================================== */
const STORAGE_KEY_THREAD_MESSAGES = "nestnova_thread_messages";

interface StoredThreadMessages {
  threadId: string;
  messages: Array<{
    id: string;
    sender_id: string;
    sender_name: string;
    text: string;
    created_at: string;
    is_mine: boolean;
  }>;
}

export function sendMessageToThread(
  threadId: string,
  msg: { text: string; sender_id?: string; sender_name?: string; is_mine?: boolean }
) {
  const newMsg = {
    id: "msg-" + Date.now(),
    sender_id: msg.sender_id || "student-current",
    sender_name: msg.sender_name || "You",
    text: msg.text,
    created_at: new Date().toISOString(),
    is_mine: msg.is_mine ?? true,
  };

  const allStored = loadFromStorage<StoredThreadMessages>(STORAGE_KEY_THREAD_MESSAGES);
  const existingThread = allStored.find((t) => t.threadId === threadId);
  if (existingThread) {
    existingThread.messages.push(newMsg);
  } else {
    allStored.push({ threadId, messages: [newMsg] });
  }
  saveToStorage(STORAGE_KEY_THREAD_MESSAGES, allStored);
  return newMsg;
}

export async function getMessageThreads(): Promise<MessageThread[]> {
  // Messages are strictly tied to actual enquiries and bookings
  const enquiries = await getStudentEnquiries();
  const visits = await getStudentVisits();
  const storedMessages = loadFromStorage<StoredThreadMessages>(STORAGE_KEY_THREAD_MESSAGES);

  const threads: MessageThread[] = [];

  for (const enq of enquiries) {
    const threadId = "th-enq-" + enq.id;
    const extra = storedMessages.find((t) => t.threadId === threadId)?.messages || [];
    const baseMsg = {
      id: "m-1-" + enq.id,
      sender_id: enq.student_id,
      sender_name: "You",
      text: enq.message,
      created_at: enq.created_at,
      is_mine: true,
    };
    const combinedMessages = [baseMsg, ...extra];
    const latest = combinedMessages[combinedMessages.length - 1];

    threads.push({
      id: threadId,
      property_id: enq.property_id,
      property_name: enq.property_name,
      participant_id: enq.owner_id,
      participant_name: `${enq.property_name} Owner`,
      participant_role: "owner",
      last_message: latest ? latest.text : enq.message,
      last_message_at: latest ? latest.created_at : enq.created_at,
      unread_count: 0,
      messages: combinedMessages,
    });
  }

  for (const vis of visits) {
    const threadId = "th-vis-" + vis.id;
    const extra = storedMessages.find((t) => t.threadId === threadId)?.messages || [];
    const baseMsg = {
      id: "m-v-" + vis.id,
      sender_id: vis.student_id,
      sender_name: "You",
      text: `Scheduled visit request: ${vis.student_notes || "Looking forward to inspecting the premises in Gokak."}`,
      created_at: vis.created_at,
      is_mine: true,
    };
    const combinedMessages = [baseMsg, ...extra];
    const latest = combinedMessages[combinedMessages.length - 1];

    threads.push({
      id: threadId,
      property_id: vis.property_id,
      property_name: vis.property_name,
      participant_id: vis.owner_id,
      participant_name: `${vis.property_name} (Visit Coordinator)`,
      participant_role: "owner",
      last_message: latest
        ? latest.text
        : `Visit requested for ${new Date(vis.scheduled_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}`,
      last_message_at: latest ? latest.created_at : vis.created_at,
      unread_count: 0,
      messages: combinedMessages,
    });
  }

  return threads;
}
