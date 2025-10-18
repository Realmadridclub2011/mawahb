/*
  # Add trigger to create user profile on auth signup

  1. Changes
    - Create function to handle new user creation
    - Add trigger to automatically create user profile when auth.users entry is created
    - Remove password column from users table (no longer needed)
  
  2. Security
    - Function runs with security definer privileges
    - Automatically assigns 'student' role to new users
*/

-- Drop password column if it exists (not needed with Supabase Auth)
ALTER TABLE public.users DROP COLUMN IF EXISTS password;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at)
  VALUES (NEW.id, NEW.email, 'student', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on new auth user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();