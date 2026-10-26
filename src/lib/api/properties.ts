import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { PropertyListing, PropertyRoom, PropertyImage, PropertyReview, LocationVerifiedPhoto } from "@/types";
import { isGokakLocation } from "@/constants/gokak";
import { GOKAK_DEMO_PROPERTIES } from "@/data/gokakDemoStays";

export interface PropertyFilterParams {
  searchQuery?: string;
  locality?: string;
  propertyType?: string;
  gender?: string;
  sharing?: string;
  maxBudget?: number;
  foodIncluded?: boolean;
  amenities?: string[];
  verifiedOnly?: boolean;
  collegeId?: string;
  sort?: "recommended" | "lowest_cost" | "highest_rated" | "nearest" | "recently_added";
}

// In-memory & localStorage cache for real properties created by owners
const sessionProperties: PropertyListing[] = [];
const LOCAL_STORAGE_PROPERTIES_KEY = "nestnova_local_properties";

function getStoredProperties(): PropertyListing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(p => isGokakLocation(p.city, p.address)) : [];
  } catch {
    return [];
  }
}

function saveStoredProperties(props: PropertyListing[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(props));
  } catch {}
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let propertiesCache: CacheEntry<PropertyListing[]> | null = null;
const CACHE_TTL_MS = 60000; // 60 seconds

export function invalidatePropertiesCache() {
  propertiesCache = null;
}

export function addSessionProperty(property: PropertyListing) {
  // STRICT ENFORCEMENT: Only Gokak stays allowed
  if (isGokakLocation(property.city, property.address)) {
    sessionProperties.unshift(property);
    const existing = getStoredProperties();
    const updated = [property, ...existing.filter(p => p.id !== property.id)];
    saveStoredProperties(updated);
    invalidatePropertiesCache();
  }
}

