"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Search,
  MapPin,
  Heart,
  CalendarCheck,
  Building,
  CreditCard,
  Utensils,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { GOKAK_COLLEGES, GOKAK_LOCALITIES } from "@/constants/gokak";
import { getGokakProperties } from "@/lib/api/properties";
import { getGokakFoodProviders } from "@/lib/api/food";
import { GOKAK_DEMO_PROPERTIES } from "@/data/gokakDemoStays";
import { GOKAK_DEMO_FOOD_PROVIDERS } from "@/data/gokakDemoFood";
import {
  getSavedPropertyIds,
  getStudentEnquiries,
  getStudentVisits,
  getStudentBookings,
  getStudentPayments,
} from "@/lib/api/requests";
import { PropertyListing, FoodProviderListing } from "@/types";
import { PropertyCard } from "@/components/common/PropertyCard";
import { FoodCard } from "@/components/common/FoodCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PropertyCardSkeleton, FoodCardSkeleton } from "@/components/common/SkeletonCard";

export default function StudentDashboardHome() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("all");

  const [properties, setProperties] = useState<PropertyListing[]>(() => GOKAK_DEMO_PROPERTIES);
  const [foodProviders, setFoodProviders] = useState<FoodProviderListing[]>(() => GOKAK_DEMO_FOOD_PROVIDERS);
  const [stats, setStats] = useState({
    savedCount: 0,
    activeEnquiries: 0,
    upcomingVisits: 0,
    currentBookings: 0,
    paymentStatus: "No due payments",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [propRes, foodRes, enqs, visits, bookings, payments] = await Promise.all([
          getGokakProperties(),
          getGokakFoodProviders(),
          getStudentEnquiries(),
          getStudentVisits(),
          getStudentBookings(),
          getStudentPayments(),
        ]);

        setProperties(propRes.properties);
        setFoodProviders(foodRes.providers);

        const openEnq = enqs.filter((e) => e.status === "open").length;
        const pendingVisits = visits.filter((v) => v.status === "pending" || v.status === "accepted").length;
        const activeBookings = bookings.filter((b) => b.status === "pending" || b.status === "approved" || b.status === "confirmed").length;

        setStats({
          savedCount: getSavedPropertyIds().length,
          activeEnquiries: openEnq,
          upcomingVisits: pendingVisits,
          currentBookings: activeBookings,
          paymentStatus: payments.length > 0 ? "Up to date" : "No due payments",
        });
      } catch {
        setProperties([]);
        setFoodProviders([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("searchQuery", searchQuery);
    if (selectedLocality !== "all") params.set("locality", selectedLocality);
    router.push(`/student/search?${params.toString()}`);
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0F5C5C] to-[#124b4b] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-emerald-300 text-xs font-bold mb-3 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
              <span>Gokak, Karnataka Exclusive</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-sans tracking-tight mb-2">
              Find your next stay in Gokak.
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6">
              Track your scheduled visits, direct owner enquiries, and explore physically audited student rooms near your college.
            </p>

            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by PG name, room type, or landmark..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2A33A]"
                />
              </div>

              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="px-3.5 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2A33A]"
              >
                <option value="all">All Localities</option>
                {GOKAK_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#F2A33A] hover:bg-[#e09127] text-[#1B2A2F] font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Real Marketplace Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            href="/student/saved"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0F5C5C]/30 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Saved Stays</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-2xl font-black text-[#1B2A2F]">{stats.savedCount}</span>
            <span className="text-[11px] text-gray-400 mt-1">Shortlisted in Gokak</span>
          </Link>

          <Link
            href="/student/enquiries"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0F5C5C]/30 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Enquiries</span>
              <CalendarCheck className="w-4 h-4 text-[#0F5C5C]" />
            </div>
            <span className="text-2xl font-black text-[#1B2A2F]">{stats.activeEnquiries}</span>
            <span className="text-[11px] text-gray-400 mt-1">Active conversations</span>
          </Link>

          <Link
            href="/student/enquiries"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0F5C5C]/30 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Visits</span>
              <MapPin className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-black text-[#1B2A2F]">{stats.upcomingVisits}</span>
            <span className="text-[11px] text-gray-400 mt-1">Physical inspections</span>
          </Link>

          <Link
            href="/student/bookings"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0F5C5C]/30 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Bookings</span>
              <Building className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-[#1B2A2F]">{stats.currentBookings}</span>
            <span className="text-[11px] text-gray-400 mt-1">Room reservations</span>
          </Link>

          <Link
            href="/student/payments"
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#0F5C5C]/30 transition-all col-span-2 sm:col-span-1 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-gray-400 mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Payments</span>
              <CreditCard className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-sm font-bold text-emerald-700 truncate">{stats.paymentStatus}</span>
            <span className="text-[11px] text-gray-400 mt-1">Receipts & orders</span>
          </Link>
        </div>

        {/* Gokak Colleges Commute Shortcuts */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#1B2A2F] font-sans">
                Student Stays by College in Gokak
              </h2>
              <p className="text-xs text-gray-500">
                Explore student living options near official degree and polytechnic campuses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GOKAK_COLLEGES.map((col) => (
              <Link
                key={col.id}
                href={`/student/search?locality=${encodeURIComponent(col.locality.split("/")[0].trim())}`}
                className="p-3.5 rounded-2xl bg-gray-50 hover:bg-[#0F5C5C]/5 border border-gray-200/80 hover:border-[#0F5C5C]/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0F5C5C] shadow-2xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1B2A2F] leading-tight">{col.shortName}</h4>
                    <span className="text-[10px] text-gray-500">{col.locality}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Stays (Real Gokak Data Only) */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#1B2A2F] font-sans">
                Recommended Stays in Gokak
              </h2>
              <p className="text-xs text-gray-500">
                Verified listings currently available for student occupancy in Gokak.
              </p>
            </div>
            <Link
              href="/student/search"
              className="text-xs font-bold text-[#0F5C5C] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
              {properties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="properties"
              title="No verified stays available in Gokak yet"
              description="NestNova only displays physically verified student stays in Gokak. If you own a PG or hostel in Gokak, list it today."
              actionText="List Property in Gokak"
              actionHref="/owner/properties/new"
              secondaryText="Explore Search Filters"
              secondaryHref="/student/search"
            />
          )}
        </div>

        {/* Gokak Food & Mess Discovery */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#1B2A2F] font-sans">
                Mess & Tiffin Services
              </h2>
              <p className="text-xs text-gray-500">
                Daily meals and tiffin delivery services in Gokak.
              </p>
            </div>
            <Link
              href="/student/food"
              className="text-xs font-bold text-[#0F5C5C] hover:underline flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FoodCardSkeleton />
              <FoodCardSkeleton />
            </div>
          ) : foodProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodProviders.slice(0, 2).map((provider) => (
                <FoodCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="food"
              title="No mess or tiffin services listed in Gokak yet"
              description="Connect your mess or home-tiffin delivery in Gokak to reach college students."
              actionText="List Gokak Mess"
              actionHref="/owner"
            />
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
