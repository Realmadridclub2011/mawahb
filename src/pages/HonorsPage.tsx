// src/pages/HonorsPage.tsx
import React, { useEffect, useState } from "react";
import { ArrowRight, Trophy } from "lucide-react";
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {honors.map((honor) => (
          <div
            key={honor.id}
            className="ui-card ui-card-hover ui-card-amber overflow-hidden border-t-4 border-amber-500"
          >
            {honor.media_type === "image" ? (
              <img
                src={honor.media_url}
                alt={honor.title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="relative w-full h-56 bg-black">
                <iframe
                  src={honor.media_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-500">
                  {new Date(honor.honor_date).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">{honor.title}</h3>
              <p className="text-gray-600">{honor.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
