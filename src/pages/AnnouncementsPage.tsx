// src/pages/AnnouncementsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Lock, UnlockKeyhole } from "lucide-react";
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

  const cards = useMemo(() => announcements || [], [announcements]);

  const isSelectedCompetition = selectedAnnouncement?.type === "competition";
  const selectedIsOpen = !!selectedAnnouncement?.registration_open;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700 mb-3">
          الإعلانات والمسابقات
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-semibold">
          تابع آخر الأخبار والمسابقات
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((a) => {
          const isComp = a?.type === "competition";
          const open = !!a?.registration_open;

          return (
            <div
              key={a.id}
              className="ui-card ui-card-hover rounded-3xl p-6 flex flex-col min-h-[280px]"
            >
              <h3 className="text-lg md:text-xl font-black mb-2">
                {a.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                {a.description}
              </p>

              <div className="mt-auto">
                {/* ✅ مسابقة مفتوحة */}
                {canRegister(a) && (
                  <button
                    onClick={() => setSelectedAnnouncement(a)}
                    className="
                      w-full h-12 rounded-2xl font-black
                      bg-teal-100 text-teal-900
                      border border-teal-200
                      hover:bg-teal-200
                      transition
                    "
                  >
                    سجّل الآن
                  </button>
                )}

                {/* ✅ إعلان */}
                {!isComp && (
                  <button
                    onClick={() => setSelectedAnnouncement(a)}
                    className="
                      w-full h-12 rounded-2xl font-extrabold
                      bg-cyan-100 text-cyan-900
                      border border-cyan-200
                      hover:bg-cyan-200
                      transition
                    "
                  >
                    تابعنا للمزيد من التحديثات
                  </button>
                )}

                {/* ✅ مسابقة مغلقة */}
                {isComp && !open && (
                  <div
                    className="
                      w-full h-12 rounded-2xl
                      bg-slate-200 text-slate-900
                      border border-slate-300
                      flex items-center justify-center gap-2
                      font-black
                    "
                  >
                    <Lock className="w-4 h-4" />
                    انتهى التسجيل
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-3xl p-7 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-black mb-4">
              {selectedAnnouncement.title}
            </h2>

            <p className="text-gray-700 mb-4">
              {selectedAnnouncement.description}
            </p>

            {isSelectedCompetition && selectedIsOpen ? (
              <button
                onClick={() => handleRegister(selectedAnnouncement.id)}
                className="
                  w-full h-12 rounded-2xl
                  bg-teal-600 text-white
                  hover:bg-teal-700
                  transition
                "
              >
                تأكيد التسجيل
              </button>
            ) : (
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
