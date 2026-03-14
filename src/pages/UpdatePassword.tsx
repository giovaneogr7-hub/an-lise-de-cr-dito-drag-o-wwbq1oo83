import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
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

const updateSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua nova senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export default function UpdatePassword() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { updatePassword } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof updateSchema>) => {
    setIsLoading(true)

    const { error } = await updatePassword(values.password)

    if (error) {
      toast({
        title: 'Erro ao atualizar',
        description:
          'Não foi possível redefinir a senha. Tente novamente ou solicite um novo link.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    toast({
      title: 'Senha atualizada',
      description: 'Sua senha foi redefinida com sucesso.',
    })

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden font-sans">
      <div className="absolute top-1/4 -right-64 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <div className="w-full max-w-md mx-auto px-4 z-10 animate-fade-in-up py-12">
        <div className="flex flex-col items-center mb-8">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/40 bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-4">
            <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            ÚLTIMO DRAGÃO
          </h1>
        </div>

        <Card className="border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-accent to-primary/80" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Redefinir Senha</CardTitle>
            <CardDescription className="text-center text-white/60">
              Crie uma nova senha de acesso seguro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Nova Senha</FormLabel>
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
                      <FormLabel className="text-white/80">Confirmar Nova Senha</FormLabel>
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-primary text-black hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(0,163,255,0.5)] font-bold text-lg h-12 transition-all duration-500 group"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  Atualizar Senha
                </Button>
              </form>
            </Form>
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
