import { subDays } from 'date-fns'

export interface SolicitacaoCredito {
  id: string
  usuario_id: string
  valor_solicitado: number
  taxa_juros: number
  status: 'pendente' | 'aprovado' | 'negado'
  data_solicitacao: string
  data_decisao?: string
  observacoes?: string
  usuarios?: { nome: string; cpf: string }
}

const MOCK_DB: SolicitacaoCredito[] = []
const now = new Date()

// Generate realistic mock data for the authenticated user and some for another user
for (let i = 0; i < 25; i++) {
  const status = i % 3 === 0 ? 'aprovado' : i % 4 === 0 ? 'negado' : 'pendente'
  const daysAgo = i * 3
  const d = subDays(now, daysAgo)

  MOCK_DB.push({
    id: `APP-00${i + 1}`,
    usuario_id: 'user-123',
    valor_solicitado: 15000 + i * 2500,
    taxa_juros: 1.5 + (i % 5) * 0.1,
    status,
    data_solicitacao: d.toISOString(),
    usuarios: { nome: 'João Silva', cpf: '111.222.333-44' },
  })
}

// Another user's data to prove filtering works
MOCK_DB.push({
  id: `APP-999`,
  usuario_id: 'other-user',
  valor_solicitado: 50000,
  taxa_juros: 2.0,
  status: 'aprovado',
  data_solicitacao: now.toISOString(),
  usuarios: { nome: 'Outro Cliente', cpf: '000.000.000-00' },
})

class SupabaseQueryBuilder {
  private data: any[]

  constructor(data: any[]) {
    this.data = [...data]
  }

  select(columns: string) {
    // In a real implementation, this would parse columns and join.
    // We already have nested 'usuarios' in our mock data for simplicity.
    return this
  }

  eq(col: string, val: any) {
    this.data = this.data.filter((d) => d[col] === val)
    return this
  }

  gte(col: string, val: any) {
    this.data = this.data.filter((d) => new Date(d[col]) >= new Date(val))
    return this
  }

  lte(col: string, val: any) {
    this.data = this.data.filter((d) => new Date(d[col]) <= new Date(val))
    return this
  }

  then(resolve: (result: { data: any[]; error: any }) => void) {
    // Simulate network delay
    setTimeout(() => {
      resolve({ data: this.data, error: null })
    }, 400)
  }
}

export const supabase = {
  from: (table: string) => {
    if (table === 'solicitacoes_credito') {
      return new SupabaseQueryBuilder(MOCK_DB)
    }
    return new SupabaseQueryBuilder([])
  },
}
