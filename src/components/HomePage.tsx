// src/components/HomePage.tsx
import React from "react";

type HomePageProps = {
  onGoTalents: () => void;
  onGoAnnouncements: () => void;
  onGoHonors: () => void;

  showMyPageButton?: boolean;
  onGoMyPage?: () => void;
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

/* =========================
   3D Icon
========================= */
function Icon3D({
  emoji,
  tone = "teal",
}: {
  emoji: string;
  tone?: "amber" | "cyan" | "rose" | "teal";
}) {
  const toneMap: Record<string, string> = {
    amber:
      "from-amber-200/70 via-amber-100/50 to-orange-200/70 ring-amber-300/50 shadow-amber-300/30",
    cyan:
      "from-cyan-200/70 via-sky-100/50 to-blue-200/70 ring-cyan-300/50 shadow-cyan-300/30",
    rose:
      "from-rose-200/70 via-pink-100/50 to-fuchsia-200/70 ring-rose-300/50 shadow-rose-300/30",
    teal:
      "from-teal-200/70 via-emerald-100/50 to-cyan-200/70 ring-teal-300/50 shadow-teal-300/30",
  };

  return (
    <div
      className={cn(
        "relative w-16 h-16 md:w-20 md:h-20 rounded-3xl",
        "bg-white/75 backdrop-blur-md",
        "ring-1 shadow-xl flex items-center justify-center",
        toneMap[tone]
      )}
    >
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/70 blur-[1px]" />
      <span className="text-3xl md:text-4xl drop-shadow">{emoji}</span>
    </div>
  );
}

/* =========================
   Action Card
========================= */
function ActionCard({
  title,
  subtitle,
  emoji,
  tone,
  onClick,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  tone: "amber" | "cyan" | "rose" | "teal";
  onClick: () => void;
}) {
  const bgMap: Record<string, string> = {
    amber:
      "bg-gradient-to-br from-amber-100/80 via-white/60 to-orange-100/80 border-amber-300/50",
    cyan:
      "bg-gradient-to-br from-cyan-100/80 via-white/60 to-blue-100/80 border-cyan-300/50",
    rose:
      "bg-gradient-to-br from-rose-100/80 via-white/60 to-pink-100/80 border-rose-300/50",
    teal:
      "bg-gradient-to-br from-teal-100/80 via-white/60 to-cyan-100/80 border-teal-300/50",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-[28px] border",
        "shadow-[0_14px_32px_-22px_rgba(2,6,23,0.35)]",
        "transition-all duration-300 active:scale-[0.99]",
        "hover:shadow-[0_18px_40px_-24px_rgba(2,6,23,0.45)]",
        bgMap[tone]
      )}
    >
      <div className="absolute inset-0 bg-white/15 pointer-events-none" />

      <div className="relative p-5 md:p-6 flex flex-col items-center text-center gap-3">
        <div className="transition-transform duration-300 group-hover:scale-[1.05]">
          <Icon3D emoji={emoji} tone={tone} />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
            {title}
          </h3>
          <p className="text-sm md:text-[15px] text-slate-700 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="absolute -bottom-14 left-10 w-56 h-56 rounded-full bg-white/18 blur-3xl pointer-events-none" />
    </button>
  );
}

/* =========================
   Home Page
========================= */
export default function HomePage({
  onGoTalents,
  onGoAnnouncements,
  onGoHonors,
  showMyPageButton = false,
  onGoMyPage,
}: HomePageProps) {
  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          مرحباً بك في كنوز قطر
        </h1>
        <p className="text-slate-700 text-base md:text-lg">
          اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <ActionCard
            title="اكتشف موهبتك"
            subtitle="سجل موهبتك وابدأ رحلتك"
            emoji="✨"
            tone="amber"
            onClick={onGoTalents}
          />
          <ActionCard
            title="الإعلانات"
            subtitle="تابع الأخبار والتحديثات"
            emoji="📣"
            tone="cyan"
            onClick={onGoAnnouncements}
          />
          <ActionCard
            title="التكريمات"
            subtitle="إنجازات ونجاحات الطلاب"
            emoji="🏆"
            tone="rose"
            onClick={onGoHonors}
          />
        </div>

        {/* صفحتي */}
        {showMyPageButton && onGoMyPage && (
          <div className="mt-5 max-w-3xl mx-auto">
            <ActionCard
              title="صفحتي"
              subtitle="عرض وتحديث بياناتي ومواهبي"
              emoji="📄"
              tone="teal"
              onClick={onGoMyPage}
            />
          </div>
        )}

        {/* Banner الهادي */}
        <div className="mt-6 rounded-3xl p-6 border border-teal-200/50 bg-gradient-to-r from-teal-100/80 to-cyan-100/80 shadow-[0_14px_34px_-22px_rgba(2,6,23,0.35)]">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-extrabold text-teal-900 mb-2">
              ابدأ رحلتك الآن
            </h3>
            <p className="text-teal-800/80 font-medium">
              استخدم الشريط السفلي للتنقل بين الأقسام
            </p>
          </div>

          <div className="flex justify-center items-center gap-3 mt-4 text-teal-700">
            <span className="text-2xl">←</span>
            <span className="font-bold">اضغط على الأيقونات بالأسفل</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
