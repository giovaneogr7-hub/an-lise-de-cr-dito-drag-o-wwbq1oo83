import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, Search, Trash2, Edit, Download } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { AdminEditUserModal } from './AdminEditUserModal'

export default function AdminUsersTab() {
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [userToDelete, setUserToDelete] = useState<any>(null)
  const [userToEdit, setUserToEdit] = useState<any>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .order('data_criacao', { ascending: false })
    setUsers(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApprove = async (id: string) => {
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'approve', userId: id },
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Usuário aprovado.' })
      fetchUsers()
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    const { error } = await supabase.functions.invoke('admin-users', {
      body: { action: 'delete', userId: userToDelete.id },
    })
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Usuário excluído.' })
      fetchUsers()
    }
    setUserToDelete(null)
  }

  const filteredUsers = users.filter(
    (u) =>
      (u.nome || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()),
  )

  const exportToCSV = () => {
    const csv = ['Nome,Email,Role,Status,Data']
      .concat(
        filteredUsers.map(
          (u) => `"${u.nome}","${u.email}","${u.role}","${u.status}","${u.data_criacao}"`,
        ),
      )
      .join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'usuarios.csv'
    link.click()
  }

  return (
    <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
      <AdminEditUserModal
        open={!!userToEdit}
        onOpenChange={(o: boolean) => !o && setUserToEdit(null)}
        user={userToEdit}
        onSuccess={fetchUsers}
      />
      <AlertDialog open={!!userToDelete} onOpenChange={(o) => !o && setUserToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>Deseja excluir {userToDelete?.email}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardHeader className="border-b border-slate-800/50 bg-slate-800/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-blue-50">Lista de Usuários</CardTitle>
          <CardDescription>Gerencie acessos e perfis</CardDescription>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-slate-800/50 border-slate-700 w-48 text-slate-200"
            />
          </div>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-600/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-800/40">
              <TableRow className="border-slate-800">
                <TableHead className="text-blue-400">Usuário</TableHead>
                <TableHead className="text-blue-400">Role</TableHead>
                <TableHead className="text-blue-400">Status</TableHead>
                <TableHead className="text-right text-blue-400">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/40">
                    <TableCell>
                      <div className="font-medium text-slate-200">{user.nome || '-'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {user.role || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          user.status === 'pendente'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-400',
                        )}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      {user.status === 'pendente' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white h-8"
                          onClick={() => handleApprove(user.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-slate-700 text-slate-300 hover:text-blue-400"
                        onClick={() => setUserToEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-slate-700 text-red-400 hover:bg-red-500/10"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="w-4 h-4" />
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
  )
}
