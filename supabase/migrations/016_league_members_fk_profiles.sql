-- Asegurar FK entre league_members.user_id y profiles.id
-- para que PostgREST permita el join profile:profiles(*)

-- Primero aseguramos que profiles existe con PK
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar que league_members.user_id tiene FK a profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'league_members_user_id_fkey'
      AND table_name = 'league_members'
  ) THEN
    ALTER TABLE public.league_members
      ADD CONSTRAINT league_members_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Columnas de puntos
ALTER TABLE public.league_members
  ADD COLUMN IF NOT EXISTS total_fantasy_points    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_prediction_points INTEGER NOT NULL DEFAULT 0;

-- RLS profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
