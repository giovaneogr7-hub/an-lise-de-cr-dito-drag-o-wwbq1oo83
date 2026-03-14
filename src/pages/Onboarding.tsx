import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, ArrowRight, Zap, CreditCard } from 'lucide-react'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <Link to="/" className="flex items-center gap-4 transition-opacity hover:opacity-80 group">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-500/40 bg-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-transform duration-500 group-hover:scale-105">
            <img src={logoImg} alt="Dragão Crédito Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-widest text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              DRAGÃO
            </span>
            <span className="text-sm font-medium text-white/60">Análise Premium</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          asChild
          className="text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Link to="/">Pular</Link>
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Tech Background Elements */}
        <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

        <div className="w-full max-w-lg z-10 animate-fade-in-up">
          <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/80 via-amber-500 to-blue-600/80" />
            <CardHeader className="text-center pb-2 pt-10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                {step === 1 && (
                  <Zap className="h-10 w-10 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
                {step === 2 && (
                  <ShieldCheck className="h-10 w-10 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
                {step === 3 && (
                  <CreditCard className="h-10 w-10 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-white">
                {step === 1 && 'Bem-vindo ao Dragão'}
                {step === 2 && 'Segurança Militar'}
                {step === 3 && 'Análise Instantânea'}
              </CardTitle>
              <CardDescription className="text-base mt-3 text-white/60 max-w-sm mx-auto">
                {step === 1 &&
                  'A plataforma de análise de crédito mais avançada e rápida do mercado financeiro.'}
                {step === 2 &&
                  'Seus dados e de seus clientes protegidos com a mais alta tecnologia de criptografia end-to-end.'}
                {step === 3 &&
                  'Decisões de crédito baseadas em IA com respostas precisas em milissegundos.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === step
                        ? 'w-10 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="min-h-[90px] flex flex-col justify-center">
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-white/80">
                        Nome da Empresa
                      </Label>
                      <Input
                        id="company"
                        placeholder="Sua Empresa LTDA"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-amber-500/50 transition-colors"
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="api-key" className="text-white/80">
                        Chave de Integração API
                      </Label>
                      <Input
                        id="api-key"
                        readOnly
                        value="sk_test_dragao_59f8e7a2b..."
                        className="bg-white/5 border-white/10 text-amber-500/80 font-mono h-12 focus-visible:ring-amber-500/50 cursor-default selection:bg-amber-500/30"
                      />
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="flex items-center justify-center p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-fade-in">
                    <ShieldCheck className="h-6 w-6 mr-3" />
                    <span className="font-semibold text-lg">Sistema pronto para operar</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pb-10">
              <Button
                onClick={handleNext}
                className="w-full bg-amber-500 text-black hover:bg-amber-400 font-bold text-lg h-14 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-0.5"
              >
                {step === 3 ? 'Acessar Dashboard' : 'Continuar'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
