/*
  # إضافة جداول الإعلانات والمسابقات والتكريمات

  ## الجداول الجديدة
  
  1. **announcements** - جدول الإعلانات والمسابقات
     - `id` (uuid, primary key)
     - `title` (text) - عنوان الإعلان
     - `description` (text) - وصف الإعلان
     - `type` (text) - نوع الإعلان (announcement, competition)
     - `image_url` (text, optional) - رابط الصورة
     - `registration_open` (boolean) - هل التسجيل مفتوح
     - `start_date` (timestamptz, optional) - تاريخ البداية
     - `end_date` (timestamptz, optional) - تاريخ النهاية
     - `created_by_admin_id` (uuid, foreign key to users)
     - `created_at` (timestamptz)
     - `is_published` (boolean) - هل منشور

  2. **announcement_registrations** - تسجيلات الطلاب في المسابقات
     - `id` (uuid, primary key)
     - `announcement_id` (uuid, foreign key to announcements)
     - `student_id` (uuid, foreign key to users)
     - `notes` (text, optional) - ملاحظات الطالب
     - `status` (text) - حالة التسجيل (pending, approved, rejected)
     - `created_at` (timestamptz)

  3. **honors** - جدول التكريمات
     - `id` (uuid, primary key)
     - `title` (text) - عنوان التكريم
     - `description` (text) - وصف التكريم
     - `media_type` (text) - نوع الميديا (image, video)
     - `media_url` (text) - رابط الصورة أو الفيديو
     - `honor_date` (date) - تاريخ التكريم
     - `created_by_admin_id` (uuid, foreign key to users)
     - `created_at` (timestamptz)
     - `is_published` (boolean) - هل منشور

  ## الأمان
  - تفعيل RLS على جميع الجداول
  - سياسات القراءة للجميع (منشور فقط)
  - سياسات الكتابة للإداريين فقط
*/

-- جدول الإعلانات والمسابقات
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('announcement', 'competition')),
  image_url text,
  registration_open boolean DEFAULT false,
  start_date timestamptz,
  end_date timestamptz,
  created_by_admin_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT true
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- الجميع يمكنهم قراءة الإعلانات المنشورة
CREATE POLICY "Anyone can view published announcements"
  ON announcements FOR SELECT
  USING (is_published = true);

-- الإداريون فقط يمكنهم إضافة إعلانات
CREATE POLICY "Admins can insert announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- الإداريون فقط يمكنهم تعديل إعلاناتهم
CREATE POLICY "Admins can update own announcements"
  ON announcements FOR UPDATE
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

-- الإداريون فقط يمكنهم حذف إعلانات
CREATE POLICY "Admins can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- جدول تسجيلات المسابقات
CREATE TABLE IF NOT EXISTS announcement_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id),
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(announcement_id, student_id)
);

ALTER TABLE announcement_registrations ENABLE ROW LEVEL SECURITY;

-- الطلاب يمكنهم قراءة تسجيلاتهم فقط
CREATE POLICY "Students can view own registrations"
  ON announcement_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- المعلمون والإداريون يمكنهم قراءة جميع التسجيلات
CREATE POLICY "Teachers and admins can view all registrations"
  ON announcement_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('teacher', 'admin')
    )
  );

-- الطلاب يمكنهم التسجيل
CREATE POLICY "Students can register"
  ON announcement_registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('student', 'guardian')
    )
  );

-- الإداريون يمكنهم تحديث حالة التسجيل
CREATE POLICY "Admins can update registration status"
  ON announcement_registrations FOR UPDATE
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

-- جدول التكريمات
CREATE TABLE IF NOT EXISTS honors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL,
  honor_date date DEFAULT CURRENT_DATE,
  created_by_admin_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT true
);

ALTER TABLE honors ENABLE ROW LEVEL SECURITY;

-- الجميع يمكنهم قراءة التكريمات المنشورة
CREATE POLICY "Anyone can view published honors"
  ON honors FOR SELECT
  USING (is_published = true);

-- الإداريون فقط يمكنهم إضافة تكريمات
CREATE POLICY "Admins can insert honors"
  ON honors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- الإداريون فقط يمكنهم تعديل تكريمات
CREATE POLICY "Admins can update honors"
  ON honors FOR UPDATE
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

-- الإداريون فقط يمكنهم حذف تكريمات
CREATE POLICY "Admins can delete honors"
  ON honors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- إضافة بيانات تجريبية
INSERT INTO announcements (title, description, type, image_url, registration_open, start_date, end_date, is_published) VALUES
('مسابقة الفروسية', 'مسابقة الفروسية السنوية للطلاب المتميزين في رياضة الفروسية', 'competition', 'https://images.pexels.com/photos/3608056/pexels-photo-3608056.jpeg', true, now(), now() + interval '30 days', true),
('مسابقة المحدث الصغير', 'مسابقة المحدث الصغير لحفظ الأحاديث النبوية الشريفة', 'competition', 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg', true, now(), now() + interval '45 days', true),
('معرض المواهب السنوي', 'ندعوكم لحضور معرض المواهب السنوي يوم الخميس القادم', 'announcement', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', false, now() + interval '7 days', null, true);

INSERT INTO honors (title, description, media_type, media_url, honor_date, is_published) VALUES
('الفوز بالمركز الأول في مسابقة الرياضيات', 'تهانينا لطلابنا المتميزين على الفوز بالمركز الأول في مسابقة الرياضيات على مستوى المنطقة', 'image', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg', CURRENT_DATE - interval '10 days', true),
('تكريم الطلاب المتفوقين', 'حفل تكريم الطلاب المتفوقين لهذا العام الدراسي', 'image', 'https://images.pexels.com/photos/5940831/pexels-photo-5940831.jpeg', CURRENT_DATE - interval '5 days', true);
