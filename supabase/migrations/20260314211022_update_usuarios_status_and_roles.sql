DO $$ 
BEGIN
    ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_status_check;
    ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_status_check CHECK (status IN ('pendente', 'aprovado', 'negado', 'ativo', 'inativo'));

    ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_role_check;
    ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_role_check CHECK (role IN ('admin', 'analista', 'cliente', 'financeiro', 'cobrador', 'investidor'));
END $$;

UPDATE public.usuarios SET status = 'ativo' WHERE status = 'aprovado';
