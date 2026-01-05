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
    <div className="min-h-[calc(100vh-140px)] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-3">
            مرحباً بك في كنوز قطر
          </h1>
          <p className="text-gray-600 text-lg">
            اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
          </p>

          {/* ✅ زر صفحتي (لو مسجل دخول) */}
          {showMyPageButton && onGoMyPage && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={onGoMyPage}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                <FileText className="w-5 h-5" />
                صفحتي
              </button>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={onGoHonors}
            className="group bg-white/80 backdrop-blur rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition text-right"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
              التكريمات
            </h3>
            <p className="text-gray-600 text-sm text-center">إنجازات مدرستنا</p>
          </button>

          <button
            onClick={onGoAnnouncements}
            className="group bg-white/80 backdrop-blur rounded-2xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition text-right"
          >
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
              الإعلانات
            </h3>
            <p className="text-gray-600 text-sm text-center">تابع الأخبار</p>
          </button>

          <button
            onClick={onGoTalents}
            className="group bg-white/80 backdrop-blur rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition text-right"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
              اكتشف موهبتك
            </h3>
            <p className="text-gray-600 text-sm text-center">سجل موهبتك الآن</p>
          </button>
        </div>

        {/* Banner */}
        <div className="bg-teal-600 text-white rounded-2xl p-6 shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">ابدأ رحلتك الآن</h2>
          <p className="text-teal-50 mb-3">
            استخدم الشريط السفلي للتنقل بين الأقسام
          </p>
          <div className="flex justify-center gap-4 text-teal-100">
            <span>→</span>
            <span>اضغط على الأيقونات بالأسفل</span>
            <span>←</span>
          </div>
        </div>
      </div>
    </div>
  );
}
