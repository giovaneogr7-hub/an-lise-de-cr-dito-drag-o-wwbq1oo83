import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import { onboardingSchema, stepFields, type OnboardingData } from '@/lib/onboarding-schema'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { StepPersonal } from '@/components/onboarding/StepPersonal'
import { StepDocuments } from '@/components/onboarding/StepDocuments'
import { StepBanking } from '@/components/onboarding/StepBanking'
import { StepIncome } from '@/components/onboarding/StepIncome'
import { StepLegal } from '@/components/onboarding/StepLegal'
import { WizardNav } from '@/components/onboarding/WizardNav'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const STEPS_COUNT = 5

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
  })

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep]
    const isValid = await form.trigger(fieldsToValidate)

    if (isValid) {
      if (currentStep === STEPS_COUNT - 1) {
        setIsSuccess(true)
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const progressPercentage = ((currentStep + 1) / STEPS_COUNT) * 100

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg border-gold-glow bg-card/80 backdrop-blur-xl animate-in zoom-in-95 duration-500">
          <CardContent className="pt-10 pb-8 px-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Tudo Certo!</h1>
            <p className="text-muted-foreground text-lg">
              Suas informações foram enviadas com sucesso. Nossa inteligência artificial já está
              analisando seu perfil.
            </p>
            <div className="pt-4">
              <Button
                asChild
                className="bg-primary text-black hover:bg-accent hover:text-white transition-colors duration-300 w-full sm:w-auto px-8"
              >
                <Link to="/">Acessar Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full p-6 flex justify-center items-center z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-xl border border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <div className="w-5 h-5 bg-primary rounded-sm transform rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-breathing-eye" />
            </div>
          </div>
          <span className="font-display font-bold text-2xl tracking-widest text-foreground">
            DRAGÃO
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <Card className="w-full max-w-xl border-gold-glow bg-card/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Progress Bar Area */}
          <div className="bg-black/60 p-6 border-b border-white/5 space-y-4">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>
                Etapa {currentStep + 1} de {STEPS_COUNT}
              </span>
              <span className="text-accent">{Math.round(progressPercentage)}%</span>
            </div>
            {/* Using a custom wrapper to override the indicator color to accent (blue) */}
            <div className="[&_[data-radix-progress-indicator]]:bg-accent">
              <Progress value={progressPercentage} className="h-2 bg-white/5" />
            </div>
          </div>

          <CardContent className="p-6 sm:p-8">
            <FormProvider {...form}>
              <form onSubmit={(e) => e.preventDefault()}>
                {currentStep === 0 && <StepPersonal />}
                {currentStep === 1 && <StepDocuments />}
                {currentStep === 2 && <StepBanking />}
                {currentStep === 3 && <StepIncome />}
                {currentStep === 4 && <StepLegal />}

                <WizardNav
                  onNext={handleNext}
                  onPrev={currentStep > 0 ? handlePrev : undefined}
                  isLastStep={currentStep === STEPS_COUNT - 1}
                />
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
