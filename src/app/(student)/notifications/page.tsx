"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Check,
} from "lucide-react";
import { getStudentNotifications } from "@/lib/api/requests";
import { InAppNotification } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function StudentNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "booking" | "visit" | "payment" | "message">("all");
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getStudentNotifications();
        setNotifications(res);
      } catch {
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.category === filter);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
              Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Important updates about your stay requests, scheduled visits, and payment confirmations in Gokak.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
          {(["all", "booking", "visit", "payment", "message"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === cat
                  ? "bg-[#0F5C5C] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat === "all" ? "All Updates" : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  !item.is_read
                    ? "bg-white border-emerald-200 shadow-xs"
                    : "bg-gray-50/70 border-gray-100 text-gray-600"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F5C5C] flex items-center justify-center shrink-0 border border-teal-200">
                  {item.category === "booking" && <Building className="w-5 h-5" />}
                  {item.category === "visit" && <Calendar className="w-5 h-5" />}
                  {item.category === "payment" && <CreditCard className="w-5 h-5" />}
                  {item.category === "message" && <MessageSquare className="w-5 h-5" />}
                  {item.category === "verification" && <ShieldCheck className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                    <span className="text-[10px] text-gray-400">
                      {new Date(item.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="notifications"
            title="No notifications in this category"
            description="You are completely up to date. Important updates on your visits and stays in Gokak will appear here."
            actionText="Browse Gokak Stays"
            actionHref="/student/search"
          />
        )}
      </div>
    </StudentLayout>
  );
}
