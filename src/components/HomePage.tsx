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

function Icon3D({
  emoji,
  tone = "teal",
}: {
  emoji: string;
  tone?: "amber" | "cyan" | "rose" | "teal";
}) {
  const toneMap: Record<string, string> = {
    amber:
      "from-amber-100 via-amber-50 to-orange-100 ring-amber-200/70 shadow-amber-200/60",
    cyan:
      "from-cyan-100 via-sky-50 to-blue-100 ring-cyan-200/70 shadow-cyan-200/60",
    rose:
      "from-rose-100 via-pink-50 to-fuchsia-100 ring-rose-200/70 shadow-rose-200/60",
    teal:
      "from-teal-100 via-emerald-50 to-cyan-100 ring-teal-200/70 shadow-teal-200/60",
  };

  return (
    <div
      className={cn(
        "relative w-16 h-16 md:w-20 md:h-20 rounded-3xl",
        "bg-white/65 backdrop-blur-md",
        "ring-1 shadow-xl flex items-center justify-center",
        toneMap[tone]
      )}
    >
      {/* لمعان خفيف */}
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/70 blur-[1px]" />
      <span className="text-3xl md:text-4xl drop-shadow">{emoji}</span>
    </div>
  );
}

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
    amber: "bg-gradient-to-br from-amber-50/90 via-white/70 to-orange-50/90 border-amber-200/70",
    cyan: "bg-gradient-to-br from-cyan-50/90 via-white/70 to-blue-50/90 border-cyan-200/70",
    rose: "bg-gradient-to-br from-rose-50/90 via-white/70 to-pink-50/90 border-rose-200/70",
    teal: "bg-gradient-to-br from-teal-50/90 via-white/70 to-cyan-50/90 border-teal-200/70",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-[28px] border",
        "shadow-[0_18px_45px_-30px_rgba(0,0,0,0.35)]",
        "transition-all duration-300 active:scale-[0.99]",
        "hover:shadow-[0_22px_55px_-32px_rgba(0,0,0,0.45)]",
        bgMap[tone]
      )}
    >
      {/* طبقة شفافة حلوة */}
      <div className="absolute inset-0 bg-white/25 pointer-events-none" />
      <div className="relative p-5 md:p-6 flex flex-col items-center text-center gap-3">
        <div className="transition-transform duration-300 group-hover:scale-[1.06]">
          <Icon3D emoji={emoji} tone={tone} />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-extrabold text-slate-800">
            {title}
          </h3>
          <p className="text-sm md:text-[15px] text-slate-600 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* لمعة من تحت زي الصورة التانية */}
      <div className="absolute -bottom-10 left-10 w-56 h-56 rounded-full bg-white/25 blur-3xl pointer-events-none" />
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
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-800 mb-2 tracking-tight">
          مرحباً بك في كنوز قطر
        </h1>
        <p className="text-slate-700 text-base md:text-lg">
          اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ✅ 3 بطاقات مرتبة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <ActionCard
            title="التكريمات"
            subtitle="إنجازات ونجاحات الطلاب"
            emoji="🏆"
            tone="rose"
            onClick={onGoHonors}
          />
          <ActionCard
            title="الإعلانات"
            subtitle="تابع الأخبار والتحديثات"
            emoji="📣"
            tone="cyan"
            onClick={onGoAnnouncements}
          />
          <ActionCard
            title="اكتشف موهبتك"
            subtitle="سجل موهبتك وابدأ رحلتك"
            emoji="✨"
            tone="amber"
            onClick={onGoTalents}
          />
        </div>

        {/* ✅ صفحتي: تتوسّط صح + نفس الستايل */}
        {showMyPageButton && onGoMyPage && (
          <div className="mt-5">
            <div className="max-w-3xl mx-auto">
              <ActionCard
                title="صفحتي"
                subtitle="عرض وتحديث بياناتي ومواهبي"
                emoji="📄"
                tone="teal"
                onClick={onGoMyPage}
              />
            </div>
          </div>
        )}

        {/* Banner */}
        <div className="mt-6 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-3xl p-6 shadow-2xl max-w-6xl mx-auto">
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
