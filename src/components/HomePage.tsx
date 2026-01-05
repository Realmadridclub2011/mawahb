// src/components/HomePage.tsx
import React from "react";
import { Trophy, Send, Star, FileText } from "lucide-react";

type HomePageProps = {
  onGoTalents: () => void;
  onGoAnnouncements: () => void;
  onGoHonors: () => void;

  // ✅ يظهر فقط لو المستخدم مسجل دخول
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-700 mb-2 tracking-tight">
          مرحباً بك في كنوز قطر
        </h1>
        <p className="text-gray-700 text-base md:text-lg">
          اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
        </p>
      </div>

      {/* ✅ 3 كروت نفس اللي قبل (ui-card) */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* اكتشف موهبتك */}
          <button
            onClick={onGoTalents}
            className="group ui-card ui-card-hover ui-card-amber overflow-hidden h-32 md:h-40 active:scale-[0.99]"
          >
            <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1">
                اكتشف موهبتك
              </h3>
              <p className="text-sm text-gray-600 font-medium">سجل موهبتك وابدأ رحلتك</p>
            </div>
          </button>

          {/* الإعلانات */}
          <button
            onClick={onGoAnnouncements}
            className="group ui-card ui-card-hover ui-card-cyan overflow-hidden h-32 md:h-40 active:scale-[0.99]"
          >
            <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <Send className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1">
                الإعلانات
              </h3>
              <p className="text-sm text-gray-600 font-medium">تابع الأخبار والتحديثات</p>
            </div>
          </button>

          {/* التكريمات */}
          <button
            onClick={onGoHonors}
            className="group ui-card ui-card-hover ui-card-rose overflow-hidden h-32 md:h-40 active:scale-[0.99]"
          >
            <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1">
                التكريمات
              </h3>
              <p className="text-sm text-gray-600 font-medium">إنجازات ونجاحات الطلاب</p>
            </div>
          </button>
        </div>

        {/* ✅ كارت صفحتي (نفس الثيم) */}
        {showMyPageButton && onGoMyPage && (
          <div className="mt-5">
            <button
              onClick={onGoMyPage}
              className="group ui-card ui-card-hover ui-card-teal overflow-hidden w-full h-28 md:h-32 active:scale-[0.99]"
            >
              <div className="h-full p-5 md:p-6 flex items-center justify-center gap-4 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1">
                    صفحتي
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    عرض وتحديث بياناتي ومواهبي
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* نفس البانر القديم */}
        <div className="mt-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-3xl p-6 shadow-2xl max-w-5xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-extrabold mb-2">
              ابدأ رحلتك الآن
            </h3>
            <p className="text-teal-50 font-medium">
              استخدم الشريط السفلي للتنقل بين الأقسام
            </p>
          </div>
          <div className="flex justify-center items-center gap-3 mt-4 text-teal-100">
            <span className="text-2xl">←</span>
            <span className="font-bold">اضغط على الأيقونات بالأسفل</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
