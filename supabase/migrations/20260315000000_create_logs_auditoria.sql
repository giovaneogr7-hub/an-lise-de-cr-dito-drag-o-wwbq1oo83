CREATE TABLE IF NOT EXISTS public.logs_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  usuario_alvo_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  acao TEXT NOT NULL,
  detalhes JSONB,
  data_acao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_auditoria_admin_id ON public.logs_auditoria(admin_id);
CREATE INDEX IF NOT EXISTS idx_logs_auditoria_data_acao ON public.logs_auditoria(data_acao);
