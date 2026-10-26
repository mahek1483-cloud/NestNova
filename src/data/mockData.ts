export interface Owner {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  joinedDate: string;
}

export interface Verification {
  status: 'Verified' | 'Partially verified' | 'Not yet verified';
  details?: string;
}

export interface Promotion {
  isSponsored: boolean;
  sponsorLevel?: string;
}

export interface Property {
  id: string;
  name: string;
  type: 'PG' | 'Hostel' | 'Co-living';
  city: string;
  location: string;
  priceINR: number;
  verification: Verification;
  promotion: Promotion;
  ownerId: string;
  amenities: string[];
  gender: 'Male' | 'Female' | 'Unisex';
  distanceMap?: { [college: string]: number };
  rules?: { curfew?: string; visitors?: string; quietHours?: string };
  safety?: { cctv?: boolean; guard?: boolean; fireSafety?: boolean; nearestHospital?: string };
  reviews?: unknown[];
  rating?: number;
}

export interface FoodService {
  id: string;
  name: string;
  type: 'Mess' | 'Tiffin';
  city: string;
  location: string;
  cuisine?: string;
  pricePerMealINR: number;
  monthlyPriceINR: number;
  verification: Verification;
  promotion: Promotion;
  ownerId: string;
  foodType: 'Veg' | 'Non-Veg' | 'Both';
  hygieneChecked: boolean;
  rating: number;
}

export interface Review {
  id: string;
  targetId: string; // Property ID or FoodService ID
  targetType: 'Property' | 'FoodService';
  authorName: string;
  authorType: 'Verified resident' | 'Verified food customer' | 'Visited not stayed' | 'Unverified feedback';
  rating: number;
  comment: string;
  date: string;
}

export interface Request {
  id: string;
  targetId: string;
  userId: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  date: string;
}

export const owners: Owner[] = [
  { id: 'o1', name: 'Ramesh Patel', contactNumber: '+91 9876543210', email: 'ramesh@example.com', joinedDate: '2023-01-15' },
  { id: 'o2', name: 'Anita Sharma', contactNumber: '+91 9876543211', email: 'anita@example.com', joinedDate: '2022-11-20' },
  { id: 'o3', name: 'Vivek Singh', contactNumber: '+91 9876543212', email: 'vivek@example.com', joinedDate: '2024-03-10' }
];

