import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { maskDate } from '@/lib/formatters'
import type { OnboardingData } from '@/lib/onboarding-schema'

export function StepDocuments() {
  const { control, setValue } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-display font-semibold text-foreground">Documentação</h2>
        <p className="text-sm text-muted-foreground">Forneça os dados de identificação.</p>
      </div>

      <FormField
        control={control}
        name="docType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Documento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-black/50">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="RG">RG</SelectItem>
                <SelectItem value="CNH">CNH</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="docNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Documento</FormLabel>
              <FormControl>
                <Input placeholder="Apenas números" className="bg-black/50 font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="issueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Emissão</FormLabel>
              <FormControl>
                <Input
                  placeholder="DD/MM/AAAA"
                  className="bg-black/50 font-mono"
                  {...field}
                  onChange={(e) =>
                    setValue('issueDate', maskDate(e.target.value), { shouldValidate: true })
                  }
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
