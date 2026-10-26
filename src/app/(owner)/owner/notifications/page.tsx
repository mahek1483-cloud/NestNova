"use client";

import React, { useState, useEffect } from "react";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Bell,
  Calendar,
  Building,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getStudentNotifications } from "@/lib/api/requests";
import { InAppNotification } from "@/types";

export default function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentNotifications().then((res) => {
      setNotifications(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Owner Notifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time notifications for incoming student visits, enquiries, and audit milestones in Gokak.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading updates...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F5C5C] flex items-center justify-center shrink-0 border border-teal-200">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(n.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-gray-800">No new notifications</h3>
            <p className="text-xs text-gray-500 mt-1">
              You are all caught up! New requests from students in Gokak will notify you here.
            </p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
