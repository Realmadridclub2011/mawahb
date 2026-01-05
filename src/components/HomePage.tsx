// src/components/HomePage.tsx
import React from "react";

type HomePageProps = {
  onGoTalents: () => void;
  onGoAnnouncements: () => void;
  onGoHonors: () => void;

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

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* اكتشف موهبتك */}
          <button
            onClick={onGoTalents}
            className="group ui-card ui-card-hover ui-card-amber overflow-hidden h-32 md:h-40 active:scale-[0.99]"
          >
            <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center">
              <IconBadge
                emoji="✨"
                glowClass="bg-amber-500/25"
                ringFrom="from-amber-400"
                ringTo="to-orange-500"
              />
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1 mt-3">
                اكتشف موهبتك
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                سجل موهبتك وابدأ رحلتك
              </p>
            </div>
          </button>

          {/* الإعلانات */}
          <button
            onClick={onGoAnnouncements}
            className="group ui-card ui-card-hover ui-card-cyan overflow-hidden h-32 md:h-40 active:scale-[0.99]"
          >
            <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center">
              <IconBadge
                emoji="📣"
                glowClass="bg-cyan-500/25"
                ringFrom="from-cyan-400"
                ringTo="to-blue-500"
              />
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1 mt-3">
                الإعلانات
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                تابع الأخبار والتحديثات
              </p>
            </div>
          </button>

          {/* التكريمات */}
          <button
            onClick={onGoHonors}
            className="group ui-card ui-card-hover ui-card-rose overflow-hidden h-32 md:h-40 active:scale-[0.99]"
          >
            <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center">
              <IconBadge
                emoji="🏆"
                glowClass="bg-rose-500/25"
                ringFrom="from-rose-400"
                ringTo="to-pink-500"
              />
              <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-1 mt-3">
                التكريمات
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                إنجازات ونجاحات الطلاب
              </p>
            </div>
          </button>
        </div>

        {/* صفحتي */}
        {showMyPageButton && onGoMyPage && (
          <div className="mt-5">
            <button
              onClick={onGoMyPage}
              className="group ui-card ui-card-hover ui-card-teal overflow-hidden w-full h-28 md:h-32 active:scale-[0.99]"
            >
              <div className="h-full p-5 md:p-6 flex items-center justify-center gap-4 text-center">
                <IconBadge
                  emoji="🧾"
                  glowClass="bg-emerald-500/25"
                  ringFrom="from-teal-400"
                  ringTo="to-emerald-500"
                  size="md"
                />
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

        {/* البانر */}
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

/** نفس فكرة الأيقونة الحديثة (Glass + Glow) */
function IconBadge({
  emoji,
  glowClass,
  ringFrom,
  ringTo,
  size = "lg",
}: {
  emoji: string;
  glowClass: string;
  ringFrom: string;
  ringTo: string;
  size?: "lg" | "md";
}) {
  const outer = size === "lg" ? "w-16 h-16 md:w-[72px] md:h-[72px]" : "w-14 h-14 md:w-16 md:h-16";
  const inner = size === "lg" ? "w-[54px] h-[54px] md:w-[62px] md:h-[62px]" : "w-12 h-12 md:w-[54px] md:h-[54px]";
  const emojiSize = size === "lg" ? "text-2xl md:text-[28px]" : "text-xl md:text-2xl";

  return (
    <div className={`relative ${outer} mx-auto`}>
      {/* glow */}
      <div
        className={`absolute -inset-2 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${glowClass}`}
      />
      {/* ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${ringFrom} ${ringTo} shadow-lg`}
      />
      {/* glass */}
      <div className={`absolute inset-[6px] rounded-full bg-white/75 backdrop-blur-md shadow-inner`} />
      {/* shine */}
      <div className="absolute left-3 top-2 w-6 h-6 rounded-full bg-white/70 blur-[1px] opacity-90" />

      <div className={`relative ${inner} mx-auto rounded-full flex items-center justify-center`}>
        <span className={`${emojiSize} drop-shadow-sm`}>{emoji}</span>
      </div>
    </div>
  );
}