export function getSessionProperties(): PropertyListing[] {
  const stored = getStoredProperties();
  const all = [...sessionProperties, ...stored];
  const uniqueMap = new Map<string, PropertyListing>();
  for (const item of all) {
    if (isGokakLocation(item.city, item.address) && !uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }
  return Array.from(uniqueMap.values());
}

/**
 * Fetch public Gokak properties from database or authentic Gokak demo stays.
 * STRICT RULE: All results are strictly restricted to Gokak, Karnataka, India (591307).
 */
export async function getGokakProperties(
  filters?: PropertyFilterParams
): Promise<{ properties: PropertyListing[]; total: number; source: "database" | "demo" }> {
  let dbProperties: PropertyListing[] = [];

  // 1. Instant return from cache if fresh
  if (propertiesCache && Date.now() - propertiesCache.timestamp < CACHE_TTL_MS) {
    dbProperties = propertiesCache.data;
  } else if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      // Attempt to query Supabase properties table
      const query = supabase
        .from("properties")
        .select(`
          id,
          owner_id,
          name,
          description,
          property_type,
          address,
          city,
          locality,
          listing_status,
          verification_status,
          gender_category,
          amenities,
          rules,
          created_at,
          updated_at,
          is_demo,
          rooms (
            id,
            property_id,
            room_type,
            sharing_capacity,
            rent_amount,
            deposit_amount,
            has_attached_bath,
            has_ac,
            beds ( id, identifier, status )
          ),
          property_images ( id, url, category, is_primary ),
          location_verified_photos ( id, url, category, captured_at, status, distance, accuracy ),
          verification_records ( id, status, notes, verified_at, expires_at ),
          reviews ( id, student_id, rating_overall, review_text, created_at )
        `)
        .eq("listing_status", "published");

      const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 1200)
      );

      const result = await Promise.race([query, timeoutPromise]);

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Map and STRICTLY FILTER to Gokak only
        dbProperties = result.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((row: any) => isGokakLocation(row.city, row.address))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((row: any): PropertyListing => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rooms: PropertyRoom[] = (row.rooms || []).map((r: any) => ({
              id: r.id,
              property_id: r.property_id,
              room_type: r.room_type || `${r.sharing_capacity} Sharing`,
              sharing_capacity: r.sharing_capacity || 1,
              rent_amount: Number(r.rent_amount) || 0,
              deposit_amount: Number(r.deposit_amount) || 0,
              has_attached_bath: !!r.has_attached_bath,
              has_ac: !!r.has_ac,
              beds: r.beds || [],
              available_beds_count: (r.beds || []).filter((b: { status: string }) => b.status === "available").length,
              total_beds_count: (r.beds || []).length,
            }));

            const minRent = rooms.length > 0 ? Math.min(...rooms.map((r) => r.rent_amount)) : 0;
            const minDeposit = rooms.length > 0 ? Math.min(...rooms.map((r) => r.deposit_amount)) : 0;
            const totalBeds = rooms.reduce((acc, r) => acc + (r.total_beds_count || 0), 0);
            const availBeds = rooms.reduce((acc, r) => acc + (r.available_beds_count || 0), 0);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const reviews: PropertyReview[] = (row.reviews || []).map((rev: any) => ({
              id: rev.id,
              property_id: row.id,
              student_id: rev.student_id,
              author_name: "Student Resident",
              author_type: "Verified resident",
              rating_cleanliness: 4,
              rating_food: 4,
              rating_management: 4,
              rating_wifi: 4,
              rating_maintenance: 4,
              rating_overall: Number(rev.rating_overall) || 4,
              review_text: rev.review_text || "",
              status: "published",
              created_at: rev.created_at,
            }));

            const ratingAvg =
              reviews.length > 0
                ? reviews.reduce((acc, r) => acc + r.rating_overall, 0) / reviews.length
                : undefined;

            return {
              id: row.id,
              owner_id: row.owner_id,
              name: row.name,
              description: row.description,
              property_type: row.property_type || "PG",
              address: row.address,
              city: "Gokak",
              locality: row.locality || "Gokak Town",
              listing_status: row.listing_status,
              verification_status: row.verification_status || "unverified",
              gender_category: row.gender_category || "Boys",
              amenities: row.amenities || [],
              rules: row.rules || [],
              food_included: (row.amenities || []).some((a: string) => a.toLowerCase().includes("mess") || a.toLowerCase().includes("food")),
              monthly_rent_start: minRent,
              security_deposit_start: minDeposit,
              rooms,
              images: (row.property_images || []).map((img: { id: string; url: string; category: string; is_primary: boolean }) => ({
                id: img.id,
                property_id: row.id,
                url: img.url,
                category: (img.category as PropertyImage["category"]) || "building",
                is_primary: !!img.is_primary,
              })),
              verified_photos: (row.location_verified_photos || []).map((p: { id: string; url: string; category: string; captured_at: string; status: string; distance: number; accuracy: number }) => ({
                id: p.id,
                property_id: row.id,
                owner_id: row.owner_id,
                url: p.url,
                category: (p.category as LocationVerifiedPhoto["category"]) || "entrance",
                captured_at: p.captured_at,
                uploaded_at: p.captured_at,
                lat: 16.1682,
                lng: 74.8239,
                accuracy: p.accuracy || 10,
                distance: p.distance || 5,
                status: (p.status as LocationVerifiedPhoto["status"]) || "normal",
              })),
              verification_record: row.verification_records?.[0] || null,
              reviews,
              rating_avg: ratingAvg,
              review_count: reviews.length,
              total_beds: totalBeds,
              available_beds: availBeds,
              created_at: row.created_at,
              updated_at: row.updated_at,
              is_demo: !!row.is_demo,
            };
          });

        if (dbProperties.length > 0) {
          propertiesCache = { data: dbProperties, timestamp: Date.now() };
        }
      }
    } catch {
      // Supabase unavailable; fallback to demo data below
      dbProperties = [];
    }
  }

  // 2. If database is offline, unconfigured, or has 0 Gokak stays, use authentic Gokak demo stays
  const baseProperties = dbProperties.length > 0 ? dbProperties : GOKAK_DEMO_PROPERTIES;

  // Merge with any real properties created by owners in the current session or saved in storage
  const storedProps = getStoredProperties();
  const allGokak = [...sessionProperties, ...storedProps, ...baseProperties].filter(p => isGokakLocation(p.city, p.address));

  // Deduplicate by id
  const uniqueMap = new Map<string, PropertyListing>();
  for (const item of allGokak) {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  }
  let results = Array.from(uniqueMap.values());

  // Apply in-memory filters
  if (filters) {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.property_type.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (filters.locality && filters.locality !== "all") {
      const targetLocality = filters.locality.toLowerCase().trim();
      results = results.filter((p) => p.locality.toLowerCase().includes(targetLocality) || targetLocality.includes(p.locality.toLowerCase()));
    }

    if (filters.propertyType && filters.propertyType !== "all") {
      results = results.filter((p) => p.property_type.toLowerCase() === filters.propertyType!.toLowerCase());
    }

    if (filters.gender && filters.gender !== "all") {
      results = results.filter((p) => p.gender_category.toLowerCase() === filters.gender!.toLowerCase());
    }

    if (filters.sharing && filters.sharing !== "all") {
      const s = filters.sharing.toLowerCase();
      results = results.filter((p) => {
        if (!p.rooms || p.rooms.length === 0) return true;
        if (s === "single") return p.rooms.some((r) => r.sharing_capacity === 1);
        if (s === "double") return p.rooms.some((r) => r.sharing_capacity === 2);
        if (s === "triple") return p.rooms.some((r) => r.sharing_capacity === 3);
        if (s === "multi") return p.rooms.some((r) => r.sharing_capacity >= 4);
        return true;
      });
    }

    if (filters.maxBudget && filters.maxBudget > 0) {
      results = results.filter((p) => p.monthly_rent_start <= filters.maxBudget!);
    }

    if (filters.foodIncluded) {
      results = results.filter((p) => p.food_included);
    }

    if (filters.verifiedOnly) {
      results = results.filter((p) => p.verification_status === "verified");
    }

    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter((p) =>
        filters.amenities!.every((reqAmenity) =>
          p.amenities.some((a) => a.toLowerCase().includes(reqAmenity.toLowerCase()))
        )
      );
    }

    // Proximity to specific college
    if (filters.collegeId && filters.collegeId !== "all") {
      results.sort((a, b) => {
        const distA = a.distance_to_colleges?.[filters.collegeId!] ?? 99;
        const distB = b.distance_to_colleges?.[filters.collegeId!] ?? 99;
        return distA - distB;
      });
    }

    // Sorting
    if (filters.sort === "lowest_cost") {
      results.sort((a, b) => a.monthly_rent_start - b.monthly_rent_start);
    } else if (filters.sort === "highest_rated") {
      results.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
    } else if (filters.sort === "recently_added") {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (filters.sort === "recommended") {
      // Verified first, then highest rating
      results.sort((a, b) => {
        if (a.verification_status === "verified" && b.verification_status !== "verified") return -1;
        if (b.verification_status === "verified" && a.verification_status !== "verified") return 1;
        return (b.rating_avg || 0) - (a.rating_avg || 0);
      });
    }
  }

  return {
    properties: results,
    total: results.length,
    source: dbProperties.length > 0 ? "database" : "demo",
  };
}

/**
 * Get single Gokak property by ID or slug.
 */
export async function getPropertyById(id: string): Promise<PropertyListing | null> {
  const { properties } = await getGokakProperties();
  const match = properties.find((p) => p.id === id);
  if (match && isGokakLocation(match.city, match.address)) {
    return match;
  }
  return null;
}
