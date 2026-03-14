import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Users as UsersIcon, Loader2, UserPlus, Ban, Edit, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { CreateCustomerModal, EditCustomerModal } from '@/components/financeiro/CustomerModals'

export default function FinanceiroClientes() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  useEffect(() => {
    if (profile?.role === 'financeiro') fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role])

  const fetchClients = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('role', 'cliente')
      .order('data_criacao', { ascending: false })

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar clientes.', variant: 'destructive' })
    } else {
      setClients(data || [])
    }
    setIsLoading(false)
  }

  // Restrict access strictly to 'financeiro' as requested in User Story
  if (profile && profile.role !== 'financeiro') {
    return <Navigate to="/" replace />
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newAction = currentStatus === 'ativo' ? 'deactivate' : 'activate'
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: newAction, userId: id },
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: `Status do cliente atualizado.` })
      fetchClients()
    }
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <CreateCustomerModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchClients}
      />
      <EditCustomerModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={editingUser}
        onSuccess={fetchClients}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-xl border border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <UsersIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Gestão de Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Administração de perfis e limites de crédito.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-black hover:bg-primary/90 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Criar Cliente
          </Button>
        </div>
      </div>

      <Card className="border-gold-glow bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="rounded-md border border-border/50 bg-black/20 overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-primary font-semibold">Data Criação</TableHead>
                  <TableHead className="text-primary font-semibold">Cliente</TableHead>
                  <TableHead className="text-primary font-semibold">CPF</TableHead>
                  <TableHead className="text-primary font-semibold">Crédito Aprovado</TableHead>
                  <TableHead className="text-primary font-semibold">Status</TableHead>
                  <TableHead className="text-right text-primary font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nenhum cliente cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((user) => (
                    <TableRow key={user.id} className="border-border/20 hover:bg-white/5">
                      <TableCell className="font-mono text-xs">
                        {new Date(user.data_criacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{user.nome || '-'}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.cpf || '-'}</TableCell>
                      <TableCell className="font-medium text-emerald-400">
                        {formatCurrency(user.valor_credito_aprovado || 0)}
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

                          {user.status === 'ativo' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => toggleStatus(user.id, user.status)}
                            >
                              <Ban className="w-4 h-4 mr-1" /> Desativar
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                              onClick={() => toggleStatus(user.id, user.status)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" /> Ativar
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
