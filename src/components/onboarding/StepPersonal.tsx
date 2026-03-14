import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { maskCPF, maskPhone } from '@/lib/formatters'
import type { OnboardingData } from '@/lib/onboarding-schema'

export function StepPersonal() {
  const { control, setValue } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-display font-semibold text-foreground">Dados Pessoais</h2>
        <p className="text-sm text-muted-foreground">Informe seus dados básicos de contato.</p>
      </div>

      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: João da Silva" className="bg-black/50" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  className="bg-black/50 font-mono"
                  {...field}
                  onChange={(e) =>
                    setValue('cpf', maskCPF(e.target.value), { shouldValidate: true })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(00) 00000-0000"
                  className="bg-black/50 font-mono"
                  {...field}
                  onChange={(e) =>
                    setValue('phone', maskPhone(e.target.value), { shouldValidate: true })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="joao@exemplo.com"
                className="bg-black/50"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
