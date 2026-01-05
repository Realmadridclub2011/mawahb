// src/pages/AnnouncementsPage.tsx
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

// ✅ عدّل المسارات حسب مشروعك لو مختلفة
import { supabase } from "../supabase/client"; // أو "../lib/supabase" حسب عندك
import { useAuth } from "../contexts/AuthContext"; // أو المسار الحقيقي عندك
import { useToast } from "../components/ui/useToast"; // أو المسار الحقيقي عندك

type AnnouncementsPageProps = {
  onBackHome?: () => void; // ✅ بدل window.location.href
};

export default function AnnouncementsPage({ onBackHome }: AnnouncementsPageProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

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
        () => {
          loadAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    setAnnouncements(data || []);
    setLoading(false);
  };

  const handleRegister = async (announcementId: string) => {
    if (!user) {
      showError("يجب تسجيل الدخول أولاً");
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
          showError("أنت مسجل بالفعل في هذه المسابقة");
        } else {
          throw error;
        }
      } else {
        showSuccess("تم التسجيل بنجاح! جارٍ المراجعة");
        setSelectedAnnouncement(null);
        setRegistrationNote("");
      }
    } catch (err) {
      showError("حدث خطأ أثناء التسجيل");
    } finally {
      setRegistering(false);
    }
  };

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
          الإعلانات والمسابقات
        </h1>
        <p className="text-xl text-gray-600 font-semibold">تابع آخر الأخبار والمسابقات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="ui-card ui-card-hover ui-card-blue overflow-hidden border-t-4 border-blue-500"
          >
            {announcement.image_url && (
              <img
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {announcement.type === "competition" ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                    مسابقة
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                    إعلان
                  </span>
                )}

                {announcement.registration_open && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                    التسجيل مفتوح
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-gray-800 mb-2">{announcement.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{announcement.description}</p>

              {announcement.end_date && (
                <p className="text-sm text-gray-500 mb-4">
                  <strong>ينتهي في:</strong>{" "}
                  {new Date(announcement.end_date).toLocaleDateString("ar-SA")}
                </p>
              )}

              {announcement.registration_open && announcement.type === "competition" && (
                <button
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
                >
                  سجّل الآن
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <h2 className="text-2xl font-black text-teal-700 mb-4">
              التسجيل في {selectedAnnouncement.title}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ملاحظات (اختياري)</label>
                <textarea
                  value={registrationNote}
                  onChange={(e) => setRegistrationNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  rows={4}
                  placeholder="أضف أي ملاحظات أو معلومات إضافية"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="flex-1 bg-gray-200 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>

                <button
                  onClick={() => handleRegister(selectedAnnouncement.id)}
                  disabled={registering}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  {registering ? "جارٍ التسجيل..." : "تأكيد التسجيل"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
