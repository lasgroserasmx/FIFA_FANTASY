export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD'
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed'
export type MatchStage = 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final'
export type LeagueMode = 'fantasy' | 'prediction' | 'both' | 'torneo' | 'all'
export type LeagueStatus = 'draft' | 'active' | 'locked' | 'finished'
export type MemberRole = 'admin' | 'member'
export type TransactionType = 'entry_fee' | 'prize' | 'refund'
export type TransactionStatus = 'pending' | 'completed' | 'failed'

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  country: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  short_name: string
  logo_url: string | null
  country: string | null
  group_name: string | null
  created_at: string
}

export interface Player {
  id: string
  team_id: string | null
  name: string
  short_name: string | null
  position: PlayerPosition
  nationality: string | null
  shirt_number: number | null
  photo_url: string | null
  price: number
  is_available: boolean
  created_at: string
  updated_at: string
  team?: Team
}

export interface Match {
  id: string
  home_team_id: string | null
  away_team_id: string | null
  home_score: number | null
  away_score: number | null
  match_date: string
  venue: string | null
  stage: MatchStage
  status: MatchStatus
  matchday: number | null
  created_at: string
  updated_at: string
  home_team?: Team
  away_team?: Team
}

export interface PlayerMatchStats {
  id: string
  player_id: string
  match_id: string
  goals: number
  assists: number
  clean_sheet: boolean
  saves: number
  yellow_cards: number
  red_cards: number
  own_goals: number
  minutes_played: number
  fantasy_points: number
  created_at: string
  player?: Player
  match?: Match
}

export interface League {
  id: string
  name: string
  description: string | null
  mode: LeagueMode
  tournament_type: string | null
  torneo_id: string | null
  status: LeagueStatus
  invite_code: string
  admin_id: string | null
  max_members: number
  entry_fee: number
  prize_pool: number
  scoring_goal: number
  scoring_assist: number
  scoring_clean_sheet: number
  scoring_save: number
  scoring_yellow_card: number
  scoring_red_card: number
  scoring_own_goal: number
  pred_correct_outcome: number
  pred_correct_diff: number
  pred_exact_score: number
  draft_deadline: string | null
  budget: number
  squad_size: number
  predictions_locked: boolean
  created_at: string
  updated_at: string
  member_count?: number
  admin?: Profile
}

export interface LeagueMember {
  id: string
  league_id: string
  user_id: string
  role: MemberRole
  joined_at: string
  total_fantasy_points: number
  total_prediction_points: number
  rank: number | null
  profile?: Profile
  league?: League
}

export interface FantasyTeam {
  id: string
  league_id: string
  user_id: string
  name: string
  budget_remaining: number
  total_points: number
  created_at: string
  updated_at: string
  roster?: FantasyRoster[]
  profile?: Profile
}

export interface FantasyRoster {
  id: string
  fantasy_team_id: string
  player_id: string
  is_captain: boolean
  is_vice_captain: boolean
  is_starting: boolean
  purchase_price: number | null
  added_at: string
  player?: Player
}

export interface FantasyPoints {
  id: string
  fantasy_team_id: string
  match_id: string
  player_id: string
  points: number
  is_captain_multiplied: boolean
  created_at: string
  player?: Player
  match?: Match
}

export interface Prediction {
  id: string
  league_id: string
  user_id: string
  match_id: string
  predicted_home_score: number | null
  predicted_away_score: number | null
  predicted_winner_id: string | null
  champion_team_id: string | null
  points_earned: number
  is_processed: boolean
  created_at: string
  updated_at: string
  match?: Match
  predicted_winner?: Team
}

export interface Transaction {
  id: string
  league_id: string | null
  user_id: string | null
  amount: number
  type: TransactionType
  status: TransactionStatus
  reference: string | null
  created_at: string
}

// Dashboard stats
export interface DashboardStats {
  rank: number | null
  totalFantasyPoints: number
  totalPredictionPoints: number
  upcomingMatches: Match[]
  recentActivity: ActivityItem[]
  prizePool: number
}

export interface ActivityItem {
  id: string
  type: 'prediction' | 'transfer' | 'points' | 'join'
  message: string
  timestamp: string
  points?: number
}

// Form types
export interface CreateLeagueInput {
  name: string
  description?: string
  mode: LeagueMode
  max_members: number
  entry_fee: number
  budget: number
  squad_size: number
  tournament_type?: string
}

export interface UpdateLeagueInput extends Partial<CreateLeagueInput> {
  status?: LeagueStatus
  predictions_locked?: boolean
  scoring_goal?: number
  scoring_assist?: number
  scoring_clean_sheet?: number
  scoring_save?: number
  scoring_yellow_card?: number
  scoring_red_card?: number
  scoring_own_goal?: number
  pred_correct_outcome?: number
  pred_correct_diff?: number
  pred_exact_score?: number
  draft_deadline?: string
}

export interface PredictionInput {
  match_id: string
  predicted_home_score: number
  predicted_away_score: number
}
