// src/pages/TalentsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  FileText,
  LogIn,
  XCircle,
  Star,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";
import { useAuth, useToast } from "../App";

type TalentsPageProps = {
  initialPage?: "talents" | "subcategories" | "register" | "mypage";
  onBackHome?: () => void;
  onGoMyPage?: () => void;
  onRequestLogin?: () => void;
};

type PageId = "talents" | "subcategories" | "register" | "mypage";

export default function TalentsPage({
  initialPage = "talents",
  onBackHome,
  onGoMyPage,
  onRequestLogin,
}: TalentsPageProps) {
  const [page, setPage] = useState<PageId>(initialPage);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  return (
    <>
      {page === "talents" && (
        <TalentsHomePage
          setPage={setPage}
          setSelectedCategory={setSelectedCategory}
          onGoMyPage={() => (onGoMyPage ? onGoMyPage() : setPage("mypage"))}
          onBackHome={onBackHome}
          onRequestLogin={onRequestLogin}
        />
      )}

      {page === "subcategories" && selectedCategory && (
        <SubcategoriesPage
          categoryId={selectedCategory}
          setPage={setPage}
          setSelectedSubcategory={setSelectedSubcategory}
          onBackHome={onBackHome}
        />
      )}

      {page === "register" && selectedCategory && selectedSubcategory && (
        <RegisterPage
          categoryId={selectedCategory}
          subcategoryId={selectedSubcategory}
          setPage={setPage}
          onGoMyPage={() => (onGoMyPage ? onGoMyPage() : setPage("mypage"))}
          onBackHome={onBackHome}
          onRequestLogin={onRequestLogin}
        />
      )}

      {page === "mypage" && (
        <MyPage setPage={setPage} onBackHome={onBackHome} />
      )}
    </>
  );
}

/* ---------------------------------------------
   ICONS (Modern 3D-ish) + Badge
--------------------------------------------- */

function normalize(s: string) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function pick3dIconFromText(text: string) {
  const t = normalize(text);

  // Icons8 3d-fluency (looks modern, mobile-friendly)
  // ملاحظة: لو تحب نغيّر الباك/الستايل لباك تاني (3d-plastilina / 3d-casual)، قولّي.
  const map: Array<[RegExp, string]> = [
    // Sports
    [/كرة القدم|football|soccer/, "https://img.icons8.com/3d-fluency/94/soccer-ball.png"],
    [/كرة السلة|basketball/, "https://img.icons8.com/3d-fluency/94/basketball.png"],
    [/كرة الطائرة|volleyball/, "https://img.icons8.com/3d-fluency/94/volleyball.png"],
    [/سباحة|swim/, "https://img.icons8.com/3d-fluency/94/swimming.png"],
    [/تنس|table tennis|ping pong/, "https://img.icons8.com/3d-fluency/94/table-tennis.png"],
    [/جمباز|gymnast/, "https://img.icons8.com/3d-fluency/94/gymnastics.png"],
    [/ألعاب القوى|athletics|running|جري/, "https://img.icons8.com/3d-fluency/94/running.png"],
    [/تايكوندو|taekwondo|كاراتيه|karate/, "https://img.icons8.com/3d-fluency/94/karate.png"],
    [/فروسية|horse|equestrian/, "https://img.icons8.com/3d-fluency/94/horse.png"],
    [/دراج|bike|cycling/, "https://img.icons8.com/3d-fluency/94/bicycle.png"],
    [/رفع الأثقال|weights|lifting|كمال أجسام|bodybuilding/, "https://img.icons8.com/3d-fluency/94/dumbbell.png"],

    // Arts
    [/فنية|فن|art|drawing|رسم/, "https://img.icons8.com/3d-fluency/94/paint-palette.png"],
    [/تصوير|camera|photography/, "https://img.icons8.com/3d-fluency/94/camera.png"],
    [/موسيقى|music/, "https://img.icons8.com/3d-fluency/94/musical-notes.png"],
    [/تمثيل|theatre|مسرح/, "https://img.icons8.com/3d-fluency/94/theatre-mask.png"],

    // Literature / Reading
    [/أدبية|قراءة|كتاب|literature|reading|writing/, "https://img.icons8.com/3d-fluency/94/book.png"],

    // Science
    [/علمية|science|مختبر|lab|تجارب/, "https://img.icons8.com/3d-fluency/94/test-tube.png"],
    [/رياضيات|math/, "https://img.icons8.com/3d-fluency/94/calculator.png"],

    // Tech
    [/تقنية|tech|برمجة|coding|computer|حاسوب/, "https://img.icons8.com/3d-fluency/94/laptop.png"],
    [/روبوت|robot/, "https://img.icons8.com/3d-fluency/94/robot.png"],
    [/ذكاء|ai|artificial intelligence/, "https://img.icons8.com/3d-fluency/94/artificial-intelligence.png"],

    // General fallback
    [/.*/, "https://img.icons8.com/3d-fluency/94/star.png"],
  ];

  for (const [re, url] of map) {
    if (re.test(t)) return url;
  }
  return "https://img.icons8.com/3d-fluency/94/star.png";
}

