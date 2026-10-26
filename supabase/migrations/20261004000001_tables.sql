CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER prevent_profiles_role_change BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION prevent_role_change();

CREATE TABLE owner_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    status owner_status DEFAULT 'pending',
    business_name TEXT,
    address TEXT,
    contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_owner_profiles_updated_at BEFORE UPDATE ON owner_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    location extensions.geography(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES owner_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    property_type TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    location extensions.geography(Point, 4326),
    listing_status listing_status DEFAULT 'draft',
    verification_status verification_status DEFAULT 'unverified',
    gender_category TEXT,
    amenities TEXT[],
    rules TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER prevent_properties_verification_change BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION prevent_verification_change();

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_type TEXT,
    sharing_capacity INT NOT NULL,
    rent_amount NUMERIC(12,2) NOT NULL,
    deposit_amount NUMERIC(12,2) NOT NULL,
    has_attached_bath BOOLEAN DEFAULT FALSE,
    has_ac BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    status bed_status DEFAULT 'available',
    identifier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_beds_updated_at BEFORE UPDATE ON beds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    category TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE location_verified_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES owner_profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    category TEXT,
    captured_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    lat NUMERIC,
    lng NUMERIC,
    accuracy NUMERIC,
    distance NUMERIC,
    status photo_status DEFAULT 'normal',
    rejection_reason TEXT,
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status verification_status NOT NULL,
    notes TEXT,
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE visit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    status visit_status DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ,
    owner_notes TEXT,
    student_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_visit_requests_updated_at BEFORE UPDATE ON visit_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE stay_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_stay_records_updated_at BEFORE UPDATE ON stay_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE,
    UNIQUE(student_id, property_id)
);

CREATE TABLE food_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES owner_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    location extensions.geography(Point, 4326),
    pricing TEXT,
    timings TEXT,
    is_veg BOOLEAN,
    has_delivery BOOLEAN,
    listing_status listing_status DEFAULT 'draft',
    verification_status verification_status DEFAULT 'unverified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_food_providers_updated_at BEFORE UPDATE ON food_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER prevent_food_providers_verification_change BEFORE UPDATE ON food_providers FOR EACH ROW EXECUTE FUNCTION prevent_verification_change();

CREATE TABLE saved_food_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    food_provider_id UUID REFERENCES food_providers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE,
    UNIQUE(student_id, food_provider_id)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    rating_cleanliness INT CHECK (rating_cleanliness BETWEEN 1 AND 5),
    rating_food INT CHECK (rating_food BETWEEN 1 AND 5),
    rating_management INT CHECK (rating_management BETWEEN 1 AND 5),
    rating_wifi INT CHECK (rating_wifi BETWEEN 1 AND 5),
    rating_maintenance INT CHECK (rating_maintenance BETWEEN 1 AND 5),
    rating_overall INT CHECK (rating_overall BETWEEN 1 AND 5) NOT NULL,
    review_text TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE review_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE UNIQUE,
    owner_id UUID REFERENCES owner_profiles(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE review_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE listing_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE food_menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_provider_id UUID REFERENCES food_providers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12,2),
    is_veg BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_food_menu_items_updated_at BEFORE UPDATE ON food_menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE food_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    food_provider_id UUID REFERENCES food_providers(id) ON DELETE CASCADE,
    rating_taste INT CHECK (rating_taste BETWEEN 1 AND 5),
    rating_hygiene INT CHECK (rating_hygiene BETWEEN 1 AND 5),
    rating_quantity INT CHECK (rating_quantity BETWEEN 1 AND 5),
    rating_variety INT CHECK (rating_variety BETWEEN 1 AND 5),
    rating_timeliness INT CHECK (rating_timeliness BETWEEN 1 AND 5),
    rating_value INT CHECK (rating_value BETWEEN 1 AND 5),
    rating_overall INT CHECK (rating_overall BETWEEN 1 AND 5) NOT NULL,
    review_text TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_food_reviews_updated_at BEFORE UPDATE ON food_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    order_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_demo BOOLEAN DEFAULT FALSE
);

CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

