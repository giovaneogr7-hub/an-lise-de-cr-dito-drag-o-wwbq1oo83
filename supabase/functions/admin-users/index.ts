import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('Missing Authorization header')

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
    if (caller?.role !== 'admin' && caller?.role !== 'financeiro') throw new Error('Forbidden')

    const logAction = async (alvo: string | null, acao: string, detalhes: any) => {
      await supabaseAdmin
        .from('logs_auditoria')
        .insert({
          admin_id: user.id,
          usuario_alvo_id: alvo,
          acao,
          detalhes,
        })
        .catch(console.error)
    }

    const { action, ...body } = await req.json()

    if (action === 'create') {
      const { email, nome, role, cpf, valor_credito_aprovado, investimento_data } = body.data
      const pass = crypto.randomUUID().slice(0, 10) + 'A1!'
      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: pass,
        email_confirm: true,
      })
      if (createError) throw createError

      const { data: roleData } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('nome', role.toLowerCase())
        .maybeSingle()
      const targetStatus = ['cliente', 'investidor'].includes(role.toLowerCase())
        ? 'ativo'
        : 'pendente'

      const { error: insertError } = await supabaseAdmin.from('usuarios').insert({
        id: authData.user.id,
        email,
        nome,
        role: role.toLowerCase(),
        role_id: roleData?.id || null,
        status: targetStatus,
        cpf: cpf || null,
        valor_credito_aprovado: valor_credito_aprovado || 0,
      })
      if (insertError) throw insertError
      await logAction(authData.user.id, 'Criação de Usuário', { role })
      return new Response(JSON.stringify({ success: true, user: authData.user, password: pass }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'approve') {
      const pass = crypto.randomUUID().slice(0, 10) + 'X9#'
      await supabaseAdmin.auth.admin.updateUserById(body.userId, {
        password: pass,
        user_metadata: { force_password_change: true },
      })
      await supabaseAdmin.from('usuarios').update({ status: 'ativo' }).eq('id', body.userId)
      await logAction(body.userId, 'Aprovação', { new_status: 'ativo' })
      return new Response(JSON.stringify({ success: true, password: pass }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update') {
      const {
        userId,
        data: { nome, email, telefone, role, status, cpf, valor_credito_aprovado },
      } = body
      const { data: target } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      const payload: any = {}
      if (nome !== undefined) payload.nome = nome
      if (telefone !== undefined) payload.telefone = telefone
      if (status !== undefined) payload.status = status
      if (cpf !== undefined) payload.cpf = cpf
      if (valor_credito_aprovado !== undefined)
        payload.valor_credito_aprovado = valor_credito_aprovado

      if (role && role !== target.role) {
        const { data: roleData } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('nome', role.toLowerCase())
          .maybeSingle()
        payload.role = role.toLowerCase()
        payload.role_id = roleData?.id || null
      }

      if (email && email !== target.email) {
        await supabaseAdmin.auth.admin.updateUserById(userId, { email })
        payload.email = email
      }

      if (Object.keys(payload).length > 0) {
        await supabaseAdmin.from('usuarios').update(payload).eq('id', userId)
        await logAction(userId, 'Edição de Perfil', payload)
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      if (caller?.role !== 'admin') throw new Error('Apenas admins podem excluir.')
      const { data: targetUser } = await supabaseAdmin
        .from('usuarios')
        .select('email')
        .eq('id', body.userId)
        .maybeSingle()
      await supabaseAdmin.from('usuarios').delete().eq('id', body.userId)
      await supabaseAdmin.auth.admin.deleteUser(body.userId).catch(() => {})
      await logAction(body.userId, 'Exclusão', { email: targetUser?.email })
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
