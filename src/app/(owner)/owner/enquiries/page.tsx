"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Calendar,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Building,
  User,
  Phone,
  MessageSquare,
} from "lucide-react";
import { getStudentEnquiries, getStudentVisits, updateVisitStatus } from "@/lib/api/requests";
import { StudentEnquiry, VisitRequest } from "@/types";

export default function OwnerEnquiriesPage() {
  const [activeTab, setActiveTab] = useState<"visits" | "enquiries">("visits");
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [enquiries, setEnquiries] = useState<StudentEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const handleUpdateVisitStatus = async (id: string, newStatus: VisitRequest["status"]) => {
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    await updateVisitStatus(id, newStatus);
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Visits & Student Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage incoming student visit requests and direct property questions for your Gokak stays.
          </p>
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
            <span>Visit Requests ({visits.length})</span>
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

        {/* Content */}
        {activeTab === "visits" ? (
          visits.length > 0 ? (
            <div className="space-y-4">
              {visits.map((vis) => (
                <div
                  key={vis.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-[#1B2A2F]">
                        {vis.property_name}
                      </h3>
                      <p className="text-xs text-gray-500">{vis.property_locality}, Gokak</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        vis.status === "accepted"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : vis.status === "rejected"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : vis.status === "completed"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      Status: {vis.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-2xl">
                      <span className="text-gray-400 block font-semibold mb-0.5">Student Name</span>
                      <span className="font-bold text-gray-900">{vis.student_name || "Prospective Student"}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl">
                      <span className="text-gray-400 block font-semibold mb-0.5">Requested Schedule</span>
                      <span className="font-bold text-[#0F5C5C]">
                        {new Date(vis.scheduled_at).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl">
                      <span className="text-gray-400 block font-semibold mb-0.5">Contact Phone</span>
                      <span className="font-bold text-gray-900">{vis.student_phone || "Protected"}</span>
                    </div>
                  </div>

                  {vis.student_notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl">
                      <strong>Student Note:</strong> {vis.student_notes}
                    </p>
                  )}

                  {/* Actions: Accept, Reject, Propose, Complete */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {vis.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateVisitStatus(vis.id, "accepted")}
                          className="px-4 py-2 bg-[#1E8E5A] hover:bg-[#18754a] text-white font-bold rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
                        >
                          Accept Visit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateVisitStatus(vis.id, "proposed")}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
                        >
                          Propose Another Time
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateVisitStatus(vis.id, "rejected")}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {vis.status === "accepted" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateVisitStatus(vis.id, "completed")}
                        className="px-4 py-2 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
                      >
                        Mark Visit as Completed
                      </button>
                    )}

                    <Link
                      href="/owner/messages"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all ml-auto flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Student</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-gray-800">No student visits requested yet</h3>
              <p className="text-xs text-gray-500 mt-1">
                When students schedule an in-person room inspection for your Gokak stays, they will appear here.
              </p>
            </div>
          )
        ) : enquiries.length > 0 ? (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">{enq.property_name}</h3>
                    <p className="text-xs text-gray-500">From: {enq.student_name || "Student"}</p>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(enq.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl">&ldquo;{enq.message}&rdquo;</p>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/owner/messages"
                    className="px-4 py-2 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs shadow-xs"
                  >
                    Reply to Student
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-gray-800">No direct enquiries yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              Questions from students in Gokak will appear here.
            </p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
