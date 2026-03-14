import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { OnboardingData } from '@/lib/onboarding-schema'

export function StepBanking() {
  const { control, setValue } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-display font-semibold text-foreground">Dados Bancários</h2>
        <p className="text-sm text-muted-foreground">
          Informe a conta para recebimento de valores.
        </p>
      </div>

      <FormField
        control={control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome ou Código do Banco</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 341 - Itaú, Nubank..." className="bg-black/50" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="agency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agência (sem dígito)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0000"
                  className="bg-black/50 font-mono"
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setValue('agency', val, { shouldValidate: true })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta com Dígito</FormLabel>
              <FormControl>
                <Input
                  placeholder="00000-0"
                  className="bg-black/50 font-mono"
                  {...field}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^\d-]/g, '')
                    if (val.length > 0 && !val.includes('-') && val.length > 4) {
                      val = val.slice(0, val.length - 1) + '-' + val.slice(val.length - 1)
                    }
                    setValue('account', val, { shouldValidate: true })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
