// ============================================================
// API-Football (api-sports.io) — Cliente para Mundial 2026
// Documentación: https://www.api-football.com/documentation-v3
// League ID: 1 | Season: 2026
// ============================================================

const BASE_URL = 'https://v3.football.api-sports.io'
const API_KEY = process.env.API_FOOTBALL_KEY ?? ''
const WC_LEAGUE_ID = 1
const WC_SEASON = 2026

async function apiFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    next: { revalidate: 30 }, // cache 30s en Next.js
  })

  if (!res.ok) throw new Error(`API-Football error ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API-Football: ${JSON.stringify(json.errors)}`)
  }
  return json.response as T
}

// ============================================================
// TIPOS
// ============================================================

export interface APIFixture {
  fixture: {
    id: number
    date: string
    status: { short: string; long: string; elapsed: number | null }
    venue: { name: string; city: string }
  }
  league: { round: string }
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null }
    away: { id: number; name: string; logo: string; winner: boolean | null }
  }
  goals: { home: number | null; away: number | null }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
  }
}

export interface APIEvent {
  time: { elapsed: number; extra: number | null }
  team: { id: number; name: string }
  player: { id: number; name: string }
  assist: { id: number | null; name: string | null }
  type: string   // 'Goal' | 'Card' | 'subst' | 'Var'
  detail: string // 'Normal Goal' | 'Yellow Card' | 'Red Card' | etc.
  comments: string | null
}

export interface APIPlayer {
  player: { id: number; name: string; photo: string }
  statistics: Array<{
    team: { id: number; name: string }
    games: { position: string; rating: string | null; minutes: number | null }
    goals: { total: number | null; assists: number | null }
    cards: { yellow: number; red: number }
    shots: { total: number | null; on: number | null }
    tackles: { total: number | null }
    saves: number | null
  }>
}

export interface APIStanding {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  goalsDiff: number
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  group: string
}

// ============================================================
// PARTIDOS EN VIVO
// ============================================================

/** Devuelve todos los partidos del Mundial que están jugándose ahora */
export async function getLiveFixtures(): Promise<APIFixture[]> {
  return apiFetch<APIFixture[]>('/fixtures', {
    live: 'all',
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
  })
}

/** Devuelve TODOS los partidos del Mundial (útil para sincronización) */
export async function getAllFixtures(): Promise<APIFixture[]> {
  return apiFetch<APIFixture[]>('/fixtures', {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
  })
}

/** Devuelve los próximos N partidos */
export async function getNextFixtures(next = 10): Promise<APIFixture[]> {
  return apiFetch<APIFixture[]>('/fixtures', {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
    next,
  })
}

/** Devuelve los últimos N partidos finalizados */
export async function getLastFixtures(last = 10): Promise<APIFixture[]> {
  return apiFetch<APIFixture[]>('/fixtures', {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
    last,
  })
}

/** Devuelve un partido por su ID de API-Football */
export async function getFixtureById(fixtureId: number): Promise<APIFixture | null> {
  const data = await apiFetch<APIFixture[]>('/fixtures', { id: fixtureId })
  return data[0] ?? null
}

// ============================================================
// EVENTOS DE UN PARTIDO (goles, tarjetas, cambios)
// ============================================================

export async function getFixtureEvents(fixtureId: number): Promise<APIEvent[]> {
  return apiFetch<APIEvent[]>('/fixtures/events', { fixture: fixtureId })
}

// ============================================================
// ESTADÍSTICAS DE JUGADORES EN UN PARTIDO
// ============================================================

export async function getFixturePlayers(fixtureId: number): Promise<APIPlayer[]> {
  return apiFetch<APIPlayer[]>('/fixtures/players', { fixture: fixtureId })
}

// ============================================================
// CLASIFICACIÓN / TABLA DE GRUPOS
// ============================================================

export async function getStandings(): Promise<APIStanding[][]> {
  const data = await apiFetch<Array<{ league: { standings: APIStanding[][] } }>>('/standings', {
    league: WC_LEAGUE_ID,
    season: WC_SEASON,
  })
  return data[0]?.league?.standings ?? []
}

// ============================================================
// UTILIDADES: MAPEAR STATUS DE API A STATUS DE LA APP
// ============================================================

export function mapAPIStatus(short: string): 'scheduled' | 'live' | 'finished' | 'postponed' {
  // https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures
  const liveStatuses = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE']
  const finishedStatuses = ['FT', 'AET', 'PEN']
  const postponedStatuses = ['PST', 'CANC', 'ABD', 'AWD', 'WO']

  if (liveStatuses.includes(short)) return 'live'
  if (finishedStatuses.includes(short)) return 'finished'
  if (postponedStatuses.includes(short)) return 'postponed'
  return 'scheduled'
}
