import * as z from 'zod'

export const onboardingSchema = z.object({
  // Step 1: Personal Data
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().min(14, 'CPF inválido'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(14, 'Telefone inválido'),

  // Step 2: Documents
  docType: z.enum(['RG', 'CNH'], { required_error: 'Selecione o tipo de documento' }),
  docNumber: z.string().min(5, 'Número de documento inválido'),
  issueDate: z.string().min(10, 'Data inválida (DD/MM/AAAA)'),

  // Step 3: Banking Data
  bankName: z.string().min(2, 'Nome do banco é obrigatório'),
  agency: z.string().min(2, 'Agência é obrigatória').regex(/^\d+$/, 'Apenas números'),
  account: z
    .string()
    .min(2, 'Conta é obrigatória')
    .regex(/^\d+-\d$/, 'Formato esperado: 12345-6'),

  // Step 4: Income
  occupation: z.string().min(2, 'Profissão é obrigatória'),
  income: z.string().min(1, 'Renda é obrigatória'),

  // Step 5: Legal Terms
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os Termos de Uso' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar a Política de Privacidade' }),
  }),
})

export type OnboardingData = z.infer<typeof onboardingSchema>

export const stepFields: (keyof OnboardingData)[][] = [
  ['fullName', 'cpf', 'email', 'phone'],
  ['docType', 'docNumber', 'issueDate'],
  ['bankName', 'agency', 'account'],
  ['occupation', 'income'],
  ['acceptTerms', 'acceptPrivacy'],
]
