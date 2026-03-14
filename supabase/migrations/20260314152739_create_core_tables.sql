-- CREATE TABLES IF NOT EXIST TO ENSURE STRUCTURE
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    nome TEXT,
    cpf TEXT,
    telefone TEXT,
    data_criacao TIMESTAMPTZ DEFAULT now(),
    role TEXT CHECK (role IN ('admin', 'analista', 'cliente'))
);

CREATE TABLE IF NOT EXISTS public.solicitacoes_credito (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    valor_solicitado NUMERIC,
    taxa_juros NUMERIC,
    status TEXT CHECK (status IN ('pendente', 'aprovado', 'negado')),
    data_solicitacao TIMESTAMPTZ DEFAULT now(),
    data_decisao TIMESTAMPTZ,
    observacoes TEXT
);

CREATE TABLE IF NOT EXISTS public.operacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES public.solicitacoes_credito(id) ON DELETE CASCADE,
    valor_liberado NUMERIC,
    data_liberacao TIMESTAMPTZ,
    data_vencimento TIMESTAMPTZ,
    saldo_devedor NUMERIC
);

-- ENSURE COLUMNS USE TIMESTAMPTZ (WITH TIME ZONE) FOR EXISTING TABLES
ALTER TABLE public.usuarios 
    ALTER COLUMN data_criacao TYPE TIMESTAMPTZ USING data_criacao AT TIME ZONE 'UTC';

ALTER TABLE public.solicitacoes_credito 
    ALTER COLUMN data_solicitacao TYPE TIMESTAMPTZ USING data_solicitacao AT TIME ZONE 'UTC',
    ALTER COLUMN data_decisao TYPE TIMESTAMPTZ USING data_decisao AT TIME ZONE 'UTC';

ALTER TABLE public.operacoes 
    ALTER COLUMN data_liberacao TYPE TIMESTAMPTZ USING data_liberacao AT TIME ZONE 'UTC',
    ALTER COLUMN data_vencimento TYPE TIMESTAMPTZ USING data_vencimento AT TIME ZONE 'UTC';
