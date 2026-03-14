import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { maskCurrency } from '@/lib/formatters'
import type { OnboardingData } from '@/lib/onboarding-schema'

export function StepIncome() {
  const { control, setValue } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-display font-semibold text-foreground">Comprovação de Renda</h2>
        <p className="text-sm text-muted-foreground">
          Esses dados nos ajudam a aprovar seu limite.
        </p>
      </div>

      <FormField
        control={control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profissão ou Ocupação</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Engenheiro de Software" className="bg-black/50" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="income"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Renda Mensal (R$)</FormLabel>
            <FormControl>
              <Input
                placeholder="R$ 0,00"
                className="bg-black/50 font-mono text-lg"
                {...field}
                onChange={(e) =>
                  setValue('income', maskCurrency(e.target.value), { shouldValidate: true })
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
