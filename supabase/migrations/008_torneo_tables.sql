-- ============================================================
-- MIGRACIÓN 008 - Tablas para Torneo FC (local tournament manager)
-- Guarda el estado completo como JSONB para máxima flexibilidad
-- ============================================================

CREATE TABLE public.torneo_tournaments (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  game_type   TEXT        NOT NULL DEFAULT 'fc26', -- 'fc26' | 'wc2026' | future
  phase       TEXT        NOT NULL DEFAULT 'setup', -- setup|groups|knockout|finished
  player_count INTEGER    NOT NULL DEFAULT 0,
  state       JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_torneo_user ON public.torneo_tournaments(user_id);
CREATE INDEX idx_torneo_game ON public.torneo_tournaments(game_type);

-- Auto update_at
CREATE TRIGGER update_torneo_updated_at
  BEFORE UPDATE ON public.torneo_tournaments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE public.torneo_tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own torneos"
  ON public.torneo_tournaments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create torneos"
  ON public.torneo_tournaments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own torneos"
  ON public.torneo_tournaments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own torneos"
  ON public.torneo_tournaments FOR DELETE USING (auth.uid() = user_id);
