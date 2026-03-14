import { AlertCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

export default function PendingApproval() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden font-sans px-4 py-12">
      <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <div className="z-10 bg-black/60 p-8 sm:p-10 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl max-w-md w-full text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/40 bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-8">
          <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
        </div>

        <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full border border-yellow-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-3">Aguardando Aprovação</h1>

        <p className="text-white/60 mb-8 leading-relaxed">
          Seu cadastro está em análise. Por favor, aguarde a autorização de um administrador.
        </p>

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
