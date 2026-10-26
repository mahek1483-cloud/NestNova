CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

CREATE TYPE user_role AS ENUM ('student','owner','admin');
CREATE TYPE listing_status AS ENUM ('draft','pending','published','rejected');
CREATE TYPE verification_status AS ENUM ('unverified','pending','approved','verified','rejected');
CREATE TYPE photo_status AS ENUM ('normal','pending','approved','rejected');
CREATE TYPE visit_status AS ENUM ('pending','requested','confirmed','completed','cancelled');
CREATE TYPE bed_status AS ENUM ('available','occupied','reserved');
CREATE TYPE owner_status AS ENUM ('unverified','pending','approved','verified','rejected');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_owner_of(property_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.properties
    WHERE id = property_uuid
    AND owner_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_verification_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status AND NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can change verification status';
  END IF;
  RETURN NEW;
END;
$$;






