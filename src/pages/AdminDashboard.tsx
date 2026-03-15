import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (profile?.role === 'admin') fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role])

  const fetchUsers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('data_criacao', { ascending: false })

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar usuários.', variant: 'destructive' })
    } else {
      setUsers(data || [])
    }
    setIsLoading(false)
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleApprove = async (id: string) => {
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'activate', userId: id },
    })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Usuário aprovado com sucesso.' })
      fetchUsers()
    }
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center bg-blue-600/10 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <ShieldAlert className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-100">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">
              Gerenciamento e aprovação de contas de usuários
            </p>
          </div>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-xl shadow-blue-900/5">
        <CardHeader className="border-b border-slate-800/50 bg-slate-800/20">
          <CardTitle className="font-display text-blue-50">Lista de Usuários do Sistema</CardTitle>
          <CardDescription className="text-slate-400">
            Visualize detalhes e aprove acessos pendentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="rounded-md border border-slate-800 bg-slate-900/50 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-800/40">
                <TableRow className="hover:bg-transparent border-slate-800">
                  <TableHead className="text-blue-400 font-semibold">Nome</TableHead>
                  <TableHead className="text-blue-400 font-semibold">Email</TableHead>
                  <TableHead className="text-blue-400 font-semibold">Telefone</TableHead>
                  <TableHead className="text-blue-400 font-semibold">Role</TableHead>
                  <TableHead className="text-blue-400 font-semibold">Data de Criação</TableHead>
                  <TableHead className="text-blue-400 font-semibold text-center">Status</TableHead>
                  <TableHead className="text-right text-blue-400 font-semibold">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-slate-800 hover:bg-slate-800/40 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-200">
                        {user.nome || '-'}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">{user.email}</TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {user.telefone || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="uppercase tracking-wider text-[10px] border-slate-700 text-slate-300"
                        >
                          {user.role || 'Desconhecido'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">
                        {new Date(user.data_criacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'px-2 py-0.5',
                            user.status === 'pendente' &&
                              'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20',
                            user.status === 'ativo' &&
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
                            user.status === 'inativo' &&
                              'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20',
                          )}
                        >
                          {user.status?.toUpperCase() || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {user.status === 'pendente' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all"
                            onClick={() => handleApprove(user.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Aprovar
                          </Button>
                        )}
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
