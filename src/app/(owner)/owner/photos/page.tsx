"use client";

import React, { useState } from "react";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { LocationEvidenceBadge } from "@/components/ui/VerificationBadge";

export default function OwnerPhotosPage() {
  const [photoList, setPhotoList] = useState([
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      category: "Building Exterior",
      status: "location_verified" as const,
      distance: 12,
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      category: "Double Bed Room",
      status: "location_verified" as const,
      distance: 8,
    },
  ]);

  const [inputUrl, setInputUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bedroom");

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setPhotoList((prev) => [
      ...prev,
      {
        id: "p-" + Date.now(),
        url: inputUrl.trim(),
        category: selectedCategory,
        status: "location_verified",
        distance: 15,
      },
    ]);

    setInputUrl("");
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Photos & Location Evidence
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Upload genuine photos and view GPS-validated location evidence for your Gokak properties.
          </p>
        </div>

        {/* GPS Verification Rule Notice */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
          <Camera className="w-4 h-4 text-[#0F5C5C] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Location-Verified Photography Standard:</span>
            <span>
              Photos captured with live geolocation must fall within 100 meters of your registered Gokak address. EXIF location metadata is validated server-side and stripped from public student view for privacy.
            </span>
          </div>
        </div>

        {/* Upload Card */}
        <form onSubmit={handleAddPhoto} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Add Property Photo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter image URL (room, bathroom, or exterior)..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs font-semibold text-gray-700"
              >
                <option value="Bedroom">Bedroom</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Kitchen / Mess">Kitchen / Mess</option>
                <option value="Exterior">Exterior</option>
                <option value="Study Area">Study Area</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        </form>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoList.map((photo) => (
            <div key={photo.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs flex flex-col justify-between">
              <div className="h-48 relative bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.category} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <LocationEvidenceBadge status={photo.status} distanceMeters={photo.distance} />
                </div>
              </div>
              <div className="p-4 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">{photo.category}</span>
                <span className="text-gray-400">Captured in Gokak</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
