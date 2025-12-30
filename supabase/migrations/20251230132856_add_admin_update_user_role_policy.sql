/*
  # Add Admin Permission to Update User Roles

  1. Changes
    - Add RLS policy to allow admins to update user roles
    - Ensure only admins can change user roles for security

  2. Security
    - Only users with role='admin' can update other users' roles
    - Prevents unauthorized role escalation
*/

-- Drop existing policy if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Admins can update user roles'
  ) THEN
    DROP POLICY "Admins can update user roles" ON users;
  END IF;
END $$;

-- Allow admins to update user roles
CREATE POLICY "Admins can update user roles"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );