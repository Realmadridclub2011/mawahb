// src/pages/HonorsPage.tsx
import React, { useEffect, useState } from "react";
import { ArrowRight, Trophy, Image as ImageIcon, PlayCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type HonorsPageProps = {
  onBackHome?: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Chip({
  tone = "amber",
  children,
}: {
  tone?: "amber" | "teal" | "slate";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    amber: "bg-amber-50 text-amber-800 border-amber-200/70",
    teal: "bg-teal-50 text-teal-800 border-teal-200/70",
    slate: "bg-slate-50 text-slate-700 border-slate-200/70",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold border",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

function MediaFrame({
  mediaType,
  mediaUrl,
  title,
}: {
  mediaType: "image" | "video";
  mediaUrl: string;
  title: string;
}) {
  if (mediaType === "video") {
    return (
      <div className="relative w-full aspect-[16/10] bg-black overflow-hidden">
        <iframe
          src={mediaUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden">
      <img src={mediaUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
    </div>
  );
}

export default function HonorsPage({ onBackHome }: HonorsPageProps) {
  const [honors, setHonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHonors = async () => {
      const { data } = await supabase
        .from("honors")
        .select("*")
        .eq("is_published", true)
        .order("honor_date", { ascending: false });

      setHonors(data || []);
      setLoading(false);
    };

    loadHonors();

    const channel = supabase
      .channel("honors-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "honors" }, () =>
        loadHonors()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10 md:py-12" dir="rtl">
      {/* رجوع */}
      <button
        onClick={() => (onBackHome ? onBackHome() : null)}
        className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md text-emerald-700
        hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600
        px-6 py-3 rounded-2xl font-extrabold mb-8 shadow-lg hover:shadow-xl transition-all
        border border-emerald-200/70"
      >
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      {/* عنوان */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-3">
          التكريمات
        </h1>
        <p className="text-base md:text-lg text-slate-600 font-semibold">
          إنجازاتنا وتكريماتنا
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {honors.map((honor) => {
          const isVideo = honor.media_type === "video";
          const dateStr = honor.honor_date
            ? new Date(honor.honor_date).toLocaleDateString("ar-SA")
            : "";

          return (
            <div
              key={honor.id}
              className={cn(
                "group overflow-hidden rounded-[26px] border bg-white/65 backdrop-blur-md",
                "shadow-[0_18px_45px_-30px_rgba(0,0,0,0.35)]",
                "transition-all duration-300 hover:shadow-[0_22px_55px_-32px_rgba(0,0,0,0.45)]",
                isVideo ? "border-cyan-200/70" : "border-amber-200/70"
              )}
            >
              {/* Media */}
              <div className="relative">
                <MediaFrame
                  mediaType={isVideo ? "video" : "image"}
                  mediaUrl={honor.media_url}
                  title={honor.title}
                />

                {/* badges فوق الصورة */}
                <div className="absolute top-3 right-3 flex flex-wrap gap-2">
                  <Chip tone={isVideo ? "teal" : "amber"}>
                    {isVideo ? (
                      <>
                        <PlayCircle className="w-4 h-4" /> فيديو
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" /> صورة
                      </>
                    )}
                  </Chip>

                  {dateStr && (
                    <Chip tone="slate">
                      <Trophy className="w-4 h-4" />
                      {dateStr}
                    </Chip>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 line-clamp-2">
                  {honor.title}
                </h3>
                <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed line-clamp-3">
                  {honor.description}
                </p>

                {/* خط لطيف تحت */}
                <div className="mt-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* لو مفيش بيانات */}
      {honors.length === 0 && (
        <div className="max-w-xl mx-auto mt-10 text-center ui-card p-10 border-t-4 border-amber-500">
          <Trophy className="w-14 h-14 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-800 mb-2">لا توجد تكريمات حالياً</h3>
          <p className="text-slate-600">سيتم عرض التكريمات هنا عند نشرها.</p>
        </div>
      )}
    </div>
  );
}
