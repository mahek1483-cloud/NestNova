"use client";

import React, { useState } from "react";
import { TrueCostBreakdown } from "@/types";
import { calculateTrueCost, CostCalculationInput } from "@/lib/api/calculator";
import { Calculator, Check, AlertCircle } from "lucide-react";

interface CostBreakdownProps {
  initialInput?: Partial<CostCalculationInput>;
  compact?: boolean;
  className?: string;
}

export function CostBreakdown({ initialInput, compact = false, className = "" }: CostBreakdownProps) {
  const [baseRent, setBaseRent] = useState<number>(initialInput?.baseRent || 4500);
  const [foodIncluded, setFoodIncluded] = useState<boolean>(initialInput?.foodIncluded ?? true);
  const [foodCost] = useState<number>(initialInput?.foodMonthlyCost || 2800);
  const [electricityIncluded] = useState<boolean>(initialInput?.electricityIncluded ?? false);
  const [transportMethod, setTransportMethod] = useState<"walk" | "bicycle" | "auto">("walk");
  const [distanceKm] = useState<number>(initialInput?.distanceKmToCollege || 1.2);

  const breakdown: TrueCostBreakdown = calculateTrueCost({
    baseRent,
    foodIncluded,
    foodMonthlyCost: foodIncluded ? 0 : foodCost,
    electricityIncluded,
    electricityMonthlyCost: electricityIncluded ? 0 : 400,
    maintenanceIncluded: false,
    maintenanceMonthlyCost: 200,
    laundryIncluded: false,
    laundryMonthlyCost: 300,
    distanceKmToCollege: distanceKm,
    dailyTransportMethod: transportMethod,
  });

  const formatINR = (val: number) => `₹${val.toLocaleString("en-IN")}`;

  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0F5C5C]/10 text-[#0F5C5C] rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1B2A2F] font-sans">
              True Monthly Cost Calculator
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Rent alone isn&apos;t your only monthly expense. Know what you will actually spend in Gokak.
          </p>
        </div>

        {breakdown.isPartialEstimate ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full">
            <AlertCircle className="w-3.5 h-3.5" />
            Partial Estimate
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full">
            <Check className="w-3.5 h-3.5" />
            Full Breakdown
          </span>
        )}
      </div>

      {/* Interactive Controls if not strictly compact */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Base Room Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
              <input
                type="number"
                value={baseRent}
                onChange={(e) => setBaseRent(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-[#1B2A2F] focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Mess / Food</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="foodInc"
                checked={foodIncluded}
                onChange={(e) => setFoodIncluded(e.target.checked)}
                className="rounded text-[#0F5C5C] focus:ring-[#0F5C5C] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="foodInc" className="cursor-pointer text-gray-700 font-medium">
                Included in stay rent
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Daily Commute</label>
            <select
              value={transportMethod}
              onChange={(e) => setTransportMethod(e.target.value as "walk" | "bicycle" | "auto")}
              className="w-full p-2 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F5C5C]"
            >
              <option value="walk">Walking (0 km - ₹0)</option>
              <option value="bicycle">Bicycle (~₹50/mo)</option>
              <option value="auto">Shared Auto / Bus in Gokak</option>
            </select>
          </div>
        </div>
      )}

      {/* Visual Budget Distribution Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-50/70 border border-gray-150/70">
        <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
          <span>Monthly Expense Distribution</span>
          <span className="text-[#0F5C5C] font-extrabold">{formatINR(breakdown.totalMonthlyEstimated)} total</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-200/80 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${Math.max(5, (breakdown.rent.amount / breakdown.totalMonthlyEstimated) * 100)}%` }}
            className="bg-[#0F5C5C] transition-all duration-500 ease-out"
            title={`Rent: ${formatINR(breakdown.rent.amount)}`}
          />
          {breakdown.food.amount > 0 && (
            <div
              style={{ width: `${(breakdown.food.amount / breakdown.totalMonthlyEstimated) * 100}%` }}
              className="bg-[#F2A33A] transition-all duration-500 ease-out"
              title={`Food: ${formatINR(breakdown.food.amount)}`}
            />
          )}
          {breakdown.electricity.amount > 0 && (
            <div
              style={{ width: `${(breakdown.electricity.amount / breakdown.totalMonthlyEstimated) * 100}%` }}
              className="bg-teal-400 transition-all duration-500 ease-out"
              title={`Electricity: ${formatINR(breakdown.electricity.amount)}`}
            />
          )}
          <div
            style={{ width: `${(breakdown.maintenance.amount / breakdown.totalMonthlyEstimated) * 100}%` }}
            className="bg-indigo-400 transition-all duration-500 ease-out"
            title={`Maintenance: ${formatINR(breakdown.maintenance.amount)}`}
          />
          {breakdown.transport.amount > 0 && (
            <div
              style={{ width: `${(breakdown.transport.amount / breakdown.totalMonthlyEstimated) * 100}%` }}
              className="bg-purple-400 transition-all duration-500 ease-out"
              title={`Transport: ${formatINR(breakdown.transport.amount)}`}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-3 mt-2.5 text-[10px] font-bold text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0F5C5C]" /> Rent</span>
          {breakdown.food.amount > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F2A33A]" /> Food</span>}
          {breakdown.electricity.amount > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> Electricity</span>}
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Maintenance</span>
          {breakdown.transport.amount > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Commute</span>}
        </div>
      </div>

      {/* Cost Table Items */}
      <div className="space-y-3 mb-6">
        {/* Rent */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 hover:bg-gray-100/70 transition-all duration-200 border border-gray-150/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1B2A2F]">Room Rent</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-800">
              Fixed
            </span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1B2A2F]">{formatINR(breakdown.rent.amount)}</span>
            <span className="text-[11px] text-gray-500 block">per bed / mo</span>
          </div>
        </div>

        {/* Food */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 hover:bg-gray-100/70 transition-all duration-200 border border-gray-150/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1B2A2F]">Food / Mess</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                  breakdown.food.type === "fixed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {breakdown.food.type}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">{breakdown.food.notes}</span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1B2A2F]">
              {breakdown.food.amount === 0 ? "Included" : formatINR(breakdown.food.amount)}
            </span>
          </div>
        </div>

        {/* Electricity */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1B2A2F]">Electricity</span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                  breakdown.electricity.type === "fixed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {breakdown.electricity.type}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">{breakdown.electricity.notes}</span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1B2A2F]">
              {breakdown.electricity.amount === 0 ? "Included" : formatINR(breakdown.electricity.amount)}
            </span>
          </div>
        </div>

        {/* Maintenance */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1B2A2F]">Maintenance & Cleaning</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-800">
                {breakdown.maintenance.type}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">{breakdown.maintenance.notes}</span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1B2A2F]">{formatINR(breakdown.maintenance.amount)}</span>
          </div>
        </div>

        {/* Laundry */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1B2A2F]">Laundry</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-800">
                {breakdown.laundry.type}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">{breakdown.laundry.notes}</span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1B2A2F]">{formatINR(breakdown.laundry.amount)}</span>
          </div>
        </div>

        {/* Transport */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1B2A2F]">College Commute</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-800">
                {breakdown.transport.type}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">{breakdown.transport.notes}</span>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1B2A2F]">{formatINR(breakdown.transport.amount)}</span>
          </div>
        </div>
      </div>

      {/* Total Card */}
      <div className="p-5 rounded-2xl bg-[#0F5C5C] text-white flex items-center justify-between shadow-lg">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold block">
            Estimated True Monthly Total
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-sans">
            {formatINR(breakdown.totalMonthlyEstimated)}
            <span className="text-xs font-normal text-white/80"> / month</span>
          </span>
        </div>
        <div className="text-right text-xs text-white/80 max-w-[150px]">
          No hidden surprises on arrival in Gokak.
        </div>
      </div>
    </div>
  );
}
