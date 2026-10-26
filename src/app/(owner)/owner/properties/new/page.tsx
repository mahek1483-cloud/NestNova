"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  Building,
  MapPin,
  Bed,
  IndianRupee,
  Utensils,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";
import {
  GOKAK_LOCALITIES,
  GOKAK_PROPERTY_TYPES,
  GOKAK_GENDER_CATEGORIES,
  GOKAK_AMENITIES_LIST,
  isGokakLocation,
} from "@/constants/gokak";
import { addSessionProperty } from "@/lib/api/properties";
import { PropertyListing, PropertyRoom } from "@/types";

export default function NewPropertyWizardPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Basic Information
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyListing["property_type"]>("PG");
  const [genderCategory, setGenderCategory] = useState<PropertyListing["gender_category"]>("Boys");

  // Step 2: Location (Strict Gokak Validation)
  const [locality, setLocality] = useState<string>(GOKAK_LOCALITIES[0]);
  const [address, setAddress] = useState("");
  const [cityInput, setCityInput] = useState("Gokak");
  const [pincode, setPincode] = useState("591307");

  // Step 3: Rooms & Sharing
  const [rooms, setRooms] = useState<
    Array<{
      roomType: string;
      sharingCapacity: number;
      rentAmount: number;
      depositAmount: number;
      hasAttachedBath: boolean;
      hasAc: boolean;
      totalBeds: number;
    }>
  >([
    {
      roomType: "2 Sharing Room",
      sharingCapacity: 2,
      rentAmount: 4500,
      depositAmount: 5000,
      hasAttachedBath: true,
      hasAc: false,
      totalBeds: 4,
    },
  ]);

  // Step 4: Pricing & Extra Charges
  const [foodIncluded, setFoodIncluded] = useState(true);
  const [foodMonthlyCost, setFoodMonthlyCost] = useState(2800);
  const [electricityIncluded, setElectricityIncluded] = useState(false);
  const [maintenanceMonthlyCost, setMaintenanceMonthlyCost] = useState(200);

  // Step 5: Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Wi-Fi",
    "Study Desk & Chair",
    "24/7 Water Supply",
    "Hot Water Geyser",
    "Purified Drinking Water (RO)",
  ]);

  // Step 6: Food / Mess description
  const [foodDescription, setFoodDescription] = useState(
    "Fresh South Indian & North Karnataka vegetarian meals served daily."
  );

  // Step 7: Photos
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const handleNextStep = () => {
    setErrorMsg(null);

    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg("Please enter a property name.");
        return;
      }
    }

    if (step === 2) {
      // STRICT GOKAK SCOPE CHECK
      if (!isGokakLocation(cityInput, address)) {
        setErrorMsg(
          "STRICT REQUIREMENT: NestNova operates exclusively in Gokak, Karnataka, India. Properties from other cities cannot be registered."
        );
        return;
      }
      if (!address.trim()) {
        setErrorMsg("Please provide the full street address in Gokak.");
        return;
      }
    }

    if (step === 3) {
      if (rooms.length === 0) {
        setErrorMsg("Please add at least one room configuration.");
        return;
      }
    }

    setStep((prev) => Math.min(8, prev + 1));
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleAddRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        roomType: "Single Room",
        sharingCapacity: 1,
        rentAmount: 6000,
        depositAmount: 7000,
        hasAttachedBath: true,
        hasAc: false,
        totalBeds: 2,
      },
    ]);
  };

  const handleRemoveRoom = (idx: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotoUrls((prev) => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl("");
    }
  };

  const handlePublish = () => {
    // Construct final property object
    const minRent = Math.min(...rooms.map((r) => r.rentAmount));
    const minDeposit = Math.min(...rooms.map((r) => r.depositAmount));
    const totalBeds = rooms.reduce((acc, r) => acc + r.totalBeds, 0);

    const newProp: PropertyListing = {
      id: "prop-gokak-" + Date.now(),
      owner_id: "owner-current",
      name: name.trim(),
      description: description.trim(),
      property_type: propertyType,
      address: `${address.trim()}, ${locality}, Gokak, Karnataka ${pincode}`,
      city: "Gokak",
      locality,
      listing_status: "published",
      verification_status: "pending",
      gender_category: genderCategory,
      amenities: selectedAmenities,
      rules: ["Gate closes 10:00 PM", "Quiet hours after 10:30 PM", "Visitors in lounge only"],
      food_included: foodIncluded,
      food_description: foodDescription,
      monthly_rent_start: minRent,
      security_deposit_start: minDeposit,
      total_beds: totalBeds,
      available_beds: totalBeds,
      images: photoUrls.map((url, i) => ({
        id: `img-${i}`,
        property_id: "new",
        url,
        category: "building",
        is_primary: i === 0,
      })),
      created_at: new Date().toISOString(),
    };

    addSessionProperty(newProp);
    router.push("/owner/properties");
  };

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Scope: Gokak, Karnataka Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            List a Student Property in Gokak
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete the 8-step registration wizard. Verified listings appear directly to relocating college students.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
            <span>
              Step {step} of 8:{" "}
              {
                [
                  "Basic Information",
                  "Gokak Location",
                  "Room Types & Beds",
                  "Pricing Breakdown",
                  "Amenities",
                  "Food & Mess",
                  "Property Photos",
                  "Review & Publish",
                ][step - 1]
              }
            </span>
            <span className="text-[#0F5C5C] font-extrabold">{Math.round((step / 8) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F5C5C] transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Multi-Step Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Step 1: Basic Stay Information</h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Property Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Basaveshwar Student PG"
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Stay Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyListing["property_type"])}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium"
                  >
                    {GOKAK_PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Gender Preference</label>
                  <select
                    value={genderCategory}
                    onChange={(e) => setGenderCategory(e.target.value as PropertyListing["gender_category"])}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium"
                  >
                    {GOKAK_GENDER_CATEGORIES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your student stay, quiet study atmosphere, distance to bus stand, etc."
                  className="w-full p-3 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Strict Gokak Location */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center justify-between">
                <span>Step 2: Property Location</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Gokak, Karnataka Exclusive
                </span>
              </h3>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed">
                NestNova only accepts properties located in <strong>Gokak, Belagavi District, Karnataka</strong>. Listings from Bengaluru, Belagavi city, Hubballi, or outside Gokak taluk are prohibited.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Gokak Locality</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium"
                >
                  {GOKAK_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., Plot 24, Near JSS College, Station Road"
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">City (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={cityInput}
                    className="w-full px-4 py-2.5 bg-gray-100 border rounded-xl text-xs sm:text-sm font-bold text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Rooms & Sharing */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">Step 3: Room Types & Beds</h3>
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="px-3 py-1.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Room Type</span>
                </button>
              </div>

              <div className="space-y-4">
                {rooms.map((room, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-700 uppercase">Configuration #{idx + 1}</span>
                      {rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRoom(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Room Name</label>
                        <input
                          type="text"
                          value={room.roomType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, roomType: val } : r)));
                          }}
                          className="w-full p-2 bg-white border rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Rent / Bed (₹)</label>
                        <input
                          type="number"
                          value={room.rentAmount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, rentAmount: val } : r)));
                          }}
                          className="w-full p-2 bg-white border rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Available Beds</label>
                        <input
                          type="number"
                          value={room.totalBeds}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, totalBeds: val } : r)));
                          }}
                          className="w-full p-2 bg-white border rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Pricing Breakdown */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Step 4: True Cost Breakdown</h3>
              <p className="text-xs text-gray-500">
                To guarantee transparency, state clearly which monthly utilities are covered in rent.
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodIncluded}
                    onChange={(e) => setFoodIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#0F5C5C] rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block">Student Mess Food Included in Rent</span>
                    <span className="text-gray-500">Breakfast, lunch, and dinner provided at no extra charge.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={electricityIncluded}
                    onChange={(e) => setElectricityIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#0F5C5C] rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800 block">Electricity / Power Backup Included</span>
                    <span className="text-gray-500">No separate sub-meter charges for geyser and lights.</span>
                  </div>
                </label>

                <div className="p-3.5 bg-gray-50 rounded-2xl border space-y-2 text-xs">
                  <label className="font-bold text-gray-800 block">Monthly Maintenance Charge (₹)</label>
                  <input
                    type="number"
                    value={maintenanceMonthlyCost}
                    onChange={(e) => setMaintenanceMonthlyCost(Number(e.target.value))}
                    className="w-full p-2 bg-white border rounded-xl"
                  />
                  <span className="text-[11px] text-gray-500">Covers staircase cleaning, garbage collection, and water motor.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Amenities */}
          {step === 5 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Step 5: Verified Amenities</h3>
              <p className="text-xs text-gray-500">Select all amenities available on premises in Gokak.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GOKAK_AMENITIES_LIST.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? "bg-[#0F5C5C] text-white border-[#0F5C5C]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isChecked ? "text-white" : "text-gray-300"}`} />
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Food / Mess */}
          {step === 6 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Step 6: Food & Mess Details</h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Food / Kitchen Details</label>
                <textarea
                  rows={4}
                  value={foodDescription}
                  onChange={(e) => setFoodDescription(e.target.value)}
                  placeholder="Explain meal menu, vegetarian preference, tiffin timings, etc."
                  className="w-full p-3 bg-gray-50 border rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Photos */}
          {step === 7 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Step 7: Photos & Evidence</h3>
              <p className="text-xs text-gray-500">Provide real photography of the room, washroom, and building entrance.</p>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Paste direct image URL (jpg/png/webp)"
                  className="flex-1 px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-4 py-2 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
                >
                  Add Photo
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photoUrls.map((url, i) => (
                  <div key={i} className="relative h-28 rounded-xl overflow-hidden bg-gray-100 border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[10px] font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Review & Publish */}
          {step === 8 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Step 8: Review & Publish Stay</h3>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="font-bold">Property:</span>
                  <span>{name} ({propertyType} • {genderCategory})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Location:</span>
                  <span>{locality}, Gokak, Karnataka</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Starting Rent:</span>
                  <span className="text-[#0F5C5C] font-extrabold">₹{rooms[0]?.rentAmount}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Amenities Count:</span>
                  <span>{selectedAmenities.length} selected</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Physical Audit Queue:</span>
                  <span>
                    Upon publishing, your listing will be active for student viewing in Gokak with status &ldquo;Pending Audit&rdquo;. Our Gokak coordinator will arrange a visit to verify room measurements.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 8 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="px-8 py-3 bg-[#1E8E5A] hover:bg-[#18754a] text-white font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Gokak Stay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
