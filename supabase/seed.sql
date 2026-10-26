-- ==============================================================================
-- NestNova Demo Seed Script for Gokak, Karnataka (591307)
-- All demo records are strictly tagged with is_demo = true
-- ==============================================================================

-- 1. Demo Auth Users
INSERT INTO auth.users (id, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'student@demo.com'),
('22222222-2222-2222-2222-222222222222', 'owner@demo.com'),
('33333333-3333-3333-3333-333333333333', 'admin@demo.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Profiles
INSERT INTO profiles (id, role, full_name, email, is_demo)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'student', 'Demo Student', 'student@demo.com', true),
  ('22222222-2222-2222-2222-222222222222', 'owner', 'Anand Kulkarni (Demo Owner)', 'owner@demo.com', true),
  ('33333333-3333-3333-3333-333333333333', 'admin', 'NestNova Gokak Admin', 'admin@demo.com', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Owner Profile
INSERT INTO owner_profiles (id, status, business_name, address, is_demo)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'approved', 'Gokak Student Living Network', 'Court Road, Near Taluk Office, Gokak, Karnataka 591307', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Authentic Gokak Properties
INSERT INTO properties (
  id, owner_id, name, description, property_type, address, city, locality,
  listing_status, verification_status, gender_category, amenities, rules, is_demo
) VALUES
(
  '44444444-4444-4444-4444-444444444441',
  '22222222-2222-2222-2222-222222222222',
  'Basaveshwar Executive Boys PG',
  'Premium student accommodation located directly behind JSS College on Station Road. Features spacious ventilated rooms, daily housekeeping, RO water, and wholesome North Karnataka home meals.',
  'PG',
  'Plot 42, 2nd Cross, Station Road, Basaveshwar Nagar, Gokak, Karnataka 591307',
  'Gokak',
  'Basaveshwar Nagar',
  'published',
  'verified',
  'Boys',
  ARRAY['Wi-Fi', 'Study Desk & Chair', 'Attached Bathroom', '24/7 Water Supply', 'Power Backup / Inverter', 'Purified Drinking Water (RO)', 'Daily Cleaning / Housekeeping', 'CCTV Surveillance', 'Hot Water Geyser', 'Bicycle / Two-Wheeler Parking', 'Vegetarian Mess Available'],
  ARRAY['Curfew time is 10:00 PM for student safety', 'Quiet hours strictly observed between 10:30 PM - 6:00 AM', 'No smoking or alcohol permitted inside premises'],
  true
),
(
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222222',
  'Kaveri Girls Deluxe Hostel & PG',
  'Secure, disciplined, and comfortable hostel dedicated to female college students and teachers in Gokak. 24/7 security guard, CCTV cameras, biometric gate, and wholesome pure vegetarian meals.',
  'Hostel',
  'Opposite Taluk Court Complex, Court Road, Gokak, Karnataka 591307',
  'Gokak',
  'Court Road',
  'published',
  'verified',
  'Girls',
  ARRAY['Wi-Fi', 'Attached Bathroom', 'Study Desk & Chair', '24/7 Water Supply', 'Power Backup / Inverter', 'Purified Drinking Water (RO)', 'Daily Cleaning / Housekeeping', 'CCTV Surveillance', 'Security Guard', 'Washing Machine / Laundry', 'Hot Water Geyser', 'Vegetarian Mess Available'],
  ARRAY['Strict curfew at 8:30 PM (gate locked)', 'Guardian or parent approval required for overnight leave', 'Male visitors strictly restricted to main reception waiting area'],
  true
),
(
  '44444444-4444-4444-4444-444444444443',
  '22222222-2222-2222-2222-222222222222',
  'Ghataprabha Student Living & Co-living',
  'Modern, independent student housing located near the scenic Ghataprabha River basin on Falls Road. Separate wings for boys and girls with high-speed fiber internet and power backup.',
  'Co-living',
  'Near Ghataprabha Bridge, Falls Road, Gokak, Karnataka 591307',
  'Gokak',
  'Falls Road',
  'published',
  'verified',
  'Co-ed',
  ARRAY['Wi-Fi', 'Study Desk & Chair', 'Attached Bathroom', '24/7 Water Supply', 'Power Backup / Inverter', 'Purified Drinking Water (RO)', 'Daily Cleaning / Housekeeping', 'Hot Water Geyser', 'Bicycle / Two-Wheeler Parking'],
  ARRAY['Curfew at 9:30 PM', 'Separate residential wings for male and female tenants', 'No loud music after 10:00 PM'],
  true
),
(
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'Shri Renuka Devi Boys Hostel',
  'Budget-friendly, highly popular hostel for diploma and engineering students attending Rural Polytechnic College in Gokak. Includes daily meals and dedicated bike parking.',
  'Hostel',
  'Near Rural Polytechnic Campus, Shinglapur Road, Gokak, Karnataka 591307',
  'Gokak',
  'Shinglapur Road',
  'published',
  'pending',
  'Boys',
  ARRAY['Purified Drinking Water (RO)', '24/7 Water Supply', 'Hot Water Geyser', 'Study Desk & Chair', 'Bicycle / Two-Wheeler Parking', 'Daily Cleaning / Housekeeping', 'Vegetarian Mess Available'],
  ARRAY['Curfew at 10:00 PM', 'Cleanliness of personal study tables must be maintained'],
  true
),
(
  '44444444-4444-4444-4444-444444444445',
  '22222222-2222-2222-2222-222222222222',
  'Ananya Working Women & Girls PG',
  'Centrally located right behind the KSRTC Bus Stand. Highly convenient for students travelling to Belagavi or local Gokak colleges. Clean environment with strict security.',
  'PG',
  'Behind KSRTC Depot, Bus Stand Colony, Gokak, Karnataka 591307',
  'Gokak',
  'Near KSRTC Bus Stand',
  'published',
  'verified',
  'Girls',
  ARRAY['Wi-Fi', 'Attached Bathroom', 'Study Desk & Chair', '24/7 Water Supply', 'Power Backup / Inverter', 'Purified Drinking Water (RO)', 'Daily Cleaning / Housekeeping', 'CCTV Surveillance', 'Security Guard', 'Hot Water Geyser', 'Vegetarian Mess Available'],
  ARRAY['Curfew time is 8:30 PM', 'Only parents / verified local guardians allowed to visit'],
  true
),
(
  '44444444-4444-4444-4444-444444444446',
  '22222222-2222-2222-2222-222222222222',
  'Station View Student Rooms',
  'Budget independent room rentals for senior college students and working professionals. Unfurnished and semi-furnished rooms with self-metered electricity.',
  'Student Room',
  'Station Road, Near APMC Market Yard, Gokak, Karnataka 591307',
  'Gokak',
  'Station Road',
  'published',
  'unverified',
  'Boys',
  ARRAY['24/7 Water Supply', 'Purified Drinking Water (RO)', 'Power Backup / Inverter', 'Bicycle / Two-Wheeler Parking'],
  ARRAY['Electric heater usage prohibited without prior consent', 'Notice period of 30 days before vacating'],
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  locality = EXCLUDED.locality,
  verification_status = EXCLUDED.verification_status;

-- 5. Rooms for Gokak Stays
INSERT INTO rooms (
  id, property_id, room_type, sharing_capacity, rent_amount, deposit_amount,
  has_attached_bath, has_ac, is_demo
) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444441', 'Single Room', 1, 5500.00, 8000.00, true, false, true),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444441', '2 Sharing (Double)', 2, 3800.00, 6000.00, true, false, true),
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444441', '3 Sharing (Triple)', 3, 3200.00, 5000.00, false, false, true),
('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444442', '2 Sharing (Double)', 2, 4500.00, 8000.00, true, false, true),
('55555555-5555-5555-5555-555555555505', '44444444-4444-4444-4444-444444444442', 'Single Room', 1, 6000.00, 10000.00, true, false, true),
('55555555-5555-5555-5555-555555555506', '44444444-4444-4444-4444-444444444443', '3 Sharing (Triple)', 3, 3500.00, 5000.00, true, false, true),
('55555555-5555-5555-5555-555555555507', '44444444-4444-4444-4444-444444444444', '4+ Sharing', 4, 2800.00, 4000.00, false, false, true),
('55555555-5555-5555-5555-555555555508', '44444444-4444-4444-4444-444444444445', '2 Sharing (Double)', 2, 4200.00, 7000.00, true, false, true),
('55555555-5555-5555-5555-555555555509', '44444444-4444-4444-4444-444444444446', '2 Sharing (Double)', 2, 3000.00, 6000.00, false, false, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Beds
INSERT INTO beds (id, room_id, status, identifier, is_demo) VALUES
('66666666-6666-6666-6666-666666666601', '55555555-5555-5555-5555-555555555501', 'available', 'Bed 101', true),
('66666666-6666-6666-6666-666666666602', '55555555-5555-5555-5555-555555555502', 'available', 'Bed 102-A', true),
('66666666-6666-6666-6666-666666666603', '55555555-5555-5555-5555-555555555502', 'occupied', 'Bed 102-B', true),
('66666666-6666-6666-6666-666666666604', '55555555-5555-5555-5555-555555555504', 'available', 'Bed 201-A', true),
('66666666-6666-6666-6666-666666666605', '55555555-5555-5555-5555-555555555504', 'occupied', 'Bed 201-B', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Verification Records
INSERT INTO verification_records (
  id, property_id, admin_id, status, notes, verified_at, expires_at
) VALUES
(
  '77777777-7777-7777-7777-777777777701',
  '44444444-4444-4444-4444-444444444441',
  '33333333-3333-3333-3333-333333333333',
  'verified',
  'Audited by NestNova Gokak Inspector. 24/7 water supply, fire extinguisher, and RO plant verified.',
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '355 days'
),
(
  '77777777-7777-7777-7777-777777777702',
  '44444444-4444-4444-4444-444444444442',
  '33333333-3333-3333-3333-333333333333',
  'verified',
  'On-site inspection completed. Safety gate, CCTV coverage, drinking water test, and female warden verified.',
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '350 days'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Food Providers in Gokak
INSERT INTO food_providers (
  id, owner_id, name, description, address, pricing, timings,
  is_veg, has_delivery, listing_status, verification_status, is_demo
) VALUES
(
  '88888888-8888-8888-8888-888888888801',
  '22222222-2222-2222-2222-222222222222',
  'Annapurna Jowar Roti Mess',
  'Famous North Karnataka pure vegetarian mess serving hot hand-made Jolada Roti (Jowar Roti) meals with Yennegai (Brinjal curry), Shengachutney, and fresh curd.',
  'Near JSS College Circle, Station Road, Gokak, Karnataka 591307',
  '₹2,600/month (2 meals/day) or ₹70/unlimited thali',
  '12:00 PM - 3:30 PM & 7:30 PM - 10:00 PM',
  true,
  true,
  'published',
  'verified',
  true
),
(
  '88888888-8888-8888-8888-888888888802',
  '22222222-2222-2222-2222-222222222222',
  'Shri Mahalakshmi Student Tiffin Delivery',
  'Home-packed stainless steel hot tiffin delivered directly to your PG or hostel room in Gokak. Choice of chapati or jowar roti with nutritious seasonal vegetables.',
  'Court Road, Near Municipal High School, Gokak, Karnataka 591307',
  '₹2,800/month (Home/PG doorstep delivery included)',
  'Lunch delivery: 12:30 PM - 1:30 PM | Dinner: 7:30 PM - 8:30 PM',
  true,
  true,
  'published',
  'verified',
  true
),
(
  '88888888-8888-8888-8888-888888888803',
  '22222222-2222-2222-2222-222222222222',
  'Basaveshwar Bhojanalaya',
  'Budget dining hall catering specifically to college students from Rural Polytechnic and JSS College. Pure veg, clean dining environment, and quick service.',
  'Basaveshwar Nagar, Near Old Water Tank, Gokak, Karnataka 591307',
  '₹2,400/month or ₹60/meal',
  '11:30 AM - 3:00 PM & 7:00 PM - 9:30 PM',
  true,
  false,
  'published',
  'verified',
  true
)
ON CONFLICT (id) DO NOTHING;