function isProbablyUrl(s: string) {
  return /^https?:\/\//i.test((s || "").trim());
}

function IconBadge({
  label,
  iconHint,
  gradientClass,
  sizeClass = "w-14 h-14", // bigger & nicer on small screens
  imgClass = "w-9 h-9",
}: {
  label: string;
  iconHint?: string;
  gradientClass: string;
  sizeClass?: string;
  imgClass?: string;
}) {
  const [broken, setBroken] = useState(false);

  const iconUrl = useMemo(() => {
    const hint = (iconHint || "").trim();

    // لو الداتا أصلاً فيها URL — استخدمه
    if (hint && isProbablyUrl(hint)) return hint;

    // لو hint اسم (Arabic/English) — اختار 3D مناسب
    const merged = [label, hint].filter(Boolean).join(" ");
    return pick3dIconFromText(merged);
  }, [label, iconHint]);

  return (
    <div className="relative">
      {/* Glow */}
      <div
        className={`absolute -inset-1 rounded-full blur-md opacity-60 bg-gradient-to-br ${gradientClass}`}
      />
      {/* Main badge */}
      <div
        className={`relative ${sizeClass} rounded-full bg-white/65 backdrop-blur-md border border-white/60 shadow-[0_12px_30px_rgba(0,0,0,0.12)] flex items-center justify-center`}
      >
        {!broken ? (
          <img
            src={iconUrl}
            alt={label}
            className={`${imgClass} object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.18)]`}
            onError={() => setBroken(true)}
          />
        ) : (
          <Star className="w-7 h-7 text-slate-700" />
        )}

        {/* subtle highlight */}
        <div className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 bg-white/80 rounded-full blur-[1px]" />
      </div>
    </div>
  );
}

/* ---------------------------------------------
   TALENTS HOME
--------------------------------------------- */

