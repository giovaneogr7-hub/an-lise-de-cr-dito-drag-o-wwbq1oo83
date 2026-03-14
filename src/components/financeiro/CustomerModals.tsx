import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { maskCPF, maskCurrency, parseCurrency } from '@/lib/formatters'

const customerSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(14, 'CPF inválido'),
  valor_credito_aprovado: z.string().min(1, 'Valor de crédito é obrigatório'),
})

export function CreateCustomerModal({ open, onOpenChange, onSuccess }: any) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: { nome: '', email: '', cpf: '', valor_credito_aprovado: '' },
  })

  useEffect(() => {
    if (open) form.reset()
  }, [open, form])

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    setIsLoading(true)

    const payload = {
      ...values,
      role: 'cliente',
      valor_credito_aprovado: parseCurrency(values.valor_credito_aprovado),
    }

    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'create', data: payload },
    })
    setIsLoading(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Cliente Criado!',
        description: `Senha temporária: ${data.password}. Um e-mail de boas-vindas foi simulado. O usuário deverá alterar a senha no primeiro acesso.`,
        duration: 10000,
      })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border-border/50 text-foreground backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Cadastrar Cliente</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Insira os dados do novo cliente. Credenciais serão geradas automaticamente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" className="bg-black/40 border-border/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      className="bg-black/40 border-border/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      className="bg-black/40 border-border/50"
                      {...field}
                      onChange={(e) => field.onChange(maskCPF(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor_credito_aprovado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crédito Aprovado (R$)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      className="bg-black/40 border-border/50"
                      {...field}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border/50 hover:bg-black/40"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-black hover:bg-accent hover:text-white transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Cadastrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const editSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  cpf: z.string().min(14, 'CPF inválido'),
  valor_credito_aprovado: z.string().min(1, 'Valor de crédito é obrigatório'),
})

export function EditCustomerModal({ open, onOpenChange, user, onSuccess }: any) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: { nome: '', cpf: '', valor_credito_aprovado: '' },
  })

  useEffect(() => {
    if (open && user) {
      const initialCredit = user.valor_credito_aprovado
        ? maskCurrency((user.valor_credito_aprovado * 100).toFixed(0))
        : ''
      form.reset({
        nome: user.nome || '',
        cpf: user.cpf || '',
        valor_credito_aprovado: initialCredit,
      })
    }
  }, [open, user, form])

  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    setIsLoading(true)

    const payload = {
      ...values,
      valor_credito_aprovado: parseCurrency(values.valor_credito_aprovado),
    }

    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'update', userId: user.id, data: payload },
    })
    setIsLoading(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Cliente atualizado com sucesso.' })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border-border/50 text-foreground backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Editar Cliente</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize as informações do perfil de {user?.email}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input className="bg-black/40 border-border/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-black/40 border-border/50"
                      {...field}
                      onChange={(e) => field.onChange(maskCPF(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor_credito_aprovado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crédito Aprovado (R$)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-black/40 border-border/50"
                      {...field}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border/50 hover:bg-black/40"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-black hover:bg-accent hover:text-white transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
