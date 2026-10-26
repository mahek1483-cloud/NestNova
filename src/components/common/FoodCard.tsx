"use client";

import React from "react";
import Link from "next/link";
import { FoodProviderListing } from "@/types";
import { NestNovaVerifiedBadge } from "@/components/ui/VerificationBadge";
import {
  MapPin,
  Clock,
  Bike,
  Leaf,
  ArrowRight,
} from "lucide-react";

interface FoodCardProps {
  provider: FoodProviderListing;
}

export function FoodCard({ provider }: FoodCardProps) {
  return (
    <div className="group interactive-card bg-white rounded-3xl border border-gray-150/90 p-6 shadow-2xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                provider.is_veg
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <Leaf className="w-3 h-3" />
              <span>{provider.is_veg ? "Pure Veg" : "Veg & Non-Veg"}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
              {provider.type}
            </span>

            <NestNovaVerifiedBadge status={provider.verification_status} />
          </div>

          {provider.rating_avg && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shrink-0">
              <span>★</span>
              <span>{provider.rating_avg.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Title & Location */}
        <h3 className="text-xl font-extrabold text-[#1B2A2F] mb-1 leading-snug">
          {provider.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#F2A33A] shrink-0" />
          <span>{provider.locality}, Gokak, Karnataka</span>
        </div>

        {provider.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {provider.description}
          </p>
        )}

        {/* Timings & Delivery */}
        <div className="space-y-2 py-3 border-y border-gray-100 text-xs text-gray-600 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-medium">{provider.timings}</span>
          </div>

          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-medium">
              {provider.has_delivery
                ? "Doorstep Tiffin Delivery available in Gokak"
                : "Dine-in Mess on premise"}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase text-gray-400 block">Monthly Subscription</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#0F5C5C]">
                ₹{provider.monthly_price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-gray-500">/month</span>
            </div>
          </div>

          {provider.per_meal_price && (
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase text-gray-400 block">Per Thali</span>
              <span className="text-sm font-bold text-gray-700">₹{provider.per_meal_price}</span>
            </div>
          )}
        </div>

        <Link
          href={`/student/food/${provider.id}`}
          className="w-full py-2.5 px-4 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-extrabold rounded-xl shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Menu & Inquire</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
