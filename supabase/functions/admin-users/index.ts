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
    if (caller?.role !== 'admin' && caller?.role !== 'financeiro')
      throw new Error('Forbidden: Insufficient permissions')

    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { email, nome, role, cpf, valor_credito_aprovado, investimento_data } = body.data

      if (
        caller?.role === 'financeiro' &&
        !['cliente', 'investidor'].includes(role.toLowerCase())
      ) {
        throw new Error('Financeiro can only create clients or investors.')
      }

      const generatedPassword = crypto.randomUUID().replace(/-/g, '').slice(0, 9) + 'A1!'

      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { force_password_change: true },
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

      if (role.toLowerCase() === 'investidor' && investimento_data) {
        const { operacao_id, valor_investido, percentual_retorno, data_investimento } =
          investimento_data
        if (operacao_id) {
          const { error: invError } = await supabaseAdmin.from('investimentos').insert({
            usuario_id: authData.user.id,
            operacao_id,
            valor_investido,
            percentual_retorno,
            data_investimento,
            status: 'ativo',
          })
          if (invError) throw invError
        }
      }

      return new Response(
        JSON.stringify({ success: true, user: authData.user, password: generatedPassword }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (action === 'approve') {
      const { userId } = body
      const { data: targetUser } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (!targetUser) throw new Error('User not found')

      const newPassword = crypto.randomUUID().replace(/-/g, '').slice(0, 9) + 'X9#'

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
        data: { nome, role, cpf, valor_credito_aprovado, investimento_data },
      } = body

      if (caller?.role === 'financeiro') {
        const { data: target } = await supabaseAdmin
          .from('usuarios')
          .select('role')
          .eq('id', userId)
          .single()
        if (target?.role !== 'cliente' && target?.role !== 'investidor')
          throw new Error('Financeiro can only update clients or investors.')
      }

      const updatePayload: any = { nome }

      if (role) {
        const { data: roleData } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('nome', role.toLowerCase())
          .maybeSingle()
        updatePayload.role = role.toLowerCase()
        updatePayload.role_id = roleData?.id || null
      }

      if (cpf !== undefined) updatePayload.cpf = cpf
      if (valor_credito_aprovado !== undefined)
        updatePayload.valor_credito_aprovado = valor_credito_aprovado

      const { error: updateDbError } = await supabaseAdmin
        .from('usuarios')
        .update(updatePayload)
        .eq('id', userId)
      if (updateDbError) throw updateDbError

      if (investimento_data) {
        const {
          operacao_id,
          valor_investido,
          percentual_retorno,
          data_investimento,
          id: investimento_id,
        } = investimento_data
        if (investimento_id) {
          const { error: invError } = await supabaseAdmin
            .from('investimentos')
            .update({
              operacao_id,
              valor_investido,
              percentual_retorno,
              data_investimento,
            })
            .eq('id', investimento_id)
          if (invError) throw invError
        } else if (operacao_id) {
          const { error: invError } = await supabaseAdmin.from('investimentos').insert({
            usuario_id: userId,
            operacao_id,
            valor_investido,
            percentual_retorno,
            data_investimento,
            status: 'ativo',
          })
          if (invError) throw invError
        }
      }

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

    if (action === 'activate') {
      const { userId } = body
      const { error: updateDbError } = await supabaseAdmin
        .from('usuarios')
        .update({ status: 'ativo' })
        .eq('id', userId)
      if (updateDbError) throw updateDbError
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      const { userId } = body
      if (caller?.role !== 'admin')
        throw new Error('Apenas administradores podem excluir usuários.')

      // Removing from public.usuarios first clears data cascades like solicitacoes_credito and investimentos cleanly
      const { error: dbError } = await supabaseAdmin.from('usuarios').delete().eq('id', userId)
      if (dbError) throw dbError

      // Delete from auth.users
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (authError)
        console.error('Failed to delete auth user, but public profile removed:', authError)

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
