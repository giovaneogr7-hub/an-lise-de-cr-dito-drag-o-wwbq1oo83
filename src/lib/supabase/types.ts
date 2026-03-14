// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      investimentos: {
        Row: {
          data_investimento: string | null
          id: string
          operacao_id: string
          percentual_retorno: number
          status: string
          usuario_id: string
          valor_investido: number
        }
        Insert: {
          data_investimento?: string | null
          id?: string
          operacao_id: string
          percentual_retorno: number
          status: string
          usuario_id: string
          valor_investido: number
        }
        Update: {
          data_investimento?: string | null
          id?: string
          operacao_id?: string
          percentual_retorno?: number
          status?: string
          usuario_id?: string
          valor_investido?: number
        }
        Relationships: [
          {
            foreignKeyName: 'investimentos_operacao_id_fkey'
            columns: ['operacao_id']
            isOneToOne: false
            referencedRelation: 'operacoes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'investimentos_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      operacoes: {
        Row: {
          data_liberacao: string | null
          data_vencimento: string | null
          id: string
          saldo_devedor: number | null
          solicitacao_id: string
          valor_liberado: number | null
        }
        Insert: {
          data_liberacao?: string | null
          data_vencimento?: string | null
          id?: string
          saldo_devedor?: number | null
          solicitacao_id: string
          valor_liberado?: number | null
        }
        Update: {
          data_liberacao?: string | null
          data_vencimento?: string | null
          id?: string
          saldo_devedor?: number | null
          solicitacao_id?: string
          valor_liberado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'operacoes_solicitacao_id_fkey'
            columns: ['solicitacao_id']
            isOneToOne: false
            referencedRelation: 'solicitacoes_credito'
            referencedColumns: ['id']
          },
        ]
      }
      permissoes: {
        Row: {
          acao: string
          id: string
          recurso: string
          role_id: string
        }
        Insert: {
          acao: string
          id?: string
          recurso: string
          role_id: string
        }
        Update: {
          acao?: string
          id?: string
          recurso?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'permissoes_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
        ]
      }
      roles: {
        Row: {
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      solicitacoes_credito: {
        Row: {
          data_decisao: string | null
          data_solicitacao: string | null
          id: string
          observacoes: string | null
          status: string | null
          taxa_juros: number | null
          usuario_id: string
          valor_solicitado: number | null
        }
        Insert: {
          data_decisao?: string | null
          data_solicitacao?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          taxa_juros?: number | null
          usuario_id: string
          valor_solicitado?: number | null
        }
        Update: {
          data_decisao?: string | null
          data_solicitacao?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          taxa_juros?: number | null
          usuario_id?: string
          valor_solicitado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'solicitacoes_credito_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      usuarios: {
        Row: {
          cpf: string | null
          data_criacao: string | null
          email: string | null
          id: string
          nome: string | null
          role: string | null
          role_id: string | null
          status: string | null
          telefone: string | null
          valor_credito_aprovado: number | null
        }
        Insert: {
          cpf?: string | null
          data_criacao?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          role?: string | null
          role_id?: string | null
          status?: string | null
          telefone?: string | null
          valor_credito_aprovado?: number | null
        }
        Update: {
          cpf?: string | null
          data_criacao?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          role?: string | null
          role_id?: string | null
          status?: string | null
          telefone?: string | null
          valor_credito_aprovado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'usuarios_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: investimentos
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   operacao_id: uuid (not null)
//   valor_investido: numeric (not null)
//   percentual_retorno: numeric (not null)
//   data_investimento: timestamp with time zone (nullable, default: now())
//   status: text (not null)
// Table: operacoes
//   id: uuid (not null, default: gen_random_uuid())
//   solicitacao_id: uuid (not null)
//   valor_liberado: numeric (nullable)
//   data_liberacao: timestamp with time zone (nullable)
//   data_vencimento: timestamp with time zone (nullable)
//   saldo_devedor: numeric (nullable)
// Table: permissoes
//   id: uuid (not null, default: gen_random_uuid())
//   role_id: uuid (not null)
//   acao: text (not null)
//   recurso: text (not null)
// Table: roles
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   descricao: text (nullable)
// Table: solicitacoes_credito
//   id: uuid (not null, default: gen_random_uuid())
//   usuario_id: uuid (not null)
//   valor_solicitado: numeric (nullable)
//   taxa_juros: numeric (nullable)
//   status: text (nullable)
//   data_solicitacao: timestamp with time zone (nullable, default: now())
//   data_decisao: timestamp with time zone (nullable)
//   observacoes: text (nullable)
// Table: usuarios
//   id: uuid (not null, default: gen_random_uuid())
//   email: text (nullable)
//   nome: text (nullable)
//   cpf: text (nullable)
//   telefone: text (nullable)
//   data_criacao: timestamp with time zone (nullable, default: now())
//   role: text (nullable)
//   role_id: uuid (nullable)
//   status: text (nullable, default: 'pendente'::text)
//   valor_credito_aprovado: numeric (nullable, default: 0)

// --- CONSTRAINTS ---
// Table: investimentos
//   FOREIGN KEY investimentos_operacao_id_fkey: FOREIGN KEY (operacao_id) REFERENCES operacoes(id) ON DELETE CASCADE
//   PRIMARY KEY investimentos_pkey: PRIMARY KEY (id)
//   CHECK investimentos_status_check: CHECK ((status = ANY (ARRAY['ativo'::text, 'finalizado'::text])))
//   FOREIGN KEY investimentos_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: operacoes
//   PRIMARY KEY operacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY operacoes_solicitacao_id_fkey: FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes_credito(id) ON DELETE CASCADE
// Table: permissoes
//   CHECK permissoes_acao_check: CHECK ((acao = ANY (ARRAY['criar'::text, 'ler'::text, 'editar'::text, 'deletar'::text])))
//   PRIMARY KEY permissoes_pkey: PRIMARY KEY (id)
//   CHECK permissoes_recurso_check: CHECK ((recurso = ANY (ARRAY['solicitacoes'::text, 'operacoes'::text, 'cobrancas'::text, 'relatorios'::text, 'investimentos'::text])))
//   FOREIGN KEY permissoes_role_id_fkey: FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
// Table: roles
//   CHECK roles_nome_check: CHECK ((nome = ANY (ARRAY['admin'::text, 'financeiro'::text, 'cobrador'::text, 'investidor'::text, 'cliente'::text])))
//   PRIMARY KEY roles_pkey: PRIMARY KEY (id)
// Table: solicitacoes_credito
//   PRIMARY KEY solicitacoes_credito_pkey: PRIMARY KEY (id)
//   CHECK solicitacoes_credito_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'aprovado'::text, 'negado'::text])))
//   FOREIGN KEY solicitacoes_credito_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
// Table: usuarios
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
//   CHECK usuarios_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'analista'::text, 'cliente'::text, 'financeiro'::text, 'cobrador'::text, 'investidor'::text])))
//   FOREIGN KEY usuarios_role_id_fkey: FOREIGN KEY (role_id) REFERENCES roles(id)
//   CHECK usuarios_status_check: CHECK ((status = ANY (ARRAY['pendente'::text, 'aprovado'::text, 'negado'::text, 'ativo'::text, 'inativo'::text])))

// --- DATABASE FUNCTIONS ---
// FUNCTION check_admin_status_update()
//   CREATE OR REPLACE FUNCTION public.check_admin_status_update()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       IF NEW.status IS DISTINCT FROM OLD.status THEN
//           IF NOT EXISTS (
//               SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'
//           ) THEN
//               RAISE EXCEPTION 'Apenas administradores podem alterar o status do usuário.';
//           END IF;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: usuarios
//   enforce_admin_status_update: CREATE TRIGGER enforce_admin_status_update BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION check_admin_status_update()
