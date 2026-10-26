import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { FoodProviderListing, FoodMenuItem } from "@/types";
import { isGokakLocation } from "@/constants/gokak";
import { GOKAK_DEMO_FOOD_PROVIDERS } from "@/data/gokakDemoFood";

export interface FoodFilterParams {
  searchQuery?: string;
  type?: "Mess" | "Tiffin" | "all";
  isVegOnly?: boolean;
  hasDelivery?: boolean;
  maxMonthlyPrice?: number;
}

const sessionFoodProviders: FoodProviderListing[] = [];

export function addSessionFoodProvider(provider: FoodProviderListing) {
  if (isGokakLocation(provider.city, provider.address)) {
    sessionFoodProviders.unshift(provider);
  }
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let foodCache: CacheEntry<FoodProviderListing[]> | null = null;
const FOOD_CACHE_TTL_MS = 60000; // 60 seconds

export function invalidateFoodCache() {
  foodCache = null;
}

/**
 * Fetch real Gokak mess and tiffin services.
 * STRICT GOKAK ONLY: Excludes any food providers from other cities.
 */
export async function getGokakFoodProviders(
  filters?: FoodFilterParams
): Promise<{ providers: FoodProviderListing[]; total: number; source: "database" | "demo" }> {
  let dbProviders: FoodProviderListing[] = [];

  // Instant cache return
  if (foodCache && Date.now() - foodCache.timestamp < FOOD_CACHE_TTL_MS) {
    dbProviders = foodCache.data;
  } else if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const query = supabase
        .from("food_providers")
        .select(`
          id,
          owner_id,
          name,
          description,
          address,
          pricing,
          timings,
          is_veg,
          has_delivery,
          listing_status,
          verification_status,
          created_at,
          food_menu_items ( id, name, description, price, is_veg ),
          food_reviews ( id, rating_overall, review_text, created_at )
        `)
        .eq("listing_status", "published");

      const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: "timeout" } }), 1200)
      );

      const result = await Promise.race([query, timeoutPromise]);

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        dbProviders = result.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((row: any) => isGokakLocation(row.city || "Gokak", row.address))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((row: any): FoodProviderListing => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const menuItems: FoodMenuItem[] = (row.food_menu_items || []).map((m: any) => ({
              id: m.id,
              food_provider_id: row.id,
              name: m.name,
              description: m.description,
              price: m.price ? Number(m.price) : undefined,
              is_veg: !!m.is_veg,
            }));

            const revs = row.food_reviews || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ratingAvg = revs.length > 0 ? revs.reduce((acc: number, r: any) => acc + (Number(r.rating_overall) || 0), 0) / revs.length : undefined;

            const monthlyMatch = (row.pricing || "").match(/₹?\s*(\d[\d,]*)/);
            const monthlyNum = monthlyMatch ? parseInt(monthlyMatch[1].replace(/,/g, ""), 10) : 2800;

            return {
              id: row.id,
              owner_id: row.owner_id,
              name: row.name,
              description: row.description,
              type: (row.name || "").toLowerCase().includes("tiffin") ? "Tiffin" : "Mess",
              address: row.address,
              city: "Gokak",
              locality: "Gokak Town",
              pricing: row.pricing || "₹2,800/month",
              monthly_price: monthlyNum,
              timings: row.timings || "12:30 PM - 3:00 PM & 7:30 PM - 10:00 PM",
              is_veg: !!row.is_veg,
              has_delivery: !!row.has_delivery,
              listing_status: row.listing_status,
              verification_status: row.verification_status || "unverified",
              menu_items: menuItems,
              rating_avg: ratingAvg,
              review_count: revs.length,
              created_at: row.created_at,
            };
          });

        if (dbProviders.length > 0) {
          foodCache = { data: dbProviders, timestamp: Date.now() };
        }
      }
    } catch {
      dbProviders = [];
    }
  }

  // Fallback to Gokak demo food providers if database has no rows
  const baseProviders = dbProviders.length > 0 ? dbProviders : GOKAK_DEMO_FOOD_PROVIDERS;
  const allProviders = [...sessionFoodProviders, ...baseProviders].filter((p) => isGokakLocation(p.city, p.address));

  let results = allProviders;

  if (filters) {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== "all") {
      results = results.filter((p) => p.type.toLowerCase() === filters.type!.toLowerCase());
    }

    if (filters.isVegOnly) {
      results = results.filter((p) => p.is_veg);
    }

    if (filters.hasDelivery) {
      results = results.filter((p) => p.has_delivery);
    }

    if (filters.maxMonthlyPrice && filters.maxMonthlyPrice > 0) {
      results = results.filter((p) => (p.monthly_price || 0) <= filters.maxMonthlyPrice!);
    }
  }

  return {
    providers: results,
    total: results.length,
    source: dbProviders.length > 0 ? "database" : "demo",
  };
}

export async function getFoodProviderById(id: string): Promise<FoodProviderListing | null> {
  const { providers } = await getGokakFoodProviders();
  return providers.find((p) => p.id === id) || null;
}
