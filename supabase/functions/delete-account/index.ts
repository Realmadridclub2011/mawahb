// supabase/functions/delete-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*', // في الإنتاج يفضل تضع الدومين الحقيقي بدل *
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // ردّ على طلب الـ preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const authHeader = req.headers.get('Authorization');
  const jwt = authHeader?.replace('Bearer ', '');

  if (!jwt) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const userId = user.id;

  // 1) حذف بيانات المستخدم من جداولك
  await supabase.from('student_talents').delete().eq('student_id', userId);
  await supabase.from('teacher_notes').delete().eq('teacher_id', userId);
  // زوّد أي جداول أخرى مرتبطة بالمستخدم

  // 2) حذف صف المستخدم من جدول users
  await supabase.from('users').delete().eq('id', userId);

  // 3) حذف مستخدم auth نفسه
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders,
  });
});
