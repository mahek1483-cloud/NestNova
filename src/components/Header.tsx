"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  MapPin,
  Building,
  User,
  LogOut,
  Heart,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getSavedPropertyIds } from "@/lib/api/requests";
import { useAuthUser, setAuthUser } from "@/hooks/useAuthUser";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthUser();
  const [savedCount, setSavedCount] = useState(0);

  // Update saved count on pathname change or storage event
  useEffect(() => {
    const updateCount = () => {
      setSavedCount(getSavedPropertyIds().length);
    };
    const timer = setTimeout(updateCount, 0);
    window.addEventListener("storage", updateCount);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", updateCount);
    };
  }, [pathname]);

  const handleLogout = async () => {
    document.cookie = "nestnova_demo_user=; path=/; max-age=0";
    setAuthUser(null);
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Ignore network errors on logout
      }
    }
    router.push("/login");
  };

  const navLinks = [
    { href: "/student/search", label: "Explore Stays" },
    { href: "/student/food", label: "Mess & Tiffin" },
    { href: "/student/compare", label: "Compare" },
    { href: "/how-verification-works", label: "How Trust Works" },
  ];

  const isOwnerRoute = pathname.startsWith("/owner");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-[#FBF8F3]/90 backdrop-blur-xl shadow-2xs transition-all duration-300">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Gokak Scope Indicator */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-[#0F5C5C] flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <span className="font-extrabold text-xl">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-xl tracking-tight text-[#0F5C5C]">
                Nest<span className="text-[#F2A33A]">Nova</span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest -mt-1">
                Student Living
              </span>
            </div>
          </Link>

          {/* Gokak exclusivity pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold shadow-2xs hover:bg-emerald-100/60 transition-colors">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Gokak, Karnataka</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-black/[0.03] rounded-full border border-black/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#0F5C5C] shadow-xs font-bold scale-[1.02]"
                    : "text-[#1B2A2F]/75 hover:text-[#0F5C5C] hover:bg-white/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick link to Saved */}
          <Link
            href="/student/saved"
            className="p-2.5 text-gray-600 hover:text-[#0F5C5C] hover:bg-white/80 rounded-full relative transition-all duration-200 border border-transparent hover:border-gray-200/60"
            title="Saved Stays"
          >
            <Heart className="w-5 h-5 transition-transform hover:scale-110 active:scale-125" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse-subtle shadow-xs">
                {savedCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Dashboard Switcher Button */}
              {isOwnerRoute ? (
                <Link
                  href="/student"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
                >
                  Student Mode
                </Link>
              ) : (
                <Link
                  href="/owner"
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0F5C5C] text-xs font-bold rounded-xl border border-teal-200 transition-all flex items-center gap-1"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Owner Portal</span>
                </Link>
              )}

              <Link
                href="/student/profile"
                className="flex items-center gap-2 p-1.5 pl-3 pr-2 bg-white rounded-full border border-gray-200 shadow-2xs hover:shadow-xs transition-all text-sm font-bold text-gray-800"
              >
                <span className="max-w-[100px] truncate">
                  {user.user_metadata?.full_name || "Account"}
                </span>
                <div className="w-7 h-7 bg-[#0F5C5C] text-white rounded-full flex items-center justify-center text-xs">
                  <User className="w-4 h-4" />
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/owner"
                className="text-xs font-bold text-[#0F5C5C] hover:text-[#0c4747] px-3 py-2 rounded-xl hover:bg-teal-50/50 transition-colors"
              >
                For Stay Owners
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-800 text-xs font-bold rounded-xl transition-all"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#0F5C5C] hover:bg-[#0c4747] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-700 hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-black/5 bg-[#FBF8F3] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold w-fit mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scope: Gokak, Karnataka Only</span>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2.5 text-base font-bold text-[#1B2A2F] border-b border-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            {user ? (
              <>
                <Link
                  href="/student"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 px-4 bg-[#0F5C5C] text-white font-bold rounded-xl text-center text-sm shadow-xs"
                >
                  Student Dashboard
                </Link>
                <Link
                  href="/owner"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 px-4 bg-teal-50 text-[#0F5C5C] font-bold rounded-xl text-center text-sm border border-teal-200"
                >
                  Owner Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-2.5 text-rose-600 font-bold text-center text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-4 border border-gray-300 text-center font-bold text-sm rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-4 bg-[#0F5C5C] text-white text-center font-bold text-sm rounded-xl shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