export const properties: Property[] = [
  // 60% Verified (8/14)
  {
    id: 'p1', name: 'Sunrise PG', type: 'PG', city: 'Bengaluru', location: 'Koramangala', priceINR: 8000,
    verification: { status: 'Verified', details: 'Aadhaar & Property verified' }, promotion: { isSponsored: false },
    ownerId: 'o1', amenities: ['WiFi', 'Washing Machine', 'Food'], gender: 'Male', rating: 4.5
  },
  {
    id: 'p2', name: 'Star Co-living', type: 'Co-living', city: 'Pune', location: 'Viman Nagar', priceINR: 12000,
    verification: { status: 'Verified' }, promotion: { isSponsored: true, sponsorLevel: 'Gold' },
    ownerId: 'o2', amenities: ['WiFi', 'AC', 'Gym'], gender: 'Unisex', rating: 4.8
  },
  {
    id: 'p3', name: 'Elite Hostel', type: 'Hostel', city: 'Hyderabad', location: 'Gachibowli', priceINR: 6500,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o3', amenities: ['WiFi', 'Cleaning'], gender: 'Female', rating: 4.2
  },
  {
    id: 'p4', name: 'Comfort Stay', type: 'PG', city: 'Delhi', location: 'Laxmi Nagar', priceINR: 7000,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o1', amenities: ['WiFi', 'Food'], gender: 'Male', rating: 3.9
  },
  {
    id: 'p5', name: 'Royal PG', type: 'PG', city: 'Chennai', location: 'OMR', priceINR: 8500,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o2', amenities: ['WiFi', 'AC', 'Food'], gender: 'Female', rating: 4.6
  },
  {
    id: 'p6', name: 'Students Hub', type: 'Hostel', city: 'Kota', location: 'Talwandi', priceINR: 9000,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o3', amenities: ['WiFi', 'Library', 'Food'], gender: 'Male', rating: 4.4
  },
  {
    id: 'p7', name: 'Techie Nest', type: 'Co-living', city: 'Bengaluru', location: 'HSR Layout', priceINR: 15000,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o1', amenities: ['WiFi', 'AC', 'Gym', 'Pool'], gender: 'Unisex', rating: 4.9
  },
  {
    id: 'p8', name: 'Green View PG', type: 'PG', city: 'Pune', location: 'Hinjewadi', priceINR: 7500,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o2', amenities: ['WiFi', 'Washing Machine'], gender: 'Female', rating: 4.1
  },
  
  // 25% Partially verified (4/14)
  {
    id: 'p9', name: 'City Centre Hostel', type: 'Hostel', city: 'Hyderabad', location: 'Ameerpet', priceINR: 5500,
    verification: { status: 'Partially verified', details: 'Owner ID verified, property pending' }, promotion: { isSponsored: false },
    ownerId: 'o3', amenities: ['WiFi'], gender: 'Male', rating: 3.5
  },
  {
    id: 'p10', name: 'Budget Stay', type: 'PG', city: 'Delhi', location: 'Mukherjee Nagar', priceINR: 6000,
    verification: { status: 'Partially verified' }, promotion: { isSponsored: false },
    ownerId: 'o1', amenities: ['Food'], gender: 'Male', rating: 3.8
  },
  {
    id: 'p11', name: 'Beachside Co-living', type: 'Co-living', city: 'Chennai', location: 'ECR', priceINR: 18000,
    verification: { status: 'Partially verified' }, promotion: { isSponsored: false },
    ownerId: 'o2', amenities: ['WiFi', 'AC', 'Sea View'], gender: 'Unisex', rating: 4.7
  },
  {
    id: 'p12', name: 'Toppers Hostel', type: 'Hostel', city: 'Kota', location: 'Vigyan Nagar', priceINR: 8000,
    verification: { status: 'Partially verified' }, promotion: { isSponsored: false },
    ownerId: 'o3', amenities: ['WiFi', 'Food'], gender: 'Female', rating: 4.0
  },
  
  // 15% Not yet verified (2/14)
  {
    id: 'p13', name: 'New PG Koramangala', type: 'PG', city: 'Bengaluru', location: 'Koramangala', priceINR: 7000,
    verification: { status: 'Not yet verified', details: 'Pending physical visit' }, promotion: { isSponsored: true, sponsorLevel: 'Silver' },
    ownerId: 'o1', amenities: ['WiFi'], gender: 'Male', rating: 0
  },
  {
    id: 'p14', name: 'Aman PG', type: 'PG', city: 'Pune', location: 'Kharadi', priceINR: 6500,
    verification: { status: 'Not yet verified' }, promotion: { isSponsored: false },
    ownerId: 'o2', amenities: ['Washing Machine'], gender: 'Male', rating: 0
  }
];

export const foodServices: FoodService[] = [
  {
    id: 'f1', name: 'Maa ki Rasoi', type: 'Tiffin', city: 'Bengaluru', location: 'HSR Layout', pricePerMealINR: 100, monthlyPriceINR: 5500,
    verification: { status: 'Verified' }, promotion: { isSponsored: true },
    ownerId: 'o1', foodType: 'Veg', hygieneChecked: true, rating: 4.7
  },
  {
    id: 'f2', name: 'Spice Box', type: 'Mess', city: 'Pune', location: 'Viman Nagar', pricePerMealINR: 120, monthlyPriceINR: 6500,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o2', foodType: 'Both', hygieneChecked: true, rating: 4.3
  },
  {
    id: 'f3', name: 'Andhra Mess', type: 'Mess', city: 'Hyderabad', location: 'Ameerpet', pricePerMealINR: 90, monthlyPriceINR: 5000,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o3', foodType: 'Both', hygieneChecked: true, rating: 4.5
  },
  {
    id: 'f4', name: 'Delhi Tiffin Service', type: 'Tiffin', city: 'Delhi', location: 'Laxmi Nagar', pricePerMealINR: 80, monthlyPriceINR: 4500,
    verification: { status: 'Partially verified' }, promotion: { isSponsored: false },
    ownerId: 'o1', foodType: 'Veg', hygieneChecked: false, rating: 3.9
  },
  {
    id: 'f5', name: 'Chettinad Kitchen', type: 'Mess', city: 'Chennai', location: 'OMR', pricePerMealINR: 150, monthlyPriceINR: 8000,
    verification: { status: 'Verified' }, promotion: { isSponsored: false },
    ownerId: 'o2', foodType: 'Non-Veg', hygieneChecked: true, rating: 4.8
  },
  {
    id: 'f6', name: 'Kota Students Mess', type: 'Mess', city: 'Kota', location: 'Talwandi', pricePerMealINR: 110, monthlyPriceINR: 6000,
    verification: { status: 'Not yet verified' }, promotion: { isSponsored: false },
    ownerId: 'o3', foodType: 'Veg', hygieneChecked: false, rating: 4.0
  }
];

