// Strict Gokak Location Scope Constants
// Gokak, Belagavi District, Karnataka, India

export const GOKAK_LOCATION = {
  city: "Gokak",
  district: "Belagavi",
  state: "Karnataka",
  country: "India",
  pincode: "591307",
  coordinates: {
    lat: 16.1682,
    lng: 74.8239,
  },
  landmark: "Gokak Falls & Ghataprabha River Basin",
} as const;

export interface GokakCollege {
  id: string;
  name: string;
  shortName: string;
  locality: string;
  address: string;
  coordinates: { lat: number; lng: number };
  popularCourses: string[];
}

export const GOKAK_COLLEGES: GokakCollege[] = [
  {
    id: "jss-gokak",
    name: "JSS Arts, Science & Commerce College, Gokak",
    shortName: "JSS College",
    locality: "Basaveshwar Nagar / Station Road",
    address: "Station Road, Gokak, Karnataka 591307",
    coordinates: { lat: 16.1712, lng: 74.8285 },
    popularCourses: ["B.Sc", "B.Com", "B.A", "M.Com", "BCA"],
  },
  {
    id: "vsg-gfgc-gokak",
    name: "VSG Government First Grade College, Gokak",
    shortName: "GFGC Gokak",
    locality: "Falls Road",
    address: "Falls Road, Near Govt Hospital, Gokak, Karnataka 591307",
    coordinates: { lat: 16.1645, lng: 74.8192 },
    popularCourses: ["B.A", "B.Sc", "B.Com", "BBA"],
  },
  {
    id: "karnataka-college-gokak",
    name: "Karnataka Science & Commerce College",
    shortName: "Karnataka College",
    locality: "Court Road",
    address: "Court Road, Gokak, Karnataka 591307",
    coordinates: { lat: 16.1695, lng: 74.8251 },
    popularCourses: ["PUC Science", "PUC Commerce", "Degree"],
  },
  {
    id: "rural-polytechnic-gokak",
    name: "Rural Polytechnic College, Gokak",
    shortName: "Rural Polytechnic",
    locality: "Loliwada / Shinglapur Road",
    address: "Shinglapur Road, Gokak, Karnataka 591307",
    coordinates: { lat: 16.178, lng: 74.832 },
    popularCourses: ["Diploma in Mechanical", "Civil", "Computer Science", "Electrical"],
  },
  {
    id: "kle-gokak",
    name: "KLE Society's Degree & PU Institutions, Gokak",
    shortName: "KLE Gokak",
    locality: "Near Bus Stand",
    address: "Opposite KSRTC Depot, Gokak, Karnataka 591307",
    coordinates: { lat: 16.1668, lng: 74.8264 },
    popularCourses: ["Science", "Commerce", "Management Studies"],
  },
];

export const GOKAK_LOCALITIES = [
  "Court Road",
  "Basaveshwar Nagar",
  "Gandhi Chowk",
  "Raviwar Peth",
  "Somwar Peth",
  "Guruwar Peth",
  "Station Road",
  "Near KSRTC Bus Stand",
  "Falls Road",
  "Shinglapur Road",
  "Loliwada Road",
  "Market Yard / APMC Road",
] as const;

export const GOKAK_PROPERTY_TYPES = [
  { value: "PG", label: "Paying Guest (PG)" },
  { value: "Hostel", label: "Student Hostel" },
  { value: "Student Room", label: "Student Room / Flat" },
  { value: "Co-living", label: "Shared Co-living" },
] as const;

export const GOKAK_GENDER_CATEGORIES = [
  { value: "Boys", label: "Boys Only" },
  { value: "Girls", label: "Girls Only" },
  { value: "Co-ed", label: "Co-ed / Unisex" },
] as const;

export const GOKAK_SHARING_OPTIONS = [
  { value: "single", label: "Single Room (1 Bed)" },
  { value: "double", label: "2 Sharing (Double)" },
  { value: "triple", label: "3 Sharing (Triple)" },
  { value: "multi", label: "4+ Sharing" },
] as const;

export const GOKAK_AMENITIES_LIST = [
  "Wi-Fi",
  "Study Desk & Chair",
  "Attached Bathroom",
  "24/7 Water Supply",
  "Power Backup / Inverter",
  "Purified Drinking Water (RO)",
  "Daily Cleaning / Housekeeping",
  "CCTV Surveillance",
  "Washing Machine / Laundry",
  "Hot Water Geyser",
  "Bicycle / Two-Wheeler Parking",
  "Security Guard",
  "Vegetarian Mess Available",
  "Cooler / AC Provision",
] as const;

export const GOKAK_FOOD_TYPES = [
  { value: "Mess", label: "Dine-in Student Mess" },
  { value: "Tiffin", label: "Daily Tiffin Delivery / Tiffin Box" },
] as const;

export const GOKAK_CUISINE_OPTIONS = [
  "North Karnataka (Jowar Roti / Jolada Roti meals)",
  "South Indian (Rice, Sambar, Rasam, Palya)",
  "Pure Vegetarian",
  "Jain Meals Available",
  "Eggetarian / Non-Veg on select days",
] as const;

// STRICT ENFORCEMENT: Checks whether an address, city, or record belongs to Gokak
export function isGokakLocation(city?: string | null, address?: string | null): boolean {
  if (!city && !address) return false;
  const c = (city || "").toLowerCase().trim();
  const a = (address || "").toLowerCase().trim();

  // Explicit city match
  if (c === "gokak" || c.includes("gokak")) return true;
  // Fallback to address containing Gokak
  if (a.includes("gokak") || a.includes("591307")) return true;

  return false;
}
