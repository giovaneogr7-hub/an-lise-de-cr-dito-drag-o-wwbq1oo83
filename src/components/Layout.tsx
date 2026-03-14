import { Navigate, Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function Layout() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!profile || !['ativo', 'aprovado'].includes(profile.status || '')) {
    return <Navigate to="/pending-approval" replace />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full max-w-full">
          <Header />
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full animate-slide-fade">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
