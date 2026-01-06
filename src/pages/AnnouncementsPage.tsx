// src/pages/AnnouncementsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Lock, Unlock } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type AnnouncementsPageProps = {
  onBackHome?: () => void;

  user?: { id: string } | null;
  showSuccess?: (msg: string) => void;
  showError?: (msg: string) => void;
};

function fmtDateAr(d?: string | null) {
  if (!d) return "";
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

    setAnnouncements(Array.isArray(data) ? data : []);
    setLoading(false);
  };

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

  const handleRegister = async (announcementId: string) => {
    if (!user?.id) {
      showError?.("يجب تسجيل الدخول أولاً");
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase.from("announcement_registrations").insert({
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

  const canRegister = (a: any) =>
    a?.type === "competition" && !!a?.registration_open;

  const getTone = (a: any) => {
    const isComp = a?.type === "competition";
    const open = !!a?.registration_open;

    // إعلان
    if (!isComp) {
      return {
        card: "border-sky-200 bg-gradient-to-b from-sky-50/70 to-white/50",
        chip: "bg-sky-100 text-sky-800",
        btn: "from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700",
        footer:
          "bg-white/70 text-slate-700 border border-white/60 ring-1 ring-sky-200/60",
      };
    }

    // مسابقة - مفتوح
    if (open) {
      return {
        card: "border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white/50",
        chip: "bg-emerald-100 text-emerald-800",
        btn:
          "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
        footer:
          "bg-white/70 text-slate-700 border border-white/60 ring-1 ring-emerald-200/60",
      };
    }

    // مسابقة - مغلق (أغمق)
    return {
      card: "border-slate-300 bg-gradient-to-b from-slate-100/80 to-white/40",
      chip: "bg-slate-200 text-slate-800",
      btn: "from-slate-700 to-slate-600 hover:from-slate-700 hover:to-slate-600",
      footer:
        "bg-slate-100 text-slate-800 border border-slate-300 ring-1 ring-slate-400/60",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((a) => {
          const tone = getTone(a);
          const hasImage = !!a?.image_url;
          const open = !!a?.registration_open;
          const isComp = a?.type === "competition";

          return (
            <div
              key={a?.id || `${a?.title}-${a?.created_at}`}
              className={[
                "ui-card ui-card-hover overflow-hidden rounded-3xl border",
                tone.card,
                "shadow-[0_10px_30px_rgba(2,6,23,0.08)] transition-transform duration-200 hover:-translate-y-0.5",
              ].join(" ")}
            >
              {/* صورة اختيارية */}
              {hasImage ? (
                <div className="relative">
                  <img
                    src={a.image_url}
                    alt={a?.title || "announcement"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                </div>
              ) : (
                <div className="h-20 bg-gradient-to-r from-white/50 to-white/10" />
              )}

              <div className="p-6 flex flex-col min-h-[280px]">
                {/* Chips + تاريخ */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${tone.chip}`}>
                      {isComp ? "مسابقة" : "إعلان"}
                    </span>

                    {/* التسجيل مفتوح/مغلق مع أيقونة */}
                    {isComp && (
                      <span
                        className={[
                          "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black",
                          open ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-800",
                        ].join(" ")}
                      >
                        {open ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            التسجيل مفتوح
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            التسجيل مغلق
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* تاريخ النهاية */}
                  {a?.end_date ? (
                    <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                      ينتهي: {fmtDateAr(a.end_date)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                      —
                    </span>
                  )}
                </div>

                {/* محتوى البطاقة */}
                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2 leading-snug">
                  {a?.title || "بدون عنوان"}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {a?.description || "—"}
                </p>

                {/* Footer ثابت: زر أو شريط */}
                <div className="mt-auto pt-4">
                  {canRegister(a) ? (
                    <button
                      onClick={() => setSelectedAnnouncement(a)}
                      className={[
                        "w-full py-3 rounded-xl font-black text-white",
                        "bg-gradient-to-r",
                        tone.btn,
                        "shadow-md hover:shadow-lg transition active:scale-[0.99]",
                      ].join(" ")}
                    >
                      سجّل الآن
                    </button>
                  ) : (
                    <div
                      className={[
                        "w-full py-3 rounded-xl flex items-center justify-center gap-2",
                        "text-center text-sm font-black",
                        tone.footer,
                      ].join(" ")}
                    >
                      {isComp ? (
                        <>
                          <Lock className="w-4 h-4" />
                          انتهى التسجيل — تابعنا للمسابقات القادمة
                        </>
                      ) : (
                        <>تابعنا للمزيد من التحديثات</>
                      )}
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
              التسجيل في {selectedAnnouncement?.title || "المسابقة"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">سيتم إرسال طلبك للمراجعة.</p>

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
