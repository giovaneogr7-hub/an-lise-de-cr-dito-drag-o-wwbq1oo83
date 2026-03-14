import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { maskCurrency, parseCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  operacao_id: z.string().min(1, 'Operação obrigatória'),
  valor_investido: z.string().min(1, 'Valor obrigatório'),
  percentual_retorno: z.string().min(1, 'Percentual obrigatório'),
  data_investimento: z.date({ required_error: 'Data obrigatória' }),
})

export function EditInvestorModal({ open, onOpenChange, user, onSuccess }: any) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [operacoes, setOperacoes] = useState<any[]>([])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', operacao_id: '', valor_investido: '', percentual_retorno: '' },
  })

  useEffect(() => {
    if (open && user) {
      supabase
        .from('operacoes')
        .select('id, valor_liberado')
        .then(({ data }) => setOperacoes(data || []))
      const inv = user.investimentos?.[0]
      form.reset({
        nome: user.nome || '',
        operacao_id: inv?.operacao_id || '',
        valor_investido: inv ? maskCurrency((inv.valor_investido * 100).toFixed(0)) : '',
        percentual_retorno: inv ? inv.percentual_retorno.toString() : '',
        data_investimento: inv?.data_investimento ? new Date(inv.data_investimento) : new Date(),
      })
    }
  }, [open, user, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    const payload = {
      nome: values.nome,
      role: 'investidor',
      investimento_data: {
        id: user.investimentos?.[0]?.id,
        operacao_id: values.operacao_id,
        valor_investido: parseCurrency(values.valor_investido),
        percentual_retorno: parseFloat(values.percentual_retorno.replace(',', '.')),
        data_investimento: values.data_investimento.toISOString(),
      },
    }

    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'update', userId: user.id, data: payload },
    })
    setIsLoading(false)

    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Investidor atualizado.' })
      onSuccess()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 border-border/50 text-foreground backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-display">Editar Investidor</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize os detalhes de investimento de {user?.email}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="operacao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operação Vinculada</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/40 border-border/50">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operacoes.length > 0 ? (
                        operacoes.map((op) => (
                          <SelectItem key={op.id} value={op.id}>
                            Op. {op.id.slice(0, 8)} -{' '}
                            {maskCurrency(((op.valor_liberado || 0) * 100).toFixed(0))}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Nenhuma disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor_investido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
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
              <FormField
                control={form.control}
                name="percentual_retorno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retorno (%)</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-black/40 border-border/50"
                        placeholder="Ex: 15.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data_investimento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Investimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'bg-black/40 border-border/50 pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(d) => d > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-black hover:bg-accent hover:text-white"
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
