import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

interface WizardNavProps {
  onNext: () => void
  onPrev?: () => void
  isLastStep: boolean
  isLoading?: boolean
}

export function WizardNav({ onNext, onPrev, isLastStep, isLoading }: WizardNavProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
      <div>
        {onPrev && (
          <Button
            type="button"
            variant="ghost"
            onClick={onPrev}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        )}
      </div>
      <Button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        className="bg-primary text-black hover:bg-accent hover:text-white transition-colors duration-300 font-bold min-w-[140px]"
      >
        {isLastStep ? (
          <>
            Finalizar
            <CheckCircle className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
