/*
  # Add Admin Management Features

  1. Changes to Tables
    - Add `image_url` column to `announcements` table for announcement images
    - Add `image_url` and `video_url` columns to `honors` table if not exists
    
  2. New Tables
    - `app_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - setting key name
      - `value` (text) - setting value
      - `description` (text) - setting description
      - `updated_at` (timestamptz)
      - `updated_by` (uuid) - reference to users table
  
  3. Security
    - Enable RLS on `app_settings` table
    - Add policies for admin-only access to app_settings
    - Update policies for announcements and honors to allow admin full control
*/

-- Add image_url to announcements if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'announcements' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE announcements ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Add image_url and video_url to honors if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'honors' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE honors ADD COLUMN image_url TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'honors' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE honors ADD COLUMN video_url TEXT;
  END IF;
END $$;

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policies for app_settings (admin only)
CREATE POLICY "Admins can view app settings"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert app settings"
  ON app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update app settings"
  ON app_settings
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

CREATE POLICY "Admins can delete app settings"
  ON app_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update announcements policies to allow admin full control
DROP POLICY IF EXISTS "Admins can insert announcements" ON announcements;
CREATE POLICY "Admins can insert announcements"
  ON announcements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update announcements" ON announcements;
CREATE POLICY "Admins can update announcements"
  ON announcements
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

DROP POLICY IF EXISTS "Admins can delete announcements" ON announcements;
CREATE POLICY "Admins can delete announcements"
  ON announcements
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update honors policies to allow admin full control
DROP POLICY IF EXISTS "Admins can insert honors" ON honors;
CREATE POLICY "Admins can insert honors"
  ON honors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update honors" ON honors;
CREATE POLICY "Admins can update honors"
  ON honors
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

DROP POLICY IF EXISTS "Admins can delete honors" ON honors;
CREATE POLICY "Admins can delete honors"
  ON honors
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert default app settings
INSERT INTO app_settings (key, value, description) VALUES
  ('app_name', 'اكتشف موهبتك', 'اسم التطبيق'),
  ('app_description', 'منصة لاكتشاف وتطوير مواهب الطلاب', 'وصف التطبيق'),
  ('contact_email', 'info@school.edu.sa', 'البريد الإلكتروني للتواصل'),
  ('contact_phone', '0500000000', 'رقم الهاتف للتواصل')
ON CONFLICT (key) DO NOTHING;