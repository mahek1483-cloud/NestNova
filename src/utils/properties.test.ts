import { expect, test, describe } from "vitest";
import { getGokakProperties, getPropertyById } from "../lib/api/properties";
import { getGokakFoodProviders } from "../lib/api/food";

describe("Gokak Property Search & Demo Data", () => {
  test("returns authentic Gokak demo stays when database is offline/unseeded", async () => {
    const res = await getGokakProperties();
    expect(res.properties.length).toBeGreaterThanOrEqual(6);
    expect(res.properties.every((p) => p.city === "Gokak")).toBe(true);
  });

  test("filters properties by search query", async () => {
    const res = await getGokakProperties({ searchQuery: "Basaveshwar" });
    expect(res.properties.length).toBeGreaterThanOrEqual(1);
    expect(
      res.properties.some((p) => p.name.includes("Basaveshwar") || p.locality.includes("Basaveshwar"))
    ).toBe(true);
  });

  test("filters properties by gender category", async () => {
    const boysRes = await getGokakProperties({ gender: "Boys" });
    expect(boysRes.properties.every((p) => p.gender_category === "Boys")).toBe(true);

    const girlsRes = await getGokakProperties({ gender: "Girls" });
    expect(girlsRes.properties.every((p) => p.gender_category === "Girls")).toBe(true);
  });

  test("filters properties by verifiedOnly", async () => {
    const verifiedRes = await getGokakProperties({ verifiedOnly: true });
    expect(verifiedRes.properties.every((p) => p.verification_status === "verified")).toBe(true);
    expect(verifiedRes.properties.length).toBeGreaterThanOrEqual(3);
  });

  test("filters properties by maxBudget", async () => {
    const budgetRes = await getGokakProperties({ maxBudget: 3500 });
    expect(budgetRes.properties.every((p) => p.monthly_rent_start <= 3500)).toBe(true);
  });

  test("retrieves a single Gokak property by ID", async () => {
    const stay = await getPropertyById("gokak-stay-1");
    expect(stay).not.toBeNull();
    expect(stay?.name).toBe("Basaveshwar Executive Boys PG");
    expect(stay?.monthly_rent_start).toBe(3800);
    expect(stay?.food_included).toBe(true);
  });

  test("returns Gokak mess & tiffin providers", async () => {
    const foodRes = await getGokakFoodProviders();
    expect(foodRes.providers.length).toBeGreaterThanOrEqual(2);
    expect(foodRes.providers.every((p) => p.city === "Gokak")).toBe(true);
  });
});
