/*
  # تحديث جداول المواهب بالحقول الإضافية المطلوبة

  1. التعديلات على الجداول
    - إضافة حقل `ord` لترتيب الأقسام والتخصصات
    - إضافة حقل `review_notes` لملاحظات المراجعة
    - إضافة قيد فريد لمنع التكرار في الطلبات
    - إضافة حقل `email` كبديل لتسجيل الدخول

  2. التحسينات
    - تحديث القيود والتحققات
    - إضافة فهارس للأداء
*/

-- إضافة حقل الترتيب للأقسام
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'talent_categories' AND column_name = 'ord'
  ) THEN
    ALTER TABLE talent_categories ADD COLUMN ord integer DEFAULT 0;
  END IF;
END $$;

-- إضافة حقل الترتيب للتخصصات
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'talent_subcategories' AND column_name = 'ord'
  ) THEN
    ALTER TABLE talent_subcategories ADD COLUMN ord integer DEFAULT 0;
  END IF;
END $$;

-- إضافة قيد فريد لمنع تكرار نفس الطلب أثناء pending
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_pending_talent'
  ) THEN
    CREATE UNIQUE INDEX unique_pending_talent 
    ON student_talents (student_id, category_id, subcategory_id) 
    WHERE status = 'pending';
  END IF;
END $$;

-- تحديث ترتيب الأقسام الموجودة
UPDATE talent_categories SET ord = 1 WHERE name_ar = 'رياضية';
UPDATE talent_categories SET ord = 2 WHERE name_ar = 'فنية';
UPDATE talent_categories SET ord = 3 WHERE name_ar = 'أدبية';
UPDATE talent_categories SET ord = 4 WHERE name_ar = 'علمية';
UPDATE talent_categories SET ord = 5 WHERE name_ar = 'تقنية';

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_student_talents_student ON student_talents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_talents_status ON student_talents(status);
CREATE INDEX IF NOT EXISTS idx_student_talents_category ON student_talents(category_id);
CREATE INDEX IF NOT EXISTS idx_teacher_notes_talent ON teacher_notes(student_talent_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_approved ON talent_subcategories(is_approved);
