"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ShieldCheck,
  IndianRupee,
  Utensils,
  GraduationCap,
  Building,
  CheckCircle2,
  ArrowRight,
  Filter,
  Eye,
  Calendar,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import {
  GOKAK_COLLEGES,
  GOKAK_LOCALITIES,
  GOKAK_PROPERTY_TYPES,
} from "@/constants/gokak";
import { getGokakProperties } from "@/lib/api/properties";
import { getGokakFoodProviders } from "@/lib/api/food";
import { GOKAK_DEMO_PROPERTIES } from "@/data/gokakDemoStays";
import { GOKAK_DEMO_FOOD_PROVIDERS } from "@/data/gokakDemoFood";
import { PropertyListing, FoodProviderListing } from "@/types";
import { PropertyCard } from "@/components/common/PropertyCard";
import { FoodCard } from "@/components/common/FoodCard";
import { CostBreakdown } from "@/components/common/CostBreakdown";
import { EmptyState } from "@/components/common/EmptyState";
import { PropertyCardSkeleton, FoodCardSkeleton } from "@/components/common/SkeletonCard";

export default function HomePage() {
  const router = useRouter();

  // Search Bar State
  const [searchArea, setSearchArea] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [budgetMax, setBudgetMax] = useState("all");
  const [foodOption, setFoodOption] = useState("all");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(GOKAK_COLLEGES[0].id);

  // Real backend Gokak data (initialized with demo stays to prevent SSR blank/skeleton flicker)
  const [properties, setProperties] = useState<PropertyListing[]>(() => GOKAK_DEMO_PROPERTIES);
  const [foodProviders, setFoodProviders] = useState<FoodProviderListing[]>(() => GOKAK_DEMO_FOOD_PROVIDERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [propsRes, foodRes] = await Promise.all([
          getGokakProperties(),
          getGokakFoodProviders(),
        ]);
        setProperties(propsRes.properties);
        setFoodProviders(foodRes.providers);
      } catch {
        setProperties([]);
        setFoodProviders([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchArea !== "all") params.set("locality", searchArea);
    if (propertyType !== "all") params.set("propertyType", propertyType);
    if (budgetMax !== "all") params.set("maxBudget", budgetMax);
    if (foodOption === "included") params.set("foodIncluded", "true");
    router.push(`/student/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8F3]">
      {/* ========================================================
          A. HERO SECTION WITH AMBIENT GLOW & FLOATING BADGES
          ======================================================== */}
      <section className="relative bg-gradient-to-b from-[#0F5C5C] to-[#0A3D3D] text-white pt-20 pb-40 px-4 overflow-hidden">
        {/* Ambient Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-24 right-10 w-96 h-96 bg-[#F2A33A]/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Floating Left Trust Card */}
        <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-3xl glass-panel-dark text-left items-center gap-3.5 animate-float shadow-2xl max-w-[240px] z-10 border border-white/20">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/25 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-200 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Physical Audits
            </div>
            <div className="text-xs font-bold text-white/95 mt-0.5">100% Gokak Stays Checked</div>
          </div>
        </div>

        {/* Floating Right College Routes Card */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-3xl glass-panel-dark text-left items-center gap-3.5 animate-float-gentle shadow-2xl max-w-[250px] z-10 border border-white/20">
          <div className="w-10 h-10 rounded-2xl bg-[#F2A33A]/25 flex items-center justify-center text-[#F2A33A] shrink-0">
            <GraduationCap className="w-6 h-6 text-[#F2A33A]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-300">5 Gokak Campuses</div>
            <div className="text-xs font-bold text-white/95 mt-0.5">Commute Routes Mapped</div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center animate-slide-up">
          {/* Gokak Exclusive Scope Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-white/20 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm hover:bg-white/15 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
            <span>Exclusively for Gokak, Karnataka (591307)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight leading-tight sm:leading-none mb-6">
            Find a place in Gokak you can{" "}
            <span className="relative inline-block text-[#F2A33A]">
              actually trust.
              <span className="absolute bottom-1 left-0 right-0 h-2 bg-[#F2A33A]/20 -z-10 rounded-full transform -rotate-1"></span>
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Explore verified student stays, transparent true costs, authentic mess options, and campus distances before you move.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/student/search"
              className="w-full sm:w-auto px-8 py-4 bg-[#F2A33A] hover:bg-[#e09127] text-[#1B2A2F] font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2 group"
            >
              <span>Explore Gokak</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>

            <Link
              href="/owner/properties/new"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/25 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all text-base flex items-center justify-center gap-2"
            >
              <Building className="w-5 h-5 text-emerald-300" />
              <span>List Your Property</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          B. QUICK SEARCH BAR (Pulled over Hero with Locality Chips)
          ======================================================== */}
      <section className="px-4 -mt-24 relative z-20 mb-20">
        <div className="container mx-auto max-w-5xl">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-black/5 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(15,92,92,0.15)]"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Search className="w-4 h-4 text-[#0F5C5C]" />
                <span>Search Verified Student Stays in Gokak</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% On-Ground Audited
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Location (Fixed to Gokak) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Location (Scope)
                </label>
                <div className="relative">
                  <select
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                  >
                    <option value="all">All Gokak Localities</option>
                    {GOKAK_LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Stay Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                >
                  <option value="all">Any Stay Type</option>
                  {GOKAK_PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Monthly Budget
                </label>
                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                >
                  <option value="all">Any Budget</option>
                  <option value="4000">Up to ₹4,000</option>
                  <option value="6000">Up to ₹6,000</option>
                  <option value="8000">Up to ₹8,000</option>
                  <option value="12000">Up to ₹12,000</option>
                </select>
              </div>

              {/* Food Availability */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Preference
                </label>
                <select
                  value={foodOption}
                  onChange={(e) => setFoodOption(e.target.value)}
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                >
                  <option value="all">Any (Mess / Self)</option>
                  <option value="included">Mess Included in Rent</option>
                  <option value="optional">Separate Tiffin / Mess</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Gokak</span>
                </button>
              </div>
            </div>

            {/* Quick Locality Filter Chips */}
            <div className="mt-4 pt-4 border-t border-gray-150/70 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-bold flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
                Top Localities:
              </span>
              {["Court Road", "Basaveshwar Nagar", "Falls Road", "Gandhi Chowk", "Shigli Market"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSearchArea(loc)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    searchArea === loc
                      ? "bg-[#0F5C5C] text-white shadow-xs font-bold scale-105"
                      : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/90 hover:scale-102"
                  }`}
                >
                  {loc}
                </button>
              ))}
              {searchArea !== "all" && (
                <button
                  type="button"
                  onClick={() => setSearchArea("all")}
                  className="text-xs text-rose-600 hover:underline font-bold ml-auto cursor-pointer"
                >
                  Clear filter (All Gokak)
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================
          C. EXPLORE STUDENT LIVING IN GOKAK (WITH COMMUTE DATA)
          ======================================================== */}
      <section className="py-20 px-4 bg-white border-y border-black/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full mb-3 border border-emerald-200">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Campus & Neighborhood Commute Guide</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-sans text-[#1B2A2F] tracking-tight mb-3">
              Student Living in Gokak
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Relocating to Gokak for your degree or diploma? Explore stays near top educational campuses and high-transit student localities.
            </p>
          </div>

          {/* Colleges Grid with Interactive Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {GOKAK_COLLEGES.map((college) => (
              <div
                key={college.id}
                className="interactive-card bg-[#FBF8F3] rounded-3xl p-6 border border-gray-200/80 hover:border-[#0F5C5C]/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#0F5C5C] shadow-xs mb-4 group-hover:scale-110 group-hover:bg-[#0F5C5C] group-hover:text-white transition-all duration-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-[#1B2A2F] mb-1.5 leading-snug group-hover:text-[#0F5C5C] transition-colors">
                    {college.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
                    {college.locality}, Gokak
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {college.popularCourses.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-0.5 rounded-md bg-white text-[11px] font-semibold text-gray-700 border border-gray-200/80 shadow-2xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">
                    Commute: ~5-12 min
                  </span>
                  <Link
                    href={`/student/search?locality=${encodeURIComponent(college.locality.split("/")[0].trim())}`}
                    className="text-xs font-extrabold text-[#0F5C5C] hover:text-[#0c4747] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Stays near {college.shortName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          D. FEATURED REAL GOKAK PROPERTIES ONLY
          ======================================================== */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F5C5C]/10 text-[#0F5C5C] text-xs font-bold rounded-full mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Stays</span>
              </div>
              <h2 className="text-3xl font-black font-sans text-[#1B2A2F] tracking-tight">
                Featured Stays in Gokak
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Real properties physically audited in Gokak. Zero fake cards or imaginary locations.
              </p>
            </div>

            <Link
              href="/student/search"
              className="text-sm font-bold text-[#0F5C5C] hover:underline flex items-center gap-1.5"
            >
              <span>View all Gokak listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="properties"
              title="No verified stays available in Gokak yet"
              description="We enforce strict physical verification and display zero fake listings. Check back soon or list your Gokak property."
              actionText="List a Property in Gokak"
              actionHref="/owner/properties/new"
              secondaryText="Explore Gokak Campuses"
              secondaryHref="/student/search"
            />
          )}
        </div>
      </section>

      {/* ========================================================
          E. WHY NESTNOVA TRUST PILLARS
          ======================================================== */}
      <section className="py-20 px-4 bg-white border-y border-black/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black font-sans text-[#1B2A2F] tracking-tight mb-3">
              Why Students Trust NestNova
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Moving to a new town shouldn&apos;t involve gambling on photos or unexpected surprise charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-[#FBF8F3] border border-gray-200/80 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1B2A2F]">Physical In-Person Verification</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We physically audit room sizes, ventilation, water supply, and building safety before awarding the NestNova Verified badge.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBF8F3] border border-gray-200/80 space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-bold">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1B2A2F]">Transparent True Cost</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rent is rarely the final bill. We itemize electricity, maintenance, mess subscription, and laundry before you book.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBF8F3] border border-gray-200/80 space-y-3">
              <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1B2A2F]">Location Evidence vs Audit</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We clearly separate GPS-captured photo evidence from full admin audit badges. No misleading labels or paid verification.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBF8F3] border border-gray-200/80 space-y-3">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1B2A2F]">College Commute Calculations</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Distances measured accurately to major Gokak institutions like JSS College, GFGC, and Rural Polytechnic.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBF8F3] border border-gray-200/80 space-y-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1B2A2F]">Authentic Local Food Options</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connect with authentic North Karnataka Jolada Roti mess and daily tiffin services delivering in Gokak.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-[#FBF8F3] border border-gray-200/80 space-y-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1B2A2F]">Visits Distinct from Bookings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Schedule a zero-obligation free physical visit without being forced into an unverified booking commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          F. TRUE COST EXPLANATION
          ======================================================== */}
      <section id="true-cost" className="py-20 px-4 bg-[#F5F0E6]/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full mb-3">
              <IndianRupee className="w-3.5 h-3.5 text-amber-700" />
              <span>Full Financial Transparency</span>
            </div>
            <h2 className="text-3xl font-black font-sans text-[#1B2A2F] tracking-tight mb-3">
              Why Rent Isn&apos;t Your Only Expense
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              A ₹4,000 room can end up costing ₹7,500 after meals, meter bills, laundry, and daily auto transit. Use our calculator to plan your actual Gokak monthly budget.
            </p>
          </div>

          {/* Interactive Cost Breakdown */}
          <CostBreakdown initialInput={{ baseRent: 4500, foodIncluded: false }} />
        </div>
      </section>

      {/* ========================================================
          G. FOOD DISCOVERY (MESS & TIFFIN)
          ======================================================== */}
      <section className="py-20 px-4 bg-white border-b border-black/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F5C5C]/10 text-[#0F5C5C] text-xs font-bold rounded-full mb-2">
                <Utensils className="w-3.5 h-3.5" />
                <span>Local Food Directory</span>
              </div>
              <h2 className="text-3xl font-black font-sans text-[#1B2A2F] tracking-tight">
                Mess & Tiffin Services in Gokak
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Authentic, hygienic daily meals. Dine-in student mess or doorstep tiffin boxes.
              </p>
            </div>

            <Link
              href="/student/food"
              className="text-sm font-bold text-[#0F5C5C] hover:underline flex items-center gap-1.5"
            >
              <span>Explore all Gokak food providers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FoodCardSkeleton />
              <FoodCardSkeleton />
            </div>
          ) : foodProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodProviders.map((provider) => (
                <FoodCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="food"
              title="No mess or tiffin services listed in Gokak yet"
              description="Are you a mess owner or home-tiffin provider in Gokak? List your food service to connect with local college students."
              actionText="List Gokak Mess Service"
              actionHref="/owner"
              secondaryText="Explore Stays Instead"
              secondaryHref="/student/search"
            />
          )}
        </div>
      </section>

      {/* ========================================================
          H. HOW NESTNOVA WORKS
          ======================================================== */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black font-sans text-[#1B2A2F] tracking-tight mb-3">
              How NestNova Works
            </h2>
            <p className="text-gray-600 text-sm">
              Five clear steps from initial discovery to holding the keys to your room in Gokak.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "Discover",
                desc: "Filter verified PGs and rooms by Gokak locality, budget, and sharing.",
              },
              {
                step: "2",
                title: "Compare",
                desc: "Check side-by-side true monthly costs, distance to campus, and amenities.",
              },
              {
                step: "3",
                title: "Verify",
                desc: "Inspect location evidence photos and audit history before reaching out.",
              },
              {
                step: "4",
                title: "Visit",
                desc: "Schedule a free, zero-obligation physical inspection with the owner.",
              },
              {
                step: "5",
                title: "Book",
                desc: "Reserve your bed with official confirmation and transparent deposit terms.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 text-center flex flex-col items-center shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0F5C5C] text-white font-black text-xl flex items-center justify-center mb-4 shadow-sm">
                  {s.step}
                </div>
                <h3 className="font-bold text-base text-[#1B2A2F] mb-1.5">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          I & J. STUDENT & OWNER CTAS
          ======================================================== */}
      <section className="py-16 px-4 bg-white border-t border-black/5">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student CTA */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0F5C5C] to-[#0A3D3D] text-white flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-2">
                For Students & Renters
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-sans mb-3">
                Find your next stay in Gokak.
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-8">
                Skip the broker commissions and hidden charges. Discover visit-checked student living near your college.
              </p>
            </div>

            <Link
              href="/student/search"
              className="w-full sm:w-fit px-6 py-3 bg-[#F2A33A] hover:bg-[#e09127] text-[#1B2A2F] font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Gokak Stays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Owner CTA */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF8F3] border border-gray-200 text-[#1B2A2F] flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F5C5C] block mb-2">
                For Property Owners & Mess Providers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-sans mb-3">
                Have a student property in Gokak?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-8">
                Connect directly with students moving to Gokak. Get your property verified and receive genuine booking enquiries.
              </p>
            </div>

            <Link
              href="/owner/properties/new"
              className="w-full sm:w-fit px-6 py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <Building className="w-4 h-4" />
              <span>List Your Property</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
