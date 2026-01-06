// src/pages/AnnouncementsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type AnnouncementsPageProps = {
  onBackHome?: () => void;
  user?: { id: string } | null;
  showSuccess?: (msg: string) => void;
  showError?: (msg: string) => void;
};

function fmtDateAr(d: string) {
  try {
    return new Date(d).toLocaleDateString("ar-SA");
  } catch {
    return "";
  }
}

export default function AnnouncementsPage({
  onBackHome,
  user,
  showSuccess,
  showError,
}: AnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [registrationNote, setRegistrationNote] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadAnnouncements();

    const channel = supabase
      .channel("announcements-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => loadAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      showError?.("حدث خطأ أثناء تحميل الإعلانات");
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setLoading(false);
  };

  const handleRegister = async (announcementId: string) => {
    if (!user?.id) {
      showError?.("يجب تسجيل الدخول أولاً");
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase
        .from("announcement_registrations")
        .insert({
          announcement_id: announcementId,
          student_id: user.id,
          notes: registrationNote,
          status: "pending",
        });

      if (error) {
        if ((error as any).code === "23505") {
          showError?.("أنت مسجل بالفعل في هذه المسابقة");
        } else {
          throw error;
        }
      } else {
        showSuccess?.("تم التسجيل بنجاح! جارٍ المراجعة");
        setSelectedAnnouncement(null);
        setRegistrationNote("");
      }
    } catch {
      showError?.("حدث خطأ أثناء التسجيل");
    } finally {
      setRegistering(false);
    }
  };

  const isComp = (a: any) => a?.type === "competition";
  const isOpen = (a: any) => !!a?.registration_open;
  const canRegister = (a: any) => isComp(a) && isOpen(a);

  const getTone = (a: any) => {
    // ✅ مسابقة مغلقة: لون أغمق (مش أبيض)
    if (isComp(a) && !isOpen(a)) {
      return {
        card: "border-slate-300 bg-slate-100/70",
        header: "from-slate-900/10 via-slate-900/0 to-slate-900/0",
        chipMain: "bg-slate-200 text-slate-800",
        chipStatus: "bg-slate-800 text-white",
        ring: "ring-slate-300/60",
        btn: "from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700",
        accent: "from-slate-500 to-slate-400",
      };
    }

    // ✅ مسابقة مفتوحة
    if (isComp(a)) {
      return {
        card: "border-emerald-200 bg-emerald-50/40",
        header: "from-black/35 via-black/0 to-black/0",
        chipMain: "bg-emerald-100 text-emerald-900",
        chipStatus: "bg-amber-100 text-amber-800",
        ring: "ring-emerald-200/60",
        btn: "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
        accent: "from-emerald-500 to-cyan-500",
      };
    }

    // ✅ إعلان
    return {
      card: "border-sky-200 bg-sky-50/40",
      header: "from-black/30 via-black/0 to-black/0",
      chipMain: "bg-sky-100 text-sky-900",
      chipStatus: "bg-slate-100 text-slate-700",
      ring: "ring-sky-200/60",
      btn: "from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700",
      accent: "from-sky-500 to-cyan-500",
    };
  };

  const cards = useMemo(() => announcements || [], [announcements]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button
        onClick={() => onBackHome?.()}
        className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600"
      >
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-3">
          الإعلانات والمسابقات
        </h1>
        <p className="text-base md:text-xl text-gray-600 font-semibold">
          تابع آخر الأخبار والمسابقات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
        {cards.map((a) => {
          const tone = getTone(a);
          const hasImage = !!a.image_url;

          return (
            <div
              key={a.id}
              className={`
                overflow-hidden rounded-[26px]
                border ${tone.card}
                bg-white/60 backdrop-blur
                shadow-[0_14px_40px_rgba(2,6,23,0.08)]
                hover:shadow-[0_18px_55px_rgba(2,6,23,0.12)]
                transition
              `}
            >
              {/* ✅ صورة نظيفة: بدون تاريخ أو "صورة" فوقها */}
              {hasImage ? (
                <div className="relative">
                  <img
                    src={a.image_url}
                    alt={a.title}
                    className="w-full h-52 object-cover"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tone.header}`} />
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-r from-white/60 to-white/10" />
              )}

              <div className="p-6 flex flex-col min-h-[290px]">
                {/* ✅ بادجات تحت الصورة (مش فوقها) */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${tone.chipMain}`}>
                      {isComp(a) ? "مسابقة" : "إعلان"}
                    </span>

                    {isComp(a) && (
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${tone.chipStatus}`}>
                        {isOpen(a) ? "التسجيل مفتوح" : "التسجيل مغلق"}
                      </span>
                    )}
                  </div>

                  {/* التاريخ في الركن لكن داخل المحتوى */}
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                    <CalendarDays className="w-4 h-4" />
                    {a.end_date ? fmtDateAr(a.end_date) : "—"}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2 leading-snug">
                  {a.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {a.description}
                </p>

                {/* خط أكسنت زي تصميمك */}
                <div className="mt-1 mb-5">
                  <div className={`h-[3px] w-14 rounded-full bg-gradient-to-r ${tone.accent}`} />
                </div>

                {/* ✅ Footer ثابت: زر أو رسالة (مفيش فراغ) */}
                <div className="mt-auto pt-2">
                  {canRegister(a) ? (
                    <button
                      onClick={() => setSelectedAnnouncement(a)}
                      className={`
                        w-full py-3 rounded-xl font-black text-white
                        bg-gradient-to-r ${tone.btn}
                        shadow-md hover:shadow-lg transition
                        active:scale-[0.99]
                      `}
                    >
                      سجّل الآن
                    </button>
                  ) : (
                    <div
                      className={`
                        w-full py-3 rounded-xl text-center
                        text-sm font-black
                        bg-sky-50
                        border border-white/60
                        ring-1 ring-emerald-300/60
                        ${isComp(a) && !isOpen(a) ? "text-slate-800" : "text-slate-700"}
                      `}
                    >
                      {isComp(a)
                        ? isOpen(a)
                          ? "التسجيل متاح الآن"
                          : "انتهى التسجيل — تابعنا للمسابقات القادمة"
                        : "تابعنا للمزيد من التحديثات"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal تسجيل */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h2 className="text-xl md:text-2xl font-black text-teal-700 mb-2">
              التسجيل في {selectedAnnouncement.title}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              سيتم إرسال طلبك للمراجعة.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={registrationNote}
                  onChange={(e) => setRegistrationNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A1538]"
                  rows={4}
                  placeholder="أضف أي ملاحظات أو معلومات إضافية"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>

                <button
                  onClick={() => handleRegister(selectedAnnouncement.id)}
                  disabled={registering}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-xl font-black disabled:opacity-50 hover:shadow-lg transition"
                >
                  {registering ? "جارٍ التسجيل..." : "تأكيد التسجيل"}
                </button>
              </div>

              {!user?.id && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  ملاحظة: يجب تسجيل الدخول أولاً لإكمال التسجيل.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
