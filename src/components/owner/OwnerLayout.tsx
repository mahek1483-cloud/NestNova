"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  PlusCircle,
  Bed,
  Camera,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Bell,
  User,
} from "lucide-react";
import { getOwnerOverviewMetrics } from "@/lib/api/requests";
import { useAuthUser } from "@/hooks/useAuthUser";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const pathname = usePathname();
  const user = useAuthUser();
  const [metrics, setMetrics] = useState({
    pendingEnquiries: 0,
    pendingVisits: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    getOwnerOverviewMetrics().then((m) => {
      setMetrics({
        pendingEnquiries: m.pendingEnquiries,
        pendingVisits: m.pendingVisits,
        pendingBookings: m.pendingBookings,
      });
    });
  }, [pathname]);

  const navItems = [
    { href: "/owner", label: "Business Overview", icon: Building },
    { href: "/owner/properties", label: "My Properties", icon: Building },
    { href: "/owner/properties/new", label: "+ Add Gokak Stay", icon: PlusCircle, isHighlight: true },
    { href: "/owner/rooms", label: "Rooms & Availability", icon: Bed },
    { href: "/owner/photos", label: "Photos & Evidence", icon: Camera },
    { href: "/owner/verification", label: "Verification Center", icon: ShieldCheck },
    {
      href: "/owner/enquiries",
      label: "Visits & Enquiries",
      icon: CalendarCheck,
      badge: metrics.pendingEnquiries + metrics.pendingVisits,
    },
    {
      href: "/owner/bookings",
      label: "Room Bookings",
      icon: Building,
      badge: metrics.pendingBookings,
    },
    { href: "/owner/payments", label: "Payments & Payouts", icon: CreditCard },
    { href: "/owner/messages", label: "Student Messages", icon: MessageSquare },
    { href: "/owner/notifications", label: "Notifications", icon: Bell },
    { href: "/owner/profile", label: "Owner Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F3] flex flex-col md:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-gray-200/80 shrink-0 min-h-[calc(100vh-5rem)] p-4 lg:p-6 sticky top-20 self-start h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Scope Pill */}
        <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 text-teal-900 border border-teal-200 rounded-2xl text-xs font-bold mb-6">
          <Building className="w-4 h-4 text-[#0F5C5C] shrink-0" />
          <div className="flex flex-col">
            <span className="leading-tight">Gokak Owner Portal</span>
            <span className="text-[10px] text-teal-700/80 font-medium">Verified Property Business</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">
            Owner Management
          </span>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  item.isHighlight
                    ? "bg-[#F2A33A]/15 text-[#1B2A2F] border border-[#F2A33A]/30 hover:bg-[#F2A33A]/25"
                    : isActive
                    ? "bg-[#0F5C5C] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#F2A33A]" : item.isHighlight ? "text-[#F2A33A]" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white text-[#0F5C5C]" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Card in Sidebar */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-[#1B2A2F] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : "O"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate">
                {user?.user_metadata?.full_name || "Gokak Stay Owner"}
              </span>
              <span className="text-[10px] text-gray-500 truncate">
                {user?.email || "owner@nestnova.in"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
