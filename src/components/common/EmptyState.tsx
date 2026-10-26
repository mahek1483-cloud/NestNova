import React from "react";
import Link from "next/link";
import { Building2, SearchX, MapPin, PlusCircle, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  type?: "properties" | "food" | "enquiries" | "visits" | "bookings" | "saved" | "notifications" | "search";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  secondaryText?: string;
  secondaryHref?: string;
}

export function EmptyState({
  type = "properties",
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  secondaryText,
  secondaryHref,
}: EmptyStateProps) {
  const defaults = {
    properties: {
      icon: Building2,
      title: "No verified stays available in Gokak yet",
      description:
        "We enforce a strict physical verification rule and show zero fake listings. Check back soon as new Gokak student stays get audited.",
      actionText: "List a Property in Gokak",
      actionHref: "/owner/properties/new",
      secondaryText: "Explore Gokak Living Guide",
      secondaryHref: "/how-verification-works",
    },
    food: {
      icon: MapPin,
      title: "No mess or tiffin services listed in Gokak yet",
      description:
        "Are you a mess owner or home-tiffin provider in Gokak? List your food service to connect with local college students.",
      actionText: "List Gokak Mess Service",
      actionHref: "/owner",
      secondaryText: "Search Stays Instead",
      secondaryHref: "/student/search",
    },
    enquiries: {
      icon: SearchX,
      title: "No active enquiries in Gokak",
      description: "When you have questions about a room, meal timings, or gate rules in Gokak, enquire directly with verified owners.",
      actionText: "Explore Gokak Stays",
      actionHref: "/student/search",
    },
    visits: {
      icon: MapPin,
      title: "No upcoming visits scheduled",
      description: "Visiting a student PG or hostel in Gokak in person gives you full clarity on room size, cleanliness, and water supply.",
      actionText: "Browse Stays & Schedule Visit",
      actionHref: "/student/search",
    },
    bookings: {
      icon: Building2,
      title: "No room bookings yet",
      description: "You haven't reserved any beds in Gokak yet. Find your stay, schedule a visit, and reserve your place.",
      actionText: "Find a Stay in Gokak",
      actionHref: "/student/search",
    },
    saved: {
      icon: SearchX,
      title: "No saved stays yet",
      description: "Save your favorite student PGs, hostels, or mess providers in Gokak to easily compare them later.",
      actionText: "Browse Gokak Listings",
      actionHref: "/student/search",
    },
    notifications: {
      icon: SearchX,
      title: "No notifications right now",
      description: "You're all caught up! Updates about your visits, enquiries, and stay confirmations will appear here.",
      actionText: "Return to Dashboard",
      actionHref: "/student",
    },
    search: {
      icon: SearchX,
      title: "No Gokak stays match your current filters",
      description: "Try adjusting your budget range, sharing preferences, or food requirements to see available options in Gokak.",
      actionText: "Reset All Filters",
      actionHref: "/student/search",
    },
  }[type];

  const finalTitle = title || defaults.title;
  const finalDesc = description || defaults.description;
  const finalActionText = actionText || defaults.actionText;
  const finalActionHref = actionHref || defaults.actionHref;
  const finalSecText = secondaryText || (defaults as { secondaryText?: string }).secondaryText;
  const finalSecHref = secondaryHref || (defaults as { secondaryHref?: string }).secondaryHref;
  const Icon = defaults.icon;

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 sm:p-12 text-center bg-white rounded-3xl border border-gray-150/80 shadow-xs relative overflow-hidden animate-slide-up">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="w-20 h-20 bg-emerald-50 text-[#0F5C5C] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-200/80 animate-float">
        <Icon className="w-9 h-9" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full mb-3 border border-amber-200/80 shadow-2xs">
        <MapPin className="w-3.5 h-3.5 text-amber-600" />
        <span>Gokak, Karnataka (Strict Scope)</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-black font-sans text-[#1B2A2F] mb-3">
        {finalTitle}
      </h3>

      <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
        {finalDesc}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onActionClick ? (
          <button
            onClick={onActionClick}
            className="w-full sm:w-auto px-6 py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{finalActionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : finalActionHref ? (
          <Link
            href={finalActionHref}
            className="w-full sm:w-auto px-6 py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{finalActionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : null}

        {finalSecText && finalSecHref && (
          <Link
            href={finalSecHref}
            className="w-full sm:w-auto px-5 py-3 bg-gray-50 hover:bg-gray-100/90 text-gray-700 font-bold rounded-xl border border-gray-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-gray-500" />
            <span>{finalSecText}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
