import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ShieldCheck, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'

const loginSchema = z.object({
  email: z.string().min(1, 'O email é obrigatório').email('Formato de email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

const recoverySchema = z.object({
  email: z.string().min(1, 'O email é obrigatório').email('Formato de email inválido'),
})

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signIn, resetPassword, user, profile, loading } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      if (!profile) {
        navigate('/pending-approval')
        return
      }

      // Priority check: Admins bypass status restrictions
      const isAdmin = profile.role === 'admin'
      const isAtivo = ['ativo', 'aprovado'].includes(profile.status || '')

      if (isAdmin || isAtivo) {
        navigate('/')
      } else {
        navigate('/pending-approval')
      }
    }
  }, [user, profile, loading, navigate])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const recoveryForm = useForm<z.infer<typeof recoverySchema>>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    setLoginError('')

    const { error } = await signIn(values.email, values.password)

    if (error) {
      setLoginError(error.message)
      setIsLoading(false)
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      const { data: userProfile, error: profileError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileError && profileError.code !== 'PGRST116') {
        setLoginError('Erro ao verificar permissões de acesso.')
        setIsLoading(false)
        return
      }

      if (userProfile) {
        const isAdmin = userProfile.role === 'admin'
        const isAtivo = ['ativo', 'aprovado'].includes(userProfile.status || '')

        if (isAdmin || isAtivo) {
          toast({ title: 'Acesso Autorizado', description: 'Bem-vindo ao ÚLTIMO DRAGÃO.' })
          navigate('/')
        } else {
          navigate('/pending-approval')
        }
        return
      } else {
        // Missing profile logic handling
        navigate('/pending-approval')
        return
      }
    }

    setIsLoading(false)
  }

  const onRecoverySubmit = async (values: z.infer<typeof recoverySchema>) => {
    const { error } = await resetPassword(values.email)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o e-mail de recuperação. Tente novamente.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Instruções enviadas',
      description: `Verifique a caixa de entrada de ${values.email} para redefinir sua senha.`,
    })
    setIsRecoveryOpen(false)
    recoveryForm.reset()
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <div className="w-full max-w-md mx-auto px-4 z-10 animate-fade-in-up py-12">
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/40 bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-4">
            <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            ÚLTIMO DRAGÃO
          </h1>
          <p className="text-sm font-medium text-white/60 mt-1 uppercase tracking-widest">
            Gateway de Acesso
          </p>
        </div>

        <Card className="border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-accent to-primary/80" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Autenticação Restrita</CardTitle>
            <CardDescription className="text-center text-white/60">
              Insira suas credenciais corporativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300 ml-2">{loginError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                          <Input
                            placeholder="admin@ultimodragao.tech"
                            className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white/80">Senha</FormLabel>
                        <Dialog open={isRecoveryOpen} onOpenChange={setIsRecoveryOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              className="px-0 h-auto text-primary hover:text-accent font-normal text-xs transition-colors"
                            >
                              Esqueci a senha
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md bg-black/95 border-white/10 text-white backdrop-blur-xl">
                            <DialogHeader>
                              <DialogTitle className="text-primary font-display">
                                Recuperação de Senha
                              </DialogTitle>
                              <DialogDescription className="text-white/60">
                                Digite seu email para receber um link seguro de recuperação de
                                acesso.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...recoveryForm}>
                              <form
                                onSubmit={recoveryForm.handleSubmit(onRecoverySubmit)}
                                className="space-y-4 mt-4"
                              >
                                <FormField
                                  control={recoveryForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white/80">
                                        Email Cadastrado
                                      </FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                          <Input
                                            placeholder="seu@email.com"
                                            className="bg-white/5 border-white/10 pl-10 text-white focus-visible:ring-primary/50"
                                            {...field}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage className="text-red-400" />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsRecoveryOpen(false)}
                                    className="text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    type="submit"
                                    className="bg-primary text-black hover:bg-accent hover:text-white font-bold transition-all duration-300"
                                  >
                                    Enviar Instruções
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 transition-colors"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-primary text-black hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(0,163,255,0.5)] font-bold text-lg h-12 transition-all duration-500 group"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ShieldCheck className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  Entrar no Sistema
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-white/60 border-t border-white/10 pt-6">
              Não tem uma conta?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-accent font-medium transition-colors"
              >
                Cadastre-se
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 pt-5 pb-5 bg-black/20">
            <p className="text-xs text-white/40 flex items-center tracking-wider uppercase font-medium">
              <Lock className="w-3 h-3 mr-1.5" />
              Ambiente Seguro
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
