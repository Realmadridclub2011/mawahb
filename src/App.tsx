import { useState, useEffect, createContext, useContext } from 'react';
import { UiCard, UiIconCircle } from "./components/ui/UiCard";
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

function Header({ showLogin, setShowLogin }: { showLogin?: boolean; setShowLogin?: (show: boolean) => void }) {
  const { user, logout } = useAuth();

  const getRoleName = (role: string) => {
    const names: Record<string, string> = { student: 'طالب', guardian: 'ولي أمر', teacher: 'معلم', admin: 'إداري' };
    return names[role] || role;
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 via-teal-700 to-cyan-700 text-white shadow-2xl border-b-2 md:border-b-4 border-teal-400" dir="rtl">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-2 py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg border border-white/20">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-slate-800" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-black text-xs md:text-sm leading-tight">{user.full_name}</p>
                  <p className="text-[10px] md:text-xs text-teal-200 font-semibold">{getRoleName(user.role)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Star className="w-6 h-6 md:w-7 md:h-7 text-teal-300" />
                <span className="font-black text-sm md:text-lg">المواهب</span>
              </div>
            )}
          </div>
          <h1 className="text-xs md:text-xl lg:text-2xl font-black drop-shadow-lg text-center flex-1 mx-2">كنوز قطر</h1>
          <div className="flex items-center">
            {user ? (
              <button onClick={logout} className="flex items-center gap-1 md:gap-2 bg-white/20 hover:bg-white/30 px-2 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-lg transition-all border border-white/30">
                <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden md:inline text-xs md:text-sm">خروج</span>
              </button>
            ) : (
              <button onClick={() => setShowLogin?.(true)} className="flex items-center gap-1 md:gap-2 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 md:px-4 md:py-2 rounded-lg font-bold shadow-lg transition-all border border-white/30">
                <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">دخول</span>
              </button>
            )}
          </div>
        </div>
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
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-50 via-teal-50 to-cyan-50 border-t-2 md:border-t-4 border-teal-600 shadow-2xl z-40" dir="rtl">
      <div className="container mx-auto px-1">
        <div className="grid grid-cols-4 gap-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out transform ${
                currentSection === item.id
                  ? 'text-teal-700 bg-gradient-to-b from-teal-100 to-teal-50 shadow-inner scale-95'
                  : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 hover:scale-110 active:scale-95 hover:shadow-lg'
              }`}
            >
              <item.icon className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-all duration-300 ${
                currentSection === item.id
                  ? 'scale-110 drop-shadow-md'
                  : 'group-hover:scale-125 group-hover:rotate-3'
              }`} />
              <span className={`text-[9px] md:text-xs font-bold leading-tight transition-all duration-300 ${
                currentSection === item.id ? 'scale-105' : ''
              }`}>{item.label}</span>
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
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-full mb-3">
            {isRegisterMode ? <User className="w-6 h-6 text-white" /> : <LogIn className="w-6 h-6 text-white" />}
          </div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-1">
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
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="example@school.com" required dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="••••••••" required dir="ltr" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 text-sm">
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => setIsRegisterMode(true)} className="text-emerald-600 font-bold text-sm hover:underline">
                ليس لديك حساب؟ سجل الآن
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">الاسم الكامل</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="أحمد محمد علي" required />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="example@school.com" required dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">نوع الحساب</label>
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" required>
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
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="الأول" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-sm">الفصل</label>
                    <input type="text" value={classRoom} onChange={(e) => setClassRoom(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="أ" required />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">رقم الجوال (اختياري)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="05xxxxxxxx" dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="••••••••" required minLength={6} dir="ltr" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1 text-sm">تأكيد كلمة المرور</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600" placeholder="••••••••" required minLength={6} dir="ltr" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 text-sm">
              {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
            </button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => setIsRegisterMode(false)} className="text-emerald-600 font-bold text-sm hover:underline">
                لديك حساب بالفعل؟ سجل دخول
              </button>
            </div>
          </form>
        )}

        {!isRegisterMode && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-bold text-[#8A1538] mb-2 text-xs">حسابات تجريبية:</h3>
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
<div className="app-bg">

        <Header />
        <div className="pb-20">
          <TeacherDashboard />
        </div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className="app-bg">
        <Header />
        <div className="pb-20">
          {currentSection === 'admin-dashboard' && <AdminDashboard />}
          {currentSection === 'home' && <HomePage setCurrentSection={(section) => {
            setCurrentSection(section);
            if (section === 'talents') setPage('talents');
          }} />}
          {currentSection === 'talents' && (
            <>
              {page === 'talents' && <TalentsHomePage setPage={setPage} setSelectedCategory={setSelectedCategory} />}
              {page === 'subcategories' && <SubcategoriesPage categoryId={selectedCategory!} setPage={setPage} setSelectedSubcategory={setSelectedSubcategory} setSelectedCategory={setSelectedCategory} />}
              {page === 'register' && <RegisterPage categoryId={selectedCategory!} subcategoryId={selectedSubcategory!} setPage={setPage} />}
              {page === 'mypage' && <MyPage setPage={setPage} />}
            </>
          )}
          {currentSection === 'announcements' && <AnnouncementsPage />}
          {currentSection === 'honors' && <HonorsPage />}
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-50 via-teal-50 to-cyan-50 border-t-2 md:border-t-4 border-teal-600 shadow-2xl z-40" dir="rtl">
          <div className="container mx-auto px-1">
            <div className="grid grid-cols-5 gap-0.5">
              <button
                onClick={() => setCurrentSection('home')}
                className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out transform ${
                  currentSection === 'home'
                    ? 'text-teal-700 bg-gradient-to-b from-teal-100 to-teal-50 shadow-inner scale-95'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 hover:scale-110 active:scale-95 hover:shadow-lg'
                }`}
              >
                <Home className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-all duration-300 ${
                  currentSection === 'home' ? 'scale-110 drop-shadow-md' : ''
                }`} />
                <span className={`text-[10px] md:text-xs font-bold transition-all duration-300 ${
                  currentSection === 'home' ? 'scale-105' : ''
                }`}>الرئيسية</span>
              </button>
              <button
                onClick={() => {
                  setCurrentSection('talents');
                  setPage('talents');
                }}
                className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out transform ${
                  currentSection === 'talents'
                    ? 'text-teal-700 bg-gradient-to-b from-teal-100 to-teal-50 shadow-inner scale-95'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 hover:scale-110 active:scale-95 hover:shadow-lg'
                }`}
              >
                <Star className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-all duration-300 ${
                  currentSection === 'talents' ? 'scale-110 drop-shadow-md' : ''
                }`} />
                <span className={`text-[10px] md:text-xs font-bold transition-all duration-300 ${
                  currentSection === 'talents' ? 'scale-105' : ''
                }`}>المواهب</span>
              </button>
              <button
                onClick={() => setCurrentSection('announcements')}
                className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out transform ${
                  currentSection === 'announcements'
                    ? 'text-teal-700 bg-gradient-to-b from-teal-100 to-teal-50 shadow-inner scale-95'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 hover:scale-110 active:scale-95 hover:shadow-lg'
                }`}
              >
                <Megaphone className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-all duration-300 ${
                  currentSection === 'announcements' ? 'scale-110 drop-shadow-md' : ''
                }`} />
                <span className={`text-[10px] md:text-xs font-bold transition-all duration-300 ${
                  currentSection === 'announcements' ? 'scale-105' : ''
                }`}>الإعلانات</span>
              </button>
              <button
                onClick={() => setCurrentSection('honors')}
                className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out transform ${
                  currentSection === 'honors'
                    ? 'text-teal-700 bg-gradient-to-b from-teal-100 to-teal-50 shadow-inner scale-95'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 hover:scale-110 active:scale-95 hover:shadow-lg'
                }`}
              >
                <Trophy className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-all duration-300 ${
                  currentSection === 'honors' ? 'scale-110 drop-shadow-md' : ''
                }`} />
                <span className={`text-[10px] md:text-xs font-bold transition-all duration-300 ${
                  currentSection === 'honors' ? 'scale-105' : ''
                }`}>التكريمات</span>
              </button>
              <button
                onClick={() => setCurrentSection('admin-dashboard')}
                className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ease-in-out transform ${
                  currentSection === 'admin-dashboard'
                    ? 'text-teal-700 bg-gradient-to-b from-teal-100 to-teal-50 shadow-inner scale-95'
                    : 'text-gray-600 hover:text-teal-700 hover:bg-teal-50 hover:scale-110 active:scale-95 hover:shadow-lg'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 transition-all duration-300 ${
                  currentSection === 'admin-dashboard' ? 'scale-110 drop-shadow-md' : ''
                }`} />
                <span className={`text-[10px] md:text-xs font-bold transition-all duration-300 ${
                  currentSection === 'admin-dashboard' ? 'scale-105' : ''
                }`}>لوحة التحكم</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="app-bg">
      <Header showLogin={showLogin} setShowLogin={setShowLogin} />
      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />

      <div className="pb-20">
        {currentSection === 'home' && <HomePage setCurrentSection={(section) => {
          setCurrentSection(section);
          if (section === 'talents') setPage('talents');
        }} />}
        {currentSection === 'talents' && (
          <>
            {page === 'talents' && <TalentsHomePage setPage={setPage} setSelectedCategory={setSelectedCategory} />}
            {page === 'subcategories' && <SubcategoriesPage categoryId={selectedCategory!} setPage={setPage} setSelectedSubcategory={setSelectedSubcategory} setSelectedCategory={setSelectedCategory} />}
            {page === 'register' && <RegisterPage categoryId={selectedCategory!} subcategoryId={selectedSubcategory!} setPage={setPage} />}
            {page === 'mypage' && <MyPage setPage={setPage} />}
          </>
        )}
        {currentSection === 'announcements' && <AnnouncementsPage />}
        {currentSection === 'honors' && <HonorsPage />}
      </div>

      <BottomNav currentSection={currentSection} setCurrentSection={(section) => {
        setCurrentSection(section);
        if (section === 'talents') setPage('talents');
      }} />
    </div>
  );
}

function HomePage({ setCurrentSection }: { setCurrentSection: (section: string) => void }) {
  // صور Illustrations (مؤقتًا من icons8 — بعدين لو رفعت ملفاتك هنبدّلها محلي)
  const tiles = [
    {
      id: "talents",
      title: "اكتشف موهبتك",
      sub: "سجّل موهبتك الآن",
      badge: "ابدأ الآن",
      variant: "maroon" as const,
      img: "https://img.icons8.com/color/256/treasure-chest.png",
    },
    {
      id: "announcements",
      title: "الإعلانات والمسابقات",
      sub: "تابع آخر الفرص",
      badge: "التسجيل مفتوح",
      variant: "cyan" as const,
      img: "https://img.icons8.com/color/256/megaphone.png",
    },
    {
      id: "honors",
      title: "التكريمات",
      sub: "إنجازات المدرسة",
      badge: "شاهد المزيد",
      variant: "emerald" as const,
      img: "https://img.icons8.com/color/256/trophy.png",
    },
  ];

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2 drop-shadow-sm">
          مرحباً بك في كنوز قطر
        </h1>
        <p className="text-sm md:text-lg text-gray-600 font-semibold">
          اكتشف مواهبك، سجل في المسابقات، واحتفل بالإنجازات
        </p>
      </div>

      {/* ✅ Tiles Grid مثل الصورة */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
        {tiles.map((t) => (
          <UiTile
            key={t.id}
            variant={t.variant}
            onClick={() => setCurrentSection(t.id)}
            className="p-3 md:p-4 min-h-[170px] md:min-h-[210px]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="ui-badge">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                {t.badge}
              </span>

              <div className="w-9 h-9 rounded-full bg-white/70 border border-white/60 shadow-md flex items-center justify-center">
                <span className="text-xs font-black text-slate-700">★</span>
              </div>
            </div>

            <div className="mt-3 ui-tile-media">
              <img src={t.img} alt={t.title} />
            </div>

            <div className="mt-3">
              <div className="ui-tile-title text-base md:text-lg">{t.title}</div>
              <div className="ui-tile-sub text-xs md:text-sm mt-1">{t.sub}</div>
            </div>
          </UiTile>
        ))}

        {/* ✅ بطاقة إضافية صغيرة (اختياري) لو تحب نفس فكرة “grid” في الصورة */}
        <UiTile
          variant="teal"
          onClick={() => setCurrentSection("talents")}
          className="col-span-2 md:col-span-1 p-3 md:p-4 min-h-[170px] md:min-h-[210px]"
        >
          <div className="flex items-start justify-between">
            <span className="ui-badge">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
              منصة المواهب
            </span>
          </div>

          <div className="mt-3 ui-tile-media">
            <img
              src="https://img.icons8.com/color/256/reading.png"
              alt="منصة المواهب"
            />
          </div>

          <div className="mt-3">
            <div className="ui-tile-title text-base md:text-lg">مسارات متنوعة</div>
            <div className="ui-tile-sub text-xs md:text-sm mt-1">رياضية • فنية • علمية • تقنية</div>
          </div>
        </UiTile>
      </div>

      {/* Footer Hint */}
      <div className="mt-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-lg p-4 md:p-6 text-center text-white max-w-5xl mx-auto">
        <h2 className="text-lg md:text-2xl font-black mb-2">ابدأ رحلتك الآن</h2>
        <p className="text-sm md:text-lg mb-3">استخدم الشريط السفلي للتنقل بين الأقسام</p>
        <div className="flex items-center justify-center gap-2 md:gap-4 text-emerald-200">
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
    { gradient: 'from-blue-400 via-cyan-400 to-emerald-400', name: 'رياضية' },
    { gradient: 'from-purple-400 via-pink-400 to-rose-400', name: 'فنية' },
    { gradient: 'from-amber-400 via-yellow-300 to-orange-200', name: 'أدبية' },
    { gradient: 'from-blue-600 via-cyan-500 to-teal-400', name: 'علمية' },
    { gradient: 'from-gray-400 via-slate-400 to-sky-300', name: 'تقنية' }
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <div className="text-center mb-6">
        {user && (
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl shadow-lg">
              <p className="text-sm md:text-lg font-black drop-shadow-md">مرحباً {user.full_name}</p>
            </div>
          </div>
        )}
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2 drop-shadow-sm">اكتشف موهبتك</h1>
        <p className="text-sm md:text-lg text-gray-600 font-semibold mb-4">نور مستقبلك بموهبتك الفريدة</p>
        {user && (
          <button onClick={() => setPage('mypage')} className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all text-sm md:text-base">
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span>صفحتي</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat, i) => {
          const colorClasses = ['ui-card-teal', 'ui-card-purple', 'ui-card-amber', 'ui-card-blue', 'ui-card-cyan'];
          const iconColors = [
            'from-teal-400 to-emerald-500',
            'from-purple-400 to-pink-500',
            'from-amber-400 to-orange-500',
            'from-blue-400 to-cyan-500',
            'from-cyan-400 to-sky-500'
          ];
          const colorClass = colorClasses[i % colorClasses.length];
          const iconColor = iconColors[i % iconColors.length];

          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage('subcategories'); }}
              className={`group ui-card ui-card-hover ${colorClass} overflow-hidden h-36 md:h-44 active:scale-[0.99]`}
            >
              <div className="p-3 flex flex-col items-center justify-center h-full">
                <div className={`mb-3 w-12 h-12 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md`}>
                  <img src={getIconImage(cat.icon)} alt={cat.name_ar} className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-base md:text-lg font-black text-slate-900 mb-1">{cat.name_ar}</h3>
                <div className="w-10 h-0.5 bg-slate-200 rounded-full"></div>
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
    'from-rose-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-emerald-400 to-teal-400',
    'from-amber-400 to-yellow-400',
    'from-purple-400 to-pink-400',
    'from-sky-400 to-blue-400',
    'from-orange-400 to-red-400',
    'from-teal-400 to-cyan-400'
  ];

  return (
    <div className="container mx-auto px-3 py-6" dir="rtl">
      <button onClick={() => setPage('talents')} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold mb-6 shadow-lg active:scale-95 transition-all text-sm md:text-base">
        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        <span>العودة للأقسام</span>
      </button>

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-2 drop-shadow-sm">{category?.name_ar}</h1>
        <p className="text-sm md:text-lg text-gray-600 font-semibold">اختر التخصص المناسب لموهبتك</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {subcategories.map((sub, idx) => {
          const colorClasses = ['ui-card-rose', 'ui-card-blue', 'ui-card-teal', 'ui-card-amber', 'ui-card-purple', 'ui-card-cyan'];
          const iconColors = [
            'from-rose-400 to-pink-500',
            'from-blue-400 to-indigo-500',
            'from-teal-400 to-emerald-500',
            'from-amber-400 to-yellow-500',
            'from-purple-400 to-fuchsia-500',
            'from-cyan-400 to-blue-500'
          ];
          const colorClass = colorClasses[idx % colorClasses.length];
          const iconColor = iconColors[idx % iconColors.length];

          return (
            <button
              key={sub.id}
              onClick={() => { setSelectedSubcategory(sub.id); setPage('register'); }}
              className={`group ui-card ui-card-hover ${colorClass} overflow-hidden h-36 md:h-40 active:scale-[0.99]`}
            >
              <div className="p-3 flex flex-col items-center justify-center h-full">
                <div className={`mb-2 w-12 h-12 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md`}>
                  <Award className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-sm md:text-base font-black text-slate-900 text-center">{sub.name_ar}</h3>
              </div>
            </button>
          );
        })}
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
      <div className="app-bg min-h-screen flex items-center justify-center px-4 py-16" dir="rtl">
        <div className="max-w-md w-full">
          <div className="ui-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-amber-50/50 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl animate-icon-appear">
                <LogIn className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-3">يجب تسجيل الدخول</h2>
              <p className="text-gray-600 mb-8 text-lg">لتسجيل موهبتك، يرجى تسجيل الدخول أولاً</p>
              <button
                onClick={() => setPage('talents')}
                className="bg-gradient-to-r from-rose-600 to-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1"
              >
                العودة للأقسام
              </button>
            </div>
          </div>
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
      <button onClick={() => setPage('subcategories')} className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة</span>
      </button>

      <div className="max-w-2xl mx-auto ui-card p-8 border-t-4 border-emerald-600">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-8 text-center">نموذج تسجيل الموهبة</h1>

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
              <input type="checkbox" checked={form.consent_guardian} onChange={(e) => setForm({ ...form, consent_guardian: e.target.checked })} className="mt-1 w-5 h-5 text-[#8A1538]" required />
              <span className="text-gray-700"><strong>موافقة ولي الأمر:</strong> أقر بأن ولي أمري على علم بتسجيل هذه الموهبة ويوافق على المشاركة *</span>
            </label>
          </div>

          <button type="submit" disabled={loading || !form.consent_guardian} className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-4 rounded-xl font-black text-lg hover:shadow-xl transition disabled:opacity-50">
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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => setPage('talents')} className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">صفحتي</h1>
        <p className="text-xl text-gray-600 font-semibold">مواهبك المسجلة وحالة الطلبات</p>
      </div>

      {talents.length === 0 ? (
        <div className="ui-card p-16 text-center border-t-4 border-emerald-600 max-w-2xl mx-auto">
          <FileText className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-800 mb-4">لم تسجل أي موهبة بعد</h2>
          <p className="text-gray-600 mb-8 text-lg">ابدأ رحلتك في اكتشاف مواهبك الآن</p>
          <button onClick={() => setPage('talents')} className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
            سجّل موهبتك الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {talents.map(t => (
            <div key={t.id} className={`ui-card ui-card-hover ${t.status === 'approved' ? 'ui-card-teal border-green-500' : t.status === 'rejected' ? 'ui-card-rose border-red-500' : 'ui-card-amber border-yellow-500'} p-6 border-r-8`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-[#8A1538] mb-1">{t.subcategory_name}</h3>
                  <p className="text-gray-600 font-semibold">{t.category_name}</p>
                </div>
                <span className={`px-4 py-2 rounded-xl font-bold shadow-md text-sm ${t.status === 'approved' ? 'bg-green-100 text-green-800' : t.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {t.status === 'approved' ? <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> مقبول</span> : t.status === 'rejected' ? <span className="flex items-center gap-1"><XCircle className="w-4 h-4" /> مرفوض</span> : <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> قيد المراجعة</span>}
                </span>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2"><strong className="text-[#8A1538]">المستوى:</strong> <span className="font-semibold">{t.proficiency}</span></p>
                <p className="flex items-center gap-2"><strong className="text-[#8A1538]">سنوات الخبرة:</strong> <span className="font-semibold">{t.years_of_experience}</span></p>
                <p className="flex items-center gap-2 text-sm"><strong className="text-[#8A1538]">التاريخ:</strong> <span className="font-semibold">{new Date(t.created_at).toLocaleDateString('ar-SA')}</span></p>
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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">الإعلانات والمسابقات</h1>
        <p className="text-xl text-gray-600 font-semibold">تابع آخر الأخبار والمسابقات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {announcements.map(announcement => (
          <div key={announcement.id} className="ui-card ui-card-hover ui-card-blue overflow-hidden border-t-4 border-blue-500">
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAnnouncement(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-2xl font-black text-[#8A1538] mb-4">التسجيل في {selectedAnnouncement.title}</h2>
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
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8A1538] border-t-transparent"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold mb-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-emerald-600">
        <ArrowRight className="w-5 h-5" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">التكريمات</h1>
        <p className="text-xl text-gray-600 font-semibold">إنجازاتنا وتكريماتنا</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {honors.map(honor => (
          <div key={honor.id} className="ui-card ui-card-hover ui-card-amber overflow-hidden border-t-4 border-amber-500">
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
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">لوحة المعلم</h1>
        <p className="text-lg text-gray-600 font-semibold">مشاهدة طلبات الطلاب والإحصائيات</p>
      </div>

      <div className="ui-card p-6 mb-6 border-t-4 border-emerald-600">
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
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-bold">
          <Plus className="w-5 h-5" />
          اقتراح موهبة جديدة
        </button>
      </div>

      <div className="ui-card overflow-x-auto border-t-4 border-emerald-600">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
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
            <h2 className="text-2xl font-bold text-[#8A1538] mb-6">اقتراح موهبة جديدة</h2>
            <div className="space-y-4">
              <select value={newSub.categoryId} onChange={(e) => setNewSub({ ...newSub, categoryId: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
                <option value="">اختر القسم</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
              <input type="text" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="اسم التخصص" />
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">إلغاء</button>
                <button onClick={handleSuggest} className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-bold">إرسال</button>
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
  const [accounts, setAccounts] = useState<any[]>([]);
  const [tab, setTab] = useState<'stats' | 'requests' | 'suggestions' | 'announcements' | 'honors' | 'settings' | 'accounts'>('stats');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showHonorModal, setShowHonorModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '', type: 'announcement', image_url: '', registration_open: false, end_date: '', is_published: true });
  const [newHonor, setNewHonor] = useState({ title: '', description: '', image_url: '', video_url: '', media_type: 'image', honor_date: '' });

  useEffect(() => { loadData(); loadAnnouncements(); loadHonors(); loadSettings(); loadAccounts(); }, []);

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

  const loadAccounts = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setAccounts(data || []);
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
    if (error) {
      showError('فشل تحديث الدور');
    } else {
      showSuccess('تم تحديث الدور بنجاح');
      loadAccounts();
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/update-admin-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: selectedAccount.email,
          newPassword: newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل إعادة تعيين كلمة المرور');
      }

      showSuccess('تم إعادة تعيين كلمة المرور بنجاح');
      setShowResetPasswordModal(false);
      setNewPassword('');
      setSelectedAccount(null);
    } catch (error: any) {
      showError(error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedAccount) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showError('الجلسة غير صالحة');
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: selectedAccount.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل حذف المستخدم');
      }

      showSuccess('تم حذف الحساب بنجاح');
      setShowDeleteUserModal(false);
      setSelectedAccount(null);
      loadAccounts();
    } catch (error: any) {
      showError(error.message || 'حدث خطأ أثناء حذف المستخدم');
    }
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
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4">لوحة الإدارة</h1>
        <p className="text-lg text-gray-600 font-semibold">مشاهدة جميع الطلبات والإحصائيات</p>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto">
        {[
          { key: 'stats', label: 'الإحصائيات' },
          { key: 'requests', label: `طلبات التسجيل (${stats.pending})` },
          { key: 'suggestions', label: 'اقتراحات المعلمين' },
          { key: 'announcements', label: 'إدارة الإعلانات' },
          { key: 'honors', label: 'إدارة التكريمات' },
          { key: 'accounts', label: 'إدارة الحسابات' },
          { key: 'settings', label: 'إعدادات التطبيق' }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-6 py-3 rounded-xl font-black transition-all whitespace-nowrap shadow-lg transform hover:scale-105 ${tab === t.key ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-xl' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: 'إجمالي الطلبات', value: stats.total, iconColor: 'from-blue-400 to-cyan-500', borderColor: 'border-blue-500', hoverColor: 'ui-card-blue' },
            { icon: CheckCircle, label: 'المقبولين', value: stats.approved, iconColor: 'from-green-400 to-teal-500', borderColor: 'border-green-500', hoverColor: 'ui-card-teal' },
            { icon: Clock, label: 'قيد المراجعة', value: stats.pending, iconColor: 'from-yellow-400 to-orange-500', borderColor: 'border-yellow-500', hoverColor: 'ui-card-amber' },
            { icon: TrendingUp, label: 'الأكثر تسجيلاً', value: stats.topTalent, iconColor: 'from-rose-400 to-pink-500', borderColor: 'border-rose-500', hoverColor: 'ui-card-rose' }
          ].map((stat, i) => (
            <div key={i} className={`ui-card ui-card-hover ${stat.hoverColor} p-6 border-t-4 ${stat.borderColor}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.iconColor} flex items-center justify-center shadow-md`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 font-semibold text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="ui-card p-6 border-t-4 border-[#8A1538]">
          <button onClick={exportCSV} className="mb-4 flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600">
            <Download className="w-5 h-5" />
            تصدير CSV
          </button>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
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
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            إضافة إعلان جديد
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map(announcement => (
              <div key={announcement.id} className="ui-card overflow-hidden border-t-4 border-blue-500">
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
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            إضافة تكريم جديد
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {honors.map(honor => (
              <div key={honor.id} className="ui-card overflow-hidden border-t-4 border-amber-500">
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
        <div className="ui-card p-8 border-t-4 border-[#8A1538]">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-[#8A1538]" />
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

      {tab === 'accounts' && (
        <div className="ui-card p-6 border-t-4 border-[#8A1538]">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-[#8A1538]" />
            <h2 className="text-2xl font-black text-gray-800">إدارة الحسابات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-right text-sm">الاسم الكامل</th>
                  <th className="px-4 py-3 text-right text-sm">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right text-sm">الصف</th>
                  <th className="px-4 py-3 text-right text-sm">الفصل</th>
                  <th className="px-4 py-3 text-right text-sm">رقم الجوال</th>
                  <th className="px-4 py-3 text-right text-sm">الدور الحالي</th>
                  <th className="px-4 py-3 text-right text-sm">تغيير الدور</th>
                  <th className="px-4 py-3 text-right text-sm">إعادة تعيين كلمة المرور</th>
                  <th className="px-4 py-3 text-right text-sm">حذف الحساب</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, i) => (
                  <tr key={account.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 font-semibold text-sm">{account.full_name || '-'}</td>
                    <td className="px-4 py-3 text-sm">{account.email}</td>
                    <td className="px-4 py-3 text-sm">{account.grade || '-'}</td>
                    <td className="px-4 py-3 text-sm">{account.class || '-'}</td>
                    <td className="px-4 py-3 text-sm">{account.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        account.role === 'admin' ? 'bg-red-100 text-red-800' :
                        account.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                        account.role === 'guardian' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {account.role === 'admin' ? 'إداري' :
                         account.role === 'teacher' ? 'معلم' :
                         account.role === 'guardian' ? 'ولي أمر' :
                         'طالب'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={account.role}
                        onChange={(e) => handleUpdateUserRole(account.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#8A1538] font-semibold"
                      >
                        <option value="student">طالب</option>
                        <option value="guardian">ولي أمر</option>
                        <option value="teacher">معلم</option>
                        <option value="admin">إداري</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowResetPasswordModal(true);
                        }}
                        className="bg-orange-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-orange-600 font-semibold transition-colors"
                      >
                        إعادة تعيين
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDeleteUserModal(true);
                        }}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-red-600 font-semibold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="ui-card overflow-x-auto border-t-4 border-[#8A1538]">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
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
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-6">{editingItem ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h2>
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
                    className="w-5 h-5 text-[#8A1538] focus:ring-[#8A1538]"
                    id="registration-open"
                  />
                  <label htmlFor="registration-open" className="text-gray-700 font-semibold">التسجيل مفتوح</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.is_published}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_published: e.target.checked })}
                    className="w-5 h-5 text-[#8A1538] focus:ring-[#8A1538]"
                    id="is-published"
                  />
                  <label htmlFor="is-published" className="text-gray-700 font-semibold">نشر الإعلان</label>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAnnouncementModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">إلغاء</button>
                <button onClick={handleSaveAnnouncement} className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-bold">
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
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-6">{editingItem ? 'تعديل التكريم' : 'إضافة تكريم جديد'}</h2>
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
                <button onClick={handleSaveHonor} className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-lg font-bold">
                  {editingItem ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowResetPasswordModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-6">إعادة تعيين كلمة المرور</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الحساب</label>
                <input
                  type="text"
                  value={selectedAccount?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">كلمة المرور الجديدة *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A1538]"
                  placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => {
                  setShowResetPasswordModal(false);
                  setNewPassword('');
                  setSelectedAccount(null);
                }} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold hover:bg-gray-300">إلغاء</button>
                <button onClick={handleResetPassword} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600">
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteUserModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteUserModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-2xl font-black text-red-600 mb-4">تأكيد حذف الحساب</h2>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-gray-800 font-semibold mb-2">هل أنت متأكد من حذف هذا الحساب؟</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>الاسم:</strong> {selectedAccount?.full_name || '-'}</p>
                  <p><strong>البريد الإلكتروني:</strong> {selectedAccount?.email}</p>
                </div>
                <p className="text-red-600 font-bold text-sm mt-3">تحذير: هذا الإجراء لا يمكن التراجع عنه!</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => {
                  setShowDeleteUserModal(false);
                  setSelectedAccount(null);
                }} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold hover:bg-gray-300">إلغاء</button>
                <button onClick={handleDeleteUser} className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  حذف الحساب
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