"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Scale,
  CheckCircle2,
  XCircle,
  MapPin,
  ShieldCheck,
  Building,
  Utensils,
  IndianRupee,
  Bed,
  ArrowRight,
  X,
} from "lucide-react";
import { getGokakProperties } from "@/lib/api/properties";
import { calculateTrueCost } from "@/lib/api/calculator";
import { PropertyListing } from "@/types";
import { NestNovaVerifiedBadge } from "@/components/ui/VerificationBadge";
import { EmptyState } from "@/components/common/EmptyState";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawIds = searchParams.get("ids")?.split(",").filter(Boolean) || [];

  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComparison() {
      setIsLoading(true);
      try {
        const res = await getGokakProperties();
        if (rawIds.length > 0) {
          const matched = res.properties.filter((p) => rawIds.includes(p.id));
          setProperties(matched.slice(0, 4));
        } else {
          // If no specific IDs provided in URL, compare top available Gokak stays
          setProperties(res.properties.slice(0, 3));
        }
      } catch {
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComparison();
  }, [searchParams]);

  const removeProperty = (id: string) => {
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    if (updated.length > 0) {
      router.push(`/student/compare?ids=${updated.map((p) => p.id).join(",")}`);
    } else {
      router.push("/student/compare");
    }
  };

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="py-20 text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold">Comparing Gokak stays...</p>
        </div>
      </StudentLayout>
    );
  }

  if (properties.length === 0) {
    return (
      <StudentLayout>
        <EmptyState
          type="search"
          title="No properties selected to compare"
          description="Select up to 4 student stays in Gokak from search results or your saved list to compare true costs, mess options, and campus distances side-by-side."
          actionText="Browse Gokak Stays"
          actionHref="/student/search"
        />
      </StudentLayout>
    );
  }

  // All unique amenities across compared properties
  const allAmenities = Array.from(new Set(properties.flatMap((p) => p.amenities))).sort();

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full mb-2">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Side-by-Side Gokak Comparison</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
              Compare {properties.length} Stays
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Clear breakdown of monthly expenses, food, room sharing, and campus commute.
            </p>
          </div>

          <Link
            href="/student/search"
            className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50 shadow-2xs"
          >
            + Add Another Stay
          </Link>
        </div>

        {/* Desktop Side-by-Side Table */}
        <div className="hidden lg:block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr>
                  <th className="p-5 border-b border-r border-gray-100 bg-gray-50/80 w-56 font-bold text-xs uppercase tracking-wider text-gray-500">
                    Stay Feature
                  </th>
                  {properties.map((p) => (
                    <th key={p.id} className="p-5 border-b border-gray-100 bg-white align-top min-w-[240px]">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {p.property_type} • {p.gender_category}
                        </span>
                        <button
                          onClick={() => removeProperty(p.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded-full hover:bg-gray-100"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-extrabold text-base text-[#1B2A2F] leading-snug mb-1">{p.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F2A33A]" />
                        {p.locality}, Gokak
                      </p>

                      <Link
                        href={`/student/property/${p.id}`}
                        className="w-full py-2 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs hover:bg-[#0c4747]"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-xs">
                {/* 1. Base Rent */}
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    Monthly Rent (Base)
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 border-b border-gray-100 font-extrabold text-sm text-[#0F5C5C]">
                      ₹{p.monthly_rent_start.toLocaleString("en-IN")}/mo
                    </td>
                  ))}
                </tr>

                {/* 2. Estimated True Total */}
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 bg-emerald-50/40 font-bold text-emerald-900">
                    Est. True Total (Rent + Food + Transit)
                  </td>
                  {properties.map((p) => {
                    const cost = calculateTrueCost({
                      baseRent: p.monthly_rent_start,
                      foodIncluded: p.food_included,
                    });
                    return (
                      <td key={p.id} className="p-4 border-b border-gray-100 font-black text-sm text-gray-900 bg-emerald-50/20">
                        ₹{cost.totalMonthlyEstimated.toLocaleString("en-IN")}/mo
                      </td>
                    );
                  })}
                </tr>

                {/* 3. Verification Badge */}
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    Audit Status
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 border-b border-gray-100">
                      <NestNovaVerifiedBadge status={p.verification_status} />
                    </td>
                  ))}
                </tr>

                {/* 4. Food / Mess */}
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    Food Arrangement
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 border-b border-gray-100 font-medium text-gray-800">
                      {p.food_included ? "Mess Included in Rent" : "Mess Optional / Extra"}
                    </td>
                  ))}
                </tr>

                {/* 5. Sharing Capacity */}
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    Room Sharing
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 border-b border-gray-100 text-gray-700">
                      {p.rooms?.map((r) => r.room_type).join(", ") || "Single / Double"}
                    </td>
                  ))}
                </tr>

                {/* 6. Available Beds */}
                <tr>
                  <td className="p-4 border-b border-r border-gray-100 bg-gray-50/50 font-bold text-gray-700">
                    Available Beds
                  </td>
                  {properties.map((p) => (
                    <td key={p.id} className="p-4 border-b border-gray-100 font-bold text-emerald-700">
                      {p.available_beds ?? 2} beds open
                    </td>
                  ))}
                </tr>

                {/* 7. Amenities Checklist */}
                <tr>
                  <td colSpan={properties.length + 1} className="p-3 bg-gray-100 font-bold text-gray-800 uppercase text-[10px] tracking-wider">
                    Amenities Comparison
                  </td>
                </tr>

                {allAmenities.map((amenity) => (
                  <tr key={amenity}>
                    <td className="p-3.5 border-b border-r border-gray-100 bg-gray-50/50 font-medium text-gray-700">
                      {amenity}
                    </td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3.5 border-b border-gray-100 text-center">
                        {p.amenities.includes(amenity) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Comparison Cards (Stack) */}
        <div className="lg:hidden space-y-6">
          {properties.map((p) => {
            const cost = calculateTrueCost({
              baseRent: p.monthly_rent_start,
              foodIncluded: p.food_included,
            });
            return (
              <div key={p.id} className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {p.property_type} • {p.gender_category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mt-1">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.locality}, Gokak</p>
                  </div>
                  <button onClick={() => removeProperty(p.id)} className="p-1 text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-400 block font-bold">Base Rent</span>
                    <span className="font-extrabold text-[#0F5C5C] text-sm">
                      ₹{p.monthly_rent_start.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold">Est. Total</span>
                    <span className="font-bold text-gray-800 text-sm">
                      ₹{cost.totalMonthlyEstimated.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Audit Status:</span>
                    <NestNovaVerifiedBadge status={p.verification_status} />
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Food:</span>
                    <span className="font-medium text-gray-800">
                      {p.food_included ? "Mess Included" : "Mess Extra"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Available:</span>
                    <span className="font-bold text-emerald-700">{p.available_beds ?? 2} beds</span>
                  </div>
                </div>

                <Link
                  href={`/student/property/${p.id}`}
                  className="w-full py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