export const reviews: Review[] = [
  { id: 'r1', targetId: 'p1', targetType: 'Property', authorName: 'Rahul', authorType: 'Verified resident', rating: 5, comment: 'Great place, friendly owner.', date: '2024-01-10' },
  { id: 'r2', targetId: 'p1', targetType: 'Property', authorName: 'Sumit', authorType: 'Visited not stayed', rating: 4, comment: 'Looked good, but a bit pricey for me.', date: '2024-01-12' },
  { id: 'r3', targetId: 'p2', targetType: 'Property', authorName: 'Neha', authorType: 'Verified resident', rating: 5, comment: 'Amazing amenities and very clean.', date: '2024-02-05' },
  { id: 'r4', targetId: 'p3', targetType: 'Property', authorName: 'Pooja', authorType: 'Verified resident', rating: 4, comment: 'Good food, but rooms are small.', date: '2024-02-15' },
  { id: 'r5', targetId: 'p4', targetType: 'Property', authorName: 'Aman', authorType: 'Unverified feedback', rating: 3, comment: 'Decent place for the price.', date: '2024-03-01' },
  { id: 'r6', targetId: 'p5', targetType: 'Property', authorName: 'Karthik', authorType: 'Verified resident', rating: 5, comment: 'Best PG in OMR area.', date: '2024-03-10' },
  { id: 'r7', targetId: 'p6', targetType: 'Property', authorName: 'Saurabh', authorType: 'Verified resident', rating: 4, comment: 'Very conducive environment for studying.', date: '2024-03-15' },
  { id: 'r8', targetId: 'p7', targetType: 'Property', authorName: 'Vikram', authorType: 'Verified resident', rating: 5, comment: 'Luxury living at its best.', date: '2024-04-02' },
  { id: 'r9', targetId: 'p8', targetType: 'Property', authorName: 'Sneha', authorType: 'Visited not stayed', rating: 4, comment: 'Clean but too far from my office.', date: '2024-04-10' },
  { id: 'r10', targetId: 'p9', targetType: 'Property', authorName: 'Arjun', authorType: 'Unverified feedback', rating: 2, comment: 'Maintenance could be better.', date: '2024-04-12' },
  { id: 'r11', targetId: 'p10', targetType: 'Property', authorName: 'Raj', authorType: 'Verified resident', rating: 4, comment: 'Affordable and good enough.', date: '2024-04-20' },
  { id: 'r12', targetId: 'p11', targetType: 'Property', authorName: 'Riya', authorType: 'Verified resident', rating: 5, comment: 'Loved the sea view!', date: '2024-05-05' },
  { id: 'r13', targetId: 'p12', targetType: 'Property', authorName: 'Aditi', authorType: 'Verified resident', rating: 4, comment: 'Good security for girls.', date: '2024-05-15' },
  { id: 'r14', targetId: 'p13', targetType: 'Property', authorName: 'Kunal', authorType: 'Visited not stayed', rating: 3, comment: 'Still under construction in some parts.', date: '2024-05-20' },
  { id: 'r15', targetId: 'f1', targetType: 'FoodService', authorName: 'Manish', authorType: 'Verified food customer', rating: 5, comment: 'Tastes just like home!', date: '2024-01-20' },
  { id: 'r16', targetId: 'f2', targetType: 'FoodService', authorName: 'Nikhil', authorType: 'Verified food customer', rating: 4, comment: 'Good variety, sometimes spicy.', date: '2024-02-10' },
  { id: 'r17', targetId: 'f3', targetType: 'FoodService', authorName: 'Ravi', authorType: 'Verified food customer', rating: 5, comment: 'Authentic Andhra meals.', date: '2024-02-25' },
  { id: 'r18', targetId: 'f4', targetType: 'FoodService', authorName: 'Deepak', authorType: 'Unverified feedback', rating: 3, comment: 'Okay food, can improve.', date: '2024-03-05' },
  { id: 'r19', targetId: 'f5', targetType: 'FoodService', authorName: 'Anil', authorType: 'Verified food customer', rating: 5, comment: 'Excellent quality and hygiene.', date: '2024-03-20' },
  { id: 'r20', targetId: 'f6', targetType: 'FoodService', authorName: 'Mohit', authorType: 'Verified food customer', rating: 4, comment: 'Very timely delivery.', date: '2024-04-05' },
  { id: 'r21', targetId: 'f1', targetType: 'FoodService', authorName: 'Suresh', authorType: 'Unverified feedback', rating: 4, comment: 'Portion sizes are good.', date: '2024-04-15' }
];

export const requests: Request[] = [];
