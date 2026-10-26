"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  X,
  Building,
  Scale,
  ArrowUpDown,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  GOKAK_LOCALITIES,
  GOKAK_PROPERTY_TYPES,
  GOKAK_GENDER_CATEGORIES,
  GOKAK_SHARING_OPTIONS,
  GOKAK_AMENITIES_LIST,
  GOKAK_COLLEGES,
} from "@/constants/gokak";
import { getGokakProperties, PropertyFilterParams } from "@/lib/api/properties";
import { GOKAK_DEMO_PROPERTIES } from "@/data/gokakDemoStays";
import { PropertyListing } from "@/types";
import { PropertyCard } from "@/components/common/PropertyCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PropertyCardSkeleton } from "@/components/common/SkeletonCard";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search and Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("searchQuery") || "");
  const [locality, setLocality] = useState(searchParams.get("locality") || "all");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "all");
  const [gender, setGender] = useState(searchParams.get("gender") || "all");
  const [sharing, setSharing] = useState(searchParams.get("sharing") || "all");
  const [maxBudget, setMaxBudget] = useState(Number(searchParams.get("maxBudget")) || 15000);
  const [foodIncluded, setFoodIncluded] = useState(searchParams.get("foodIncluded") === "true");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verifiedOnly") === "true");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState<PropertyFilterParams["sort"]>("recommended");

  // Comparison drawer state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Results State
  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    const hasFilter =
      !!searchParams.get("searchQuery") ||
      (searchParams.get("locality") && searchParams.get("locality") !== "all") ||
      (searchParams.get("propertyType") && searchParams.get("propertyType") !== "all") ||
      (searchParams.get("gender") && searchParams.get("gender") !== "all") ||
      (searchParams.get("sharing") && searchParams.get("sharing") !== "all") ||
      !!searchParams.get("maxBudget") ||
      searchParams.get("foodIncluded") === "true" ||
      searchParams.get("verifiedOnly") === "true";
    return hasFilter ? [] : GOKAK_DEMO_PROPERTIES;
  });
  const [isLoading, setIsLoading] = useState(() => {
    return (
      !!searchParams.get("searchQuery") ||
      (searchParams.get("locality") && searchParams.get("locality") !== "all") ||
      (searchParams.get("propertyType") && searchParams.get("propertyType") !== "all") ||
      (searchParams.get("gender") && searchParams.get("gender") !== "all") ||
      (searchParams.get("sharing") && searchParams.get("sharing") !== "all") ||
      !!searchParams.get("maxBudget") ||
      searchParams.get("foodIncluded") === "true" ||
      searchParams.get("verifiedOnly") === "true"
    );
  });

  // Fetch properties based on active filters
  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        const filters: PropertyFilterParams = {
          searchQuery: searchQuery.trim() || undefined,
          locality: locality !== "all" ? locality : undefined,
          propertyType: propertyType !== "all" ? propertyType : undefined,
          gender: gender !== "all" ? gender : undefined,
          sharing: sharing !== "all" ? sharing : undefined,
          maxBudget: maxBudget < 15000 ? maxBudget : undefined,
          foodIncluded: foodIncluded || undefined,
          verifiedOnly: verifiedOnly || undefined,
          amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
          sort,
        };

        const res = await getGokakProperties(filters);
        setProperties(res.properties);
      } catch {
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [
    searchQuery,
    locality,
    propertyType,
    gender,
    sharing,
    maxBudget,
    foodIncluded,
    verifiedOnly,
    selectedAmenities,
    sort,
  ]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 stays in Gokak at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocality("all");
    setPropertyType("all");
    setGender("all");
    setSharing("all");
    setMaxBudget(15000);
    setFoodIncluded(false);
    setVerifiedOnly(false);
    setSelectedAmenities([]);
    setSort("recommended");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Top Banner & Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gokak, Karnataka (Strict Location Scope)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-sans text-[#1B2A2F] tracking-tight">
              Student Accommodation in Gokak
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Physically verified PGs, hostels, and student rooms near Gokak educational institutions.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs">
              {properties.length} {properties.length === 1 ? "Stay" : "Stays"} in Gokak ({properties.filter((p) => p.verification_status === "verified").length} Verified)
            </span>
          </div>
        </div>

        {/* Large Prominent Search Bar */}
        <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PG name, room type, Court Road, Falls Road, Basaveshwar Nagar..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as PropertyFilterParams["sort"])}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="lowest_cost">Lowest Rent</option>
                <option value="highest_rated">Highest Rated</option>
                <option value="recently_added">Recently Added</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden px-4 py-2 bg-[#0F5C5C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Property Cards */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-72 shrink-0 bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 font-extrabold text-[#1B2A2F] text-sm">
              <Filter className="w-4 h-4 text-[#0F5C5C]" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#0F5C5C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Gokak Locality */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Gokak Locality
            </label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
            >
              <option value="all">All Gokak Localities</option>
              {GOKAK_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Stay Type
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="propType"
                  checked={propertyType === "all"}
                  onChange={() => setPropertyType("all")}
                  className="text-[#0F5C5C] focus:ring-[#0F5C5C]"
                />
                <span>All Types</span>
              </label>
              {GOKAK_PROPERTY_TYPES.map((t) => (
                <label key={t.value} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="propType"
                    checked={propertyType === t.value}
                    onChange={() => setPropertyType(t.value)}
                    className="text-[#0F5C5C] focus:ring-[#0F5C5C]"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Gender Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["all", "Boys", "Girls"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    gender === g
                      ? "bg-[#0F5C5C] text-white border-[#0F5C5C]"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {g === "all" ? "Any" : g}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Max Monthly Rent
              </label>
              <span className="text-xs font-extrabold text-[#0F5C5C]">
                {maxBudget >= 15000 ? "Any Budget" : `₹${maxBudget.toLocaleString("en-IN")}`}
              </span>
            </div>
            <input
              type="range"
              min={3000}
              max={15000}
              step={500}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#0F5C5C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>₹3,000</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={foodIncluded}
                onChange={(e) => setFoodIncluded(e.target.checked)}
                className="rounded text-[#0F5C5C] focus:ring-[#0F5C5C] w-4 h-4 cursor-pointer"
              />
              <span>Mess Food Included</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-[#0F5C5C] focus:ring-[#0F5C5C] w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audited Verified Stays Only</span>
              </span>
            </label>
          </div>

          {/* Key Amenities */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Amenities
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {GOKAK_AMENITIES_LIST.slice(0, 8).map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded text-[#0F5C5C] focus:ring-[#0F5C5C]"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onCompareToggle={toggleCompare}
                  isCompared={compareIds.includes(property.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              title="No Gokak stays match your current filters"
              description="NestNova only shows verified properties in Gokak, Karnataka. Adjust your budget, locality, or sharing preferences."
              actionText="Reset All Filters"
              onActionClick={handleResetFilters}
              secondaryText="List Your Property in Gokak"
              secondaryHref="/owner/properties/new"
            />
          )}
        </div>
      </div>

      {/* Floating Comparison Tray */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-xl mx-auto bg-[#1B2A2F] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between z-40 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#F2A33A]" />
            <span className="text-xs sm:text-sm font-bold">
              {compareIds.length} {compareIds.length === 1 ? "Stay" : "Stays"} selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-gray-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => router.push(`/student/compare?ids=${compareIds.join(",")}`)}
              className="px-4 py-2 bg-[#F2A33A] hover:bg-[#e09127] text-[#1B2A2F] font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-bold text-lg text-gray-900">Search Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Locality</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-medium"
                >
                  <option value="all">All Gokak Localities</option>
                  {GOKAK_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Stay Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-medium"
                >
                  <option value="all">All Types</option>
                  {GOKAK_PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["all", "Boys", "Girls"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        gender === g ? "bg-[#0F5C5C] text-white" : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {g === "all" ? "Any" : g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Max Rent:</span>
                  <span>₹{maxBudget.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={15000}
                  step={500}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#0F5C5C]"
                />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={foodIncluded}
                    onChange={(e) => setFoodIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#0F5C5C]"
                  />
                  <span>Mess Included</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-[#0F5C5C]"
                  />
                  <span>Verified Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-1/3 py-2.5 border rounded-xl font-bold text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-2/3 py-2.5 bg-[#0F5C5C] text-white rounded-xl font-bold text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Gokak stays...</div>}>
      <SearchContent />
    </Suspense>
  );
}
