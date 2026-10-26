export type TransportMode = "walk" | "auto" | "metro" | "bus" | "bike";

export interface TravelEstimate {
  distanceKm: number;
  timeMins: number;
  costInr: number;
  mode: TransportMode;
}

// Simple deterministic pseudo-formulas based on distance to simulate a demo response.
export function getTravelEstimate(distanceKm: number, mode: TransportMode): TravelEstimate {
  let timeMins = 0;
  let costInr = 0;

  switch (mode) {
    case "walk":
      timeMins = Math.round(distanceKm * 12); // ~12 mins per km
      costInr = 0;
      break;
    case "auto":
      timeMins = Math.round(distanceKm * 4 + 3); // base 3 mins wait + 4 min/km
      costInr = Math.round(30 + distanceKm * 18); // base fare 30 + 18/km
      break;
    case "bike":
      timeMins = Math.round(distanceKm * 3 + 2); // 3 min/km
      costInr = Math.round(15 + distanceKm * 10);
      break;
    case "metro":
      // Assumes some access walk time + wait time
      timeMins = Math.round(distanceKm * 2 + 10);
      costInr = Math.min(60, Math.round(10 + distanceKm * 4)); // cap at 60
      break;
    case "bus":
      timeMins = Math.round(distanceKm * 5 + 10);
      costInr = Math.round(10 + distanceKm * 2);
      break;
  }

  return { distanceKm, timeMins, costInr, mode };
}

export function formatTravelString(est: TravelEstimate): string {
  if (est.mode === "walk") {
    return `${est.distanceKm} km · ~${est.timeMins} min walk`;
  }
  return `${est.distanceKm} km · ~${est.timeMins} min via ${est.mode} (₹${est.costInr})`;
}
