-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  extracted_role user_role;
  extracted_name text;
BEGIN
  -- Extract role from metadata, default to 'student'
  extracted_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'::user_role);
  extracted_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown');
  
  -- Prevent admin role via public signup
  IF extracted_role = 'admin' THEN
    extracted_role := 'student';
  END IF;

  INSERT INTO public.profiles (id, full_name, role, is_demo)
  VALUES (NEW.id, extracted_name, extracted_role, false);

  IF extracted_role = 'owner' THEN
    INSERT INTO public.owner_profiles (id, owner_status, is_demo)
    VALUES (NEW.id, 'pending', false);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
