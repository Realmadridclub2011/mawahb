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
      "from-amber-200/90 via-amber-100/60 to-orange-200/80 ring-amber-300/60 shadow-amber-300/40",
    cyan:
      "from-cyan-200/90 via-sky-100/60 to-blue-200/80 ring-cyan-300/60 shadow-cyan-300/40",
    rose:
      "from-rose-200/90 via-pink-100/60 to-fuchsia-200/80 ring-rose-300/60 shadow-rose-300/40",
    teal:
      "from-teal-200/90 via-emerald-100/60 to-cyan-200/80 ring-teal-300/60 shadow-teal-300/40",
  };

  return (
    <div
      className={cn(
        "relative w-16 h-16 md:w-20 md:h-20 rounded-3xl",
        "bg-white/70 backdrop-blur-md",
        "ring-1 shadow-xl flex items-center justify-center",
        "shadow-[0_18px_40px_-26px_rgba(2,6,23,0.45)]",
        toneMap[tone]
      )}
    >
      {/* لمعان خفيف */}
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/70 blur-[1px]" />
      <span className="text-3xl md:text-4xl drop-shadow">{emoji}</span>
    </div>
  );
}

function Brand3DBadge() {
  return (
    <div className="relative w-11 h-11 rounded-2xl bg-white/65 backdrop-blur-md ring-1 ring-white/60 shadow-[0_18px_40px_-28px_rgba(2,6,23,0.55)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-200/60 via-white/20 to-cyan-200/60" />
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white/30 blur-2xl" />
      <div className="relative text-xl">🇶🇦</div>
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
  // ✅ تغميق بسيط + تمييز أفضل ع الموبايل
  const bgMap: Record<string, string> = {
    amber:
      "bg-gradient-to-br from-amber-100/85 via-white/60 to-orange-100/85 border-amber-300/60",
    cyan:
      "bg-gradient-to-br from-cyan-100/85 via-white/60 to-blue-100/85 border-cyan-300/60",
    rose:
      "bg-gradient-to-br from-rose-100/85 via-white/60 to-pink-100/85 border-rose-300/60",
    teal:
      "bg-gradient-to-br from-teal-100/85 via-white/60 to-cyan-100/85 border-teal-300/60",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-[28px] border",
        // ✅ كارت أوضح على الموبايل
        "shadow-[0_18px_45px_-32px_rgba(2,6,23,0.42)]",
        "transition-all duration-300 active:scale-[0.99]",
        "hover:shadow-[0_22px_55px_-34px_rgba(2,6,23,0.52)]",
        bgMap[tone]
      )}
    >
      {/* طبقة شفافة خفيفة */}
      <div className="absolute inset-0 bg-white/18 pointer-events-none" />

      <div className="relative p-5 md:p-6 flex flex-col items-center text-center gap-3">
        <div className="transition-transform duration-300 group-hover:scale-[1.06]">
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

      {/* لمعة من تحت */}
      <div className="absolute -bottom-12 left-10 w-56 h-56 rounded-full bg-white/18 blur-3xl pointer-events-none" />
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
      {/* ✅ Mini Top strip داخل الصفحة (اختياري) */}
      <div className="max-w-6xl mx-auto mb-5">
        <div className="rounded-3xl border border-slate-200/70 bg-white/55 backdrop-blur-md shadow-[0_18px_45px_-35px_rgba(2,6,23,0.45)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brand3DBadge />
            <div className="leading-tight">
              <div className="font-black text-slate-900">كنوز قطر</div>
              <div className="text-xs text-slate-600 font-semibold">
                منصة المواهب والمسابقات
              </div>
            </div>
          </div>

          <button
            onClick={() => onGoTalents()}
            className="hidden md:inline-flex items-center justify-center rounded-2xl px-4 py-2 font-extrabold text-teal-900 border border-teal-200/70 bg-gradient-to-r from-teal-100/90 to-cyan-100/90 hover:from-teal-200 hover:to-cyan-200 transition"
          >
            ابدأ الآن
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-900 mb-2 tracking-tight">
          مرحباً بك في كنوز قطر
        </h1>
        <p className="text-slate-700 text-base md:text-lg">
          اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* ✅ 3 بطاقات مرتبة: "اكتشف موهبتك" أول بطاقة من اليمين */}
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

        {/* ✅ صفحتي */}
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

        {/* ✅ Banner: أغمق بسيط + أقل “صرخة” + أنعم */}
        <div className="mt-6 rounded-3xl p-6 shadow-2xl max-w-6xl mx-auto overflow-hidden border border-teal-900/10 bg-gradient-to-r from-teal-800 to-emerald-800 text-white relative">
          <div className="absolute inset-0 opacity-[0.28] pointer-events-none bg-[radial-gradient(800px_300px_at_20%_0%,rgba(255,255,255,0.40),transparent_60%),radial-gradient(700px_280px_at_80%_20%,rgba(255,255,255,0.22),transparent_55%)]" />

          <div className="relative text-center">
            <h3 className="text-xl md:text-2xl font-extrabold mb-2">
              ابدأ رحلتك الآن
            </h3>
            <p className="text-teal-50/95 font-medium">
              استخدم الشريط السفلي للتنقل بين الأقسام
            </p>
          </div>

          <div className="relative flex justify-center items-center gap-3 mt-4 text-teal-100">
            <span className="text-2xl">←</span>
            <span className="font-bold">اضغط على الأيقونات بالأسفل</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
