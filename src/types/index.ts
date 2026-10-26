// NestNova Core TypeScript Definitions

export type UserRole = "student" | "owner" | "admin";
export type ListingStatus = "draft" | "submitted" | "published" | "rejected" | "archived";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "correction_requested";
export type PhotoStatus = "normal" | "location_verified" | "location_rejected";
export type VisitStatus = "pending" | "accepted" | "proposed" | "rejected" | "completed" | "cancelled";
export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "confirmed" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export type BedStatus = "available" | "occupied" | "reserved";

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  preferred_college?: string | null;
  created_at: string;
  updated_at?: string;
  is_demo?: boolean;
}

export interface OwnerProfile {
  id: string;
  status: "pending" | "approved" | "rejected";
  business_name?: string | null;
  address?: string | null;
  contact_phone?: string | null;
  created_at: string;
  updated_at?: string;
  is_demo?: boolean;
}

export interface RoomBed {
  id: string;
  room_id: string;
  identifier: string;
  status: BedStatus;
  is_demo?: boolean;
}

export interface PropertyRoom {
  id: string;
  property_id: string;
  room_type: string; // "Single", "Double", "Triple", "4 Sharing"
  sharing_capacity: number;
  rent_amount: number;
  deposit_amount: number;
  has_attached_bath: boolean;
  has_ac: boolean;
  beds?: RoomBed[];
  available_beds_count?: number;
  total_beds_count?: number;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  category: "building" | "room" | "bathroom" | "kitchen" | "common" | "other";
  is_primary: boolean;
  created_at?: string;
}

export interface LocationVerifiedPhoto {
  id: string;
  property_id: string;
  owner_id: string;
  url: string;
  category: "entrance" | "room" | "bathroom" | "kitchen" | "common_area";
  captured_at: string;
  uploaded_at: string;
  lat: number;
  lng: number;
  accuracy: number;
  distance: number;
  status: PhotoStatus;
  rejection_reason?: string | null;
}

export interface VerificationRecord {
  id: string;
  property_id: string;
  admin_id?: string | null;
  status: VerificationStatus;
  notes?: string | null;
  verified_at?: string | null;
  expires_at?: string | null;
  created_at: string;
}

export interface PropertyReview {
  id: string;
  property_id: string;
  student_id: string;
  author_name: string;
  author_type: "Verified resident" | "Visited not stayed" | "Unverified feedback";
  rating_cleanliness: number;
  rating_food: number;
  rating_management: number;
  rating_wifi: number;
  rating_maintenance: number;
  rating_overall: number;
  review_text: string;
  status: "pending" | "published" | "rejected";
  created_at: string;
  owner_response?: string | null;
}

export interface TrueCostBreakdown {
  rent: { amount: number; type: "fixed"; notes?: string };
  food: { amount: number; type: "fixed" | "estimated" | "not_provided"; notes?: string };
  electricity: { amount: number; type: "fixed" | "estimated" | "not_provided"; notes?: string };
  maintenance: { amount: number; type: "fixed" | "estimated" | "not_provided"; notes?: string };
  laundry: { amount: number; type: "fixed" | "estimated" | "not_provided"; notes?: string };
  transport: { amount: number; type: "estimated" | "not_provided"; notes?: string };
  totalMonthlyEstimated: number;
  isPartialEstimate: boolean;
}

export interface PropertyListing {
  id: string;
  owner_id: string;
  name: string;
  description?: string | null;
  property_type: "PG" | "Hostel" | "Student Room" | "Co-living";
  address: string;
  city: "Gokak";
  locality: string;
  location?: { lat: number; lng: number } | null;
  listing_status: ListingStatus;
  verification_status: VerificationStatus;
  gender_category: "Boys" | "Girls" | "Co-ed";
  amenities: string[];
  rules: string[];
  safety_features?: string[];
  food_included: boolean;
  food_description?: string;
  monthly_rent_start: number; // lowest room rent
  security_deposit_start: number;
  distance_to_colleges?: Record<string, number>; // collegeId -> km
  rooms?: PropertyRoom[];
  images?: PropertyImage[];
  verified_photos?: LocationVerifiedPhoto[];
  verification_record?: VerificationRecord | null;
  reviews?: PropertyReview[];
  rating_avg?: number;
  review_count?: number;
  total_beds?: number;
  available_beds?: number;
  created_at: string;
  updated_at?: string;
  is_demo?: boolean;
}

export interface FoodMenuItem {
  id: string;
  food_provider_id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  is_veg: boolean;
}

export interface FoodProviderListing {
  id: string;
  owner_id: string;
  name: string;
  description?: string | null;
  type: "Mess" | "Tiffin";
  address: string;
  city: "Gokak";
  locality: string;
  location?: { lat: number; lng: number } | null;
  pricing: string; // e.g. "₹2,800/month or ₹70/thali"
  monthly_price: number;
  per_meal_price?: number;
  timings: string; // e.g. "Lunch 12:30-3:00 PM, Dinner 7:30-10:00 PM"
  is_veg: boolean;
  has_delivery: boolean;
  delivery_radius_km?: number;
  listing_status: ListingStatus;
  verification_status: VerificationStatus;
  menu_items?: FoodMenuItem[];
  rating_avg?: number;
  review_count?: number;
  contact_phone?: string;
  created_at: string;
}

export interface StudentEnquiry {
  id: string;
  student_id: string;
  property_id: string;
  property_name: string;
  property_locality: string;
  owner_id: string;
  message: string;
  status: "open" | "closed" | "replied";
  created_at: string;
  updated_at?: string;
  student_name?: string;
  student_phone?: string;
}

export interface VisitRequest {
  id: string;
  student_id: string;
  property_id: string;
  property_name: string;
  property_locality: string;
  owner_id: string;
  status: VisitStatus;
  scheduled_at: string;
  student_notes?: string | null;
  owner_notes?: string | null;
  created_at: string;
  updated_at?: string;
  student_name?: string;
  student_phone?: string;
}

export interface BookingRecord {
  id: string;
  student_id: string;
  property_id: string;
  property_name: string;
  property_locality: string;
  room_type: string;
  monthly_rent: number;
  deposit_amount: number;
  status: BookingStatus;
  start_date: string;
  end_date?: string | null;
  payment_id?: string | null;
  payment_status?: PaymentStatus;
  created_at: string;
  updated_at?: string;
  student_name?: string;
  student_phone?: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  booking_id?: string | null;
  property_name?: string;
  order_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  updated_at?: string;
  notes?: string;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: "booking" | "visit" | "verification" | "payment" | "message";
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageThread {
  id: string;
  property_id?: string;
  property_name?: string;
  participant_id: string;
  participant_name: string;
  participant_role: UserRole;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  messages: Array<{
    id: string;
    sender_id: string;
    sender_name: string;
    text: string;
    created_at: string;
    is_mine: boolean;
  }>;
}
