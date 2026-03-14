import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, ShieldCheck, User, CreditCard, DollarSign } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, MOCK_APPLICATIONS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const MOCK_HISTORY = [
  { id: 1, date: '15/10/2023', desc: 'Fatura Cartão de Crédito', amount: 1250, status: 'Pago' },
  { id: 2, date: '15/09/2023', desc: 'Fatura Cartão de Crédito', amount: 1100, status: 'Atrasado' },
  { id: 3, date: '15/08/2023', desc: 'Fatura Cartão de Crédito', amount: 950, status: 'Pago' },
  { id: 4, date: '10/07/2023', desc: 'Empréstimo Pessoal', amount: 450, status: 'Pago' },
]

export default function Analysis() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  const customer = MOCK_APPLICATIONS.find((app) => app.id === id) || MOCK_APPLICATIONS[1]
  const [obs, setObs] = useState('')

  const recommendedLimit = customer.income * 0.3
  const scorePercent = (customer.score / 1000) * 100

  const handleAction = (action: 'approve' | 'deny') => {
    toast({
      title: action === 'approve' ? 'Crédito Aprovado' : 'Crédito Negado',
      description: `A decisão foi registrada para ${customer.name}.`,
    })
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-xl border border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <div className="w-5 h-5 bg-primary rounded-sm transform rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-breathing-eye" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Análise de Crédito</h1>
          <p className="text-sm text-muted-foreground">
            Avaliação detalhada para a solicitação {customer.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Profile Summary */}
        <Card className="border-gold-glow bg-card/80 backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Perfil do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-6 items-center">
            <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <AvatarImage
                src={`https://img.usecurling.com/ppl/medium?gender=${customer.name.endsWith('a') ? 'female' : 'male'}&seed=${customer.id.replace(/\D/g, '')}`}
              />
              <AvatarFallback className="text-xl bg-black text-primary">
                {customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1 w-full text-center sm:text-left">
              <h2 className="text-2xl font-display font-bold">{customer.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CPF</p>
                  <p className="font-mono">{customer.cpf}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Renda Declarada
                  </p>
                  <p className="font-medium text-emerald-400">{formatCurrency(customer.income)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Limit */}
        <Card className="border-gold-glow bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Limite Recomendado
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[calc(100%-4rem)]">
            <div className="p-6 bg-black/40 rounded-xl border border-primary/20 flex flex-col items-center justify-center relative group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <p className="text-xs text-primary uppercase tracking-widest font-semibold mb-2 relative z-10">
                Valor Sugerido (30%)
              </p>
              <div className="text-3xl font-display font-bold text-foreground drop-shadow-[0_0_10px_rgba(212,175,55,0.2)] relative z-10">
                {formatCurrency(recommendedLimit)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Credit Score */}
        <Card className="border-gold-glow bg-card/80 backdrop-blur-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Score de Crédito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex justify-between items-end">
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-display font-bold drop-shadow-md">{customer.score}</p>
                <p className="text-sm text-muted-foreground">/ 1000 pontos</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'border-2 px-3 py-1 shadow-lg',
                  customer.score >= 700
                    ? 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/10'
                    : customer.score >= 400
                      ? 'text-yellow-400 border-yellow-500/50 shadow-yellow-500/10'
                      : 'text-destructive border-destructive/50 shadow-destructive/10',
                )}
              >
                {customer.score >= 700
                  ? 'Risco Baixo'
                  : customer.score >= 400
                    ? 'Risco Médio'
                    : 'Risco Alto'}
              </Badge>
            </div>
            <div className="relative pt-2 pb-6">
              <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden shadow-inner border border-white/5">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 opacity-30" />
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <div
                className="absolute top-0 bottom-6 w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] z-10"
                style={{ left: `${scorePercent}%`, transform: 'translateX(-50%)' }}
              />
              <div className="absolute bottom-0 w-full flex justify-between text-xs font-mono text-muted-foreground px-1">
                <span>0</span>
                <span>300</span>
                <span>700</span>
                <span>1000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-gold-glow bg-card/80 backdrop-blur-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 bg-black/20 overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-primary">Data</TableHead>
                    <TableHead className="text-primary">Descrição</TableHead>
                    <TableHead className="text-primary">Valor</TableHead>
                    <TableHead className="text-right text-primary">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_HISTORY.map((item) => (
                    <TableRow key={item.id} className="border-border/20 hover:bg-white/5">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.date}
                      </TableCell>
                      <TableCell className="font-medium">{item.desc}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            item.status === 'Pago'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Decision Panel */}
        <Card className="border-gold-glow bg-card/80 backdrop-blur-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Parecer do Analista</CardTitle>
            <CardDescription>Registre observações e tome a decisão final.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Descreva motivos da aprovação ou negação..."
              className="min-h-[100px] bg-black/40 border-border/50 focus-visible:ring-accent resize-none placeholder:text-muted-foreground/40"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-4 border-t border-border/50 pt-6">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-primary text-primary hover:bg-accent hover:border-accent hover:text-white"
              onClick={() => handleAction('deny')}
            >
              <XCircle className="w-5 h-5 mr-2" /> Negar Crédito
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-black hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(0,163,255,0.4)]"
              onClick={() => handleAction('approve')}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" /> Aprovar Crédito
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
