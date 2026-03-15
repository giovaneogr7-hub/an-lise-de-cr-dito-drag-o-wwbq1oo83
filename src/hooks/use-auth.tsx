import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthResponse } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  nome: string | null
  email: string | null
  role: string | null
  role_id: string | null
  status: string | null
  cpf: string | null
  telefone: string | null
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  signUp: (email: string, password: string) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchProfileAndSetUser = (currentSession: Session | null) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (!currentSession?.user) {
        if (isMounted) {
          setProfile(null)
          setLoading(false)
        }
        return
      }

      supabase
        .from('usuarios')
        .select('*')
        .eq('id', currentSession.user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error.message)
          }
          if (isMounted) {
            setProfile(data)
            setLoading(false)
          }
        })
        .catch((err) => {
          console.error('Unexpected error fetching profile:', err)
          if (isMounted) {
            setLoading(false)
          }
        })
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfileAndSetUser(session)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        fetchProfileAndSetUser(session)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).maybeSingle()
    setProfile(data)
  }

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })

    if (response.error) {
      let friendlyMessage = 'Ocorreu um erro ao realizar o cadastro.'
      if (response.error.message.includes('User already registered')) {
        friendlyMessage = 'Este e-mail já está cadastrado.'
      }
      return {
        data: response.data,
        error: { ...response.error, message: friendlyMessage } as any,
      }
    }

    return response
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      let friendlyMessage = 'Ocorreu um erro ao fazer login. Tente novamente.'

      if (error.message.includes('Invalid login credentials')) {
        friendlyMessage = 'E-mail ou senha incorretos.'
      } else if (error.message.includes('Email not confirmed')) {
        friendlyMessage =
          'Seu e-mail ainda não foi confirmado. Por favor, verifique sua caixa de entrada.'
      } else if (error.message.includes('User not found')) {
        friendlyMessage = 'E-mail não encontrado.'
      } else if (error.message.includes('Invalid password')) {
        friendlyMessage = 'Senha incorreta.'
      }

      return { error: { ...error, message: friendlyMessage } }
    }
    return { error: null }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
