-- Tabla para que cada miembro del torneo guarde su selección de club
-- independientemente del estado principal del torneo (que solo el admin puede editar)

CREATE TABLE IF NOT EXISTS public.torneo_player_selections (
  torneo_id   UUID        NOT NULL REFERENCES public.torneo_tournaments(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  club        TEXT        NOT NULL DEFAULT '',
  player_name TEXT        NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (torneo_id, user_id)
);

ALTER TABLE public.torneo_player_selections ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede VER las selecciones (para que el admin vea a todos)
CREATE POLICY "Authenticated users can read player selections"
  ON public.torneo_player_selections FOR SELECT
  TO authenticated
  USING (true);

-- Cada usuario solo puede insertar/actualizar SU PROPIA selección
CREATE POLICY "Users can insert own selection"
  ON public.torneo_player_selections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own selection"
  ON public.torneo_player_selections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.update_player_selection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER player_selection_updated_at
  BEFORE UPDATE ON public.torneo_player_selections
  FOR EACH ROW EXECUTE FUNCTION public.update_player_selection_updated_at();
