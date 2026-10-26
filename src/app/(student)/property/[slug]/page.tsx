"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Heart,
  Scale,
  Calendar,
  Send,
  Bed,
  Utensils,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  Navigation,
  Lock,
  Wifi,
  ChevronRight,
  Info,
} from "lucide-react";
import { getPropertyById } from "@/lib/api/properties";
import { toggleSavedProperty, getSavedPropertyIds } from "@/lib/api/requests";
import { PropertyListing } from "@/types";
import { NestNovaVerifiedBadge, LocationEvidenceBadge } from "@/components/ui/VerificationBadge";
import { CostBreakdown } from "@/components/common/CostBreakdown";
import { EnquiryModal, ScheduleVisitModal, BookingModal } from "@/components/common/ActionModals";
import { GOKAK_COLLEGES } from "@/constants/gokak";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  // Modals
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      setIsLoading(true);
      const res = await getPropertyById(resolvedParams.slug);
      if (!res) {
        setProperty(null);
      } else {
        setProperty(res);
        setIsSaved(getSavedPropertyIds().includes(res.id));
      }
      setIsLoading(false);
    }

    fetchProperty();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl text-center text-gray-500">
        <div className="w-12 h-12 border-4 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading verified property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-2">Property Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">
          This stay either does not exist or is not registered within the strict Gokak, Karnataka scope.
        </p>
        <Link
          href="/student/search"
          className="px-6 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-sm"
        >
          Explore All Gokak Stays
        </Link>
      </div>
    );
  }

  const selectedRoom = property.rooms?.[selectedRoomIndex] || property.rooms?.[0];
  const monthlyRent = selectedRoom?.rent_amount || property.monthly_rent_start;
  const depositAmount = selectedRoom?.deposit_amount || property.security_deposit_start;

  const handleToggleSave = () => {
    const updated = toggleSavedProperty(property.id);
    setIsSaved(updated.includes(property.id));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-[#FBF8F3] min-h-screen pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="container mx-auto max-w-6xl flex items-center gap-2 text-xs text-gray-500">
          <Link href="/student" className="hover:text-[#0F5C5C]">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/student/search" className="hover:text-[#0F5C5C]">
            Gokak Stays
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-bold truncate">{property.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 h-72 sm:h-96 relative bg-gray-900">
            {property.images?.[0] ? (
              <Image
                src={property.images[0].url}
                alt={property.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#0F5C5C]/90 flex flex-col items-center justify-center text-white p-6">
                <MapPin className="w-12 h-12 text-[#F2A33A] mb-2" />
                <span className="font-bold text-lg">{property.name}</span>
                <span className="text-xs text-white/70">{property.locality}, Gokak</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <NestNovaVerifiedBadge status={property.verification_status} />
            </div>
          </div>

          <div className="hidden md:grid col-span-2 grid-cols-2 gap-3 h-96">
            {[1, 2, 3, 4].map((idx) => {
              const img = property.images?.[idx];
              return (
                <div key={idx} className="relative bg-gray-200 rounded-2xl overflow-hidden">
                  {img ? (
                    <Image src={img.url} alt={`${property.name} ${idx}`} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-semibold">
                      <span>Room Interior</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Title, Badges & Save Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 mb-8 border-b border-gray-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
                {property.property_type}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
                {property.gender_category}
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{property.locality}, Gokak, Karnataka</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
              {property.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{property.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-gray-500" />
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-2xs"
              }`}
            >
              <Heart className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
              <span>{isSaved ? "Saved" : "Save Stay"}</span>
            </button>

            <Link
              href={`/student/compare?ids=${property.id}`}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs"
            >
              <Scale className="w-4 h-4 text-gray-500" />
              <span>Compare</span>
            </Link>
          </div>
        </div>

        {/* Two-Column Marketplace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Details Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Verification Status Explainer Box */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-gray-900">NestNova Verification Status</h3>
                </div>
                <NestNovaVerifiedBadge status={property.verification_status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl space-y-1">
                  <span className="font-bold text-gray-900 block">Location Evidence (GPS Camera)</span>
                  <p className="text-gray-500 leading-relaxed">
                    Photos captured live by owner within verified Gokak boundaries. Confirms physical structure.
                  </p>
                  <LocationEvidenceBadge status="location_verified" distanceMeters={15} />
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl space-y-1">
                  <span className="font-bold text-gray-900 block">Physical Audit (Human Inspection)</span>
                  <p className="text-gray-500 leading-relaxed">
                    Bed dimensions, water pressure, and rent transparency physically confirmed in person in Gokak.
                  </p>
                  <span className="inline-block text-[11px] font-bold text-emerald-700">
                    Audit Status: {property.verification_status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Options & Sharing */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
              <h3 className="text-lg font-extrabold text-[#1B2A2F] mb-4 font-sans">
                Room Sharing Options & Available Beds
              </h3>

              {property.rooms && property.rooms.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {property.rooms.map((room, idx) => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomIndex(idx)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedRoomIndex === idx
                          ? "border-[#0F5C5C] bg-[#0F5C5C]/5 ring-2 ring-[#0F5C5C]"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-[#1B2A2F]">{room.room_type}</span>
                        <span className="text-xs font-extrabold text-[#0F5C5C]">
                          ₹{room.rent_amount.toLocaleString("en-IN")}/mo
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p>{room.sharing_capacity} Bed Sharing Room</p>
                        <p>Deposit: ₹{room.deposit_amount.toLocaleString("en-IN")}</p>
                        <p className="text-emerald-700 font-semibold">
                          {room.available_beds_count ?? 1} bed(s) available
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Contact owner for specific room configurations.</p>
              )}
            </div>

            {/* Overview / Description */}
            {property.description && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
                <h3 className="text-lg font-extrabold text-[#1B2A2F] mb-3 font-sans">
                  About this Gokak Stay
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
              <h3 className="text-lg font-extrabold text-[#1B2A2F] mb-4 font-sans">
                Verified Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-[#F2A33A]" />
                <h3 className="text-lg font-extrabold text-[#1B2A2F] font-sans">
                  Food & Mess Arrangements
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {property.food_included
                  ? "Daily vegetarian student mess is included in the monthly rent. Includes breakfast, lunch box provision for college, and dinner."
                  : "Food is not included in base rent. Student can opt for independent local Gokak tiffin services or nearby mess providers."}
              </p>
              <Link
                href="/student/food"
                className="text-xs font-bold text-[#0F5C5C] hover:underline inline-flex items-center gap-1"
              >
                <span>Browse Gokak mess and tiffin providers →</span>
              </Link>
            </div>

            {/* College Commute Distances */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-[#0F5C5C]" />
                <h3 className="text-lg font-extrabold text-[#1B2A2F] font-sans">
                  Distance to Gokak Campuses
                </h3>
              </div>
              <div className="space-y-2.5">
                {GOKAK_COLLEGES.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-xs"
                  >
                    <span className="font-bold text-gray-800">{col.name}</span>
                    <span className="text-gray-500 font-medium">~1.2 km (Walking / Short Auto)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules & Safety */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>House Rules</span>
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {property.rules && property.rules.length > 0 ? (
                    property.rules.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#0F5C5C]">•</span>
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>• Gate closes at 10:00 PM</li>
                      <li>• Visitors allowed in reception area only</li>
                      <li>• 1 month advance notice before vacating</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Safety & Security</span>
                </h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li>• CCTV surveillance in common areas</li>
                  <li>• Gated property with night security lock</li>
                  <li>• Fire safety bucket & extinguisher on floor</li>
                  <li>• Nearest medical clinic within 500m in Gokak</li>
                </ul>
              </div>
            </div>

            {/* Genuine Resident Reviews */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs">
              <h3 className="text-lg font-extrabold text-[#1B2A2F] mb-4 font-sans">
                Verified Resident Reviews
              </h3>
              {property.reviews && property.reviews.length > 0 ? (
                <div className="space-y-4">
                  {property.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{rev.author_name}</span>
                        <span className="text-amber-600 font-bold">★ {rev.rating_overall}/5</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{rev.review_text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-2xl text-center text-xs text-gray-500">
                  <p>No verified resident reviews submitted yet for this Gokak property.</p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Only students with confirmed stay records can publish reviews on NestNova.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Right Action Column (Booking & Cost) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-lg space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-gray-400 uppercase block">Starting Rent</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-[#0F5C5C]">
                    ₹{monthlyRent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ bed / month</span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold mt-1 block">
                  Deposit: ₹{depositAmount.toLocaleString("en-IN")} (Refundable)
                </span>
              </div>

              {/* 3 Explicit Separate Action Buttons */}
              <div className="space-y-2.5">
                {/* 1. Schedule Visit */}
                <button
                  type="button"
                  onClick={() => setShowVisit(true)}
                  className="w-full py-3.5 px-4 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#F2A33A]" />
                  <span>Request Free Visit</span>
                </button>

                {/* 2. Direct Enquiry */}
                <button
                  type="button"
                  onClick={() => setShowEnquiry(true)}
                  className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl border border-gray-200 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#0F5C5C]" />
                  <span>Enquire With Owner</span>
                </button>

                {/* 3. Reserve Room */}
                <button
                  type="button"
                  onClick={() => setShowBooking(true)}
                  className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bed className="w-4 h-4 text-emerald-600" />
                  <span>Reserve Bed</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Free physical visits do not require payment and do not create a binding booking.
              </p>
            </div>

            {/* True Cost Calculator Card */}
            <CostBreakdown
              compact
              initialInput={{
                baseRent: monthlyRent,
                foodIncluded: property.food_included,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <EnquiryModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        propertyId={property.id}
        propertyName={property.name}
        propertyLocality={property.locality}
        ownerId={property.owner_id}
      />

      <ScheduleVisitModal
        isOpen={showVisit}
        onClose={() => setShowVisit(false)}
        propertyId={property.id}
        propertyName={property.name}
        propertyLocality={property.locality}
        ownerId={property.owner_id}
      />

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        propertyId={property.id}
        propertyName={property.name}
        propertyLocality={property.locality}
        roomType={selectedRoom?.room_type || "Standard Bed"}
        monthlyRent={monthlyRent}
        depositAmount={depositAmount}
      />
    </div>
  );
}
