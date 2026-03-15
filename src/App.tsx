import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Analysis from './pages/Analysis'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import AdminUsers from './pages/AdminUsers'
import AdminDashboard from './pages/AdminDashboard'
import FinanceiroClientes from './pages/financeiro/FinanceiroClientes'
import FinanceiroInvestidores from './pages/financeiro/FinanceiroInvestidores'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PendingApproval from './pages/PendingApproval'
import UpdatePassword from './pages/UpdatePassword'
import { AuthProvider } from '@/hooks/use-auth'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/financeiro/clientes" element={<FinanceiroClientes />} />
            <Route path="/financeiro/investidores" element={<FinanceiroInvestidores />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
