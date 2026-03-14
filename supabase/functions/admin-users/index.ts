import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) throw new Error('Unauthorized')

    const { data: caller } = await supabaseAdmin
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (caller?.role !== 'admin') throw new Error('Forbidden: Admins only')

    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { email, nome, role } = body.data

      const dummyPassword = Math.random().toString(36).slice(-12) + 'A1!'
      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: dummyPassword,
        email_confirm: true,
        user_metadata: { force_password_change: true },
      })
      if (createError) throw createError

      const { data: roleData } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('nome', role.toLowerCase())
        .maybeSingle()

      const { error: insertError } = await supabaseAdmin.from('usuarios').insert({
        id: authData.user.id,
        email,
        nome,
        role: role.toLowerCase(),
        role_id: roleData?.id || null,
        status: 'pendente',
      })
      if (insertError) throw insertError

      return new Response(JSON.stringify({ success: true, user: authData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'approve') {
      const { userId } = body

      const { data: targetUser } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (!targetUser) throw new Error('User not found')

      const newPassword = Math.random().toString(36).slice(-10) + 'X9#'

      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
        user_metadata: { force_password_change: true },
      })
      if (updateAuthError) throw updateAuthError

      const { error: updateDbError } = await supabaseAdmin
        .from('usuarios')
        .update({ status: 'ativo' })
        .eq('id', userId)
      if (updateDbError) throw updateDbError

      console.log(`[MOCK EMAIL] Sent to ${targetUser.email}. Password: ${newPassword}`)
      return new Response(JSON.stringify({ success: true, password: newPassword }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update') {
      const {
        userId,
        data: { nome, role },
      } = body
      const { data: roleData } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('nome', role.toLowerCase())
        .maybeSingle()

      const { error: updateDbError } = await supabaseAdmin
        .from('usuarios')
        .update({
          nome,
          role: role.toLowerCase(),
          role_id: roleData?.id || null,
        })
        .eq('id', userId)
      if (updateDbError) throw updateDbError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'deactivate') {
      const { userId } = body
      const { error: updateDbError } = await supabaseAdmin
        .from('usuarios')
        .update({ status: 'inativo' })
        .eq('id', userId)
      if (updateDbError) throw updateDbError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
