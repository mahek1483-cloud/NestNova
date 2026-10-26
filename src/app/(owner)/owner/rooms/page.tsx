"use client";

import React, { useState, useEffect } from "react";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import { getGokakProperties } from "@/lib/api/properties";
import { PropertyListing } from "@/types";

interface RoomItem {
  id: string;
  roomType: string;
  sharing: number;
  rent: number;
  availableBeds: number;
  totalBeds: number;
  hasAttachedBath: boolean;
}

function getInitialRooms(property: PropertyListing): RoomItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`nestnova_rooms_${property.id}`);
      if (stored) return JSON.parse(stored);
    } catch {}
  }

  if (property.rooms && property.rooms.length > 0) {
    return property.rooms.map((r, i) => ({
      id: r.id || `r-${property.id}-${i}`,
      roomType: r.room_type || `${r.sharing_capacity} Sharing Room`,
      sharing: r.sharing_capacity || 2,
      rent: r.rent_amount || property.monthly_rent_start || 4500,
      availableBeds:
        typeof r.available_beds_count === "number"
          ? r.available_beds_count
          : (r.beds?.filter((b) => b.status === "available").length ?? 2),
      totalBeds:
        typeof r.total_beds_count === "number"
          ? r.total_beds_count
          : (r.beds?.length ?? r.sharing_capacity ?? 4),
      hasAttachedBath: !!r.has_attached_bath,
    }));
  }

  return [
    {
      id: `r-${property.id}-1`,
      roomType: "2-Sharing Standard",
      sharing: 2,
      rent: property.monthly_rent_start || 4500,
      availableBeds: 2,
      totalBeds: 4,
      hasAttachedBath: true,
    },
    {
      id: `r-${property.id}-2`,
      roomType: "Single Occupancy",
      sharing: 1,
      rent: (property.monthly_rent_start || 4500) + 1500,
      availableBeds: 1,
      totalBeds: 2,
      hasAttachedBath: true,
    },
  ];
}

function RoomVacancyManager({ property }: { property: PropertyListing }) {
  const [rooms, setRooms] = useState<RoomItem[]>(() => getInitialRooms(property));

  const handleToggleBed = (roomId: string, increment: boolean) => {
    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (r.id === roomId) {
          const next = increment
            ? Math.min(r.totalBeds, r.availableBeds + 1)
            : Math.max(0, r.availableBeds - 1);
          return { ...r, availableBeds: next };
        }
        return r;
      });
      try {
        localStorage.setItem(`nestnova_rooms_${property.id}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-gray-900">{room.roomType}</h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                {room.sharing} Sharing
              </span>
              {room.hasAttachedBath && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  Attached Washroom
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Base rent: <strong className="text-[#0F5C5C]">₹{room.rent.toLocaleString("en-IN")}/mo</strong> per bed
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="font-semibold text-gray-700">
                Available: <strong className="text-emerald-700">{room.availableBeds} beds</strong> / {room.totalBeds} total
              </span>
            </div>
          </div>

          {/* Real-time Availability Stepper */}
          <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 w-full sm:w-auto justify-between">
            <span className="text-xs font-bold text-gray-600 px-2">Adjust Vacancy:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleBed(room.id, false)}
                disabled={room.availableBeds <= 0}
                className="w-8 h-8 rounded-xl bg-white border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-2xs"
              >
                -
              </button>
              <span className="font-extrabold text-sm w-6 text-center text-[#1B2A2F]">
                {room.availableBeds}
              </span>
              <button
                type="button"
                onClick={() => handleToggleBed(room.id, true)}
                disabled={room.availableBeds >= room.totalBeds}
                className="w-8 h-8 rounded-xl bg-[#0F5C5C] font-bold text-sm text-white hover:bg-[#0c4747] disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-2xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OwnerRoomsPage() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getGokakProperties();
        setProperties(res.properties);
        if (res.properties.length > 0) {
          setSelectedPropertyId(res.properties[0].id);
        }
      } catch {
        setProperties([]);
      }
    }
    load();
  }, []);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Rooms & Bed Availability
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time occupancy management for your student properties in Gokak.
          </p>
        </div>

        {properties.length > 0 && (
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs font-bold text-gray-700">Select Stay:</span>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="p-2 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.locality}, Gokak)
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedProperty && (
          <RoomVacancyManager key={selectedProperty.id} property={selectedProperty} />
        )}
      </div>
    </OwnerLayout>
  );
}
