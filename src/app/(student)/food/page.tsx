"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Utensils,
  MapPin,
  Search,
  Filter,
  Leaf,
  Bike,
  Clock,
  ShieldCheck,
  Building,
} from "lucide-react";
import { getGokakFoodProviders, FoodFilterParams } from "@/lib/api/food";
import { GOKAK_DEMO_FOOD_PROVIDERS } from "@/data/gokakDemoFood";
import { FoodProviderListing } from "@/types";
import { FoodCard } from "@/components/common/FoodCard";
import { EmptyState } from "@/components/common/EmptyState";
import { FoodCardSkeleton } from "@/components/common/SkeletonCard";

export default function FoodDirectoryPage() {
  const [tab, setTab] = useState<"all" | "Mess" | "Tiffin">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [maxPrice, setMaxPrice] = useState(6000);

  const [providers, setProviders] = useState<FoodProviderListing[]>(() => GOKAK_DEMO_FOOD_PROVIDERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadFood() {
      setIsLoading(true);
      try {
        const filters: FoodFilterParams = {
          type: tab !== "all" ? tab : undefined,
          searchQuery: searchQuery.trim() || undefined,
          isVegOnly: isVegOnly || undefined,
          hasDelivery: hasDelivery || undefined,
          maxMonthlyPrice: maxPrice < 6000 ? maxPrice : undefined,
        };

        const res = await getGokakFoodProviders(filters);
        setProviders(res.providers);
      } catch {
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadFood();
  }, [tab, searchQuery, isVegOnly, hasDelivery, maxPrice]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full mb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gokak, Karnataka Exclusive Food Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-[#1B2A2F] tracking-tight">
          Mess & Tiffin Services in Gokak
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
          Daily home-cooked meals, North Karnataka Jolada Roti thalis, and doorstep student tiffins across Gokak.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl w-full sm:w-auto">
            {(["all", "Mess", "Tiffin"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === t
                    ? "bg-[#0F5C5C] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t === "all" ? "All Food Services" : t === "Mess" ? "Dine-in Mess" : "Tiffin Delivery"}
              </button>
            ))}
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVegOnly}
                onChange={(e) => setIsVegOnly(e.target.checked)}
                className="rounded text-[#0F5C5C] focus:ring-[#0F5C5C] w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pure Veg Only</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDelivery}
                onChange={(e) => setHasDelivery(e.target.checked)}
                className="rounded text-[#0F5C5C] focus:ring-[#0F5C5C] w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-[#F2A33A]" />
                <span>Doorstep Delivery</span>
              </span>
            </label>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Gokak mess names, menu items, or locality..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
          />
        </div>
      </div>

      {/* Grid Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FoodCardSkeleton />
          <FoodCardSkeleton />
        </div>
      ) : providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <FoodCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <EmptyState
          type="food"
          title="No mess or tiffin services listed in Gokak yet"
          description="Are you a mess owner or home-tiffin provider in Gokak? List your food service to connect with local college students."
          actionText="List Gokak Mess"
          actionHref="/owner"
          secondaryText="Explore Stays Instead"
          secondaryHref="/student/search"
        />
      )}
    </div>
  );
}
