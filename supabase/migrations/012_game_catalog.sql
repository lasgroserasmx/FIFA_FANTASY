-- ============================================================
-- Catálogo de datos del juego: equipos, jugadores, fixtures
-- ============================================================

-- Tipos de torneo (fc26, wc2026, etc.)
CREATE TABLE IF NOT EXISTS public.game_types (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  emoji       TEXT NOT NULL DEFAULT '🎮',
  description TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Equipos por tipo de torneo
CREATE TABLE IF NOT EXISTS public.game_teams (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type  TEXT NOT NULL REFERENCES public.game_types(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  league     TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT '',
  stars      NUMERIC(2,1) DEFAULT NULL,
  rating     INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_type, name)
);

-- Jugadores por tipo de torneo
CREATE TABLE IF NOT EXISTS public.game_players (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type  TEXT NOT NULL REFERENCES public.game_types(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  team       TEXT NOT NULL,   -- Nombre del equipo (debe coincidir con game_teams.name)
  position   TEXT NOT NULL CHECK (position IN ('GK','DEF','MID','FWD')),
  ovr        INTEGER NOT NULL DEFAULT 70,
  price      NUMERIC(5,1) NOT NULL DEFAULT 5.0,
  league     TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_type, name, team)
);

-- Partidos / fixtures reales del torneo
CREATE TABLE IF NOT EXISTS public.game_fixtures (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type    TEXT NOT NULL REFERENCES public.game_types(id) ON DELETE CASCADE,
  home_team    TEXT NOT NULL,
  away_team    TEXT NOT NULL,
  match_date   TIMESTAMPTZ,
  competition  TEXT NOT NULL DEFAULT '',  -- 'Premier League', 'Grupos Fase 1', etc.
  matchday     INTEGER DEFAULT NULL,
  home_score   INTEGER DEFAULT NULL,
  away_score   INTEGER DEFAULT NULL,
  status       TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','finished')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- RLS: lectura pública para usuarios autenticados
ALTER TABLE public.game_types    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_teams    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_fixtures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users read game_types"    ON public.game_types    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users read game_teams"    ON public.game_teams    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users read game_players"  ON public.game_players  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users read game_fixtures" ON public.game_fixtures FOR SELECT USING (auth.uid() IS NOT NULL);

-- Solo admins/service_role puede insertar/editar (seed desde SQL Editor o server)
CREATE POLICY "Service role write game_types"    ON public.game_types    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write game_teams"    ON public.game_teams    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write game_players"  ON public.game_players  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write game_fixtures" ON public.game_fixtures FOR ALL USING (auth.role() = 'service_role');

-- Índices
CREATE INDEX IF NOT EXISTS idx_game_teams_type    ON public.game_teams(game_type);
CREATE INDEX IF NOT EXISTS idx_game_players_type  ON public.game_players(game_type);
CREATE INDEX IF NOT EXISTS idx_game_players_team  ON public.game_players(team);
CREATE INDEX IF NOT EXISTS idx_game_fixtures_type ON public.game_fixtures(game_type);
CREATE INDEX IF NOT EXISTS idx_game_fixtures_date ON public.game_fixtures(match_date);
