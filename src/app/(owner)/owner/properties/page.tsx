"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Building,
  PlusCircle,
  MapPin,
  Bed,
  Eye,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getGokakProperties } from "@/lib/api/properties";
import { PropertyListing } from "@/types";
import { NestNovaVerifiedBadge } from "@/components/ui/VerificationBadge";
import { EmptyState } from "@/components/common/EmptyState";

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getGokakProperties();
        setProperties(res.properties);
      } catch {
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this property listing from Gokak?")) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
              My Gokak Properties
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Active student accommodations registered in Gokak, Karnataka.
            </p>
          </div>

          <Link
            href="/owner/properties/new"
            className="px-5 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Stay</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {p.property_type} • {p.gender_category}
                    </span>
                    <NestNovaVerifiedBadge status={p.verification_status} />
                  </div>

                  <h3 className="font-extrabold text-lg text-gray-900 leading-snug">{p.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F2A33A]" />
                    {p.locality}, Gokak, Karnataka
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-gray-50 rounded-2xl text-xs">
                    <div>
                      <span className="text-gray-400 block font-semibold">Starting Rent</span>
                      <span className="font-extrabold text-[#0F5C5C] text-sm">
                        ₹{p.monthly_rent_start.toLocaleString("en-IN")}/mo
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block font-semibold">Bed Availability</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {p.available_beds ?? 2} open / {p.total_beds ?? 4} total
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student/property/${p.id}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>

                    <Link
                      href="/owner/rooms"
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0F5C5C] font-bold rounded-xl text-xs border border-teal-200 flex items-center gap-1"
                    >
                      <Bed className="w-3.5 h-3.5" />
                      <span>Manage Rooms</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Delete Stay"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="properties"
            title="No properties listed yet"
            description="You have not added any stays in Gokak yet. Use our 8-step wizard to register your property."
            actionText="Add Gokak Property"
            actionHref="/owner/properties/new"
          />
        )}
      </div>
    </OwnerLayout>
  );
}
