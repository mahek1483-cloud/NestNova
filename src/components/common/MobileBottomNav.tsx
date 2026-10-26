"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Search,
  Utensils,
  Heart,
  User,
  Building,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isOwner = pathname.startsWith("/owner");

  if (isOwner) {
    const ownerTabs = [
      { href: "/owner", label: "Overview", icon: Building },
      { href: "/owner/properties", label: "Properties", icon: Compass },
      { href: "/owner/enquiries", label: "Visits & Enq", icon: CalendarCheck },
      { href: "/owner/verification", label: "Verify", icon: ShieldCheck },
      { href: "/owner/profile", label: "Profile", icon: User },
    ];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {ownerTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                isActive ? "text-[#0F5C5C]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] mt-0.5 ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Student bottom nav
  const studentTabs = [
    { href: "/student", label: "Home", icon: Compass },
    { href: "/student/search", label: "Stays", icon: Search },
    { href: "/student/food", label: "Mess", icon: Utensils },
    { href: "/student/saved", label: "Saved", icon: Heart },
    { href: "/student/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {studentTabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== "/student" && pathname.startsWith(tab.href));
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
              isActive ? "text-[#0F5C5C]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className={`text-[10px] mt-0.5 ${isActive ? "font-bold" : "font-medium"}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
