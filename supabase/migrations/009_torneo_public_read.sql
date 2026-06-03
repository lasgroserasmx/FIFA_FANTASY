-- ============================================================
-- MIGRACIÓN 009 - Permitir lectura pública de torneos por ID
-- Cualquier usuario autenticado puede ver un torneo si tiene su ID.
-- Solo el dueño puede crear/editar/borrar.
-- ============================================================

-- Reemplazar política de SELECT restrictiva por una que permita
-- a cualquier usuario autenticado leer cualquier torneo.
-- (La lista muestra solo los propios filtrando en la query)
DROP POLICY IF EXISTS "Users see own torneos" ON public.torneo_tournaments;

CREATE POLICY "Auth users can read any torneo"
  ON public.torneo_tournaments FOR SELECT
  USING (auth.uid() IS NOT NULL);
