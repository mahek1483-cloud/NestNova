import { TrueCostBreakdown } from "@/types";

export interface CostCalculationInput {
  baseRent: number;
  foodIncluded: boolean;
  foodMonthlyCost?: number | null;
  electricityIncluded?: boolean;
  electricityMonthlyCost?: number | null;
  maintenanceIncluded?: boolean;
  maintenanceMonthlyCost?: number | null;
  laundryIncluded?: boolean;
  laundryMonthlyCost?: number | null;
  distanceKmToCollege?: number | null;
  dailyTransportMethod?: "walk" | "bicycle" | "auto" | "bus" | "none";
}

/**
 * Pure, transparent monthly cost calculator for student living in Gokak.
 * Never fabricates numbers. Distinguishes fixed, estimated, and not provided.
 */
export function calculateTrueCost(input: CostCalculationInput): TrueCostBreakdown {
  const baseRent = Math.max(0, Math.round(input.baseRent || 0));
  let isPartialEstimate = false;

  // 1. Rent
  const rentItem: TrueCostBreakdown["rent"] = {
    amount: baseRent,
    type: "fixed",
    notes: "Base room rent per bed/month",
  };

  // 2. Food
  let foodItem: TrueCostBreakdown["food"];
  if (input.foodIncluded) {
    foodItem = {
      amount: 0,
      type: "fixed",
      notes: "Included in base rent",
    };
  } else if (typeof input.foodMonthlyCost === "number" && input.foodMonthlyCost > 0) {
    foodItem = {
      amount: Math.round(input.foodMonthlyCost),
      type: "fixed",
      notes: "Mess subscription fee",
    };
  } else if (input.foodMonthlyCost === 0) {
    foodItem = {
      amount: 0,
      type: "fixed",
      notes: "Self-cooking / no fee",
    };
  } else {
    // Gokak student average mess estimate: ~₹2,500 - ₹3,000 / mo
    foodItem = {
      amount: 2800,
      type: "estimated",
      notes: "Avg. Gokak student mess estimate",
    };
    isPartialEstimate = true;
  }

  // 3. Electricity
  let electricityItem: TrueCostBreakdown["electricity"];
  if (input.electricityIncluded) {
    electricityItem = {
      amount: 0,
      type: "fixed",
      notes: "Included in rent",
    };
  } else if (typeof input.electricityMonthlyCost === "number" && input.electricityMonthlyCost >= 0) {
    electricityItem = {
      amount: Math.round(input.electricityMonthlyCost),
      type: "fixed",
      notes: "Fixed monthly electricity charge",
    };
  } else {
    // Gokak typical student room power estimate
    electricityItem = {
      amount: 400,
      type: "estimated",
      notes: "Estimated meter / sharing cost",
    };
    isPartialEstimate = true;
  }

  // 4. Maintenance
  let maintenanceItem: TrueCostBreakdown["maintenance"];
  if (input.maintenanceIncluded) {
    maintenanceItem = {
      amount: 0,
      type: "fixed",
      notes: "Included in rent",
    };
  } else if (typeof input.maintenanceMonthlyCost === "number" && input.maintenanceMonthlyCost >= 0) {
    maintenanceItem = {
      amount: Math.round(input.maintenanceMonthlyCost),
      type: "fixed",
      notes: "Building maintenance charge",
    };
  } else {
    maintenanceItem = {
      amount: 250,
      type: "estimated",
      notes: "Estimated cleaning/maintenance fee",
    };
    isPartialEstimate = true;
  }

  // 5. Laundry
  let laundryItem: TrueCostBreakdown["laundry"];
  if (input.laundryIncluded) {
    laundryItem = {
      amount: 0,
      type: "fixed",
      notes: "Washing machine access included",
    };
  } else if (typeof input.laundryMonthlyCost === "number" && input.laundryMonthlyCost >= 0) {
    laundryItem = {
      amount: Math.round(input.laundryMonthlyCost),
      type: "fixed",
      notes: "Laundry fee",
    };
  } else {
    laundryItem = {
      amount: 350,
      type: "estimated",
      notes: "Self-wash or local dhobi estimate",
    };
  }

  // 6. Transport in Gokak
  let transportItem: TrueCostBreakdown["transport"];
  const dist = input.distanceKmToCollege;
  const method = input.dailyTransportMethod || (dist && dist <= 1.5 ? "walk" : "auto");

  if (method === "walk" || (dist && dist <= 1.0)) {
    transportItem = {
      amount: 0,
      type: "estimated",
      notes: "Within walking distance (0 km)",
    };
  } else if (method === "bicycle") {
    transportItem = {
      amount: 50,
      type: "estimated",
      notes: "Bicycle commute maintenance",
    };
  } else if (dist && dist > 1.0) {
    // Gokak local shared auto / bus ~₹15-20 per day return trip = ~₹450/month
    const estAuto = Math.min(800, Math.round(dist * 20 * 25));
    transportItem = {
      amount: estAuto,
      type: "estimated",
      notes: `Estimated local transit (${dist} km)`,
    };
  } else {
    transportItem = {
      amount: 0,
      type: "not_provided",
      notes: "College distance not selected",
    };
  }

  const totalMonthlyEstimated =
    rentItem.amount +
    foodItem.amount +
    electricityItem.amount +
    maintenanceItem.amount +
    laundryItem.amount +
    transportItem.amount;

  return {
    rent: rentItem,
    food: foodItem,
    electricity: electricityItem,
    maintenance: maintenanceItem,
    laundry: laundryItem,
    transport: transportItem,
    totalMonthlyEstimated,
    isPartialEstimate,
  };
}
