-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  country TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEAMS (Football clubs/national teams)
-- ============================================================
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  country TEXT,
  group_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLAYERS
-- ============================================================
CREATE TYPE public.player_position AS ENUM ('GK', 'DEF', 'MID', 'FWD');

CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  position player_position NOT NULL,
  nationality TEXT,
  shirt_number INTEGER,
  photo_url TEXT,
  price NUMERIC(5,1) DEFAULT 5.0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TYPE public.match_status AS ENUM ('scheduled', 'live', 'finished', 'postponed');
CREATE TYPE public.match_stage AS ENUM ('group', 'round_of_16', 'quarter_final', 'semi_final', 'final');

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id UUID REFERENCES public.teams(id),
  away_team_id UUID REFERENCES public.teams(id),
  home_score INTEGER,
  away_score INTEGER,
  match_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  stage match_stage NOT NULL DEFAULT 'group',
  status match_status NOT NULL DEFAULT 'scheduled',
  matchday INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLAYER MATCH STATS
-- ============================================================
CREATE TABLE public.player_match_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  clean_sheet BOOLEAN DEFAULT FALSE,
  saves INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  own_goals INTEGER DEFAULT 0,
  minutes_played INTEGER DEFAULT 0,
  fantasy_points INTEGER GENERATED ALWAYS AS (
    goals * 5 +
    assists * 3 +
    (CASE WHEN clean_sheet THEN 4 ELSE 0 END) +
    saves * 1 +
    yellow_cards * -1 +
    red_cards * -3 +
    own_goals * -2
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, match_id)
);

-- ============================================================
-- LEAGUES
-- ============================================================
CREATE TYPE public.league_mode AS ENUM ('fantasy', 'prediction', 'both');
CREATE TYPE public.league_status AS ENUM ('draft', 'active', 'locked', 'finished');

CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  mode league_mode NOT NULL DEFAULT 'both',
  status league_status NOT NULL DEFAULT 'draft',
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex'),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  max_members INTEGER DEFAULT 20,
  entry_fee NUMERIC(10,2) DEFAULT 0,
  prize_pool NUMERIC(10,2) DEFAULT 0,
  -- Scoring config (overrides defaults)
  scoring_goal INTEGER DEFAULT 5,
  scoring_assist INTEGER DEFAULT 3,
  scoring_clean_sheet INTEGER DEFAULT 4,
  scoring_save INTEGER DEFAULT 1,
  scoring_yellow_card INTEGER DEFAULT -1,
  scoring_red_card INTEGER DEFAULT -3,
  scoring_own_goal INTEGER DEFAULT -2,
  -- Prediction scoring
  pred_correct_outcome INTEGER DEFAULT 3,
  pred_correct_diff INTEGER DEFAULT 5,
  pred_exact_score INTEGER DEFAULT 10,
  -- Draft config
  draft_deadline TIMESTAMPTZ,
  budget NUMERIC(5,1) DEFAULT 100.0,
  squad_size INTEGER DEFAULT 15,
  predictions_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEAGUE MEMBERS
-- ============================================================
CREATE TYPE public.member_role AS ENUM ('admin', 'member');

CREATE TABLE public.league_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  total_fantasy_points INTEGER DEFAULT 0,
  total_prediction_points INTEGER DEFAULT 0,
  rank INTEGER,
  UNIQUE(league_id, user_id)
);

-- ============================================================
-- FANTASY TEAMS
-- ============================================================
CREATE TABLE public.fantasy_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_remaining NUMERIC(5,1) DEFAULT 100.0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, user_id)
);

-- ============================================================
-- FANTASY ROSTERS (players in a fantasy team)
-- ============================================================
CREATE TABLE public.fantasy_rosters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fantasy_team_id UUID REFERENCES public.fantasy_teams(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  is_captain BOOLEAN DEFAULT FALSE,
  is_vice_captain BOOLEAN DEFAULT FALSE,
  is_starting BOOLEAN DEFAULT TRUE,
  purchase_price NUMERIC(5,1),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fantasy_team_id, player_id)
);

