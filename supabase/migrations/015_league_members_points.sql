-- Añadir columnas de puntos que faltan en league_members
ALTER TABLE public.league_members
  ADD COLUMN IF NOT EXISTS total_fantasy_points    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_prediction_points INTEGER NOT NULL DEFAULT 0;
