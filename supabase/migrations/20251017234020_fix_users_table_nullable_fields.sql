/*
  # Fix users table nullable fields

  1. Changes
    - Make full_name nullable with default empty string
    - Ensure trigger can create user without full_name
  
  2. Security
    - No changes to RLS policies
*/

-- Make full_name nullable and add default
ALTER TABLE public.users 
ALTER COLUMN full_name DROP NOT NULL,
ALTER COLUMN full_name SET DEFAULT '';

-- Update trigger function to use empty string for full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, created_at)
  VALUES (NEW.id, NEW.email, '', 'student', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;