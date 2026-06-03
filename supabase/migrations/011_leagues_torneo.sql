-- ============================================================
-- MIGRACIÓN 011 - Extender leagues con tipo de torneo y bracket
-- Permite que una liga tenga un torneo de FC26/WC2026 asociado
-- ============================================================

-- Nuevas columnas en leagues
ALTER TABLE public.leagues
  ADD COLUMN IF NOT EXISTS tournament_type TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS torneo_id UUID REFERENCES public.torneo_tournaments(id) ON DELETE SET NULL DEFAULT NULL;

-- Índice para buscar ligas por torneo
CREATE INDEX IF NOT EXISTS idx_league_torneo ON public.leagues(torneo_id);

-- Las ligas existentes no tienen torneo, quedan con NULL (comportamiento anterior)
