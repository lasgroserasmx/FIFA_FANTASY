-- ============================================================
-- MIGRACIÓN 007 - Fix RLS en fantasy_rosters
--
-- El bug: .insert().select() en Supabase retorna data=null,error=null
-- cuando la política SELECT no pasa, causando que el presupuesto
-- se descuente sin que el jugador aparezca en la plantilla.
--
-- Solución: política SELECT más simple basada en ownership directo.
-- ============================================================

-- Eliminar política SELECT compleja y reemplazar por una simple
DROP POLICY IF EXISTS "Rosters select" ON public.fantasy_rosters;

-- Nueva política: cualquier miembro de la liga puede ver los rosters
-- (necesario para ver plantillas de rivales en la clasificación)
CREATE POLICY "Rosters select own" ON public.fantasy_rosters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.fantasy_teams
      WHERE id = fantasy_rosters.fantasy_team_id
        AND user_id = auth.uid()
    )
  );

-- Política adicional para ver rosters de otros miembros de la misma liga
CREATE POLICY "Rosters select league members" ON public.fantasy_rosters
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.fantasy_teams ft
      JOIN public.league_members lm ON lm.league_id = ft.league_id
      WHERE ft.id = fantasy_rosters.fantasy_team_id
        AND lm.user_id = auth.uid()
    )
  );
