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

  const [authLoading, setAuthLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  const loading = authLoading || profileLoading

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Prevent UI deadlocks using setTimeout for state transitions
      setTimeout(() => {
        setSession(session)
        setUser(session?.user ?? null)
        setAuthLoading(false)
      }, 0)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setTimeout(() => {
        setSession(session)
        setUser(session?.user ?? null)
        setAuthLoading(false)
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setProfile(null)
        setProfileLoading(false)
      }, 0)
      return
    }

    setProfileLoading(true)
    supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setTimeout(() => {
          setProfile(data)
          setProfileLoading(false)
        }, 0)
      })
  }, [user?.id])

  const refreshProfile = async () => {
    if (!user) return
    const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single()
    setTimeout(() => {
      setProfile(data)
    }, 0)
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
