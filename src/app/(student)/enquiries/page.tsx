"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Calendar,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Building,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { getStudentEnquiries, getStudentVisits } from "@/lib/api/requests";
import { StudentEnquiry, VisitRequest } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function StudentEnquiriesPage() {
  const [activeTab, setActiveTab] = useState<"visits" | "enquiries">("visits");
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [enquiries, setEnquiries] = useState<StudentEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [vList, eList] = await Promise.all([getStudentVisits(), getStudentEnquiries()]);
        setVisits(vList);
        setEnquiries(eList);
      } catch {
        setVisits([]);
        setEnquiries([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getVisitStatusBadge = (status: VisitRequest["status"]) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Accepted / Confirmed Visit
          </span>
        );
      case "proposed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Owner Proposed New Time
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Visit Declined
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-600" />
            Visit Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Pending Owner Confirmation
          </span>
        );
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Visits & Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your physical inspection visits and direct question threads with Gokak stay owners.
          </p>
        </div>

        {/* Clear Notice Distinguishing Visits from Bookings */}
        <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
          <AlertCircle className="w-4 h-4 text-[#0F5C5C] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Physical Visits are Separate from Bookings:</span>
            <span>
              Requesting a visit schedules a free inspection of the stay in Gokak. It does NOT charge a deposit or reserve a bed. When ready to move in, submit an official room booking.
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab("visits")}
            className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "visits"
                ? "border-[#0F5C5C] text-[#0F5C5C]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Scheduled Visits ({visits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("enquiries")}
            className={`pb-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "enquiries"
                ? "border-[#0F5C5C] text-[#0F5C5C]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Direct Enquiries ({enquiries.length})</span>
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === "visits" ? (
          visits.length > 0 ? (
            <div className="space-y-4">
              {visits.map((vis) => (
                <div
                  key={vis.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-[#1B2A2F]">
                        {vis.property_name}
                      </h3>
                      {getVisitStatusBadge(vis.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
                        {vis.property_locality}, Gokak
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-[#0F5C5C]" />
                        {new Date(vis.scheduled_at).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {vis.student_notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl max-w-lg">
                        <strong>Your note:</strong> {vis.student_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/student/property/${vis.property_id}`}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs text-center transition-all"
                    >
                      View Property
                    </Link>
                    <Link
                      href="/student/messages"
                      className="flex-1 sm:flex-none px-4 py-2 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs text-center transition-all"
                    >
                      Message Owner
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              type="visits"
              title="No upcoming visits scheduled"
              description="Visiting a student PG or hostel in Gokak in person gives you full clarity on room size, cleanliness, and water supply."
              actionText="Browse Stays & Schedule Visit"
              actionHref="/student/search"
            />
          )
        ) : enquiries.length > 0 ? (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-[#1B2A2F]">
                      {enq.property_name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        enq.status === "open"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enq.status === "open" ? "Active Thread" : "Closed"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
                    {enq.property_locality}, Gokak
                  </p>

                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl max-w-xl">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href="/student/messages"
                    className="w-full sm:w-auto px-4 py-2 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="enquiries"
            title="No active enquiries in Gokak"
            description="When you have questions about a room, meal timings, or gate rules in Gokak, enquire directly with verified owners."
            actionText="Explore Gokak Stays"
            actionHref="/student/search"
          />
        )}
      </div>
    </StudentLayout>
  );
}
