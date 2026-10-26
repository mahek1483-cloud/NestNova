"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Utensils,
  MapPin,
  Clock,
  Bike,
  ShieldCheck,
  Leaf,
  ChevronRight,
  Phone,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getFoodProviderById } from "@/lib/api/food";
import { FoodProviderListing } from "@/types";
import { NestNovaVerifiedBadge } from "@/components/ui/VerificationBadge";
import { submitEnquiry } from "@/lib/api/requests";

export default function FoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [provider, setProvider] = useState<FoodProviderListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enquirySent, setEnquirySent] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getFoodProviderById(resolvedParams.slug);
      setProvider(res);
      setIsLoading(false);
    }
    load();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading food service details...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Utensils className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-2">Food Provider Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">
          This food provider is not registered or not operating within Gokak, Karnataka.
        </p>
        <Link href="/student/food" className="px-6 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-sm">
          Browse Gokak Mess Services
        </Link>
      </div>
    );
  }

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitEnquiry({
        propertyId: `food-${provider.id}`,
        propertyName: provider.name,
        propertyLocality: provider.locality,
        message: `Mess Subscription Inquiry: ${message || "Requesting trial meal and subscription details."}`,
        studentName,
        studentPhone,
      });
    } catch {}
    setEnquirySent(true);
  };

  return (
    <div className="bg-[#FBF8F3] min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="container mx-auto max-w-5xl flex items-center gap-2 text-xs text-gray-500">
          <Link href="/student" className="hover:text-[#0F5C5C]">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/student/food" className="hover:text-[#0F5C5C]">
            Gokak Mess Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-bold truncate">{provider.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    provider.is_veg
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>{provider.is_veg ? "Pure Vegetarian" : "Veg & Non-Veg"}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                  {provider.type}
                </span>
                <NestNovaVerifiedBadge status={provider.verification_status} />
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A2F] font-sans tracking-tight mb-2">
                {provider.name}
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
                <span>{provider.locality}, Gokak, Karnataka (Pincode: 591307)</span>
              </div>

              {provider.description && (
                <div className="pt-4 border-t border-gray-100 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">About this Food Provider</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {provider.description}
                  </p>
                </div>
              )}

              {/* Service Details */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl text-xs text-gray-700">
                <div className="space-y-1">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Serving Timings:</span>
                  </span>
                  <p className="text-gray-600 pl-5">{provider.timings}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-gray-400" />
                    <span>Delivery Mode:</span>
                  </span>
                  <p className="text-gray-600 pl-5">
                    {provider.has_delivery
                      ? "Doorstep tiffin delivery across Gokak localities"
                      : "Dine-in seated student mess"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
              <h3 className="text-lg font-extrabold text-[#1B2A2F] mb-4 font-sans flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#0F5C5C]" />
                <span>Typical Daily Student Menu</span>
              </h3>

              {provider.menu_items && provider.menu_items.length > 0 ? (
                <div className="space-y-3">
                  {provider.menu_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start p-3 rounded-2xl bg-gray-50 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <span>{item.name}</span>
                          {item.is_veg && <Leaf className="w-3 h-3 text-emerald-600" />}
                        </div>
                        {item.description && (
                          <p className="text-gray-500 mt-0.5">{item.description}</p>
                        )}
                      </div>
                      {item.price && (
                        <span className="font-extrabold text-[#0F5C5C]">₹{item.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-800">Sample North Karnataka Student Thali:</p>
                  <p>• 2 Fresh Jolada Rotti / Chapati with Shengada Chutney</p>
                  <p>• 1 Seasonal Dry Veg Palya (Ennegai / Mixed Veg)</p>
                  <p>• 1 Dal Sambar / Tovve with Steamed White Rice</p>
                  <p>• Fresh Curd / Buttermilk & Salad</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Subscription Contact Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-lg space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-gray-400 uppercase block">Monthly Subscription</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-[#0F5C5C]">
                    ₹{provider.monthly_price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ month (Lunch & Dinner)</span>
                </div>
                {provider.per_meal_price && (
                  <span className="text-xs text-gray-600 font-medium mt-1 block">
                    Single Thali / Trial: ₹{provider.per_meal_price}
                  </span>
                )}
              </div>

              {enquirySent ? (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold">Subscription Enquiry Sent!</p>
                  <p className="text-gray-600">The mess coordinator in Gokak will contact you on your mobile number.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="space-y-3.5">
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Subscribe or Ask for Trial Thali</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Student name"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Delivery Address in Gokak (If Tiffin)</label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Near JSS College, Station Road"
                      className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Inquire for Trial Meal</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