function TalentsHomePage({
  setPage,
  setSelectedCategory,
  onGoMyPage,
  onBackHome,
  onRequestLogin,
}: {
  setPage: (p: PageId) => void;
  setSelectedCategory: (id: string) => void;
  onGoMyPage: () => void;
  onBackHome?: () => void;
  onRequestLogin?: () => void;
}) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("talent_categories")
      .select("*")
      .order("ord")
      .then(({ data }) => {
        setCategories(data || []);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      {/* Home back (same style across app) */}
      {onBackHome && (
        <button
          onClick={onBackHome}
          className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </button>
      )}

      <div className="text-center mb-6">
        {user ? (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg">
              <p className="text-sm md:text-lg font-black drop-shadow-md">
                مرحباً {user.full_name}
              </p>
            </div>

            <button
              onClick={onGoMyPage}
              className="bg-white border-2 border-emerald-600 text-emerald-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 md:px-5 md:py-3 rounded-xl font-black shadow-lg transition-all active:scale-95"
            >
              صفحتي
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            <button
              onClick={() => onRequestLogin?.()}
              className="bg-white border-2 border-emerald-600 text-emerald-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 md:px-5 md:py-3 rounded-xl font-black shadow-lg transition-all active:scale-95"
            >
              تسجيل الدخول
            </button>
          </div>
        )}

        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2 drop-shadow-sm">
          اكتشف موهبتك
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-semibold mb-4">
          نور مستقبلك بموهبتك الفريدة
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat: any, i: number) => {
          const cardStyles = [
            { card: "ui-card-teal", glow: "from-teal-400 to-emerald-500" },
            { card: "ui-card-purple", glow: "from-purple-400 to-pink-500" },
            { card: "ui-card-amber", glow: "from-amber-400 to-orange-500" },
            { card: "ui-card-blue", glow: "from-blue-400 to-cyan-500" },
            { card: "ui-card-cyan", glow: "from-cyan-400 to-sky-500" },
          ];

          const st = cardStyles[i % cardStyles.length];

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage("subcategories");
              }}
              className={[
                "group ui-card ui-card-hover",
                st.card,
                "overflow-hidden h-36 md:h-44 active:scale-[0.99]",
                "relative",
              ].join(" ")}
            >
              {/* subtle background pattern */}
              <div className="pointer-events-none absolute -top-10 -left-10 w-28 h-28 rounded-full bg-white/35 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-10 w-28 h-28 rounded-full bg-white/30 blur-2xl" />

              <div className="p-3 flex flex-col items-center justify-center h-full">
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <IconBadge
                    label={cat.name_ar}
                    iconHint={cat.icon}
                    gradientClass={st.glow}
                    sizeClass="w-14 h-14 md:w-16 md:h-16"
                    imgClass="w-9 h-9 md:w-10 md:h-10"
                  />
                </div>

                <h3 className="text-base md:text-lg font-black text-slate-900 mb-1">
                  {cat.name_ar}
                </h3>
                <div className="w-10 h-0.5 bg-slate-200 rounded-full"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   SUBCATEGORIES
--------------------------------------------- */

