-- Add status column to usuarios table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.usuarios 
        ADD COLUMN status TEXT DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'aprovado', 'negado'));
        
        -- Automatically approve existing users to prevent lockout
        UPDATE public.usuarios SET status = 'aprovado';
    END IF;
END $$;

-- Create function to enforce that only admins can change user status
CREATE OR REPLACE FUNCTION check_admin_status_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Apenas administradores podem alterar o status do usuário.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for the status update policy
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_admin_status_update') THEN
        CREATE TRIGGER enforce_admin_status_update
        BEFORE UPDATE ON public.usuarios
        FOR EACH ROW
        EXECUTE FUNCTION check_admin_status_update();
    END IF;
END $$;
