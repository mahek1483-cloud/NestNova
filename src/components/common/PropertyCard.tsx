"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PropertyListing } from "@/types";
import { NestNovaVerifiedBadge } from "@/components/ui/VerificationBadge";
import { calculateTrueCost } from "@/lib/api/calculator";
import { toggleSavedProperty, getSavedPropertyIds } from "@/lib/api/requests";
import {
  MapPin,
  Heart,
  Scale,
  Utensils,
  Users,
  Bed,
  Building,
  ArrowRight,
} from "lucide-react";

interface PropertyCardProps {
  property: PropertyListing;
  onCompareToggle?: (id: string) => void;
  isCompared?: boolean;
}

export function PropertyCard({ property, onCompareToggle, isCompared = false }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(() => getSavedPropertyIds().includes(property.id));

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = toggleSavedProperty(property.id);
    setIsSaved(newSaved.includes(property.id));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(property.id);
    }
  };

  // Compute true cost
  const trueCost = calculateTrueCost({
    baseRent: property.monthly_rent_start,
    foodIncluded: property.food_included,
    foodMonthlyCost: property.food_included ? 0 : 2800,
    distanceKmToCollege: 1.0,
  });

  const primaryImage =
    property.images?.find((img) => img.is_primary)?.url ||
    property.images?.[0]?.url ||
    null;

  const sharingText = property.rooms && property.rooms.length > 0
    ? Array.from(new Set(property.rooms.map((r) => `${r.sharing_capacity} Bed`))).join(", ")
    : "Single / Shared";

  return (
    <div className="group interactive-card bg-white rounded-3xl border border-gray-150/90 overflow-hidden shadow-2xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      {/* Property Visual Header */}
      <div className="relative w-full h-52 bg-slate-900 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            loading="lazy"
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0F5C5C]/90 to-[#1B2A2F] flex flex-col items-center justify-center text-white p-6 text-center">
            <Building className="w-12 h-12 text-[#F2A33A] mb-2 opacity-90 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-bold tracking-wide">{property.property_type}</span>
            <span className="text-xs text-white/70 mt-1">{property.locality}, Gokak</span>
          </div>
        )}

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <div className="flex flex-wrap gap-1.5">
            <NestNovaVerifiedBadge status={property.verification_status} />
            <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-xs">
              {property.property_type} • {property.gender_category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Compare Button */}
            <button
              onClick={handleCompare}
              title={isCompared ? "Remove from comparison" : "Add to compare"}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 ${
                isCompared
                  ? "bg-[#0F5C5C] text-white shadow-md"
                  : "bg-white/85 hover:bg-white text-gray-700 shadow-xs"
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              title={isSaved ? "Remove from saved" : "Save property"}
              className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-110 active:scale-125 ${
                isSaved
                  ? "bg-rose-500 text-white shadow-md"
                  : "bg-white/85 hover:bg-white text-gray-700 shadow-xs"
              }`}
            >
              <Heart className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Bottom Image Overlay: Locality & College Distance */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
            <span>{property.locality}, Gokak</span>
          </div>

          {typeof property.available_beds === "number" && (
            <div className="flex items-center gap-1 font-bold bg-[#1E8E5A] px-2.5 py-1 rounded-full text-white shadow-xs">
              <Bed className="w-3.5 h-3.5" />
              <span>{property.available_beds} beds left</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-extrabold text-lg text-[#1B2A2F] group-hover:text-[#0F5C5C] transition-colors leading-snug">
              {property.name}
            </h3>
            {property.rating_avg && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shrink-0">
                <span>★</span>
                <span>{property.rating_avg.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-1 mb-4">
            {property.address}
          </p>

          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-100 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0F5C5C]" />
              <span className="font-medium">{sharingText}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#F2A33A]" />
              <span className="font-medium">
                {property.food_included ? "Mess Included" : "Mess Optional"}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div>
          <div className="flex items-center justify-between mb-4 p-2.5 rounded-2xl bg-gray-50/80 border border-gray-150/70">
            <div>
              <span className="text-[10px] font-bold uppercase text-gray-500 block tracking-wider">Base Rent</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-[#0F5C5C]">
                  ₹{property.monthly_rent_start.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-500">/mo</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-gray-500 block tracking-wider">Est. True Total</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-extrabold text-xs inline-block">
                ₹{trueCost.totalMonthlyEstimated.toLocaleString("en-IN")}/mo
              </span>
            </div>
          </div>

          <Link
            href={`/student/property/${property.id}`}
            className="w-full py-2.5 px-4 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-extrabold rounded-xl shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Property Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
