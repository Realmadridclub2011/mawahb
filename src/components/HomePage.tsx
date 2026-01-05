import React from "react";
import { Trophy, Send, Star, FileText } from "lucide-react";

type HomePageProps = {
  onGoTalents: () => void;
  onGoAnnouncements: () => void;
  onGoHonors: () => void;

  // ✅ زر "صفحتي" يظهر فقط لو المستخدم مسجل دخول
  showMyPageButton?: boolean;
  onGoMyPage?: () => void;
};

export default function HomePage({
  onGoTalents,
  onGoAnnouncements,
  onGoHonors,
  showMyPageButton = false,
  onGoMyPage,
}: HomePageProps) {
  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2 drop-shadow-sm">
          مرحباً بك في كنوز قطر
        </h1>
        <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
          اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
        </p>

        {/* ✅ زر صفحتي (لو مسجل دخول) */}
        {showMyPageButton && onGoMyPage && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onGoMyPage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-white font-semibold shadow-md hover:shadow-lg transition bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 active:scale-[0.99]"
            >
              <FileText className="w-5 h-5" />
              صفحتي
            </button>
          </div>
        )}
      </div>

      {/* Cards (نفس كروت/ألوان app.tsx) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onGoTalents}
          className="ui-card ui-card-hover ui-card-amber"
        >
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-md">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-right">
              <div className="text-base font-bold mb-1">اكتشف موهبتك</div>
              <div className="text-xs text-gray-600">
                سجل موهبتك وابدأ رحلتك
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={onGoAnnouncements}
          className="ui-card ui-card-hover ui-card-cyan"
        >
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-400 flex items-center justify-center shadow-md">
              <Send className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-right">
              <div className="text-base font-bold mb-1">الإعلانات</div>
              <div className="text-xs text-gray-600">
                تابع الأخبار والتحديثات
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={onGoHonors}
          className="ui-card ui-card-hover ui-card-purple sm:col-span-2"
        >
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-md">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-right">
              <div className="text-base font-bold mb-1">التكريمات</div>
              <div className="text-xs text-gray-600">
                إنجازات مدرستنا ونجاحات الطلاب
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Banner (بنفس روح الواجهة) */}
      <div className="mt-4 ui-card ui-card-hover ui-card-emerald">
        <div className="text-center">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 mb-1">
            ابدأ رحلتك الآن
          </h2>
          <p className="text-sm text-gray-700">
            استخدم الشريط السفلي للتنقل بين الأقسام
          </p>
        </div>
      </div>
    </div>
  );
}
