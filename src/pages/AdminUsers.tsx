import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Users as UsersIcon, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

export default function AdminUsers() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pendente')

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role, statusFilter])

  const fetchUsers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, cpf, telefone, data_criacao, status')
      .eq('status', statusFilter)
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

  const handleAction = async (id: string, newStatus: 'aprovado' | 'negado') => {
    const { error } = await supabase.from('usuarios').update({ status: newStatus }).eq('id', id)
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Sucesso',
        description: `Usuário ${newStatus === 'aprovado' ? 'aprovado' : 'reprovado'} com sucesso.`,
      })
      if (statusFilter === 'pendente') {
        setUsers(users.filter((u) => u.id !== id))
      } else {
        fetchUsers()
      }
    }
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-xl border border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <UsersIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Aprovação de Usuários
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerenciamento de acessos à plataforma Dragão
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5 backdrop-blur-md">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-background border-border/50 hover:bg-black/40 transition-colors">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="aprovado">Aprovados</SelectItem>
              <SelectItem value="negado">Negados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-gold-glow bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display">Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="rounded-md border border-border/50 bg-black/20 overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-primary font-semibold">Data</TableHead>
                  <TableHead className="text-primary font-semibold">Nome</TableHead>
                  <TableHead className="text-primary font-semibold">Contato</TableHead>
                  <TableHead className="text-primary font-semibold">Status</TableHead>
                  <TableHead className="text-right text-primary font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      {statusFilter === 'pendente'
                        ? 'Nenhuma solicitação pendente no momento'
                        : 'Nenhum usuário encontrado para este filtro.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-border/20 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">
                        {user.data_criacao
                          ? new Date(user.data_criacao).toLocaleDateString('pt-BR')
                          : '-'}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <div>{user.nome || '-'}</div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {user.cpf || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{user.email || '-'}</div>
                        <div className="text-xs text-muted-foreground">{user.telefone || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`
                            ${user.status === 'pendente' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                            ${user.status === 'negado' ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}
                            ${user.status === 'aprovado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          `}
                        >
                          {user.status
                            ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                            : '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {user.status === 'pendente' ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors h-8"
                              onClick={() => handleAction(user.id, 'negado')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reprovar
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors h-8 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              onClick={() => handleAction(user.id, 'aprovado')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Resolvido</span>
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
