import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { supabase } from '@/lib/supabase/client'
import { subDays, format, isSameDay, parseISO } from 'date-fns'

export default function AdminAnalyticsTab() {
  const [users, setUsers] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('usuarios')
      .select('data_criacao')
      .then(({ data }) => setUsers(data || []))
    supabase
      .from('logs_auditoria')
      .select('data_acao, acao')
      .eq('acao', 'Aprovação')
      .then(({ data }) => setLogs(data || []))
  }, [])

  const chartData = useMemo(() => {
    const data = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStr = format(date, 'dd/MM')

      const newUsers = users.filter(
        (u) => u.data_criacao && isSameDay(parseISO(u.data_criacao), date),
      ).length
      const approvals = logs.filter(
        (l) => l.data_acao && isSameDay(parseISO(l.data_acao), date),
      ).length

      data.push({ date: dayStr, novos: newUsers, aprovacoes: approvals })
    }
    return data
  }, [users, logs])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-50">Crescimento de Usuários</CardTitle>
          <CardDescription>Novos cadastros nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{ novos: { label: 'Novos Usuários', color: '#3b82f6' } }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNovos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltipContent indicator="dot" />}
                  cursor={{ stroke: '#334155', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="novos"
                  stroke="#3b82f6"
                  fill="url(#colorNovos)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-50">Aprovações de Contas</CardTitle>
          <CardDescription>Volume de aprovações nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{ aprovacoes: { label: 'Aprovações', color: '#10b981' } }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltipContent indicator="dot" />}
                  cursor={{ fill: '#1e293b', opacity: 0.5 }}
                />
                <Bar dataKey="aprovacoes" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
