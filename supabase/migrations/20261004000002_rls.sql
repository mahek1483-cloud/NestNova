ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_verified_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE stay_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_food_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- owner_profiles
CREATE POLICY "Public owner_profiles are viewable by everyone" ON owner_profiles FOR SELECT USING (true);
CREATE POLICY "Owners can update own profile" ON owner_profiles FOR UPDATE USING (auth.uid() = id);

-- colleges
CREATE POLICY "Colleges viewable by everyone" ON colleges FOR SELECT USING (true);

-- properties
CREATE POLICY "Published properties viewable by everyone" ON properties FOR SELECT USING (listing_status = 'published');
CREATE POLICY "Owners can view own properties" ON properties FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owners can insert own properties" ON properties FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own properties" ON properties FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete own properties" ON properties FOR DELETE USING (owner_id = auth.uid());

-- rooms
CREATE POLICY "Rooms viewable if property is published" ON rooms FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE id = rooms.property_id AND (listing_status = 'published' OR owner_id = auth.uid()))
);
CREATE POLICY "Owners can insert rooms for own properties" ON rooms FOR INSERT WITH CHECK (is_owner_of(property_id));
CREATE POLICY "Owners can update rooms for own properties" ON rooms FOR UPDATE USING (is_owner_of(property_id));
CREATE POLICY "Owners can delete rooms for own properties" ON rooms FOR DELETE USING (is_owner_of(property_id));

-- beds
CREATE POLICY "Beds viewable if property is published" ON beds FOR SELECT USING (
    EXISTS (SELECT 1 FROM rooms JOIN properties ON rooms.property_id = properties.id WHERE rooms.id = beds.room_id AND (properties.listing_status = 'published' OR properties.owner_id = auth.uid()))
);
CREATE POLICY "Owners can insert beds for own properties" ON beds FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND is_owner_of(property_id))
);
CREATE POLICY "Owners can update beds for own properties" ON beds FOR UPDATE USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND is_owner_of(property_id))
);
CREATE POLICY "Owners can delete beds for own properties" ON beds FOR DELETE USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND is_owner_of(property_id))
);

-- property_images
CREATE POLICY "Images viewable if property is published" ON property_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_images.property_id AND (listing_status = 'published' OR owner_id = auth.uid()))
);
CREATE POLICY "Owners can insert images for own properties" ON property_images FOR INSERT WITH CHECK (is_owner_of(property_id));
CREATE POLICY "Owners can update images for own properties" ON property_images FOR UPDATE USING (is_owner_of(property_id));
CREATE POLICY "Owners can delete images for own properties" ON property_images FOR DELETE USING (is_owner_of(property_id));

-- location_verified_photos
CREATE POLICY "Location photos viewable if property is published" ON location_verified_photos FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE id = location_verified_photos.property_id AND (listing_status = 'published' OR owner_id = auth.uid()))
);
CREATE POLICY "Owners can insert location photos for own properties" ON location_verified_photos FOR INSERT WITH CHECK (is_owner_of(property_id));
CREATE POLICY "Owners can update location photos for own properties" ON location_verified_photos FOR UPDATE USING (is_owner_of(property_id));
CREATE POLICY "Owners can delete location photos for own properties" ON location_verified_photos FOR DELETE USING (is_owner_of(property_id));

-- verification_records
CREATE POLICY "Verification records viewable if property is published" ON verification_records FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE id = verification_records.property_id AND (listing_status = 'published' OR owner_id = auth.uid()))
);

-- visit_requests
CREATE POLICY "Students can view own requests" ON visit_requests FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Owners can view requests for own properties" ON visit_requests FOR SELECT USING (is_owner_of(property_id));
CREATE POLICY "Students can create requests" ON visit_requests FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Participants can update requests" ON visit_requests FOR UPDATE USING (student_id = auth.uid() OR is_owner_of(property_id));

-- stay_records
CREATE POLICY "Students can view own stays" ON stay_records FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Owners can view stays for own properties" ON stay_records FOR SELECT USING (is_owner_of(property_id));
CREATE POLICY "Owners can insert stays for own properties" ON stay_records FOR INSERT WITH CHECK (is_owner_of(property_id));
CREATE POLICY "Owners can update stays for own properties" ON stay_records FOR UPDATE USING (is_owner_of(property_id));

-- enquiries
CREATE POLICY "Students can view own enquiries" ON enquiries FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Owners can view enquiries for own properties" ON enquiries FOR SELECT USING (is_owner_of(property_id));
CREATE POLICY "Students can insert enquiries" ON enquiries FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Participants can update enquiries" ON enquiries FOR UPDATE USING (student_id = auth.uid() OR is_owner_of(property_id));

-- saved_properties
CREATE POLICY "Students can manage own saved properties" ON saved_properties FOR ALL USING (student_id = auth.uid());

-- saved_food_providers
CREATE POLICY "Students can manage own saved food providers" ON saved_food_providers FOR ALL USING (student_id = auth.uid());

-- reviews
CREATE POLICY "Published reviews viewable by everyone" ON reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Students can view own reviews" ON reviews FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert reviews" ON reviews FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own reviews" ON reviews FOR UPDATE USING (student_id = auth.uid());

-- review_responses
CREATE POLICY "Review responses viewable by everyone" ON review_responses FOR SELECT USING (
    EXISTS (SELECT 1 FROM reviews WHERE id = review_responses.review_id AND status = 'published')
);
CREATE POLICY "Owners can insert responses to own property reviews" ON review_responses FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own responses" ON review_responses FOR UPDATE USING (owner_id = auth.uid());

-- review_reports
CREATE POLICY "Users can manage own reports" ON review_reports FOR ALL USING (reporter_id = auth.uid());

-- listing_reports
CREATE POLICY "Users can manage own listing reports" ON listing_reports FOR ALL USING (reporter_id = auth.uid());

-- food_providers
CREATE POLICY "Published food providers viewable by everyone" ON food_providers FOR SELECT USING (listing_status = 'published');
CREATE POLICY "Owners can view own food providers" ON food_providers FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owners can insert own food providers" ON food_providers FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own food providers" ON food_providers FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete own food providers" ON food_providers FOR DELETE USING (owner_id = auth.uid());

-- food_menu_items
CREATE POLICY "Menu items viewable if food provider is published" ON food_menu_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM food_providers WHERE id = food_menu_items.food_provider_id AND (listing_status = 'published' OR owner_id = auth.uid()))
);
CREATE POLICY "Owners can insert menu items for own food providers" ON food_menu_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM food_providers WHERE id = food_provider_id AND owner_id = auth.uid())
);
CREATE POLICY "Owners can update menu items for own food providers" ON food_menu_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM food_providers WHERE id = food_provider_id AND owner_id = auth.uid())
);
CREATE POLICY "Owners can delete menu items for own food providers" ON food_menu_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM food_providers WHERE id = food_provider_id AND owner_id = auth.uid())
);

-- food_reviews
CREATE POLICY "Published food reviews viewable by everyone" ON food_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Students can view own food reviews" ON food_reviews FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can insert food reviews" ON food_reviews FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own food reviews" ON food_reviews FOR UPDATE USING (student_id = auth.uid());

-- payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (user_id = auth.uid());

-- notifications
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- audit_logs
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (is_admin());

-- app_settings
CREATE POLICY "Settings viewable by everyone" ON app_settings FOR SELECT USING (true);

-- Admin Override Policies (Give admins full access)
DO $$ 
DECLARE
    t_name text;
BEGIN
    FOR t_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('CREATE POLICY "Admins have full access on %I" ON %I FOR ALL USING (is_admin())', t_name, t_name);
    END LOOP;
END $$;
