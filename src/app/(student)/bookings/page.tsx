"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Building,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { getStudentBookings } from "@/lib/api/requests";
import { BookingRecord } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      setIsLoading(true);
      try {
        const res = await getStudentBookings();
        setBookings(res);
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, []);

  const getStatusBadge = (status: BookingRecord["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Booking Approved by Owner
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Stay Confirmed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Booking Declined
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
            Stay Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Owner Approval
          </span>
        );
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            My Room Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track reservation approvals, move-in timelines, and stay confirmations in Gokak.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((bk) => (
              <div
                key={bk.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-lg text-[#1B2A2F]">{bk.property_name}</h3>
                      {getStatusBadge(bk.status)}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F2A33A]" />
                      {bk.property_locality}, Gokak, Karnataka
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-gray-400 uppercase block">Monthly Rent</span>
                    <span className="text-lg font-black text-[#0F5C5C]">
                      ₹{bk.monthly_rent.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Room Type</span>
                    <span className="font-bold text-gray-800">{bk.room_type}</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Move-In Date</span>
                    <span className="font-bold text-gray-800">
                      {new Date(bk.start_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Security Deposit</span>
                    <span className="font-bold text-gray-800">
                      ₹{bk.deposit_amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Booking Reference</span>
                    <span className="font-mono font-bold text-gray-700">{bk.id}</span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Requested on{" "}
                    {new Date(bk.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student/property/${bk.property_id}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all"
                    >
                      View Stay
                    </Link>

                    {bk.status === "approved" && (
                      <Link
                        href="/student/payments"
                        className="px-4 py-2 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Proceed to Pay Deposit</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="bookings"
            title="No room bookings yet"
            description="You haven't reserved any beds in Gokak yet. Find your stay, schedule a visit, and reserve your place."
            actionText="Find a Stay in Gokak"
            actionHref="/student/search"
          />
        )}
      </div>
    </StudentLayout>
  );
}
