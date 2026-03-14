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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

const createSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  role: z.string().min(1, 'Selecione o acesso'),
})

export function CreateUserModal({ open, onOpenChange, onSuccess }: any) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { nome: '', email: '', role: '' },
  })

  useEffect(() => {
    if (open) form.reset()
  }, [open, form])

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    setIsLoading(true)
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'create', data: values },
    })
    setIsLoading(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Usuário convidado com sucesso.' })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border-border/50 text-foreground backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Criar Novo Usuário</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Convide um usuário especificando seu nível de acesso.
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
                      placeholder="seu@email.com"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Acesso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/40 border-border/50">
                        <SelectValue placeholder="Selecione o acesso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="cobrador">Cobrador</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Convidar
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
  role: z.string().min(1, 'Selecione o acesso'),
})

export function EditUserModal({ open, onOpenChange, user, onSuccess }: any) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: { nome: '', role: '' },
  })

  useEffect(() => {
    if (open && user) {
      form.reset({ nome: user.nome || '', role: user.role || '' })
    }
  }, [open, user, form])

  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    setIsLoading(true)
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'update', userId: user.id, data: values },
    })
    setIsLoading(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Usuário atualizado com sucesso.' })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border-border/50 text-foreground backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Editar Usuário</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize as informações de acesso para {user?.email}.
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Acesso</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/40 border-border/50">
                        <SelectValue placeholder="Selecione o acesso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="cobrador">Cobrador</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
