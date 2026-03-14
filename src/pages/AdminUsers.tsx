import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Users as UsersIcon, Loader2, UserPlus, CheckCircle2, Ban, Edit } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { CreateUserModal, EditUserModal } from '@/components/admin/UserModals'

export default function AdminUsers() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('todos')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  useEffect(() => {
    if (profile?.role === 'admin') fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role, statusFilter])

  const fetchUsers = async () => {
    setIsLoading(true)
    let query = supabase.from('usuarios').select('*').order('data_criacao', { ascending: false })
    if (statusFilter !== 'todos') query = query.eq('status', statusFilter)

    const { data, error } = await query
    if (error)
      toast({ title: 'Erro', description: 'Falha ao carregar usuários.', variant: 'destructive' })
    else setUsers(data || [])
    setIsLoading(false)
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleApprove = async (id: string) => {
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'approve', userId: id },
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({
        title: 'Usuário Aprovado',
        description: `Senha temporária enviada: ${data.password}`,
      })
      fetchUsers()
    }
  }

  const handleDeactivate = async (id: string) => {
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'deactivate', userId: id },
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Usuário desativado com sucesso.' })
      fetchUsers()
    }
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <CreateUserModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSuccess={fetchUsers} />
      <EditUserModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={editingUser}
        onSuccess={fetchUsers}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-xl border border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <UsersIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Gerenciamento de Acessos
            </h1>
            <p className="text-sm text-muted-foreground">
              Controle de usuários da plataforma Dragão
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black/40 p-2 rounded-xl border border-white/5 backdrop-blur-md">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-background border-border/50 hover:bg-black/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-black hover:bg-accent hover:text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
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
                  <TableHead className="text-primary font-semibold">Data Criação</TableHead>
                  <TableHead className="text-primary font-semibold">Usuário</TableHead>
                  <TableHead className="text-primary font-semibold">Tipo de Acesso</TableHead>
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
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-border/20 hover:bg-white/5">
                      <TableCell className="font-mono text-xs">
                        {new Date(user.data_criacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{user.nome || '-'}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                          {user.role || 'Desconhecido'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            user.status === 'pendente' &&
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                            user.status === 'ativo' &&
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                            user.status === 'inativo' &&
                              'bg-gray-500/10 text-gray-400 border-gray-500/20',
                          )}
                        >
                          {user.status?.toUpperCase() || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.status === 'pendente' && (
                            <Button
                              size="sm"
                              className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white h-8"
                              onClick={() => handleApprove(user.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 hover:bg-accent/20 hover:text-accent border-border/50"
                            onClick={() => {
                              setEditingUser(user)
                              setIsEditOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Editar
                          </Button>
                          {user.status === 'ativo' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeactivate(user.id)}
                            >
                              <Ban className="w-4 h-4 mr-1" /> Desativar
                            </Button>
                          )}
                        </div>
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
