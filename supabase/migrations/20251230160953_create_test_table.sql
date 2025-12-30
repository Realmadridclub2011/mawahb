/*
  # إنشاء جدول اختبار
  
  1. جدول جديد
    - `test_table`
      - `id` (uuid, مفتاح أساسي)
      - `name` (text)
      - `created_at` (timestamp)
  
  2. الأمان
    - تفعيل RLS على الجدول
    - سياسة للسماح للجميع بالقراءة (للاختبار فقط)
*/

-- إنشاء الجدول
CREATE TABLE IF NOT EXISTS test_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- تفعيل Row Level Security
ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة (للاختبار)
CREATE POLICY "Allow public read access"
  ON test_table
  FOR SELECT
  TO authenticated
  USING (true);

-- إضافة بعض البيانات التجريبية
INSERT INTO test_table (name) VALUES ('اختبار 1');
INSERT INTO test_table (name) VALUES ('اختبار 2');