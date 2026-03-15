import { AlertCircle, Ban, Clock, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

export default function PendingApproval() {
  const { signOut, profile, user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && profile) {
      const isAdmin = profile.role === 'admin'
      const isAtivo = ['ativo', 'aprovado'].includes(profile.status || '')

      if (isAdmin || isAtivo) {
        navigate('/')
      }
    }
  }, [loading, user, profile, navigate])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const status = profile?.status || 'pendente'
  const role = profile?.role || ''

  let config = {
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    shadow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
    title: 'Aguardando Aprovação',
    desc: 'Seu cadastro está em análise. Por favor, aguarde a autorização de um administrador.',
    glow1: 'bg-yellow-500/10',
    glow2: 'bg-orange-600/10',
  }

  if (status === 'pendente' && ['financeiro', 'cobrador'].includes(role)) {
    config.desc = 'Sua conta está aguardando aprovação do administrador'
  } else if (status === 'negado') {
    config = {
      icon: Ban,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      title: 'Acesso Negado',
      desc: 'Infelizmente, sua solicitação de acesso não foi aprovada neste momento.',
      glow1: 'bg-red-500/10',
      glow2: 'bg-rose-600/10',
    }
  } else if (status === 'inativo') {
    config = {
      icon: AlertCircle,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
      shadow: 'shadow-[0_0_30px_rgba(156,163,175,0.2)]',
      title: 'Conta Desativada',
      desc: 'Sua conta foi desativada temporariamente. Entre em contato com a administração.',
      glow1: 'bg-gray-500/10',
      glow2: 'bg-slate-600/10',
    }
    if (['cliente', 'investidor'].includes(role)) {
      config.desc = 'Sua conta foi desativada'
    }
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden font-sans px-4 py-12">
      <div
        className={`absolute top-1/4 -left-64 w-[600px] h-[600px] ${config.glow1} rounded-full blur-[120px] mix-blend-screen pointer-events-none`}
      />
      <div
        className={`absolute bottom-1/4 -right-64 w-[600px] h-[600px] ${config.glow2} rounded-full blur-[120px] mix-blend-screen pointer-events-none`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <div className="z-10 bg-black/60 p-8 sm:p-10 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl max-w-md w-full text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/40 bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-8">
          <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
        </div>

        <div
          className={`mx-auto w-16 h-16 ${config.bg} rounded-full border ${config.border} flex items-center justify-center mb-6 ${config.shadow}`}
        >
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-3">{config.title}</h1>

        <p className="text-white/60 mb-8 leading-relaxed">{config.desc}</p>

        <div className="border-t border-white/10 pt-8 mt-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  )
}
