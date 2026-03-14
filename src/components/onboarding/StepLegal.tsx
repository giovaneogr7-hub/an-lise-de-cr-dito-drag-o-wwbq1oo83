import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import type { OnboardingData } from '@/lib/onboarding-schema'
import { FileText, ShieldAlert } from 'lucide-react'

export function StepLegal() {
  const { control } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-display font-semibold text-foreground">Termos Legais</h2>
        <p className="text-sm text-muted-foreground">Leia e aceite as condições para continuar.</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-white/5 bg-black/40">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4 text-primary" />
                  Li e aceito os Termos de Uso
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Concordo com as condições gerais de operação de crédito.
                </p>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="acceptPrivacy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-white/5 bg-black/40">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base flex items-center gap-2 cursor-pointer">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  Li e aceito a Política de Privacidade
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Autorizo a consulta e armazenamento dos meus dados no SCR/Bacen e órgãos de
                  proteção.
                </p>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
