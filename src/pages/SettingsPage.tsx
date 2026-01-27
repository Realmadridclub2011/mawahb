// src/pages/SettingsPage.tsx
import { useState } from 'react';
import { supabase } from '../supabase/client';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'هل أنت متأكد أنك تريد حذف حسابك نهائيًا؟ سيتم حذف جميع بياناتك ولا يمكن التراجع عن هذه العملية.'
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    // هنا الأفضل تستدعي Edge Function تحذف الحساب والـ data من الجداول
    const { data, error } = await supabase.functions.invoke('delete-account', {
      body: {}
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setError('حدث خطأ أثناء حذف الحساب. حاول مرة أخرى.');
      return;
    }

    // بعد الحذف، سجل خروج
    await supabase.auth.signOut();
    window.location.href = '/'; // رجّع المستخدم لصفحة البداية
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">الإعدادات</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="w-full rounded-md border border-red-600 text-red-600 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? 'جاري حذف الحساب...' : 'حذف الحساب نهائيًا'}
      </button>
    </div>
  );
}
