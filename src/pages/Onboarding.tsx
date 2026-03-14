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
import { Checkbox } from '@/components/ui/checkbox'
import { User, FileText, Landmark, Wallet, FileCheck, ArrowRight } from 'lucide-react'
import logoImg from '@/assets/40409577-9054-4c9f-af12-2c8c43626167-a0a47.jpeg'

const stepData = [
  { title: 'Dados Pessoais', desc: 'Informações básicas para iniciar a análise.' },
  { title: 'Documentação', desc: 'Envie um documento de identificação com foto.' },
  { title: 'Dados Bancários', desc: 'Informe a conta para recebimento do crédito.' },
  { title: 'Análise de Renda', desc: 'Sua renda define seu limite pré-aprovado.' },
  { title: 'Termos e Condições', desc: 'Seu consentimento para a análise de crédito.' },
]

const stepIcons = [User, FileText, Landmark, Wallet, FileCheck]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      navigate('/')
    }
  }

  const StepIcon = stepIcons[step - 1]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <Link to="/" className="flex items-center gap-4 transition-opacity hover:opacity-80 group">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-black shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-transform duration-500 group-hover:scale-105">
            <img src={logoImg} alt="Último Dragão Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
              ÚLTIMO DRAGÃO
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

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden mt-16 sm:mt-0">
        <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

        <div className="w-full max-w-lg z-10 animate-fade-in-up">
          <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/80 via-primary to-blue-600/80" />
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <StepIcon className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                {stepData[step - 1].title}
              </CardTitle>
              <CardDescription className="text-sm mt-2 text-white/60 max-w-sm mx-auto">
                {stepData[step - 1].desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === step
                        ? 'w-10 bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                        : i < step
                          ? 'w-2 bg-primary/40'
                          : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="min-h-[120px] flex flex-col justify-center">
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <Input
                      placeholder="Nome Completo"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-primary/50"
                    />
                    <Input
                      placeholder="CPF (000.000.000-00)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-primary/50"
                    />
                  </div>
                )}
                {step === 2 && (
                  <div className="animate-fade-in text-center p-6 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer group transition-colors">
                    <FileText className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-white/80">Upload CNH ou RG</span>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <Input
                      placeholder="Banco (Ex: 001 - Banco do Brasil)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-primary/50"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Agência"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-primary/50"
                      />
                      <Input
                        placeholder="Conta com Dígito"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="animate-fade-in">
                    <Input
                      type="number"
                      placeholder="Renda Mensal Estimada (R$)"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus-visible:ring-primary/50"
                    />
                  </div>
                )}
                {step === 5 && (
                  <div className="animate-fade-in">
                    <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-lg border border-white/10">
                      <Checkbox
                        id="terms"
                        className="mt-1 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-white/80 leading-snug cursor-pointer font-normal"
                      >
                        Concordo com os Termos de Uso e Política de Privacidade do ÚLTIMO DRAGÃO, e
                        autorizo a consulta aos órgãos de proteção ao crédito.
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pb-8">
              <Button
                onClick={handleNext}
                className="w-full bg-primary text-black hover:bg-primary/90 font-bold text-lg h-12 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:-translate-y-0.5"
              >
                {step === 5 ? 'Finalizar Cadastro' : 'Continuar'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
