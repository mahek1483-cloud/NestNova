"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  ShieldCheck,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building,
  Upload,
} from "lucide-react";
import { getGokakProperties } from "@/lib/api/properties";
import { PropertyListing } from "@/types";
import { NestNovaVerifiedBadge, LocationEvidenceBadge } from "@/components/ui/VerificationBadge";

export default function OwnerVerificationPage() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    getGokakProperties().then((res) => setProperties(res.properties));
  }, []);

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Verification & Evidence Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            NestNova verification standards for student stays located in Gokak, Karnataka.
          </p>
        </div>

        {/* Clear Policy Banner: Location Evidence ≠ NestNova Verified */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold font-sans text-amber-950 mb-1">
                Core Rule: Location Evidence ≠ NestNova Verified
              </h2>
              <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                NestNova maintains strict separation between automated camera evidence and full physical verification. Neither can be purchased.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-2">
              <LocationEvidenceBadge status="location_verified" distanceMeters={20} />
              <h4 className="font-bold text-sm text-gray-900">1. Location Evidence (GPS Live Capture)</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Photos taken live with the smartphone camera at the property address in Gokak (within 100 meters radius). Proves the physical building exists at the registered coordinate.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-2">
              <NestNovaVerifiedBadge status="verified" />
              <h4 className="font-bold text-sm text-gray-900">2. NestNova Verified Stay (Full Audit)</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Granted only after our local Gokak team physically visits your premises, audits room dimensions, inspects geysers/cleanliness, and verifies the legal lease or ownership document.
              </p>
            </div>
          </div>
        </div>

        {/* Required Evidence Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-gray-900 font-sans">
            7 Required Evidence Items for Gokak Properties
          </h3>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {[
              "Building Exterior & Street View (Gokak Locality)",
              "Student Bedroom & Study Table Space",
              "Attached / Common Bathroom with Geyser",
              "Drinking Water Filter / RO Purifier",
              "Fire Safety Equipment / Sand Buckets",
              "Operating CCTV Camera Point",
              "Signed Lease or Gokak Municipal Property Tax Receipt",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs text-gray-500">
              Need assistance scheduling an in-person audit in Gokak?
            </div>

            {requestSent ? (
              <span className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold rounded-xl text-xs border border-emerald-200">
                Audit Request Submitted! Our Gokak team will contact you.
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setRequestSent(true)}
                className="px-6 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Request In-Person Gokak Audit
              </button>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
