"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Heart, Search, ArrowRight, Trash2 } from "lucide-react";
import { getSavedPropertyIds, toggleSavedProperty } from "@/lib/api/requests";
import { getGokakProperties } from "@/lib/api/properties";
import { PropertyListing } from "@/types";
import { PropertyCard } from "@/components/common/PropertyCard";
import { EmptyState } from "@/components/common/EmptyState";
import { PropertyCardSkeleton } from "@/components/common/SkeletonCard";

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      setIsLoading(true);
      try {
        const savedIds = getSavedPropertyIds();
        const res = await getGokakProperties();
        const matched = res.properties.filter((p) => savedIds.includes(p.id));
        setSavedProperties(matched);
      } catch {
        setSavedProperties([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSaved();
  }, []);

  const handleRemove = (id: string) => {
    toggleSavedProperty(id);
    setSavedProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Saved Stays in Gokak
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Keep track of student PGs and rooms you want to revisit, schedule a visit for, or compare.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        ) : savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="relative group">
                <PropertyCard property={property} />
                <button
                  onClick={() => handleRemove(property.id)}
                  className="absolute top-4 right-16 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-md z-20 cursor-pointer"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="saved"
            title="No saved stays yet"
            description="You haven't saved any student stays in Gokak yet. Explore available listings and click the heart icon to save."
            actionText="Explore Gokak Stays"
            actionHref="/student/search"
          />
        )}
      </div>
    </StudentLayout>
  );
}
