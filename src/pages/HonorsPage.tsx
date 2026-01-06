// src/pages/HonorsPage.tsx
import React, { useEffect, useState } from "react";
import { ArrowRight, Trophy, CalendarDays, Image as ImageIcon, Video } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type HonorsPageProps = {
  onBackHome?: () => void;
};

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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "honors" },
        () => loadHonors()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button
        onClick={() => (onBackHome ? onBackHome() : null)}
        className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600"
      >
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">
          التكريمات
        </h1>
        <p className="text-xl text-gray-600 font-semibold">إنجازاتنا وتكريماتنا</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
        {honors.map((honor) => {
          const isImage = honor.media_type === "image";
          const dateLabel = honor.honor_date
            ? new Date(honor.honor_date).toLocaleDateString("ar-SA")
            : "";

          return (
            <div
              key={honor.id}
              className="
                overflow-hidden rounded-[28px]
                border border-amber-200/60
                bg-white/70 backdrop-blur
                shadow-[0_18px_45px_rgba(2,6,23,0.08)]
                hover:shadow-[0_22px_55px_rgba(2,6,23,0.12)]
                transition
              "
            >
              {/* ✅ الصورة نظيفة بدون أي كتابة فوقها */}
              {isImage ? (
                <img
                  src={honor.media_url}
                  alt={honor.title}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="relative w-full h-56 bg-black">
                  <iframe
                    src={honor.media_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={honor.title}
                  />
                </div>
              )}

              <div className="p-6">
                {/* ✅ البادجات تحت الصورة (مرتبة) */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {dateLabel && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      <CalendarDays className="w-4 h-4" />
                      {dateLabel}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {isImage ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {isImage ? "صورة" : "فيديو"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-black text-gray-900">{honor.title}</h3>
                </div>

                <p className="text-gray-600 leading-relaxed">{honor.description}</p>

                {/* خط صغير تجميلي زي اللي عندك */}
                <div className="mt-5">
                  <div className="h-[3px] w-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
