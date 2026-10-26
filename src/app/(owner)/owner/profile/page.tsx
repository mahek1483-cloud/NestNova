"use client";

import React, { useState, useEffect } from "react";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OwnerProfileForm({ user }: { user: any }) {
  const [businessName, setBusinessName] = useState("Gokak Student Stays");
  const [ownerName, setOwnerName] = useState(user?.user_metadata?.full_name || "Gokak Stay Owner");
  const [email] = useState(user?.email || "owner@nestnova.in");
  const [contactPhone, setContactPhone] = useState("+91 94480 12345");
  const [officeAddress, setOfficeAddress] = useState("Court Road, Near Municipal Office, Gokak, Karnataka 591307");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Owner Business Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Registered business details for hosting students in Gokak, Karnataka.
          </p>
        </div>

        {/* Immutability & Safety Box */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3 text-xs text-gray-700">
          <Lock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Role Authorization & Gokak Host Protection:</span>
            <span>
              Your host profile (<strong>Owner / Provider</strong>) is permanently bound to your authenticated identity. Verification statuses are audited by administrators and cannot be altered client-side.
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Owner profile changes saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#0F5C5C] text-white flex items-center justify-center text-xl font-bold">
              {businessName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">{businessName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0F5C5C] text-xs font-bold border border-teal-200">
                  Role: Property Owner
                </span>
                <span className="text-xs text-gray-400">Gokak, Karnataka</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Business / Hostel Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Contact Person Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase">Registered Email</label>
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> System Verified
              </span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border rounded-xl text-xs sm:text-sm font-medium text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Phone (Visible to Students)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Gokak Office / Reception Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Business Profile"}</span>
            </button>
          </div>
        </form>
      </div>
  );
}

export default function OwnerProfilePage() {
  const user = useAuthUser();
  return (
    <OwnerLayout>
      <OwnerProfileForm key={user?.id || "guest"} user={user} />
    </OwnerLayout>
  );
}
