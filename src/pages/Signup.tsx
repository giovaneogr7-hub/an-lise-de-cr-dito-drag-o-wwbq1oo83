import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, UserPlus, Lock, Mail, User, CreditCard, Phone, Eye, EyeOff } from 'lucide-react'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { maskCPF, maskPhone } from '@/lib/formatters'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signupSchema = z
  .object({
    nome: z.string().min(3, 'Nome completo é obrigatório'),
    email: z.string().min(1, 'O email é obrigatório').email('Formato de email inválido'),
    cpf: z.string().min(14, 'CPF incompleto'),
    telefone: z.string().min(14, 'Telefone incompleto'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export default function Signup() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signUp, refreshProfile, user, profile, loading } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      if (profile?.status === 'pendente' || profile?.status === 'negado') {
        navigate('/pending-approval')
      } else if (profile?.status === 'aprovado') {
        navigate('/')
      }
    }
  }, [user, profile, loading, navigate])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true)

    try {
      const { data, error: authError } = await signUp(values.email, values.password)

      if (authError) {
        toast({ title: 'Erro no cadastro', description: authError.message, variant: 'destructive' })
        setIsLoading(false)
        return
      }

      if (data?.user) {
        // Fetch role_id for the default 'cliente' role
        const { data: roleData } = await supabase
          .from('roles')
          .select('id')
          .eq('nome', 'cliente')
          .single()

        const { error: dbError } = await supabase.from('usuarios').insert({
          id: data.user.id,
          nome: values.nome,
          email: values.email,
          cpf: values.cpf,
          telefone: values.telefone,
          role: 'cliente',
          role_id: roleData?.id || null,
          status: 'pendente',
        })

        if (dbError) {
          console.error(dbError)
          toast({
            title: 'Aviso',
            description: 'Conta criada, mas houve um erro ao salvar o perfil.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Cadastro realizado',
            description: 'Sua conta foi criada e está aguardando aprovação.',
          })
        }

        await refreshProfile()
        navigate('/pending-approval')
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um problema ao processar seu cadastro.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden font-sans py-12">
      <div className="absolute top-1/4 -right-64 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <div className="w-full max-w-xl mx-auto px-4 z-10 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/40 bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-4">
            <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            ÚLTIMO DRAGÃO
          </h1>
        </div>

        <Card className="border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-accent to-primary/80" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Novo Cadastro</CardTitle>
            <CardDescription className="text-center text-white/60">
              Preencha os dados abaixo para solicitar seu acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Nome Completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                            <Input
                              placeholder="João da Silva"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                            <Input
                              placeholder="seu@email.com"
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
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">CPF</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                            <Input
                              placeholder="000.000.000-00"
                              className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 transition-colors"
                              {...field}
                              onChange={(e) => field.onChange(maskCPF(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Telefone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                            <Input
                              placeholder="(00) 00000-0000"
                              className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 transition-colors"
                              {...field}
                              onChange={(e) => field.onChange(maskPhone(e.target.value))}
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
                        <FormLabel className="text-white/80">Senha</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Confirmar Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="bg-white/5 border-white/10 pl-10 pr-10 text-white placeholder:text-white/30 focus-visible:ring-primary/50 transition-colors"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-white/40 hover:text-white/80 transition-colors"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
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
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-primary text-black hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(0,163,255,0.5)] font-bold text-lg h-12 transition-all duration-500 group"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  Finalizar Cadastro
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-white/60 border-t border-white/10 pt-6">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-accent font-medium transition-colors"
              >
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
