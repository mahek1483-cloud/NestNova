import Link from "next/link";
import { ShieldCheck, MapPin, Building, GraduationCap, Utensils, Heart } from "lucide-react";
import { GOKAK_COLLEGES, GOKAK_LOCALITIES } from "@/constants/gokak";

export function Footer() {
  return (
    <footer className="bg-[#101A1C] text-gray-300 border-t border-black/10 mt-auto pt-16 pb-24 md:pb-12 text-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Gokak Commitment */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0F5C5C] flex items-center justify-center text-white font-black text-base shadow-sm">
                N
              </div>
              <span className="font-sans font-black text-2xl tracking-tight text-white">
                Nest<span className="text-[#F2A33A]">Nova</span>
              </span>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              NestNova is a trusted student-living platform dedicated exclusively to <strong>Gokak, Karnataka, India</strong>. We help relocating students discover genuine PGs, student rooms, hostels, and mess services with audited reality.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Strict Scope: Gokak, Belagavi Dist., 591307</span>
            </div>
          </div>

          {/* Student Stays */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#F2A33A]" />
              <span>Student Stays</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/student/search?type=PG" className="hover:text-white transition-colors">
                  Boys & Girls PGs in Gokak
                </Link>
              </li>
              <li>
                <Link href="/student/search?type=Hostel" className="hover:text-white transition-colors">
                  Student Hostels in Gokak
                </Link>
              </li>
              <li>
                <Link href="/student/search?type=Student+Room" className="hover:text-white transition-colors">
                  Single / Shared Rooms
                </Link>
              </li>
              <li>
                <Link href="/student/compare" className="hover:text-white transition-colors">
                  Compare Gokak Stays
                </Link>
              </li>
              <li>
                <Link href="/student/food" className="hover:text-white transition-colors">
                  Daily Mess & Tiffin
                </Link>
              </li>
            </ul>
          </div>

          {/* Colleges in Gokak */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#0F5C5C]" />
              <span>Colleges in Gokak</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {GOKAK_COLLEGES.slice(0, 4).map((college) => (
                <li key={college.id}>
                  <Link
                    href={`/student/search?locality=${encodeURIComponent(college.locality.split("/")[0].trim())}`}
                    className="hover:text-white transition-colors"
                  >
                    {college.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/student/search" className="text-emerald-400 hover:underline">
                  All Gokak Campuses →
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trust & Safety</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/how-verification-works" className="hover:text-white transition-colors">
                  Physical Audit Process
                </Link>
              </li>
              <li>
                <Link href="/how-verification-works#location-evidence" className="hover:text-white transition-colors">
                  Location Evidence Policy
                </Link>
              </li>
              <li>
                <Link href="/owner" className="hover:text-white transition-colors">
                  List Your Gokak Property
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Zero Fake Listings Rule</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Localities in Gokak strip */}
        <div className="pt-8 border-t border-gray-800/80 mb-8">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-3">
            Localities Covered Across Gokak:
          </span>
          <div className="flex flex-wrap gap-2">
            {GOKAK_LOCALITIES.map((loc) => (
              <Link
                key={loc}
                href={`/student/search?locality=${encodeURIComponent(loc)}`}
                className="text-[11px] px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} NestNova. Built exclusively for Gokak, Karnataka. All rights reserved.
          </p>
          <p className="text-[11px] text-gray-500">
            NestNova enforces evidence-based verification. GPS location evidence and admin verification are kept strictly separate.
          </p>
        </div>
      </div>
    </footer>
  );
}