function SubcategoriesPage({
  categoryId,
  setPage,
  setSelectedSubcategory,
  onBackHome,
}: {
  categoryId: string;
  setPage: (p: PageId) => void;
  setSelectedSubcategory: (id: string) => void;
  onBackHome?: () => void;
}) {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      supabase
        .from("talent_categories")
        .select("*")
        .eq("id", categoryId)
        .single(),
      supabase
        .from("talent_subcategories")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_approved", true)
        .order("ord"),
    ]).then(([catRes, subsRes]) => {
      setCategory(catRes.data);
      setSubcategories(subsRes.data || []);
    });
  }, [categoryId]);

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <button
          onClick={() => setPage("talents")}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all text-sm md:text-base"
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          <span>العودة للأقسام</span>
        </button>

        {onBackHome && (
          <button
            onClick={onBackHome}
            className="flex items-center gap-2 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 border-2 border-emerald-600 text-sm md:text-base"
          >
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            <span>الرئيسية</span>
          </button>
        )}
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2 drop-shadow-sm">
          {category?.name_ar}
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-semibold">
          اختر التخصص المناسب لموهبتك
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {subcategories.map((sub: any, idx: number) => {
          const colorClasses = [
            "ui-card-rose",
            "ui-card-blue",
            "ui-card-teal",
            "ui-card-amber",
            "ui-card-purple",
            "ui-card-cyan",
          ];
          const glows = [
            "from-rose-400 to-pink-500",
            "from-blue-400 to-indigo-500",
            "from-teal-400 to-emerald-500",
            "from-amber-400 to-yellow-500",
            "from-purple-400 to-fuchsia-500",
            "from-cyan-400 to-blue-500",
          ];

          const colorClass = colorClasses[idx % colorClasses.length];
          const glow = glows[idx % glows.length];

          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubcategory(sub.id);
                setPage("register");
              }}
              className={[
                "group ui-card ui-card-hover",
                colorClass,
                "overflow-hidden h-36 md:h-40 active:scale-[0.99]",
                "relative",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute -top-10 -left-10 w-28 h-28 rounded-full bg-white/35 blur-2xl" />

              <div className="p-3 flex flex-col items-center justify-center h-full">
                <div className="mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
                  <IconBadge
                    label={sub.name_ar}
                    iconHint={sub.icon || sub.name_ar}
                    gradientClass={glow}
                    sizeClass="w-14 h-14 md:w-16 md:h-16"
                    imgClass="w-9 h-9 md:w-10 md:h-10"
                  />
                </div>

                <h3 className="text-sm md:text-base font-black text-slate-900 text-center">
                  {sub.name_ar}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   REGISTER
--------------------------------------------- */

function RegisterPage({
  categoryId,
  subcategoryId,
  setPage,
  onGoMyPage,
  onBackHome,
  onRequestLogin,
}: {
  categoryId: string;
  subcategoryId: string;
  setPage: (p: PageId) => void;
  onGoMyPage: () => void;
  onBackHome?: () => void;
  onRequestLogin?: () => void;
}) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({
    proficiency: "مبتدئ",
    years_of_experience: 0,
    attachment_url: "",
    consent_guardian: false,
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16" dir="rtl">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-12 text-center border-t-4 border-teal-600">
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-12 h-12 text-teal-700" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">
            يجب تسجيل الدخول
          </h2>
          <p className="text-gray-600 mb-8">
            لتسجيل موهبتك، يرجى تسجيل الدخول أولاً
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => onRequestLogin?.()}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              تسجيل الدخول
            </button>

            <button
              onClick={() => setPage("talents")}
              className="bg-white border-2 border-teal-600 text-teal-700 px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              العودة للأقسام
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.consent_guardian) {
      showError("يجب الموافقة على إقرار ولي الأمر");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("student_talents").insert({
        student_id: user.id,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        proficiency: form.proficiency,
        years_of_experience: form.years_of_experience,
        attachment_url: form.attachment_url || null,
        consent_guardian: form.consent_guardian,
        status: "pending",
      });

      if (error) throw error;

      showSuccess("تم استلام طلبك بنجاح! جارٍ المراجعة");
      setTimeout(() => {
        onGoMyPage();
      }, 1200);
    } catch (err: any) {
      if (err?.code === "23505")
        showError("لديك طلب مماثل قيد المراجعة بالفعل");
      else showError("حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
        <button
          onClick={() => setPage("subcategories")}
          className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة</span>
        </button>

        {onBackHome && (
          <button
            onClick={onBackHome}
            className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600"
          >
            <ArrowRight className="w-5 h-5" />
            <span>الرئيسية</span>
          </button>
        )}
      </div>

      <div className="max-w-2xl mx-auto ui-card p-8 border-t-4 border-emerald-600">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-8 text-center">
          نموذج تسجيل الموهبة
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={user.full_name}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                الصف الدراسي
              </label>
              <input
                type="text"
                value={user.grade || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              مستوى الإتقان *
            </label>
            <select
              value={form.proficiency}
              onChange={(e) =>
                setForm({ ...form, proficiency: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
              required
            >
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              سنوات الخبرة *
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={form.years_of_experience}
              onChange={(e) =>
                setForm({
                  ...form,
                  years_of_experience: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              رابط المرفق (اختياري)
            </label>
            <input
              type="url"
              value={form.attachment_url}
              onChange={(e) =>
                setForm({ ...form, attachment_url: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
              placeholder="https://example.com/file"
              dir="ltr"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent_guardian}
                onChange={(e) =>
                  setForm({ ...form, consent_guardian: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-[#8A1538]"
                required
              />
              <span className="text-gray-700">
                <strong>موافقة ولي الأمر:</strong> أقر بأن ولي أمري على علم
                بتسجيل هذه الموهبة ويوافق على المشاركة *
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !form.consent_guardian}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 rounded-xl font-black text-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? "جارٍ التسجيل..." : "تسجيل الموهبة"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   MY PAGE
--------------------------------------------- */

function MyPage({
  setPage,
  onBackHome,
}: {
  setPage: (p: PageId) => void;
  onBackHome?: () => void;
}) {
  const { user } = useAuth();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from("student_talents")
      .select(
        `id, proficiency, years_of_experience, status, created_at, category_id, subcategory_id`
      )
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          const catIds = [...new Set(data.map((t: any) => t.category_id))];
          const subIds = [...new Set(data.map((t: any) => t.subcategory_id))];

          const [cats, subs] = await Promise.all([
            supabase
              .from("talent_categories")
              .select("id, name_ar")
              .in("id", catIds),
            supabase
              .from("talent_subcategories")
              .select("id, name_ar")
              .in("id", subIds),
          ]);

          const catsMap = new Map(
            (cats.data || []).map((c: any) => [c.id, c.name_ar])
          );
          const subsMap = new Map(
            (subs.data || []).map((s: any) => [s.id, s.name_ar])
          );

          const enriched = data.map((t: any) => ({
            ...t,
            category_name: catsMap.get(t.category_id),
            subcategory_name: subsMap.get(t.subcategory_id),
          }));

          setTalents(enriched);
        }
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16" dir="rtl">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-12 text-center border-t-4 border-teal-600">
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-12 h-12 text-teal-700" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">
            يجب تسجيل الدخول
          </h2>
          <p className="text-gray-600 mb-8">
            لعرض صفحتك، يرجى تسجيل الدخول أولاً
          </p>

          <button
            onClick={() => setPage("talents")}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-teal-700 hover:to-cyan-700 active:scale-95"
          >
            العودة للأقسام
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
        <button
          onClick={() => setPage("talents")}
          className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة</span>
        </button>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setPage("talents")}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            تسجيل موهبة جديدة
          </button>

          {onBackHome && (
            <button
              onClick={onBackHome}
              className="bg-white border-2 border-emerald-600 text-emerald-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-black shadow-lg transition-all active:scale-95"
            >
              الرئيسية
            </button>
          )}
        </div>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">
          صفحتي
        </h1>
        <p className="text-xl text-gray-600 font-semibold">
          مواهبك المسجلة وحالة الطلبات
        </p>
      </div>

      {talents.length === 0 ? (
        <div className="ui-card p-16 text-center border-t-4 border-emerald-600 max-w-2xl mx-auto">
          <FileText className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-800 mb-4">
            لم تسجل أي موهبة بعد
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            ابدأ رحلتك في اكتشاف مواهبك الآن
          </p>
          <button
            onClick={() => setPage("talents")}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            سجّل موهبتك الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {talents.map((t: any) => (
            <div
              key={t.id}
              className={`ui-card ui-card-hover ${
                t.status === "approved"
                  ? "ui-card-teal border-green-500"
                  : t.status === "rejected"
                  ? "ui-card-rose border-red-500"
                  : "ui-card-amber border-yellow-500"
              } p-6 border-r-8`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-[#8A1538] mb-1">
                    {t.subcategory_name}
                  </h3>
                  <p className="text-gray-600 font-semibold">{t.category_name}</p>
                </div>

                <span
                  className={`px-4 py-2 rounded-xl font-bold shadow-md text-sm ${
                    t.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : t.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {t.status === "approved" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> مقبول
                    </span>
                  ) : t.status === "rejected" ? (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> مرفوض
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> قيد المراجعة
                    </span>
                  )}
                </span>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <strong className="text-[#8A1538]">المستوى:</strong>{" "}
                  <span className="font-semibold">{t.proficiency}</span>
                </p>
                <p className="flex items-center gap-2">
                  <strong className="text-[#8A1538]">سنوات الخبرة:</strong>{" "}
                  <span className="font-semibold">{t.years_of_experience}</span>
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <strong className="text-[#8A1538]">التاريخ:</strong>{" "}
                  <span className="font-semibold">
                    {new Date(t.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
