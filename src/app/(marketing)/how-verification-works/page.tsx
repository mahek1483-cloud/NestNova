/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { ShieldCheck, MapPin, Eye, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { NestNovaVerifiedBadge, LocationEvidenceBadge } from "@/components/ui/VerificationBadge";

export default function HowVerificationWorks() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1E8E5A]/10 text-[#1E8E5A] rounded-2xl mb-6 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full mb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gokak, Karnataka Verification Protocol</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-sans mb-4 text-[#1B2A2F] tracking-tight">
          How NestNova Verification Works
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We physically visit properties in Gokak to ensure what you see online matches reality. No misleading photography, no hidden charges.
        </p>
      </div>

      {/* Critical Distinction Banner */}
      <div className="bg-amber-50/80 rounded-3xl border border-amber-200 p-8 mb-12 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sans text-amber-950 mb-2">
              Important: Location Evidence ≠ NestNova Verified
            </h2>
            <p className="text-sm text-amber-900/90 leading-relaxed mb-4">
              We never make digital GPS evidence equivalent to a full human audit. Understand the two badges:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-200/80">
                <div className="mb-2">
                  <LocationEvidenceBadge status="location_verified" distanceMeters={25} />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Location Evidence</h3>
                <p className="text-xs text-gray-600">
                  Photos captured live on a smartphone within 100 meters of the registered Gokak address. Confirms the building physically exists where claimed.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/80">
                <div className="mb-2">
                  <NestNovaVerifiedBadge status="verified" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">NestNova Verified Stay</h3>
                <p className="text-xs text-gray-600">
                  Full 7-point audit performed in-person by an auditor in Gokak. Confirms room sizes, water geyser, fire safety, and listed rent match.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 7-Point Checklist */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
        <h2 className="text-2xl font-bold font-sans text-[#1B2A2F] mb-6">
          The NestNova 7-Point Audit Checklist
        </h2>
        <div className="space-y-6">
          {[
            {
              step: 1,
              title: "Property & Identity Verification",
              desc: "We inspect ownership / lease documents to verify the owner has the legal right to host students in Gokak.",
            },
            {
              step: 2,
              title: "Actual Photos vs Reality",
              desc: "Auditors compare bedroom, bathroom, and kitchen photos with real conditions to eliminate wide-angle distortions.",
            },
            {
              step: 3,
              title: "Bed Space & Ventilation",
              desc: "We measure room square footage and ensure every bed has sufficient personal space, study desk, and natural air circulation.",
            },
            {
              step: 4,
              title: "Water Supply & Geyser",
              desc: "Essential for Gokak winters: we check 24/7 running water pressure and hot water geyser operational status.",
            },
            {
              step: 5,
              title: "Fire Safety & Gate Security",
              desc: "We verify functioning CCTV cameras, marked exit pathways, and secure night gate locking procedures.",
            },
            {
              step: 6,
              title: "Mess Kitchen Hygiene",
              desc: "For stays offering meals, we inspect kitchen cleanliness, drinking water RO filters, and food storage standards.",
            },
            {
              step: 7,
              title: "Rent Price Lock Commitment",
              desc: "The owner formally agrees that the rent, maintenance, and electricity terms on NestNova will not be inflated upon arrival.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="shrink-0 w-8 h-8 bg-[#0F5C5C] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
                {item.step}
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1B2A2F]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strict Anti-Pay-to-Verify Policy */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-12 shadow-sm">
        <h2 className="text-2xl font-bold font-sans text-[#1B2A2F] mb-4">
          Strict Anti-Pay-to-Verify Policy
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          On NestNova, verification cannot be purchased. Payment status NEVER influences ranking, ratings, or verification decisions:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200">
            <h4 className="font-bold mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>How a stay gets verified</span>
            </h4>
            <p className="leading-relaxed">
              Only by submitting location photos, valid proof of address in Gokak, and passing our auditor's physical inspection.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200">
            <h4 className="font-bold mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>What money CANNOT buy</span>
            </h4>
            <p className="leading-relaxed">
              Paying for a listing ad or subscription NEVER removes negative resident reviews or bypasses inspection requirements.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <Link
          href="/student/search"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-2xl shadow-md text-sm transition-all"
        >
          <span>Explore Verified Gokak Stays</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
