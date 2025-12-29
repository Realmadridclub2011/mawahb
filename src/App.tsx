import { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LogIn, LogOut, User, FileText, Users, LayoutDashboard, ArrowRight, CheckCircle, XCircle, Clock, TrendingUp, Plus, MessageSquare, Search, Download, X, Info, Award, Dumbbell, Palette, BookOpen, Microscope, Cpu, Home, Megaphone, Trophy, Star, CreditCard as Edit, Trash2, Settings, Image } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserType {
  id: string;
  full_name: string;
  role: 'student' | 'guardian' | 'teacher' | 'admin';
  grade?: string;
  class?: string;
  phone?: string;
  email: string;
}

const AuthContext = createContext<{
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
} | null>(null);

const ToastContext = createContext<{
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  showInfo: (msg: string) => void;
} | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            }
          });
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (user: UserType) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: string }[]>([]);

  const show = (msg: string, type: string) => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return (
    <ToastContext.Provider value={{
      showSuccess: (msg) => show(msg, 'success'),
      showError: (msg) => show(msg, 'error'),
      showInfo: (msg) => show(msg, 'info')
    }}>
      {children}
      <div className="fixed top-4 left-4 z-50 space-y-2" dir="rtl">
        {toasts.map(t => (
          <div key={t.id} className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 text-white ${
            t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {t.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {t.type === 'error' && <XCircle className="w-5 h-5" />}
            {t.type === 'info' && <Info className="w-5 h-5" />}
            <p className="flex-1 font-semibold">{t.msg}</p>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext)!;
const useToast = () => useContext(ToastContext)!;

function Header({
  showLogin,
  setShowLogin,
}: {
  showLogin?: boolean;
  setShowLogin?: (show: boolean) => void;
}) {
  const { user, logout } = useAuth();

  const getRoleName = (role: string) => {
    const names: Record<string, string> = {
      student: "طالب",
      guardian: "ولي أمر",
      teacher: "معلم",
      admin: "إداري",
    };
    return names[role] || role;
  };

  return (
    <header dir="rtl" className="sticky top-0 z-50">
      <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
        <div className="container mx-auto px-3 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[linear-gradient(135deg,#8A1538,rgba(138,21,56,0.7))] shadow-sm flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <p className="font-black text-sm md:text-base text-slate-900">
                  منصة المواهب
                </p>
                <p className="text-[11px] md:text-xs text-slate-500 font-semibold">
                  اكتشاف المواهب المدرسية
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="hidden md:block text-center flex-1">
              <h1 className="text-sm md:text-lg font-black text-slate-900">
                منصة اكتشاف المواهب المدرسية
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                اكتشف — سجّل — شارك — احتفل بالإنجاز
              </p>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#8A1538]" />
                    </div>
                    <div className="leading-tight">
                      <p className="font-black text-sm">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {getRoleName(user.role)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#8A1538] text-white font-bold shadow-sm hover:shadow-md transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">خروج</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin?.(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#8A1538] text-white font-bold shadow-sm hover:shadow-md transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>دخول</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="h-[3px] bg-[linear-gradient(90deg,rgba(138,21,56,1),rgba(138,21,56,0.4),rgba(138,21,56,1))]" />
      </div>
    </header>
  );
}

function BottomNav({ currentSection, setCurrentSection }: { currentSection: string; setCurrentSection: (section: string) => void }) {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'talents', label: 'اكتشف موهبتك', icon: Star },
    { id: 'announcements', label: 'الإعلانات', icon: Megaphone },
    { id: 'honors', label: 'التكريمات', icon: Trophy }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 md:border-t-4 border-blue-600 shadow-2xl z-40" dir="rtl">
      <div className="container mx-auto px-1">
        <div className="grid grid-cols-4 gap-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`flex flex-col items-center justify-center py-2 transition-all ${
                currentSection === item.id
                  ? 'text-blue-600 bg-amber-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-amber-50/50'
              }`}
            >
              <item.icon className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 ${currentSection === item.id ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[9px] md:text-xs font-bold leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function LoginModal({ showLogin, setShowLogin }: { showLogin: boolean; setShowLogin: (show: boolean) => void }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'guardian' | 'teacher'>('student');
  const [grade, setGrade] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();

  if (!showLogin) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        showError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError || !userData) {
        showError('حدث خطأ في جلب بيانات المستخدم');
        return;
      }

      login(userData);
      setShowLogin(false);
      showSuccess('تم تسجيل الدخول بنجاح');
    } catch (err) {
      showError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    if (password.length < 6) {
      showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          showError('البريد الإلكتروني مسجل مسبقاً');
        } else {
          showError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        showError('حدث خطأ في إنشاء الحساب');
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          role,
          grade: role === 'student' ? grade : null,
          class: role === 'student' ? classRoom : null,
          phone: phone || null
        })
        .eq('id', authData.user.id);

      if (updateError) {
        showError('حدث خطأ في حفظ البيانات');
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userData) {
        login(userData);
      }
      setShowLogin(false);
      showSuccess('تم إنشاء الحساب بنجاح');
    } catch (err) {
      showError('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3" onClick={() => setShowLogin(false)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 md:p-6 max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()} dir="rtl">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          type="button"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mb-3">
            {isRegisterMode ? <User className="w-6 h-6 text-white" /> : <LogIn className="w-6 h-6 text-white" />}
          </div>
          <h2 className="text-xl font-black text-blue-600 mb-1">
            {isRegisterMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-sm text-gray-600">
            {isRegisterMode ? 'املأ البيانات لإنشاء حساب' : 'للوصول إلى جميع المميزات'}
          </p>
        </div>

        {!isRegisterMode ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="example@school.com" required dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="••••••••" required dir="ltr" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 text-sm">
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => setIsRegisterMode(true)} className="text-blue-600 font-bold text-sm hover:underline">
                ليس لديك حساب؟ سجل الآن
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">الاسم الكامل</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="أحمد محمد علي" required />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="example@school.com" required dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">نوع الحساب</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" required>
                <option value="student">طالب</option>
                <option value="guardian">ولي أمر</option>
                <option value="teacher">معلم</option>
              </select>
            </div>

            {role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">الصف</label>
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="الأول" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">الفصل</label>
                    <input type="text" value={classRoom} onChange={(e) => setClassRoom(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="أ" required />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">رقم الجوال (اختياري)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="05xxxxxxxx" dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="••••••••" required minLength={6} dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">تأكيد كلمة المرور</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="••••••••" required minLength={6} dir="ltr" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 text-sm">
              {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
            </button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => setIsRegisterMode(false)} className="text-blue-600 font-bold text-sm hover:underline">
                لديك حساب بالفعل؟ سجل دخول
              </button>
            </div>
          </form>
        )}

        {!isRegisterMode && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-bold text-blue-600 mb-2 text-xs">حسابات تجريبية:</h3>
            <div className="text-[10px] space-y-0.5 text-gray-700">
              <p><strong>طالب:</strong> student@test.com</p>
              <p><strong>معلم:</strong> teacher@test.com</p>
              <p><strong>إدمن:</strong> admin@test.com</p>
              <p className="text-amber-700 mt-1"><strong>كلمة المرور:</strong> password123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'teacher') {
      setCurrentSection('teacher-dashboard');
    } else if (user?.role === 'admin') {
      setCurrentSection('admin-dashboard');
    }
  }, [user]);

  if (user?.role === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
        <Header />
        <div className="pb-20">
          <TeacherDashboard />
        </div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
        <Header />
        <div className="pb-20">
          <AdminDashboard />
        </div>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
    {/* خلفية ناعمة جدا */}
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(138,21,56,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_35%_at_0%_60%,rgba(37,99,235,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_35%_at_100%_70%,rgba(245,158,11,0.08),transparent_55%)]" />
    </div>

    <Header showLogin={showLogin} setShowLogin={setShowLogin} />
    <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />

    <div className="pb-24">
      {currentSection === "home" && (
        <HomePage
          setCurrentSection={(section) => {
            setCurrentSection(section);
            if (section === "talents") setPage("talents");
          }}
        />
      )}

      {currentSection === "talents" && (
        <>
          {page === "talents" && (
            <TalentsHomePage
              setPage={setPage}
              setSelectedCategory={setSelectedCategory}
            />
          )}
          {page === "subcategories" && (
            <SubcategoriesPage
              categoryId={selectedCategory!}
              setPage={setPage}
              setSelectedSubcategory={setSelectedSubcategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}
          {page === "register" && (
            <RegisterPage
              categoryId={selectedCategory!}
              subcategoryId={selectedSubcategory!}
              setPage={setPage}
            />
          )}
          {page === "mypage" && <MyPage setPage={setPage} />}
        </>
      )}

      {currentSection === "announcements" && <AnnouncementsPage />}
      {currentSection === "honors" && <HonorsPage />}
    </div>

    <BottomNav
      currentSection={currentSection}
      setCurrentSection={(section) => {
        setCurrentSection(section);
        if (section === "talents") setPage("talents");
      }}
    />
  </div>
);
}

function HomePage({ setCurrentSection }: { setCurrentSection: (section: string) => void }) {
  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 mb-2 drop-shadow-sm">مرحباً بك في منصة المواهب</h1>
        <p className="text-sm md:text-lg text-gray-700 font-semibold mb-4">اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-6">
        <button onClick={() => setCurrentSection('talents')} className="group relative rounded-2xl shadow-lg active:scale-95 transition-all duration-300 overflow-hidden h-32 md:h-40 bg-gradient-to-br from-orange-600 to-orange-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-3">
            <div className="w-10 h-10 mb-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transform group-active:scale-110 transition-all duration-300 p-2">
              <img src="https://img.icons8.com/color/96/star--v1.png" alt="star" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base md:text-xl font-black text-white mb-1 drop-shadow-md">اكتشف موهبتك</h3>
            <p className="text-white/90 text-xs md:text-sm font-semibold drop-shadow hidden md:block">سجل موهبتك الآن</p>
          </div>
        </button>

        <button onClick={() => setCurrentSection('announcements')} className="group relative rounded-2xl shadow-lg active:scale-95 transition-all duration-300 overflow-hidden h-32 md:h-40 bg-gradient-to-br from-green-700 to-green-600">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-3">
            <div className="w-10 h-10 mb-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transform group-active:scale-110 transition-all duration-300 p-2">
              <img src="https://img.icons8.com/color/96/bullhorn.png" alt="megaphone" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base md:text-xl font-black text-white mb-1 drop-shadow-md">الإعلانات</h3>
            <p className="text-white/90 text-xs md:text-sm font-semibold drop-shadow hidden md:block">تابع الأخبار</p>
          </div>
        </button>

        <button onClick={() => setCurrentSection('honors')} className="group relative rounded-2xl shadow-lg active:scale-95 transition-all duration-300 overflow-hidden h-32 md:h-40 col-span-2 md:col-span-1 bg-gradient-to-br from-purple-600 to-purple-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-3">
            <div className="w-10 h-10 mb-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transform group-active:scale-110 transition-all duration-300 p-2">
              <img src="https://img.icons8.com/color/96/trophy.png" alt="trophy" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base md:text-xl font-black text-white mb-1 drop-shadow-md">التكريمات</h3>
            <p className="text-white/90 text-xs md:text-sm font-semibold drop-shadow hidden md:block">إنجازات مدرستنا</p>
          </div>
        </button>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-4 md:p-6 text-center text-white max-w-4xl mx-auto">
        <h2 className="text-lg md:text-2xl font-black mb-2">ابدأ رحلتك الآن</h2>
        <p className="text-sm md:text-lg mb-3">استخدم الشريط السفلي للتنقل بين الأقسام</p>
        <div className="flex items-center justify-center gap-2 md:gap-4 text-amber-300">
          <ArrowRight className="w-4 h-4 md:w-6 md:h-6 animate-bounce rotate-180" />
          <span className="font-bold text-xs md:text-base">اضغط على الأيقونات بالأسفل</span>
          <ArrowRight className="w-4 h-4 md:w-6 md:h-6 animate-bounce rotate-180" />
        </div>
      </div>
    </div>
  );
}

function TalentsHomePage({ setPage, setSelectedCategory }: any) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('talent_categories').select('*').order('ord').then(({ data }) => {
      setCategories(data || []);
      setLoading(false);
    });
  }, []);

 // === TalentsHomePage: استبدل الدالة بالكامل ===
const getIconImage = (iconNameOrArabic: string) => {
  const map: Record<string, string> = {
    // مفاتيح قديمة (لو مخزّنة في DB)
    'Dumbbell': 'https://img.icons8.com/color/96/soccer-ball.png',
    'Palette': 'https://img.icons8.com/color/96/paint-palette.png',
    'BookOpen': 'https://img.icons8.com/color/96/open-book.png',
    'Microscope': 'https://img.icons8.com/color/96/microscope.png',
    'Cpu': 'https://img.icons8.com/color/96/laptop.png',

    // دعم الأسماء العربية مباشرة من الحقل name_ar
    'رياضية': 'https://img.icons8.com/color/96/soccer-ball.png',
    'فنية': 'https://img.icons8.com/color/96/paint-palette.png',
    'أدبية': 'https://img.icons8.com/color/96/open-book.png',
    'علمية': 'https://img.icons8.com/color/96/microscope.png',
    'تقنية': 'https://img.icons8.com/color/96/laptop.png',
  };

  // جرّب أولاً بالمفتاح كما هو، ثم جرّب الاسم العربي إن وُجد
  return map[iconNameOrArabic] || map[(iconNameOrArabic || '').trim()] || 'https://img.icons8.com/color/96/star--v1.png';
};
  const colorSchemes = [
    { gradient: 'from-orange-600 to-orange-500', name: 'رياضية' },
    { gradient: 'from-green-700 to-green-600', name: 'فنية' },
    { gradient: 'from-blue-600 to-blue-500', name: 'أدبية' },
    { gradient: 'from-purple-600 to-purple-500', name: 'علمية' },
    { gradient: 'from-blue-500 to-blue-400', name: 'تقنية' }
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <div className="text-center mb-6">
        {user && (
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg">
              <p className="text-sm md:text-lg font-black drop-shadow-md">مرحباً {user.full_name}</p>
            </div>
          </div>
        )}
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 mb-2 drop-shadow-sm">اكتشف موهبتك</h1>
        <p className="text-sm md:text-lg text-gray-700 font-semibold mb-4">نور مستقبلك بموهبتك الفريدة</p>
        {user && (
          <button onClick={() => setPage('mypage')} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all text-sm md:text-base">
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span>صفحتي</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat, i) => {
          const scheme = colorSchemes[i % colorSchemes.length];
          return (
            <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setPage('subcategories'); }} className={`group relative bg-gradient-to-br ${scheme.gradient} rounded-2xl shadow-md active:scale-95 transition-all duration-300 overflow-hidden h-36 md:h-44`}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-3 flex flex-col items-center justify-center relative z-10 h-full">
                <div className="mb-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transform group-active:scale-110 transition-all duration-300 p-2">
                  <img src={getIconImage(cat.icon)} alt={cat.name_ar} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base md:text-lg font-black text-white mb-1 drop-shadow-md">{cat.name_ar}</h3>
                <div className="w-10 h-0.5 bg-white/50 rounded-full"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubcategoriesPage({ categoryId, setPage, setSelectedSubcategory }: any) {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('talent_categories').select('*').eq('id', categoryId).single(),
      supabase.from('talent_subcategories').select('*').eq('category_id', categoryId).eq('is_approved', true).order('ord')
    ]).then(([catRes, subsRes]) => {
      setCategory(catRes.data);
      setSubcategories(subsRes.data || []);
    });
  }, [categoryId]);

  const subColors = [
    'from-orange-600 to-orange-500',
    'from-green-700 to-green-600',
    'from-blue-600 to-blue-500',
    'from-purple-600 to-purple-500',
    'from-blue-500 to-blue-400',
    'from-orange-600 to-orange-500',
    'from-green-700 to-green-600',
    'from-blue-600 to-blue-500'
  ];

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <button onClick={() => setPage('talents')} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold mb-6 shadow-lg active:scale-95 transition-all text-sm md:text-base">
        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        <span>العودة للأقسام</span>
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 mb-2 drop-shadow-sm">{category?.name_ar}</h1>
        <p className="text-sm md:text-lg text-gray-700 font-semibold">اختر التخصص المناسب لموهبتك</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {subcategories.map((sub, idx) => (
          <button key={sub.id} onClick={() => { setSelectedSubcategory(sub.id); setPage('register'); }} className={`group relative bg-gradient-to-br ${subColors[idx % subColors.length]} rounded-2xl shadow-md active:scale-95 transition-all duration-300 overflow-hidden border-2 border-white/20 h-36 md:h-40`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="p-3 flex flex-col items-center justify-center relative z-10 h-full">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform group-active:scale-110 transition-all duration-300 mb-2">
                <Award className="w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" style={{color: '#8A1538'}} />
              </div>
              <h3 className="text-sm md:text-base font-black text-white drop-shadow-md text-center">{sub.name_ar}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RegisterPage({ categoryId, subcategoryId, setPage }: any) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({ proficiency: 'مبتدئ', years_of_experience: 0, attachment_url: '', consent_guardian: false });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16" dir="rtl">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center border-t-4 border-blue-600">
          <LogIn className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-800 mb-4">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-8">لتسجيل موهبتك، يرجى تسجيل الدخول أولاً</p>
          <button onClick={() => setPage('talents')} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
            العودة للأقسام
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent_guardian) {
      showError('يجب الموافقة على إقرار ولي الأمر');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('student_talents').insert({
        student_id: user.id,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        proficiency: form.proficiency,
        years_of_experience: form.years_of_experience,
        attachment_url: form.attachment_url || null,
        consent_guardian: form.consent_guardian,
        status: 'pending'
      });

      if (error) throw error;

      showSuccess('تم استلام طلبك بنجاح! جارٍ المراجعة');
      setTimeout(() => setPage('mypage'), 2000);
    } catch (err: any) {
      if (err.code === '23505') {
        showError('لديك طلب مماثل قيد المراجعة بالفعل');
      } else {
        showError('حدث خطأ أثناء التسجيل');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => setPage('subcategories')} className="flex items-center gap-3 bg-white text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-[#8A1538] hover:to-[#A5763F] px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة</span>
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-blue-600">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-8 text-center">نموذج تسجيل الموهبة</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
              <input type="text" value={user.full_name} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">الصف الدراسي</label>
              <input type="text" value={user.grade || ''} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">مستوى الإتقان *</label>
            <select value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" required>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">سنوات الخبرة *</label>
            <input type="number" min="0" max="20" value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" required />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">رابط المرفق (اختياري)</label>
            <input type="url" value={form.attachment_url} onChange={(e) => setForm({ ...form, attachment_url: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]" placeholder="https://example.com/file" dir="ltr" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent_guardian} onChange={(e) => setForm({ ...form, consent_guardian: e.target.checked })} className="mt-1 w-5 h-5 text-blue-600" required />
              <span className="text-gray-700"><strong>موافقة ولي الأمر:</strong> أقر بأن ولي أمري على علم بتسجيل هذه الموهبة ويوافق على المشاركة *</span>
            </label>
          </div>

          <button type="submit" disabled={loading || !form.consent_guardian} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-black text-lg hover:shadow-xl transition disabled:opacity-50">
            {loading ? 'جارٍ التسجيل...' : 'تسجيل الموهبة'}
          </button>
        </form>
      </div>
    </div>
  );
}

function MyPage({ setPage }: any) {
  const { user } = useAuth();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('student_talents').select(`
      id, proficiency, years_of_experience, status, created_at,
      category_id, subcategory_id
    `).eq('student_id', user.id).order('created_at', { ascending: false }).then(async ({ data }) => {
      if (data && data.length > 0) {
        const catIds = [...new Set(data.map(t => t.category_id))];
        const subIds = [...new Set(data.map(t => t.subcategory_id))];

        const [cats, subs] = await Promise.all([
          supabase.from('talent_categories').select('id, name_ar').in('id', catIds),
          supabase.from('talent_subcategories').select('id, name_ar').in('id', subIds)
        ]);

        const catsMap = new Map(cats.data?.map(c => [c.id, c.name_ar]));
        const subsMap = new Map(subs.data?.map(s => [s.id, s.name_ar]));

        const enriched = data.map(t => ({
          ...t,
          category_name: catsMap.get(t.category_id),
          subcategory_name: subsMap.get(t.subcategory_id)
        }));

        setTalents(enriched);
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => setPage('talents')} className="flex items-center gap-3 bg-white text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-[#8A1538] hover:to-[#A5763F] px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-4">صفحتي</h1>
        <p className="text-xl text-gray-700 font-semibold">مواهبك المسجلة وحالة الطلبات</p>
      </div>

      {talents.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border-t-4 border-blue-600 max-w-2xl mx-auto">
          <FileText className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-800 mb-4">لم تسجل أي موهبة بعد</h2>
          <p className="text-gray-600 mb-8 text-lg">ابدأ رحلتك في اكتشاف مواهبك الآن</p>
          <button onClick={() => setPage('talents')} className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
            سجّل موهبتك الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {talents.map(t => (
            <div key={t.id} className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border-r-8 ${t.status === 'approved' ? 'border-green-500' : t.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'} transform hover:-translate-y-1`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-blue-600 mb-1">{t.subcategory_name}</h3>
                  <p className="text-gray-600 font-semibold">{t.category_name}</p>
                </div>
                <span className={`px-4 py-2 rounded-xl font-bold shadow-md text-sm ${t.status === 'approved' ? 'bg-green-100 text-green-800' : t.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {t.status === 'approved' ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> مقبول</span> : t.status === 'rejected' ? <span className="flex items-center gap-1"><XCircle className="w-4 h-4" /> مرفوض</span> : <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> قيد المراجعة</span>}
                </span>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2"><strong className="text-blue-600">المستوى:</strong> <span className="font-semibold">{t.proficiency}</span></p>
                <p className="flex items-center gap-2"><strong className="text-blue-600">سنوات الخبرة:</strong> <span className="font-semibold">{t.years_of_experience}</span></p>
                <p className="flex items-center gap-2 text-sm"><strong className="text-blue-600">التاريخ:</strong> <span className="font-semibold">{new Date(t.created_at).toLocaleDateString('ar-SA')}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [registrationNote, setRegistrationNote] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadAnnouncements();

    const channel = supabase
      .channel('announcements-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          loadAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  };

  const handleRegister = async (announcementId: string) => {
    if (!user) {
      showError('يجب تسجيل الدخول أولاً');
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase.from('announcement_registrations').insert({
        announcement_id: announcementId,
        student_id: user.id,
        notes: registrationNote,
        status: 'pending'
      });

      if (error) {
        if (error.code === '23505') {
          showError('أنت مسجل بالفعل في هذه المسابقة');
        } else {
          throw error;
        }
      } else {
        showSuccess('تم التسجيل بنجاح! جارٍ المراجعة');
        setSelectedAnnouncement(null);
        setRegistrationNote('');
      }
    } catch (err) {
      showError('حدث خطأ أثناء التسجيل');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-white text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-[#8A1538] hover:to-[#A5763F] px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-4">الإعلانات والمسابقات</h1>
        <p className="text-xl text-gray-700 font-semibold">تابع آخر الأخبار والمسابقات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {announcements.map(announcement => (
          <div key={announcement.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all border-t-4 border-blue-500">
            {announcement.image_url && (
              <img src={announcement.image_url} alt={announcement.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {announcement.type === 'competition' ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">مسابقة</span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">إعلان</span>
                )}
                {announcement.registration_open && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">التسجيل مفتوح</span>
                )}
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">{announcement.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{announcement.description}</p>
              {announcement.end_date && (
                <p className="text-sm text-gray-500 mb-4">
                  <strong>ينتهي في:</strong> {new Date(announcement.end_date).toLocaleDateString('ar-SA')}
                </p>
              )}
              {announcement.registration_open && announcement.type === 'competition' && (
                <button
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
                >
                  سجّل الآن
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-2xl font-black text-blue-600 mb-4">التسجيل في {selectedAnnouncement.title}</h2>
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
                <button onClick={() => setSelectedAnnouncement(null)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">إلغاء</button>
                <button
                  onClick={() => handleRegister(selectedAnnouncement.id)}
                  disabled={registering}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  {registering ? 'جارٍ التسجيل...' : 'تأكيد التسجيل'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HonorsPage() {
  const [honors, setHonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHonors = () => {
      supabase
        .from('honors')
        .select('*')
        .eq('is_published', true)
        .order('honor_date', { ascending: false })
        .then(({ data }) => {
          setHonors(data || []);
          setLoading(false);
        });
    };

    loadHonors();

    const channel = supabase
      .channel('honors-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'honors' },
        () => {
          loadHonors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-white text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-[#8A1538] hover:to-[#A5763F] px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-4">التكريمات</h1>
        <p className="text-xl text-gray-700 font-semibold">إنجازاتنا وتكريماتنا</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {honors.map(honor => (
          <div key={honor.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all border-t-4 border-amber-500">
            {honor.media_type === 'image' ? (
              <img src={honor.media_url} alt={honor.title} className="w-full h-56 object-cover" />
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
                <span className="text-sm text-gray-500">{new Date(honor.honor_date).toLocaleDateString('ar-SA')}</span>
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

function TeacherDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [talents, setTalents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState({ category: '', grade: '', search: '' });
  const [noteText, setNoteText] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', categoryId: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [talRes, catRes] = await Promise.all([
      supabase.from('student_talents').select('*').order('created_at', { ascending: false }),
      supabase.from('talent_categories').select('*')
    ]);

    setCategories(catRes.data || []);

    if (talRes.data && talRes.data.length > 0) {
      const stuIds = [...new Set(talRes.data.map(t => t.student_id))];
      const catIds = [...new Set(talRes.data.map(t => t.category_id))];
      const subIds = [...new Set(talRes.data.map(t => t.subcategory_id))];

      const [stus, cats, subs] = await Promise.all([
        supabase.from('users').select('id, full_name, grade, class').in('id', stuIds),
        supabase.from('talent_categories').select('id, name_ar').in('id', catIds),
        supabase.from('talent_subcategories').select('id, name_ar').in('id', subIds)
      ]);

      const stuMap = new Map(stus.data?.map(s => [s.id, s]));
      const catMap = new Map(cats.data?.map(c => [c.id, c.name_ar]));
      const subMap = new Map(subs.data?.map(s => [s.id, s.name_ar]));

      const enriched = talRes.data.map(t => {
        const stu = stuMap.get(t.student_id);
        return {
          ...t,
          student_name: stu?.full_name,
          grade: stu?.grade,
          class: stu?.class,
          category_name: catMap.get(t.category_id),
          subcategory_name: subMap.get(t.subcategory_id)
        };
      });

      setTalents(enriched);
    }
  };

  const handleAddNote = async (talentId: string) => {
    const text = noteText[talentId];
    if (!text?.trim()) return showError('الرجاء كتابة ملاحظة');

    try {
      await supabase.from('teacher_notes').insert({ student_talent_id: talentId, teacher_id: user.id, note_text: text });
      showSuccess('تم إضافة الملاحظة بنجاح');
      setNoteText({ ...noteText, [talentId]: '' });
    } catch {
      showError('حدث خطأ');
    }
  };

  const handleSuggest = async () => {
    if (!newSub.name || !newSub.categoryId) return showError('الرجاء ملء جميع الحقول');

    try {
      await supabase.from('talent_subcategories').insert({ name_ar: newSub.name, category_id: newSub.categoryId, created_by_teacher_id: user.id, is_approved: false });
      showSuccess('تم إرسال الاقتراح للمراجعة');
      setShowModal(false);
      setNewSub({ name: '', categoryId: '' });
    } catch {
      showError('حدث خطأ');
    }
  };

  const filtered = talents.filter(t => {
    if (filter.category && t.category_name !== filter.category) return false;
    if (filter.grade && t.grade !== filter.grade) return false;
    if (filter.search && !t.student_name?.includes(filter.search) && !t.subcategory_name?.includes(filter.search)) return false;
    return true;
  });

  const grades = [...new Set(talents.map(t => t.grade))].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-4">لوحة المعلم</h1>
        <p className="text-lg text-gray-600 font-semibold">مشاهدة طلبات الطلاب والإحصائيات</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-t-4 border-blue-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="البحث..." value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} className="w-full px-4 py-3 pr-12 border rounded-lg" />
          </div>
          <select value={filter.grade} onChange={(e) => setFilter({ ...filter, grade: e.target.value })} className="px-4 py-3 border rounded-lg">
            <option value="">جميع الصفوف</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} className="px-4 py-3 border rounded-lg">
            <option value="">جميع الأقسام</option>
            {categories.map(c => <option key={c.id} value={c.name_ar}>{c.name_ar}</option>)}
          </select>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-bold">
          <Plus className="w-5 h-5" />
          اقتراح موهبة جديدة
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border-t-4 border-blue-600">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="px-4 py-3 text-right text-sm">الطالب</th>
              <th className="px-4 py-3 text-right text-sm">الصف</th>
              <th className="px-4 py-3 text-right text-sm">القسم</th>
              <th className="px-4 py-3 text-right text-sm">التخصص</th>
              <th className="px-4 py-3 text-right text-sm">المستوى</th>
              <th className="px-4 py-3 text-right text-sm">الحالة</th>
              <th className="px-4 py-3 text-right text-sm">ملاحظة</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 font-semibold text-sm">{t.student_name}</td>
                <td className="px-4 py-3 text-sm">{t.grade} - {t.class}</td>
                <td className="px-4 py-3 text-sm">{t.category_name}</td>
                <td className="px-4 py-3 text-sm">{t.subcategory_name}</td>
                <td className="px-4 py-3 text-sm">{t.proficiency}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'approved' ? 'bg-green-100 text-green-800' : t.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {t.status === 'approved' ? 'مقبول' : t.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <input type="text" placeholder="اكتب ملاحظة..." value={noteText[t.id] || ''} onChange={(e) => setNoteText({ ...noteText, [t.id]: e.target.value })} className="flex-1 px-2 py-1 border rounded text-sm" />
                    <button onClick={() => handleAddNote(t.id)} className="bg-[#8A1538] text-white p-2 rounded hover:bg-[#A5763F]">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">اقتراح موهبة جديدة</h2>
            <div className="space-y-4">
              <select value={newSub.categoryId} onChange={(e) => setNewSub({ ...newSub, categoryId: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
                <option value="">اختر القسم</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
              <input type="text" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="اسم التخصص" />
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">إلغاء</button>
                <button onClick={handleSuggest} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-bold">إرسال</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, topTalent: '' });
  const [talents, setTalents] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [honors, setHonors] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [tab, setTab] = useState<'stats' | 'requests' | 'suggestions' | 'announcements' | 'honors' | 'settings'>('stats');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showHonorModal, setShowHonorModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '', type: 'announcement', image_url: '', registration_open: false, end_date: '', is_published: true });
  const [newHonor, setNewHonor] = useState({ title: '', description: '', image_url: '', video_url: '', media_type: 'image', honor_date: '' });

  useEffect(() => { loadData(); loadAnnouncements(); loadHonors(); loadSettings(); }, []);

  const loadData = async () => {
    const [talRes, subsRes] = await Promise.all([
      supabase.from('student_talents').select('*'),
      supabase.from('talent_subcategories').select('*, talent_categories(name_ar), users(full_name)').not('created_by_teacher_id', 'is', null)
    ]);

    const talData = talRes.data || [];
    const total = talData.length;
    const approved = talData.filter(t => t.status === 'approved').length;
    const pending = talData.filter(t => t.status === 'pending').length;

    const subCounts = talData.reduce((acc: any, t) => {
      acc[t.subcategory_id] = (acc[t.subcategory_id] || 0) + 1;
      return acc;
    }, {});

    let topSubId = '';
    let maxCount = 0;
    for (const [id, count] of Object.entries(subCounts)) {
      if ((count as number) > maxCount) {
        maxCount = count as number;
        topSubId = id;
      }
    }

    let topTalent = 'لا يوجد';
    if (topSubId) {
      const { data: sub } = await supabase.from('talent_subcategories').select('name_ar').eq('id', topSubId).single();
      topTalent = sub?.name_ar || 'لا يوجد';
    }

    setStats({ total, approved, pending, topTalent });

    if (talData.length > 0) {
      const stuIds = [...new Set(talData.map(t => t.student_id))];
      const catIds = [...new Set(talData.map(t => t.category_id))];
      const subIds = [...new Set(talData.map(t => t.subcategory_id))];

      const [stus, cats, subs] = await Promise.all([
        supabase.from('users').select('id, full_name').in('id', stuIds),
        supabase.from('talent_categories').select('id, name_ar').in('id', catIds),
        supabase.from('talent_subcategories').select('id, name_ar').in('id', subIds)
      ]);

      const stuMap = new Map(stus.data?.map(s => [s.id, s.full_name]));
      const catMap = new Map(cats.data?.map(c => [c.id, c.name_ar]));
      const subMap = new Map(subs.data?.map(s => [s.id, s.name_ar]));

      setTalents(talData.map(t => ({
        ...t,
        student_name: stuMap.get(t.student_id),
        category_name: catMap.get(t.category_id),
        subcategory_name: subMap.get(t.subcategory_id)
      })));
    }

    setSuggestions(subsRes.data?.map((s: any) => ({
      id: s.id,
      name_ar: s.name_ar,
      category_name: s.talent_categories?.name_ar,
      teacher_name: s.users?.full_name,
      is_approved: s.is_approved
    })) || []);
  };

  const loadAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setAnnouncements(data || []);
  };

  const loadHonors = async () => {
    const { data } = await supabase.from('honors').select('*').order('honor_date', { ascending: false });
    setHonors(data || []);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from('app_settings').select('*').order('key', { ascending: true });
    setSettings(data || []);
  };

  const handleSaveAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      return showError('الرجاء ملء جميع الحقول المطلوبة');
    }

    try {
      const announcementData: any = {
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        type: newAnnouncement.type,
        image_url: newAnnouncement.image_url || null,
        registration_open: newAnnouncement.registration_open,
        is_published: newAnnouncement.is_published,
        end_date: newAnnouncement.end_date ? new Date(newAnnouncement.end_date).toISOString() : null
      };

      if (editingItem) {
        const { error } = await supabase.from('announcements').update(announcementData).eq('id', editingItem.id);
        if (error) throw error;
        showSuccess('تم تحديث الإعلان بنجاح');
      } else {
        const { error } = await supabase.from('announcements').insert(announcementData);
        if (error) throw error;
        showSuccess('تم إضافة الإعلان بنجاح');
      }

      await loadAnnouncements();

      setShowAnnouncementModal(false);
      setEditingItem(null);
      setNewAnnouncement({ title: '', description: '', type: 'announcement', image_url: '', registration_open: false, end_date: '', is_published: true });
    } catch (error: any) {
      showError('حدث خطأ: ' + (error.message || 'خطأ غير معروف'));
      console.error('Error saving announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await supabase.from('announcements').delete().eq('id', id);
      showSuccess('تم حذف الإعلان بنجاح');
      await loadAnnouncements();
    } catch {
      showError('حدث خطأ');
    }
  };

  const handleSaveHonor = async () => {
    if (!newHonor.title || !newHonor.description) {
      return showError('الرجاء ملء جميع الحقول المطلوبة');
    }

    const honorData: any = { ...newHonor };
    if (newHonor.media_type === 'image') {
      honorData.media_url = newHonor.image_url;
      delete honorData.video_url;
    } else {
      honorData.media_url = newHonor.video_url;
      delete honorData.image_url;
    }
    delete honorData.image_url;
    delete honorData.video_url;

    try {
      if (editingItem) {
        await supabase.from('honors').update(honorData).eq('id', editingItem.id);
        showSuccess('تم تحديث التكريم بنجاح');
      } else {
        await supabase.from('honors').insert(honorData);
        showSuccess('تم إضافة التكريم بنجاح');
      }

      await loadHonors();

      setShowHonorModal(false);
      setEditingItem(null);
      setNewHonor({ title: '', description: '', image_url: '', video_url: '', media_type: 'image', honor_date: '' });
    } catch {
      showError('حدث خطأ');
    }
  };

  const handleDeleteHonor = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التكريم؟')) return;
    try {
      await supabase.from('honors').delete().eq('id', id);
      showSuccess('تم حذف التكريم بنجاح');
      await loadHonors();
    } catch {
      showError('حدث خطأ');
    }
  };

  const handleUpdateSetting = async (id: string, value: string) => {
    try {
      await supabase.from('app_settings').update({ value, updated_at: new Date().toISOString(), updated_by: user?.id }).eq('id', id);
      showSuccess('تم تحديث الإعداد بنجاح');
      await loadSettings();
    } catch {
      showError('حدث خطأ');
    }
  };

  const openEditAnnouncement = (announcement: any) => {
    setEditingItem(announcement);
    const endDateStr = announcement.end_date ? new Date(announcement.end_date).toISOString().split('T')[0] : '';
    setNewAnnouncement({
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      image_url: announcement.image_url || '',
      registration_open: announcement.registration_open,
      end_date: endDateStr,
      is_published: announcement.is_published !== undefined ? announcement.is_published : true
    });
    setShowAnnouncementModal(true);
  };

  const openEditHonor = (honor: any) => {
    setEditingItem(honor);
    setNewHonor({
      title: honor.title,
      description: honor.description,
      image_url: honor.media_type === 'image' ? honor.media_url : '',
      video_url: honor.media_type === 'video' ? honor.media_url : '',
      media_type: honor.media_type,
      honor_date: honor.honor_date || ''
    });
    setShowHonorModal(true);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await supabase.from('student_talents').update({ status }).eq('id', id);
      showSuccess(`تم ${status === 'approved' ? 'قبول' : 'رفض'} الطلب`);
      loadData();
    } catch {
      showError('حدث خطأ');
    }
  };

  const handleApproveSuggestion = async (id: string, approved: boolean) => {
    try {
      await supabase.from('talent_subcategories').update({ is_approved: approved }).eq('id', id);
      showSuccess(`تم ${approved ? 'الموافقة' : 'الرفض'}`);
      loadData();
    } catch {
      showError('حدث خطأ');
    }
  };

  const exportCSV = () => {
    const data = talents.map(t => ({
      'اسم الطالب': t.student_name,
      'القسم': t.category_name,
      'التخصص': t.subcategory_name,
      'المستوى': t.proficiency,
      'سنوات الخبرة': t.years_of_experience,
      'الحالة': t.status === 'approved' ? 'مقبول' : t.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة',
      'التاريخ': new Date(t.created_at).toLocaleDateString('ar-SA')
    }));

    const headers = Object.keys(data[0] || {});
    const csv = [headers.join(','), ...data.map(row => headers.map(h => row[h as keyof typeof row]).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'talents_export.csv';
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-4">لوحة الإدارة</h1>
        <p className="text-lg text-gray-600 font-semibold">مشاهدة جميع الطلبات والإحصائيات</p>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto">
        {[
          { key: 'stats', label: 'الإحصائيات' },
          { key: 'requests', label: `طلبات التسجيل (${stats.pending})` },
          { key: 'suggestions', label: 'اقتراحات المعلمين' },
          { key: 'announcements', label: 'إدارة الإعلانات' },
          { key: 'honors', label: 'إدارة التكريمات' },
          { key: 'settings', label: 'إعدادات التطبيق' }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-6 py-3 rounded-xl font-black transition-all whitespace-nowrap shadow-lg transform hover:scale-105 ${tab === t.key ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: 'إجمالي الطلبات', value: stats.total, color: 'from-blue-500 to-cyan-500', borderColor: 'border-blue-500' },
            { icon: CheckCircle, label: 'المقبولين', value: stats.approved, color: 'from-green-500 to-teal-500', borderColor: 'border-green-500' },
            { icon: Clock, label: 'قيد المراجعة', value: stats.pending, color: 'from-yellow-500 to-orange-500', borderColor: 'border-yellow-500' },
            { icon: TrendingUp, label: 'الأكثر تسجيلاً', value: stats.topTalent, color: 'from-rose-500 to-pink-500', borderColor: 'border-rose-500' }
          ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl p-6 transform hover:-translate-y-2 transition-all duration-300 border-t-4 ${stat.borderColor}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-600 font-semibold text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-600">
          <button onClick={exportCSV} className="mb-4 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600">
            <Download className="w-5 h-5" />
            تصدير CSV
          </button>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-right text-sm">الطالب</th>
                  <th className="px-4 py-3 text-right text-sm">القسم</th>
                  <th className="px-4 py-3 text-right text-sm">التخصص</th>
                  <th className="px-4 py-3 text-right text-sm">المستوى</th>
                  <th className="px-4 py-3 text-right text-sm">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {talents.map((t, i) => (
                  <tr key={t.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-semibold text-sm">{t.student_name}</td>
                    <td className="px-4 py-3 text-sm">{t.category_name}</td>
                    <td className="px-4 py-3 text-sm">{t.subcategory_name}</td>
                    <td className="px-4 py-3 text-sm">{t.proficiency}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'approved' ? 'bg-green-100 text-green-800' : t.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {t.status === 'approved' ? 'مقبول' : t.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateStatus(t.id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 font-semibold">قبول</button>
                          <button onClick={() => handleUpdateStatus(t.id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 font-semibold">رفض</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'announcements' && (
        <div className="space-y-6">
          <button
            onClick={() => {
              setEditingItem(null);
              setNewAnnouncement({ title: '', description: '', type: 'announcement', image_url: '', registration_open: false, end_date: '' });
              setShowAnnouncementModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            إضافة إعلان جديد
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-blue-500">
                {announcement.image_url && (
                  <img src={announcement.image_url} alt={announcement.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${announcement.type === 'competition' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {announcement.type === 'competition' ? 'مسابقة' : 'إعلان'}
                      </span>
                      {announcement.registration_open && (
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">مفتوح</span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${announcement.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {announcement.is_published ? 'منشور' : 'غير منشور'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditAnnouncement(announcement)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{announcement.description}</p>
                  {announcement.end_date && (
                    <p className="text-sm text-gray-500">ينتهي: {new Date(announcement.end_date).toLocaleDateString('en-GB')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'honors' && (
        <div className="space-y-6">
          <button
            onClick={() => {
              setEditingItem(null);
              setNewHonor({ title: '', description: '', image_url: '', video_url: '', media_type: 'image', honor_date: '' });
              setShowHonorModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            إضافة تكريم جديد
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {honors.map(honor => (
              <div key={honor.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-amber-500">
                {honor.media_type === 'image' ? (
                  honor.media_url && <img src={honor.media_url} alt={honor.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="relative w-full h-48 bg-black flex items-center justify-center text-white">
                    <Award className="w-12 h-12" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{new Date(honor.honor_date).toLocaleDateString('en-GB')}</span>
                    <div className="flex gap-2">
                      <button onClick={() => openEditHonor(honor)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteHonor(honor.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">{honor.title}</h3>
                  <p className="text-gray-600 text-sm">{honor.description}</p>
                  <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${honor.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {honor.is_published ? 'منشور' : 'غير منشور'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-black text-gray-800">إعدادات التطبيق</h2>
          </div>
          <div className="space-y-4">
            {settings.map(setting => (
              <div key={setting.id} className="border-b border-gray-200 pb-4">
                <label className="block text-gray-700 font-bold mb-2">{setting.description || setting.key}</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue={setting.value}
                    onBlur={(e) => {
                      if (e.target.value !== setting.value) {
                        handleUpdateSetting(setting.id, e.target.value);
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">المفتاح: {setting.key}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border-t-4 border-blue-600">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 text-right text-sm">اسم الموهبة</th>
                <th className="px-4 py-3 text-right text-sm">القسم</th>
                <th className="px-4 py-3 text-right text-sm">المعلم</th>
                <th className="px-4 py-3 text-right text-sm">الحالة</th>
                <th className="px-4 py-3 text-right text-sm">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-semibold text-sm">{s.name_ar}</td>
                  <td className="px-4 py-3 text-sm">{s.category_name}</td>
                  <td className="px-4 py-3 text-sm">{s.teacher_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {s.is_approved ? 'معتمد' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!s.is_approved && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveSuggestion(s.id, true)} className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 font-semibold">موافقة</button>
                        <button onClick={() => handleApproveSuggestion(s.id, false)} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 font-semibold">رفض</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAnnouncementModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-2xl font-black text-blue-600 mb-6">{editingItem ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">العنوان *</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  placeholder="عنوان الإعلان"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الوصف *</label>
                <textarea
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  rows={4}
                  placeholder="وصف الإعلان"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">رابط الصورة</label>
                <input
                  type="url"
                  value={newAnnouncement.image_url}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, image_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">النوع</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  >
                    <option value="announcement">إعلان</option>
                    <option value="competition">مسابقة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={newAnnouncement.end_date}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, end_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.registration_open}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, registration_open: e.target.checked })}
                    className="w-5 h-5 text-blue-600 focus:ring-[#8A1538]"
                    id="registration-open"
                  />
                  <label htmlFor="registration-open" className="text-gray-700 font-semibold">التسجيل مفتوح</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.is_published}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_published: e.target.checked })}
                    className="w-5 h-5 text-blue-600 focus:ring-[#8A1538]"
                    id="is-published"
                  />
                  <label htmlFor="is-published" className="text-gray-700 font-semibold">نشر الإعلان</label>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAnnouncementModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">إلغاء</button>
                <button onClick={handleSaveAnnouncement} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-bold">
                  {editingItem ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHonorModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowHonorModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-2xl font-black text-blue-600 mb-6">{editingItem ? 'تعديل التكريم' : 'إضافة تكريم جديد'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">العنوان *</label>
                <input
                  type="text"
                  value={newHonor.title}
                  onChange={(e) => setNewHonor({ ...newHonor, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  placeholder="عنوان التكريم"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الوصف *</label>
                <textarea
                  value={newHonor.description}
                  onChange={(e) => setNewHonor({ ...newHonor, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  rows={4}
                  placeholder="وصف التكريم"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">تاريخ التكريم</label>
                <input
                  type="date"
                  value={newHonor.honor_date}
                  onChange={(e) => setNewHonor({ ...newHonor, honor_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">نوع الوسائط</label>
                <select
                  value={newHonor.media_type}
                  onChange={(e) => setNewHonor({ ...newHonor, media_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                >
                  <option value="image">صورة</option>
                  <option value="video">فيديو</option>
                </select>
              </div>
              {newHonor.media_type === 'image' ? (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">رابط الصورة</label>
                  <input
                    type="url"
                    value={newHonor.image_url}
                    onChange={(e) => setNewHonor({ ...newHonor, image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">رابط الفيديو</label>
                  <input
                    type="url"
                    value={newHonor.video_url}
                    onChange={(e) => setNewHonor({ ...newHonor, video_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                    placeholder="https://youtube.com/embed/..."
                  />
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowHonorModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">إلغاء</button>
                <button onClick={handleSaveHonor} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-bold">
                  {editingItem ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
