import { useState, useEffect } from 'react';
import {
  Star,
  TrendingUp,
  Users,
  FileText,
  Dumbbell,
  Palette,
  BookOpen,
  Microscope,
  Cpu,
  Trophy,
  Megaphone,
  LogOut,
  Settings,
  Home,
  Calendar,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HeroCard, StatCard, CategoryCard } from './DashboardCards';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalTalents: 150,
    activeDays: 1,
    completionRate: 10
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#8D1B3D] hover:bg-rose-50 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">تسجيل خروج</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'student' ? 'طالب' :
                   user?.role === 'teacher' ? 'معلم' :
                   user?.role === 'guardian' ? 'ولي أمر' : 'مسؤول'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#8D1B3D] to-[#A52A4A] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {user?.full_name?.charAt(0) || 'م'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <HeroCard
            title="مرحباً بك في منصة مواهب"
            subtitle="تطبيق شامل للياقة البدنية - تمارين، تغذية، صحة"
            status="متقدم"
            icon={Star}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={TrendingUp}
            value={stats.totalTalents}
            label="نقاط محروقة"
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
          <StatCard
            icon={Calendar}
            value={stats.activeDays}
            label="أيام تمرين"
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
          <StatCard
            icon={Award}
            value={`${stats.completionRate}%`}
            label="نسبة الإنجاز"
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">الأقسام الرئيسية</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <CategoryCard
            icon={Dumbbell}
            title="التمارين"
            bgGradient="bg-gradient-to-br from-pink-100 to-pink-50"
            iconColor="text-pink-600"
          />
          <CategoryCard
            icon={Palette}
            title="التغذية"
            bgGradient="bg-gradient-to-br from-green-100 to-green-50"
            iconColor="text-green-600"
          />
          <CategoryCard
            icon={Calendar}
            title="الجداول"
            bgGradient="bg-gradient-to-br from-blue-100 to-blue-50"
            iconColor="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CategoryCard
            icon={Users}
            title="المدربون"
            bgGradient="bg-gradient-to-br from-amber-100 to-amber-50"
            iconColor="text-amber-600"
          />
          <CategoryCard
            icon={BookOpen}
            title="حاسبات"
            bgGradient="bg-gradient-to-br from-cyan-100 to-cyan-50"
            iconColor="text-cyan-600"
          />
          <CategoryCard
            icon={Trophy}
            title="الصحة"
            bgGradient="bg-gradient-to-br from-rose-100 to-rose-50"
            iconColor="text-rose-600"
          />
        </div>

        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <>
            <div className="mt-12 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">إدارة المنصة</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CategoryCard
                icon={FileText}
                title="إدارة المواهب"
                bgGradient="bg-gradient-to-br from-indigo-100 to-indigo-50"
                iconColor="text-indigo-600"
              />
              <CategoryCard
                icon={Megaphone}
                title="الإعلانات"
                bgGradient="bg-gradient-to-br from-violet-100 to-violet-50"
                iconColor="text-violet-600"
              />
              <CategoryCard
                icon={Settings}
                title="الإعدادات"
                bgGradient="bg-gradient-to-br from-slate-100 to-slate-50"
                iconColor="text-slate-600"
              />
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            منصة اكتشاف المواهب المدرسية © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