-- ============================================================
-- FANTASY POINTS (per matchday)
-- ============================================================
CREATE TABLE public.fantasy_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fantasy_team_id UUID REFERENCES public.fantasy_teams(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  is_captain_multiplied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PREDICTIONS
-- ============================================================
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  predicted_home_score INTEGER,
  predicted_away_score INTEGER,
  predicted_winner_id UUID REFERENCES public.teams(id),
  champion_team_id UUID REFERENCES public.teams(id),
  points_earned INTEGER DEFAULT 0,
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, user_id, match_id)
);

-- ============================================================
-- TRANSACTIONS / PAYMENTS
-- ============================================================
CREATE TYPE public.transaction_type AS ENUM ('entry_fee', 'prize', 'refund');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id),
  user_id UUID REFERENCES auth.users(id),
  amount NUMERIC(10,2) NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_league_members_league ON public.league_members(league_id);
CREATE INDEX idx_league_members_user ON public.league_members(user_id);
CREATE INDEX idx_fantasy_rosters_team ON public.fantasy_rosters(fantasy_team_id);
CREATE INDEX idx_fantasy_points_team ON public.fantasy_points(fantasy_team_id);
CREATE INDEX idx_predictions_league_user ON public.predictions(league_id, user_id);
CREATE INDEX idx_matches_date ON public.matches(match_date);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_player_match_stats_player ON public.player_match_stats(player_id);
CREATE INDEX idx_player_match_stats_match ON public.player_match_stats(match_id);
CREATE INDEX idx_players_team ON public.players(team_id);
CREATE INDEX idx_players_position ON public.players(position);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fantasy_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fantasy_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fantasy_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_match_stats ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Teams, players, matches - public read
CREATE POLICY "Teams public read" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Players public read" ON public.players FOR SELECT USING (true);
CREATE POLICY "Matches public read" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Match stats public read" ON public.player_match_stats FOR SELECT USING (true);

-- Leagues
CREATE POLICY "Leagues select" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Leagues insert" ON public.leagues FOR INSERT WITH CHECK (auth.uid() = admin_id);
CREATE POLICY "Leagues update admin" ON public.leagues FOR UPDATE USING (auth.uid() = admin_id);

-- League members
CREATE POLICY "Members select" ON public.league_members FOR SELECT USING (true);
CREATE POLICY "Members insert self" ON public.league_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Members delete self" ON public.league_members FOR DELETE USING (auth.uid() = user_id);

-- Fantasy teams
CREATE POLICY "Fantasy teams select" ON public.fantasy_teams FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.league_members WHERE league_id = fantasy_teams.league_id AND user_id = auth.uid())
);
CREATE POLICY "Fantasy teams insert own" ON public.fantasy_teams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Fantasy teams update own" ON public.fantasy_teams FOR UPDATE USING (auth.uid() = user_id);

-- Fantasy rosters
CREATE POLICY "Rosters select" ON public.fantasy_rosters FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.fantasy_teams ft
    JOIN public.league_members lm ON lm.league_id = ft.league_id
    WHERE ft.id = fantasy_rosters.fantasy_team_id AND lm.user_id = auth.uid()
  )
);
CREATE POLICY "Rosters insert own" ON public.fantasy_rosters FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.fantasy_teams WHERE id = fantasy_team_id AND user_id = auth.uid())
);
CREATE POLICY "Rosters update own" ON public.fantasy_rosters FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.fantasy_teams WHERE id = fantasy_team_id AND user_id = auth.uid())
);
CREATE POLICY "Rosters delete own" ON public.fantasy_rosters FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.fantasy_teams WHERE id = fantasy_team_id AND user_id = auth.uid())
);

-- Fantasy points
CREATE POLICY "Fantasy points select" ON public.fantasy_points FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.fantasy_teams WHERE id = fantasy_team_id AND user_id = auth.uid())
);

-- Predictions
CREATE POLICY "Predictions select own" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Predictions insert own" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Predictions update own" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Transactions select own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON public.leagues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_fantasy_teams_updated_at BEFORE UPDATE ON public.fantasy_teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
