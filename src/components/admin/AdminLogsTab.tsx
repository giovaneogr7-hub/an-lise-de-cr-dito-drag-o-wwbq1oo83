import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLogsTab() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('logs_auditoria')
      .select('*, admin:admin_id(nome, email), alvo:usuario_alvo_id(nome, email)')
      .order('data_acao', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setLogs(data || [])
        setIsLoading(false)
      })
  }, [])

  return (
    <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
      <CardHeader className="border-b border-slate-800/50 bg-slate-800/20">
        <CardTitle className="text-blue-50">Logs de Atividade</CardTitle>
        <CardDescription>
          Histórico de ações administrativas (Últimos 100 registros)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[600px]">
          <Table>
            <TableHeader className="bg-slate-800/40 sticky top-0">
              <TableRow className="border-slate-800">
                <TableHead className="text-blue-400">Data/Hora</TableHead>
                <TableHead className="text-blue-400">Administrador</TableHead>
                <TableHead className="text-blue-400">Ação</TableHead>
                <TableHead className="text-blue-400">Usuário Afetado</TableHead>
                <TableHead className="text-blue-400">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    Nenhum log encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/40">
                    <TableCell className="font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.data_acao).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-200">
                        {log.admin?.nome || 'Desconhecido'}
                      </div>
                      <div className="text-xs text-slate-500">{log.admin?.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {log.acao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-200">
                        {log.alvo?.nome || 'Deletado/Nulo'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {log.alvo?.email || log.detalhes?.email || '-'}
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-xs text-slate-500 max-w-[200px] truncate"
                      title={JSON.stringify(log.detalhes)}
                    >
                      {log.detalhes ? JSON.stringify(log.detalhes).substring(0, 50) + '...' : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
