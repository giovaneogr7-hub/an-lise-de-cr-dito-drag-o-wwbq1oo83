import { Navigate } from 'react-router-dom'
import { ShieldAlert, Users, BarChart3, Activity } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminUsersTab from '@/components/admin/AdminUsersTab'
import AdminAnalyticsTab from '@/components/admin/AdminAnalyticsTab'
import AdminLogsTab from '@/components/admin/AdminLogsTab'

export default function AdminDashboard() {
  const { profile } = useAuth()

  // Guard purely out of safety, but Layout already ensures this.
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-12 h-12 flex items-center justify-center bg-blue-600/10 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100">Painel Administrativo</h1>
          <p className="text-sm text-slate-400">
            Controle total, auditoria e visão analítica do sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800 mb-4 p-1 rounded-xl">
          <TabsTrigger
            value="usuarios"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2 transition-all"
          >
            <Users className="w-4 h-4 mr-2" /> Usuários
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2 transition-all"
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Relatórios
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2 transition-all"
          >
            <Activity className="w-4 h-4 mr-2" /> Logs de Atividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-0 outline-none">
          <AdminUsersTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 outline-none">
          <AdminAnalyticsTab />
        </TabsContent>

        <TabsContent value="logs" className="mt-0 outline-none">
          <AdminLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
