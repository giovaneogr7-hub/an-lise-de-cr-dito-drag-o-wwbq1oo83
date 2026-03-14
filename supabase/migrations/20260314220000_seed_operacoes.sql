DO $$
DECLARE
  mock_user_id UUID;
  mock_solicitacao_id UUID;
BEGIN
  -- Get any user to be the client target for dummy operation
  SELECT id INTO mock_user_id FROM auth.users LIMIT 1;
  
  -- Ensure operacoes has at least one record for the UI to be testable
  IF NOT EXISTS (SELECT 1 FROM public.operacoes LIMIT 1) AND mock_user_id IS NOT NULL THEN
    INSERT INTO public.solicitacoes_credito (id, usuario_id, valor_solicitado, taxa_juros, status)
    VALUES (gen_random_uuid(), mock_user_id, 10000, 2.5, 'aprovado')
    RETURNING id INTO mock_solicitacao_id;

    INSERT INTO public.operacoes (id, solicitacao_id, valor_liberado, data_liberacao, saldo_devedor)
    VALUES (gen_random_uuid(), mock_solicitacao_id, 10000, now(), 10000);
  END IF;
END $$;
