import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { MOCK_CHART_DATA } from '@/lib/mock-data'

const chartConfig = {
  aprovacoes: {
    label: 'Aprovações',
    color: 'hsl(var(--primary))',
  },
  negacoes: {
    label: 'Negações',
    color: 'hsl(var(--accent))',
  },
}

export function DashboardChart() {
  return (
    <Card className="col-span-1 lg:col-span-3 border-gold-glow bg-card/80 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <CardHeader>
        <CardTitle className="font-display">Evolução de Solicitações</CardTitle>
        <CardDescription>Comparativo de Aprovações vs Negações nos últimos meses</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] sm:h-[400px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillAprovacoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-aprovacoes)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-aprovacoes)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillNegacoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-negacoes)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-negacoes)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                content={<ChartTooltipContent indicator="dot" />}
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="aprovacoes"
                stroke="var(--color-aprovacoes)"
                fillOpacity={1}
                fill="url(#fillAprovacoes)"
                strokeWidth={2}
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="negacoes"
                stroke="var(--color-negacoes)"
                fillOpacity={1}
                fill="url(#fillNegacoes)"
                strokeWidth={2}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
