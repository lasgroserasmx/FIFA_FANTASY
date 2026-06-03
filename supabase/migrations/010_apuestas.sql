-- ============================================================
-- MIGRACIÓN 010 - Apuestas: grupos de amigos por torneo
-- Funciona como "Ligas" pero orientado a torneos de FIFA/FC
-- ============================================================

-- Función para generar código de invitación único (8 chars)
CREATE OR REPLACE FUNCTION generate_invite_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Tabla principal de apuestas
CREATE TABLE public.apuestas (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  tournament_type TEXT        NOT NULL DEFAULT 'fc26',  -- 'fc26' | 'wc2026'
  activities      JSONB       NOT NULL DEFAULT '["torneo"]', -- ['fantasy','prediccion','torneo']
  invite_code     TEXT        UNIQUE NOT NULL DEFAULT generate_invite_code(),
  torneo_id       UUID        REFERENCES public.torneo_tournaments(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Miembros de una apuesta
CREATE TABLE public.apuesta_members (
  apuesta_id  UUID NOT NULL REFERENCES public.apuestas(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (apuesta_id, user_id)
);

-- Índices
CREATE INDEX idx_apuesta_user      ON public.apuestas(user_id);
CREATE INDEX idx_apuesta_code      ON public.apuestas(invite_code);
CREATE INDEX idx_apuesta_member    ON public.apuesta_members(user_id);

-- Auto updated_at
CREATE TRIGGER update_apuesta_updated_at
  BEFORE UPDATE ON public.apuestas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.apuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apuesta_members ENABLE ROW LEVEL SECURITY;

-- Apuestas: cualquier auth user puede leer (para unirse por código)
CREATE POLICY "Auth users can read apuestas"
  ON public.apuestas FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Apuestas: solo el creador puede crear
CREATE POLICY "Users create own apuestas"
  ON public.apuestas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Apuestas: solo el creador puede actualizar/borrar
CREATE POLICY "Users update own apuestas"
  ON public.apuestas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own apuestas"
  ON public.apuestas FOR DELETE
  USING (auth.uid() = user_id);

-- Members: cualquier auth user puede ver miembros
CREATE POLICY "Auth users can read members"
  ON public.apuesta_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Members: cualquier auth user puede unirse a sí mismo
CREATE POLICY "Users join apuesta"
  ON public.apuesta_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Members: solo el propio usuario puede salirse
CREATE POLICY "Users leave apuesta"
  ON public.apuesta_members FOR DELETE
  USING (auth.uid() = user_id);
