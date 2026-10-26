import React from "react";
import { ShieldCheck, MapPin, AlertCircle, Clock } from "lucide-react";
import { VerificationStatus, PhotoStatus } from "@/types";

interface VerificationBadgeProps {
  status: VerificationStatus;
  verifiedAt?: string | null;
  className?: string;
}

/**
 * Distinct badge for NestNova Verified Properties.
 * Full physical audit by NestNova team.
 * NEVER made equivalent to simple GPS/location evidence.
 */
export function NestNovaVerifiedBadge({ status, verifiedAt, className = "" }: VerificationBadgeProps) {
  if (status === "verified") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs hover:shadow-sm transition-all duration-300 ${className}`}
        title={verifiedAt ? `Audited by NestNova on ${new Date(verifiedAt).toLocaleDateString("en-IN")}` : "Full physical audit completed by NestNova in Gokak"}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="tracking-tight">NestNova Verified</span>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold ${className}`}
        title="Physical verification requested; awaiting audit"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Verification Pending</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium ${className}`}
      title="Unverified listing - visit in person before making any decisions"
    >
      <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <span>Unverified Stay</span>
    </div>
  );
}

interface LocationEvidenceBadgeProps {
  status: PhotoStatus;
  distanceMeters?: number;
  className?: string;
}

/**
 * Distinct badge for Location Evidence.
 * Geo-tagged live capture within radius of Gokak property.
 * Strictly separate from full in-person NestNova verification.
 */
export function LocationEvidenceBadge({ status, distanceMeters, className = "" }: LocationEvidenceBadgeProps) {
  if (status === "location_verified") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold ${className}`}
        title={`Live camera photo taken on-site in Gokak (${distanceMeters ? Math.round(distanceMeters) + "m" : "on premise"})`}
      >
        <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
        <span>Location Evidence ({distanceMeters ? `${Math.round(distanceMeters)}m` : "On-site"})</span>
      </div>
    );
  }

  if (status === "location_rejected") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-medium ${className}`}
        title="GPS capture was outside allowed Gokak radius or failed validation"
      >
        <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
        <span>Location Mismatch</span>
      </div>
    );
  }

  return null;
}
