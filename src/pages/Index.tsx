import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coins, Filter, Percent, Users, Eye, Loader2 } from 'lucide-react'
import { startOfMonth, endOfMonth, subMonths, startOfQuarter } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/MetricCard'
import { DashboardChart } from '@/components/DashboardChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth'
import { supabase, SolicitacaoCredito } from '@/lib/supabase'

export default function Index() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()

  const [dbData, setDbData] = useState<SolicitacaoCredito[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('todos')
  const [periodFilter, setPeriodFilter] = useState('mes-atual')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('solicitacoes_credito')
        .select('*, usuarios(nome, cpf)')
        .eq('usuario_id', user.id)

      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter)
      }

      const now = new Date()
      if (periodFilter === 'mes-atual') {
        query = query.gte('data_solicitacao', startOfMonth(now).toISOString())
      } else if (periodFilter === 'mes-anterior') {
        query = query.gte('data_solicitacao', startOfMonth(subMonths(now, 1)).toISOString())
        query = query.lte('data_solicitacao', endOfMonth(subMonths(now, 1)).toISOString())
      } else if (periodFilter === 'trimestre') {
        query = query.gte('data_solicitacao', startOfQuarter(now).toISOString())
      }

      const { data } = await query
      if (data) setDbData(data)
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: 'Falha ao carregar dados.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleApplyFilters = () => {
    fetchData()
    toast({
      title: 'Filtros aplicados',
      description: 'Os dados do dashboard foram sincronizados.',
    })
  }

  const totalLiberado = dbData
    .filter((d) => d.status === 'aprovado')
    .reduce((sum, d) => sum + d.valor_solicitado, 0)

  const taxaMedia =
    dbData.length > 0 ? dbData.reduce((sum, d) => sum + d.taxa_juros, 0) / dbData.length : 0

  const ativas = dbData.filter((d) => d.status === 'pendente').length

  const chartData = useMemo(() => {
    const groups = new Map<string, { aprovacoes: number; negacoes: number }>()
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]

    if (periodFilter === 'mes-atual' || periodFilter === 'mes-anterior') {
      ;['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'].forEach((w) =>
        groups.set(w, { aprovacoes: 0, negacoes: 0 }),
      )
    } else {
      monthNames.forEach((m) => groups.set(m, { aprovacoes: 0, negacoes: 0 }))
    }

    dbData.forEach((item) => {
      if (item.status === 'pendente') return
      const d = new Date(item.data_solicitacao)
      let key = ''

      if (periodFilter === 'mes-atual' || periodFilter === 'mes-anterior') {
        const week = Math.ceil(d.getDate() / 7)
        key = `Sem ${week > 5 ? 5 : week}`
      } else {
        key = monthNames[d.getMonth()]
      }

      if (groups.has(key)) {
        const g = groups.get(key)!
        if (item.status === 'aprovado') g.aprovacoes += 1
        if (item.status === 'negado') g.negacoes += 1
      }
    })

    return Array.from(groups.entries())
      .map(([name, counts]) => ({ name, ...counts }))
      .filter(
        (g) =>
          periodFilter === 'mes-atual' ||
          periodFilter === 'mes-anterior' ||
          g.aprovacoes > 0 ||
          g.negacoes > 0,
      )
  }, [dbData, periodFilter])

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Geral</h1>
          <p className="text-muted-foreground">Monitoramento de solicitações e métricas ativas.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto p-2 bg-black/40 rounded-xl border border-white/5 backdrop-blur-md">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[140px] bg-background border-border/50">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes-atual">Mês Atual</SelectItem>
              <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
              <SelectItem value="todos">Todo Período</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-background border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="negado">Negado</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="bg-primary text-black hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(0,163,255,0.4)] transition-all duration-500 font-bold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Filter className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <MetricCard
          title="Total de Crédito Liberado"
          value={formatCurrency(totalLiberado)}
          icon={Coins}
          description="Refere-se ao status Aprovado"
          iconClassName="text-primary border-primary/20"
        />
        <MetricCard
          title="Taxa Média de Juros"
          value={`${taxaMedia.toFixed(2)}%`}
          icon={Percent}
          description="Média no período filtrado"
          iconClassName="text-accent border-accent/20"
        />
        <MetricCard
          title="Solicitações Pendentes"
          value={ativas}
          icon={Users}
          description="Aguardando análise"
          iconClassName="text-foreground border-border"
        />
      </div>

      <DashboardChart data={chartData} />

      <Card className="border-gold-glow bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display">Painel de Solicitações</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="rounded-md border border-border/50 bg-black/20 overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-primary font-semibold">Data</TableHead>
                  <TableHead className="text-primary font-semibold">Cliente</TableHead>
                  <TableHead className="text-primary font-semibold">Valor Solicitado</TableHead>
                  <TableHead className="text-primary font-semibold">Status</TableHead>
                  <TableHead className="text-right text-primary font-semibold">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : dbData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhuma solicitação encontrada para os filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  dbData.map((app) => (
                    <TableRow
                      key={app.id}
                      className="border-border/20 hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/analysis?id=${app.id}`)}
                    >
                      <TableCell className="font-mono text-xs">
                        {new Date(app.data_solicitacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {app.usuarios?.nome || 'Cliente'}
                      </TableCell>
                      <TableCell>{formatCurrency(app.valor_solicitado)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`
                            ${app.status === 'pendente' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                            ${app.status === 'negado' ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}
                            ${app.status === 'aprovado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          `}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/analysis?id=${app.id}`)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
