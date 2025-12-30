/*
  # إضافة سياسة للأدمن لمشاهدة جميع الإعلانات
  
  1. التغييرات
    - إضافة سياسة جديدة للأدمن لمشاهدة جميع الإعلانات (المنشورة وغير المنشورة)
    - إضافة نفس السياسة لجدول التكريمات
  
  2. الأمان
    - السياسة تسمح فقط للمستخدمين الذين لديهم دور "admin"
    - المستخدمون العاديون يمكنهم فقط مشاهدة الإعلانات المنشورة
*/

-- سياسة للأدمن لمشاهدة جميع الإعلانات
CREATE POLICY "Admins can view all announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- سياسة للأدمن لمشاهدة جميع التكريمات
CREATE POLICY "Admins can view all honors"
  ON honors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );