import { useState } from 'react'
import { Coins, Filter, Percent, Users, Eye } from 'lucide-react'
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
import { ApplicantDrawer } from '@/components/ApplicantDrawer'
import { useToast } from '@/hooks/use-toast'
import { MOCK_APPLICATIONS, CreditApplication, formatCurrency } from '@/lib/mock-data'

export default function Index() {
  const [selectedApplicant, setSelectedApplicant] = useState<CreditApplication | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { toast } = useToast()

  const handleFilter = () => {
    toast({
      title: 'Filtros aplicados',
      description: 'Os dados do dashboard foram atualizados.',
    })
  }

  const openDetails = (app: CreditApplication) => {
    setSelectedApplicant(app)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Geral</h1>
          <p className="text-muted-foreground">Visão consolidada das operações de crédito.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto p-2 bg-black/40 rounded-xl border border-white/5 backdrop-blur-md">
          <Select defaultValue="mes-atual">
            <SelectTrigger className="w-[140px] bg-background border-border/50">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes-atual">Mês Atual</SelectItem>
              <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="todos">
            <SelectTrigger className="w-[160px] bg-background border-border/50">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              <SelectItem value="pessoal">Crédito Pessoal</SelectItem>
              <SelectItem value="empresarial">Empresarial</SelectItem>
              <SelectItem value="imobiliario">Imobiliário</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleFilter}
            className="bg-gradient-to-r from-primary/80 to-primary hover:from-accent/80 hover:to-accent text-black hover:text-white transition-all duration-500 font-semibold"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <MetricCard
          title="Total de Crédito Liberado"
          value="R$ 12.450.000"
          icon={Coins}
          trend="up"
          trendValue="14.5%"
          description="vs mês anterior"
          iconClassName="text-primary border-primary/20"
        />
        <MetricCard
          title="Taxa Média de Juros"
          value="1.85%"
          icon={Percent}
          trend="down"
          trendValue="0.2%"
          description="vs mês anterior"
          iconClassName="text-accent border-accent/20"
        />
        <MetricCard
          title="Solicitações Ativas"
          value="1,284"
          icon={Users}
          trend="up"
          trendValue="5.2%"
          description="vs mês anterior"
          iconClassName="text-foreground border-border"
        />
      </div>

      {/* Chart */}
      <DashboardChart />

      {/* Table Panel */}
      <Card className="border-gold-glow bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display">Painel de Solicitações Pendentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="rounded-md border border-border/50 bg-black/20 overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-primary font-semibold">CPF</TableHead>
                  <TableHead className="text-primary font-semibold">Nome</TableHead>
                  <TableHead className="text-primary font-semibold">Valor Solicitado</TableHead>
                  <TableHead className="text-primary font-semibold">Status</TableHead>
                  <TableHead className="text-right text-primary font-semibold">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_APPLICATIONS.map((app) => (
                  <TableRow
                    key={app.id}
                    className="border-border/20 hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => openDetails(app)}
                  >
                    <TableCell className="font-mono text-xs">{app.cpf}</TableCell>
                    <TableCell className="font-medium text-foreground">{app.name}</TableCell>
                    <TableCell>{formatCurrency(app.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`
                          ${app.status === 'Pendente' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                          ${app.status === 'Em Revisão' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                          ${app.status === 'Urgente' ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse' : ''}
                          ${app.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        `}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDetails(app)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ApplicantDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        applicant={selectedApplicant}
      />
    </div>
  )
}
