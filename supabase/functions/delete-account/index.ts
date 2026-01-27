// supabase/functions/delete-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const authHeader = req.headers.get('Authorization');
  const jwt = authHeader?.replace('Bearer ', '');

  if (!jwt) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = user.id;

  // 1) حذف بيانات المستخدم من جداولك
  await supabase.from('studenttalents').delete().eq('studentid', userId);
  await supabase.from('teachernotes').delete().eq('teacherid', userId);
  // لو عندك جداول أخرى مرتبطة بالمستخدم زوّدها هنا

  // 2) حذف صف المستخدم من جدول users
  await supabase.from('users').delete().eq('id', userId);

  // 3) حذف مستخدم auth نفسه
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
