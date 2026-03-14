export type ApplicationStatus = 'Pendente' | 'Em Revisão' | 'Aprovado' | 'Urgente' | 'Negado'

export interface CreditApplication {
  id: string
  cpf: string
  name: string
  amount: number
  status: ApplicationStatus
  date: string
  score: number
  income: number
  history: { date: string; action: string }[]
}

export const MOCK_CHART_DATA = [
  { name: 'Jan', aprovacoes: 4000, negacoes: 2400 },
  { name: 'Fev', aprovacoes: 3000, negacoes: 1398 },
  { name: 'Mar', aprovacoes: 2000, negacoes: 9800 },
  { name: 'Abr', aprovacoes: 2780, negacoes: 3908 },
  { name: 'Mai', aprovacoes: 1890, negacoes: 4800 },
  { name: 'Jun', aprovacoes: 2390, negacoes: 3800 },
  { name: 'Jul', aprovacoes: 3490, negacoes: 4300 },
]

export const MOCK_APPLICATIONS: CreditApplication[] = [
  {
    id: 'APP-001',
    cpf: '123.456.789-00',
    name: 'Carlos Silva Souza',
    amount: 150000,
    status: 'Pendente',
    date: '2023-10-25',
    score: 720,
    income: 12500,
    history: [
      { date: '2023-10-25', action: 'Solicitação recebida' },
      { date: '2023-10-25', action: 'Análise automática concluída' },
    ],
  },
  {
    id: 'APP-002',
    cpf: '987.654.321-11',
    name: 'Mariana Costa',
    amount: 45000,
    status: 'Em Revisão',
    date: '2023-10-24',
    score: 650,
    income: 8200,
    history: [
      { date: '2023-10-24', action: 'Solicitação recebida' },
      { date: '2023-10-25', action: 'Encaminhado para analista sênior' },
    ],
  },
  {
    id: 'APP-003',
    cpf: '456.123.789-22',
    name: 'Roberto Fernandes',
    amount: 320000,
    status: 'Urgente',
    date: '2023-10-26',
    score: 810,
    income: 25000,
    history: [{ date: '2023-10-26', action: 'Solicitação prioritária (VIP)' }],
  },
  {
    id: 'APP-004',
    cpf: '321.654.987-33',
    name: 'Ana Paula Oliveira',
    amount: 12000,
    status: 'Pendente',
    date: '2023-10-26',
    score: 580,
    income: 4500,
    history: [{ date: '2023-10-26', action: 'Solicitação recebida' }],
  },
  {
    id: 'APP-005',
    cpf: '111.222.333-44',
    name: 'Fernando Santos',
    amount: 85000,
    status: 'Aprovado',
    date: '2023-10-20',
    score: 890,
    income: 18000,
    history: [
      { date: '2023-10-20', action: 'Solicitação recebida' },
      { date: '2023-10-21', action: 'Aprovação automática' },
    ],
  },
]

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
