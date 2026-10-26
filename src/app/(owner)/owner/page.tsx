"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Building,
  Bed,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { getGokakProperties, getSessionProperties } from "@/lib/api/properties";
import { getStudentEnquiries, getStudentVisits, getStudentBookings } from "@/lib/api/requests";
import { PropertyListing } from "@/types";

export default function OwnerOverviewPage() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [metrics, setMetrics] = useState({
    activeProperties: 0,
    availableBeds: 0,
    totalBeds: 0,
    pendingEnquiries: 0,
    pendingVisits: 0,
    pendingBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [propRes, enqs, visits, bookings] = await Promise.all([
          getGokakProperties(),
          getStudentEnquiries(),
          getStudentVisits(),
          getStudentBookings(),
        ]);

        const myStays = propRes.properties;
        setProperties(myStays);

        const totalBeds = myStays.reduce((acc, p) => acc + (p.total_beds || 0), 0);
        const availBeds = myStays.reduce((acc, p) => acc + (p.available_beds || 0), 0);

        setMetrics({
          activeProperties: myStays.length,
          availableBeds: availBeds,
          totalBeds: totalBeds,
          pendingEnquiries: enqs.filter((e) => e.status === "open").length,
          pendingVisits: visits.filter((v) => v.status === "pending").length,
          pendingBookings: bookings.filter((b) => b.status === "pending").length,
        });
      } catch {
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <OwnerLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1B2A2F] to-[#0F5C5C] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-emerald-300 text-xs font-bold mb-3 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F2A33A]" />
              <span>Gokak Partner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight mb-2">
              Manage Your Gokak Properties
            </h1>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              Connect directly with students moving to Gokak. Track physical visits, room availability, and pending reservation requests.
            </p>
          </div>

          <Link
            href="/owner/properties/new"
            className="px-6 py-3.5 bg-[#F2A33A] hover:bg-[#e09127] text-[#1B2A2F] font-black rounded-2xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>List New Stay in Gokak</span>
          </Link>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Properties</span>
            <span className="text-2xl font-black text-[#1B2A2F] my-1">{metrics.activeProperties}</span>
            <span className="text-[10px] text-gray-400">Published in Gokak</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Available Beds</span>
            <span className="text-2xl font-black text-emerald-700 my-1">{metrics.availableBeds}</span>
            <span className="text-[10px] text-gray-400">Out of {metrics.totalBeds} total</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">New Enquiries</span>
            <span className="text-2xl font-black text-[#0F5C5C] my-1">{metrics.pendingEnquiries}</span>
            <span className="text-[10px] text-gray-400">Awaiting reply</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Upcoming Visits</span>
            <span className="text-2xl font-black text-amber-600 my-1">{metrics.pendingVisits}</span>
            <span className="text-[10px] text-gray-400">Physical inspections</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Pending Bookings</span>
            <span className="text-2xl font-black text-indigo-700 my-1">{metrics.pendingBookings}</span>
            <span className="text-[10px] text-gray-400">Bed reservations</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Audit Status</span>
            <span className="text-xs font-bold text-emerald-800 my-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified
            </span>
            <span className="text-[10px] text-gray-400">Gokak Verification</span>
          </div>
        </div>

        {/* Verification Alert Banner */}
        <div className="p-5 bg-white rounded-3xl border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">NestNova Evidence & Verification Center</h3>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Remember: Location-verified camera photos show supporting evidence, while NestNova Verified badges require physical inspection by our Gokak audit team.
              </p>
            </div>
          </div>

          <Link
            href="/owner/verification"
            className="px-4 py-2 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all shrink-0 shadow-2xs"
          >
            Open Verification Center
          </Link>
        </div>

        {/* Properties Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-[#1B2A2F] font-sans">
                My Listed Properties in Gokak
              </h3>
              <p className="text-xs text-gray-500">
                Manage room sharing, monthly rent, and real-time bed occupancy.
              </p>
            </div>

            <Link
              href="/owner/properties"
              className="text-xs font-bold text-[#0F5C5C] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-gray-400 text-xs">Loading listings...</div>
          ) : properties.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {properties.map((p) => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-gray-900">{p.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.listing_status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F2A33A]" />
                      {p.locality}, Gokak • Starting ₹{p.monthly_rent_start.toLocaleString("en-IN")}/mo
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student/property/${p.id}`}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Student View</span>
                    </Link>
                    <Link
                      href="/owner/rooms"
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0F5C5C] font-bold rounded-xl text-xs border border-teal-200"
                    >
                      Manage Beds
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
              <Building className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-gray-800">No properties listed yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                List your PG, hostel, or student room located in Gokak, Karnataka to start receiving genuine student enquiries.
              </p>
              <Link
                href="/owner/properties/new"
                className="px-5 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your First Gokak Stay</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
