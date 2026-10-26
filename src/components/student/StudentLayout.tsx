"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Search,
  Heart,
  Scale,
  CalendarCheck,
  Building,
  CreditCard,
  MessageSquare,
  Bell,
  User,
  MapPin,
  Utensils,
} from "lucide-react";
import { getSavedPropertyIds, getStudentEnquiries, getStudentVisits } from "@/lib/api/requests";
import { useAuthUser } from "@/hooks/useAuthUser";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const user = useAuthUser();
  const [savedCount, setSavedCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSavedCount(getSavedPropertyIds().length);
    }, 0);

    getStudentEnquiries().then((res) => setEnquiryCount(res.filter((e) => e.status === "open").length));
    getStudentVisits().then((res) => setVisitCount(res.filter((v) => v.status === "pending").length));

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  const navItems = [
    { href: "/student", label: "Dashboard Home", icon: Compass },
    { href: "/student/search", label: "Search Stays", icon: Search },
    { href: "/student/food", label: "Mess & Tiffin", icon: Utensils },
    { href: "/student/saved", label: "Saved Stays", icon: Heart, badge: savedCount },
    { href: "/student/compare", label: "Compare", icon: Scale },
    { href: "/student/enquiries", label: "Visits & Enquiries", icon: CalendarCheck, badge: enquiryCount + visitCount },
    { href: "/student/bookings", label: "My Bookings", icon: Building },
    { href: "/student/payments", label: "Payments", icon: CreditCard },
    { href: "/student/messages", label: "Messages", icon: MessageSquare },
    { href: "/student/notifications", label: "Notifications", icon: Bell },
    { href: "/student/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FBF8F3] flex flex-col md:flex-row">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-gray-200/80 shrink-0 min-h-[calc(100vh-5rem)] p-4 lg:p-6 sticky top-20 self-start h-[calc(100vh-5rem)] overflow-y-auto">
        {/* Scope Pill */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold mb-6">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex flex-col">
            <span className="leading-tight">Gokak Marketplace</span>
            <span className="text-[10px] text-emerald-700/80 font-medium">Karnataka, India</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2 block">
            Student Living Menu
          </span>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#0F5C5C] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#F2A33A]" : "text-gray-400"}`} />
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
            <div className="w-8 h-8 rounded-full bg-[#0F5C5C] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate">
                {user?.user_metadata?.full_name || "Student User"}
              </span>
              <span className="text-[10px] text-gray-500 truncate">
                {user?.email || "Student Living in Gokak"}
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
