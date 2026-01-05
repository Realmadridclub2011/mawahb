// src/components/HomePage.tsx
import React from "react";
import { Trophy, Send, Star, FileText } from "lucide-react";

type HomePageProps = {
  onGoTalents: () => void;
  onGoAnnouncements: () => void;
  onGoHonors: () => void;

  showMyPageButton?: boolean;
  onGoMyPage?: () => void;
};

function IconBubble({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: "amber" | "cyan" | "rose" | "teal";
}) {
  const toneClasses: Record<string, string> = {
    amber:
      "bg-amber-50/60 ring-1 ring-amber-200/70 shadow-[0_18px_50px_rgba(245,158,11,0.18)]",
    cyan: "bg-cyan-50/60 ring-1 ring-cyan-200/70 shadow-[0_18px_50px_rgba(34,211,238,0.18)]",
    rose: "bg-rose-50/60 ring-1 ring-rose-200/70 shadow-[0_18px_50px_rgba(244,63,94,0.18)]",
    teal: "bg-teal-50/60 ring-1 ring-teal-200/70 shadow-[0_18px_50px_rgba(20,184,166,0.18)]",
  };

  return (
    <div
      className={[
        "relative w-14 h-14 md:w-16 md:h-16 rounded-2xl",
        "flex items-center justify-center",
        "backdrop-blur-md",
        toneClasses[tone],
      ].join(" ")}
    >
      {/* highlight */}
      <span className="pointer-events-none absolute -top-1.5 -left-1.5 w-8 h-8 rounded-full bg-white/60 blur-[1px]" />
      {/* inner glass */}
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/70 ring-1 ring-white/60 shadow-inner flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function HomeCard({
  onClick,
  title,
  subtitle,
  tone,
  icon,
  cardClass,
}: {
  onClick: () => void;
  title: string;
  subtitle: string;
  tone: "amber" | "cyan" | "rose" | "teal";
  icon: React.ReactNode;
  cardClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group ui-card ui-card-hover overflow-hidden",
        "h-32 md:h-40 active:scale-[0.99]",
        "flex items-center justify-center text-center",
        cardClass,
      ].join(" ")}
    >
      <div className="h-full p-5 md:p-6 flex flex-col justify-center items-center text-center gap-2">
        <div className="group-hover:scale-[1.04] transition-transform duration-300">
          <IconBubble tone={tone}>{icon}</IconBubble>
        </div>

        <h3 className="text-lg md:text-xl font-extrabold text-gray-800">
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
      </div>
    </button>
  );
}

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
          <HomeCard
            onClick={onGoTalents}
            title="اكتشف موهبتك"
            subtitle="سجل موهبتك وابدأ رحلتك"
            tone="amber"
            cardClass="ui-card-amber"
            icon={<Star className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />}
          />

          {/* الإعلانات */}
          <HomeCard
            onClick={onGoAnnouncements}
            title="الإعلانات"
            subtitle="تابع الأخبار والتحديثات"
            tone="cyan"
            cardClass="ui-card-cyan"
            icon={<Send className="w-5 h-5 md:w-6 md:h-6 text-cyan-700" />}
          />

          {/* التكريمات */}
          <HomeCard
            onClick={onGoHonors}
            title="التكريمات"
            subtitle="إنجازات ونجاحات الطلاب"
            tone="rose"
            cardClass="ui-card-rose"
            icon={<Trophy className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />}
          />
        </div>

        {/* ✅ صفحتي نفس ستايل البطاقات (مفيش انحراف لليسار) */}
        {showMyPageButton && onGoMyPage && (
          <div className="mt-5">
            <button
              onClick={onGoMyPage}
              className="group ui-card ui-card-hover ui-card-teal overflow-hidden w-full h-28 md:h-32 active:scale-[0.99]"
            >
              <div className="h-full p-5 md:p-6 flex flex-col items-center justify-center text-center gap-2">
                <div className="group-hover:scale-[1.04] transition-transform duration-300">
                  <IconBubble tone="teal">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-teal-700" />
                  </IconBubble>
                </div>

                <h3 className="text-lg md:text-xl font-extrabold text-gray-800">
                  صفحتي
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  عرض وتحديث بياناتي ومواهبي
                </p>
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
