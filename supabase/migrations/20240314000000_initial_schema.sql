-- Create usuarios table
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    nome TEXT,
    cpf TEXT,
    telefone TEXT,
    data_criacao TIMESTAMP DEFAULT now(),
    role TEXT CHECK (role IN ('admin', 'analista', 'cliente'))
);

-- Create solicitacoes_credito table
CREATE TABLE public.solicitacoes_credito (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    valor_solicitado NUMERIC,
    taxa_juros NUMERIC,
    status TEXT CHECK (status IN ('pendente', 'aprovado', 'negado')),
    data_solicitacao TIMESTAMP DEFAULT now(),
    data_decisao TIMESTAMP,
    observacoes TEXT
);

-- Create operacoes table
CREATE TABLE public.operacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitacao_id UUID NOT NULL REFERENCES public.solicitacoes_credito(id) ON DELETE CASCADE,
    valor_liberado NUMERIC,
    data_liberacao TIMESTAMP DEFAULT now(),
    data_vencimento TIMESTAMP,
    saldo_devedor NUMERIC
);
