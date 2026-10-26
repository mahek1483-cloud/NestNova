"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  Bed,
  MapPin,
  IndianRupee,
  Calendar,
} from "lucide-react";
import { getStudentBookings, updateBookingStatus } from "@/lib/api/requests";
import { BookingRecord } from "@/types";

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const handleUpdateBooking = async (id: string, newStatus: BookingRecord["status"]) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    await updateBookingStatus(id, newStatus);
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Room Bookings & Bed Reservations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review move-in reservation requests, approve occupancy, and manage stay confirmations.
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">{bk.property_name}</h3>
                    <p className="text-xs text-gray-500">
                      Student: <strong>{bk.student_name || "Prospective Student"}</strong> • Phone: {bk.student_phone || "Protected"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      bk.status === "approved"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : bk.status === "confirmed"
                        ? "bg-teal-50 text-teal-800 border border-teal-200"
                        : bk.status === "rejected"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    Booking: {bk.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Room Type</span>
                    <span className="font-bold text-gray-800">{bk.room_type}</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Monthly Rent</span>
                    <span className="font-bold text-[#0F5C5C]">₹{bk.monthly_rent.toLocaleString("en-IN")}/mo</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Deposit</span>
                    <span className="font-bold text-gray-800">₹{bk.deposit_amount.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-400 block font-semibold mb-0.5">Target Move-in</span>
                    <span className="font-bold text-gray-800">
                      {new Date(bk.start_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions: Approve, Reject, Confirm */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {bk.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateBooking(bk.id, "approved")}
                        className="px-4 py-2 bg-[#1E8E5A] hover:bg-[#18754a] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                      >
                        Approve Reservation
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateBooking(bk.id, "rejected")}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {bk.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateBooking(bk.id, "confirmed")}
                      className="px-4 py-2 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                    >
                      Confirm Student Move-In
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-gray-800">No room booking requests yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              When a student requests to reserve a bed in your Gokak property, their booking application will appear here.
            </p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
