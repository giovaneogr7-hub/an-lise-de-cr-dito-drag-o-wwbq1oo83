-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL CHECK (nome IN ('admin', 'financeiro', 'cobrador', 'investidor', 'cliente')),
    descricao TEXT
);

-- Seed roles table
INSERT INTO public.roles (nome, descricao) VALUES
    ('admin', 'Administrador do sistema com acesso total'),
    ('financeiro', 'Responsável pelas operações financeiras'),
    ('cobrador', 'Responsável pela cobrança de inadimplentes'),
    ('investidor', 'Investidor em operações de crédito'),
    ('cliente', 'Cliente solicitante de crédito')
ON CONFLICT DO NOTHING;

-- Create permissoes table
CREATE TABLE IF NOT EXISTS public.permissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    acao TEXT NOT NULL CHECK (acao IN ('criar', 'ler', 'editar', 'deletar')),
    recurso TEXT NOT NULL CHECK (recurso IN ('solicitacoes', 'operacoes', 'cobrancas', 'relatorios', 'investimentos'))
);

-- Update usuarios table
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id);

-- Link existing users to the new structured roles
UPDATE public.usuarios u
SET role_id = r.id
FROM public.roles r
WHERE u.role = r.nome;

-- Map legacy 'analista' role to 'financeiro' if any exist
UPDATE public.usuarios u
SET role_id = r.id
FROM public.roles r
WHERE u.role = 'analista' AND r.nome = 'financeiro' AND u.role_id IS NULL;

-- Create investimentos table
CREATE TABLE IF NOT EXISTS public.investimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    operacao_id UUID NOT NULL REFERENCES public.operacoes(id) ON DELETE CASCADE,
    valor_investido NUMERIC NOT NULL,
    percentual_retorno NUMERIC NOT NULL,
    data_investimento TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL CHECK (status IN ('ativo', 'finalizado'))
);
