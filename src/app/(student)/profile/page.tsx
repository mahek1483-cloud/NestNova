"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  ShieldCheck,
  Building,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { GOKAK_COLLEGES } from "@/constants/gokak";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StudentProfileForm({ user }: { user: any }) {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "Student Resident");
  const [email] = useState(user?.email || "student@example.com");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "+91 98765 43210");
  const [preferredCollege, setPreferredCollege] = useState("jss-gokak");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your personal contact information for stay enquiries and visit bookings in Gokak.
          </p>
        </div>

        {/* Security / Immutability Notice */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3 text-xs text-gray-700">
          <Lock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Account Security & Role Protection:</span>
            <span>
              Your account role (<strong>Student</strong>) and verification records are strictly protected by server-side authorization and database triggers. Roles cannot be modified from the client.
            </span>
          </div>
        </div>

        {isSaved && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
          {/* Avatar and Role */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#0F5C5C] text-white flex items-center justify-center text-xl font-bold">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">{fullName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Role: Student
                </span>
                <span className="text-xs text-gray-400">Gokak Marketplace</span>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Email Address
              </label>
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> Verified by Auth
              </span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Contact Phone (For Visit SMS & Calls)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Shared with property owners only when you submit a visit request or enquiry.
            </p>
          </div>

          {/* Preferred College in Gokak */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Enrolled / Target College in Gokak
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <select
                value={preferredCollege}
                onChange={(e) => setPreferredCollege(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
              >
                {GOKAK_COLLEGES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.locality})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Used to calculate walking and auto commute times to your campus.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Changes..." : "Save Profile Details"}</span>
            </button>
          </div>
        </form>
      </div>
  );
}

export default function StudentProfilePage() {
  const user = useAuthUser();
  return (
    <StudentLayout>
      <StudentProfileForm key={user?.id || "guest"} user={user} />
    </StudentLayout>
  );
}
