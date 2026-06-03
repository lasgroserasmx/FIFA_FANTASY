// ============================================================
// Datos de equipos por tipo de torneo
// Agrega nuevos torneos aquí a medida que los necesites
// ============================================================

export interface GameTeam {
  name: string
  league: string
  country: string
  rating?: number
}

export interface GameType {
  id: string
  label: string
  emoji: string
  description: string
  teams: GameTeam[]
}

// ── EA Sports FC 26 — Top clubs ────────────────────────────────────────────────
const FC26_TEAMS: GameTeam[] = [
  // ⚽ Premier League
  { name: 'Manchester City',    league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 93 },
  { name: 'Arsenal',            league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 88 },
  { name: 'Liverpool',          league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 88 },
  { name: 'Chelsea',            league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 84 },
  { name: 'Manchester United',  league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 82 },
  { name: 'Newcastle United',   league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 82 },
  { name: 'Tottenham Hotspur',  league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 81 },
  { name: 'Aston Villa',        league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 81 },
  { name: 'Brighton',           league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 79 },
  { name: 'West Ham United',    league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 78 },
  { name: 'Brentford',          league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 77 },
  { name: 'Fulham',             league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 77 },
  { name: 'Crystal Palace',     league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 76 },
  { name: 'Everton',            league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 75 },
  { name: 'Nottingham Forest',  league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 75 },
  { name: 'Wolves',             league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 74 },
  { name: 'Leicester City',     league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 74 },
  { name: 'Bournemouth',        league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 74 },

  // 🇪🇸 La Liga
  { name: 'Real Madrid',        league: 'La Liga', country: '🇪🇸', rating: 99 },
  { name: 'Barcelona',          league: 'La Liga', country: '🇪🇸', rating: 86 },
  { name: 'Atlético de Madrid', league: 'La Liga', country: '🇪🇸', rating: 84 },
  { name: 'Athletic Club',      league: 'La Liga', country: '🇪🇸', rating: 80 },
  { name: 'Real Sociedad',      league: 'La Liga', country: '🇪🇸', rating: 80 },
  { name: 'Villarreal',         league: 'La Liga', country: '🇪🇸', rating: 79 },
  { name: 'Real Betis',         league: 'La Liga', country: '🇪🇸', rating: 78 },
  { name: 'Sevilla',            league: 'La Liga', country: '🇪🇸', rating: 78 },
  { name: 'Girona',             league: 'La Liga', country: '🇪🇸', rating: 76 },
  { name: 'Valencia',           league: 'La Liga', country: '🇪🇸', rating: 75 },
  { name: 'Osasuna',            league: 'La Liga', country: '🇪🇸', rating: 74 },
  { name: 'Rayo Vallecano',     league: 'La Liga', country: '🇪🇸', rating: 73 },
  { name: 'Celta Vigo',         league: 'La Liga', country: '🇪🇸', rating: 73 },
  { name: 'Getafe',             league: 'La Liga', country: '🇪🇸', rating: 72 },
  { name: 'Mallorca',           league: 'La Liga', country: '🇪🇸', rating: 72 },

  // 🇩🇪 Bundesliga
  { name: 'Bayern Munich',      league: 'Bundesliga', country: '🇩🇪', rating: 90 },
  { name: 'Bayer Leverkusen',   league: 'Bundesliga', country: '🇩🇪', rating: 84 },
  { name: 'Borussia Dortmund',  league: 'Bundesliga', country: '🇩🇪', rating: 82 },
  { name: 'RB Leipzig',         league: 'Bundesliga', country: '🇩🇪', rating: 82 },
  { name: 'Eintracht Frankfurt',league: 'Bundesliga', country: '🇩🇪', rating: 79 },
  { name: 'VfB Stuttgart',      league: 'Bundesliga', country: '🇩🇪', rating: 78 },
  { name: 'Wolfsburg',          league: 'Bundesliga', country: '🇩🇪', rating: 76 },
  { name: 'SC Freiburg',        league: 'Bundesliga', country: '🇩🇪', rating: 75 },
  { name: 'Hoffenheim',         league: 'Bundesliga', country: '🇩🇪', rating: 74 },
  { name: 'Werder Bremen',      league: 'Bundesliga', country: '🇩🇪', rating: 74 },
  { name: 'Borussia M\'gladbach',league: 'Bundesliga', country: '🇩🇪', rating: 73 },
  { name: 'Augsburg',           league: 'Bundesliga', country: '🇩🇪', rating: 72 },

  // 🇮🇹 Serie A
  { name: 'Inter Milan',        league: 'Serie A', country: '🇮🇹', rating: 85 },
  { name: 'Napoli',             league: 'Serie A', country: '🇮🇹', rating: 84 },
  { name: 'AC Milan',           league: 'Serie A', country: '🇮🇹', rating: 83 },
  { name: 'Juventus',           league: 'Serie A', country: '🇮🇹', rating: 83 },
  { name: 'Atalanta',           league: 'Serie A', country: '🇮🇹', rating: 82 },
  { name: 'AS Roma',            league: 'Serie A', country: '🇮🇹', rating: 80 },
  { name: 'Lazio',              league: 'Serie A', country: '🇮🇹', rating: 79 },
  { name: 'Fiorentina',         league: 'Serie A', country: '🇮🇹', rating: 78 },
  { name: 'Bologna',            league: 'Serie A', country: '🇮🇹', rating: 76 },
  { name: 'Torino',             league: 'Serie A', country: '🇮🇹', rating: 74 },
  { name: 'Udinese',            league: 'Serie A', country: '🇮🇹', rating: 73 },
  { name: 'Genoa',              league: 'Serie A', country: '🇮🇹', rating: 72 },
  { name: 'Monza',              league: 'Serie A', country: '🇮🇹', rating: 72 },
  { name: 'Cagliari',           league: 'Serie A', country: '🇮🇹', rating: 71 },

  // 🇫🇷 Ligue 1
  { name: 'PSG',                league: 'Ligue 1', country: '🇫🇷', rating: 87 },
  { name: 'Monaco',             league: 'Ligue 1', country: '🇫🇷', rating: 82 },
  { name: 'Lyon',               league: 'Ligue 1', country: '🇫🇷', rating: 80 },
  { name: 'Marseille',          league: 'Ligue 1', country: '🇫🇷', rating: 79 },
  { name: 'Lille',              league: 'Ligue 1', country: '🇫🇷', rating: 78 },
  { name: 'Nice',               league: 'Ligue 1', country: '🇫🇷', rating: 77 },
  { name: 'Lens',               league: 'Ligue 1', country: '🇫🇷', rating: 76 },
  { name: 'Rennes',             league: 'Ligue 1', country: '🇫🇷', rating: 75 },
  { name: 'Brest',              league: 'Ligue 1', country: '🇫🇷', rating: 74 },
  { name: 'Reims',              league: 'Ligue 1', country: '🇫🇷', rating: 72 },
  { name: 'Nantes',             league: 'Ligue 1', country: '🇫🇷', rating: 71 },

  // 🇵🇹 Primeira Liga
  { name: 'Benfica',            league: 'Primeira Liga', country: '🇵🇹', rating: 82 },
  { name: 'Porto',              league: 'Primeira Liga', country: '🇵🇹', rating: 81 },
  { name: 'Sporting CP',        league: 'Primeira Liga', country: '🇵🇹', rating: 80 },
  { name: 'Braga',              league: 'Primeira Liga', country: '🇵🇹', rating: 75 },
  { name: 'Vitória SC',         league: 'Primeira Liga', country: '🇵🇹', rating: 71 },

  // 🇳🇱 Eredivisie
  { name: 'Ajax',               league: 'Eredivisie', country: '🇳🇱', rating: 80 },
  { name: 'PSV',                league: 'Eredivisie', country: '🇳🇱', rating: 82 },
  { name: 'Feyenoord',          league: 'Eredivisie', country: '🇳🇱', rating: 80 },
  { name: 'AZ Alkmaar',         league: 'Eredivisie', country: '🇳🇱', rating: 76 },
  { name: 'FC Twente',          league: 'Eredivisie', country: '🇳🇱', rating: 74 },

  // 🇧🇪 Pro League
  { name: 'Club Brugge',        league: 'Pro League', country: '🇧🇪', rating: 78 },
  { name: 'Anderlecht',         league: 'Pro League', country: '🇧🇪', rating: 76 },
  { name: 'Genk',               league: 'Pro League', country: '🇧🇪', rating: 74 },
  { name: 'Standard Liège',     league: 'Pro League', country: '🇧🇪', rating: 72 },

  // 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish Premiership
  { name: 'Celtic',             league: 'Scottish Prem.', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 78 },
  { name: 'Rangers',            league: 'Scottish Prem.', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 76 },

  // 🇹🇷 Süper Lig
  { name: 'Galatasaray',        league: 'Süper Lig', country: '🇹🇷', rating: 80 },
  { name: 'Fenerbahçe',         league: 'Süper Lig', country: '🇹🇷', rating: 79 },
  { name: 'Beşiktaş',          league: 'Süper Lig', country: '🇹🇷', rating: 75 },
  { name: 'Trabzonspor',        league: 'Süper Lig', country: '🇹🇷', rating: 73 },

  // 🇷🇺 / 🇺🇦 Europa del Este
  { name: 'Shakhtar Donetsk',   league: 'Premier League UA', country: '🇺🇦', rating: 76 },
  { name: 'Dinamo Zagreb',      league: 'HNL', country: '🇭🇷', rating: 75 },
  { name: 'Red Bull Salzburg',  league: 'Bundesliga AT', country: '🇦🇹', rating: 78 },
  { name: 'Sturm Graz',         league: 'Bundesliga AT', country: '🇦🇹', rating: 72 },

  // 🇲🇽 Liga MX
  { name: 'Club América',       league: 'Liga MX', country: '🇲🇽', rating: 76 },
  { name: 'Chivas',             league: 'Liga MX', country: '🇲🇽', rating: 74 },
  { name: 'Cruz Azul',          league: 'Liga MX', country: '🇲🇽', rating: 74 },
  { name: 'Pumas UNAM',         league: 'Liga MX', country: '🇲🇽', rating: 72 },
  { name: 'Tigres UANL',        league: 'Liga MX', country: '🇲🇽', rating: 75 },
  { name: 'Monterrey',          league: 'Liga MX', country: '🇲🇽', rating: 75 },
  { name: 'Santos Laguna',      league: 'Liga MX', country: '🇲🇽', rating: 72 },
  { name: 'León',               league: 'Liga MX', country: '🇲🇽', rating: 71 },
  { name: 'Pachuca',            league: 'Liga MX', country: '🇲🇽', rating: 73 },
  { name: 'Toluca',             league: 'Liga MX', country: '🇲🇽', rating: 72 },
  { name: 'Atlas',              league: 'Liga MX', country: '🇲🇽', rating: 71 },
  { name: 'Necaxa',             league: 'Liga MX', country: '🇲🇽', rating: 70 },

  // 🇺🇸 MLS
  { name: 'LA Galaxy',          league: 'MLS', country: '🇺🇸', rating: 74 },
  { name: 'LAFC',               league: 'MLS', country: '🇺🇸', rating: 75 },
  { name: 'Inter Miami',        league: 'MLS', country: '🇺🇸', rating: 76 },
  { name: 'NYC FC',             league: 'MLS', country: '🇺🇸', rating: 74 },
  { name: 'Atlanta United',     league: 'MLS', country: '🇺🇸', rating: 73 },
  { name: 'Seattle Sounders',   league: 'MLS', country: '🇺🇸', rating: 73 },
  { name: 'Portland Timbers',   league: 'MLS', country: '🇺🇸', rating: 72 },
  { name: 'CF Montréal',        league: 'MLS', country: '🇨🇦', rating: 71 },
  { name: 'Toronto FC',         league: 'MLS', country: '🇨🇦', rating: 70 },
  { name: 'Columbus Crew',      league: 'MLS', country: '🇺🇸', rating: 72 },

  // 🇧🇷 Brasileirão
  { name: 'Flamengo',           league: 'Brasileirão', country: '🇧🇷', rating: 80 },
  { name: 'Palmeiras',          league: 'Brasileirão', country: '🇧🇷', rating: 79 },
  { name: 'São Paulo',          league: 'Brasileirão', country: '🇧🇷', rating: 76 },
  { name: 'Corinthians',        league: 'Brasileirão', country: '🇧🇷', rating: 75 },
  { name: 'Grêmio',             league: 'Brasileirão', country: '🇧🇷', rating: 74 },
  { name: 'Internacional',      league: 'Brasileirão', country: '🇧🇷', rating: 74 },
  { name: 'Atlético Mineiro',   league: 'Brasileirão', country: '🇧🇷', rating: 76 },
  { name: 'Fluminense',         league: 'Brasileirão', country: '🇧🇷', rating: 75 },
  { name: 'Botafogo',           league: 'Brasileirão', country: '🇧🇷', rating: 73 },
  { name: 'Vasco da Gama',      league: 'Brasileirão', country: '🇧🇷', rating: 72 },

  // 🇦🇷 Liga Profesional
  { name: 'River Plate',        league: 'Liga Prof. ARG', country: '🇦🇷', rating: 78 },
  { name: 'Boca Juniors',       league: 'Liga Prof. ARG', country: '🇦🇷', rating: 77 },
  { name: 'Racing Club',        league: 'Liga Prof. ARG', country: '🇦🇷', rating: 73 },
  { name: 'Independiente',      league: 'Liga Prof. ARG', country: '🇦🇷', rating: 71 },
  { name: 'San Lorenzo',        league: 'Liga Prof. ARG', country: '🇦🇷', rating: 71 },
]

// ── FIFA 2026 World Cup — selecciones nacionales ───────────────────────────────
const WC2026_TEAMS: GameTeam[] = [
  // Grupo A
  { name: 'México',         league: 'Grupo A', country: '🇲🇽' },
  { name: 'Sudáfrica',      league: 'Grupo A', country: '🇿🇦' },
  { name: 'Corea del Sur',  league: 'Grupo A', country: '🇰🇷' },
  { name: 'Rep. Checa',     league: 'Grupo A', country: '🇨🇿' },
  // Grupo B
  { name: 'Canadá',         league: 'Grupo B', country: '🇨🇦' },
  { name: 'Bosnia-Herzeg.', league: 'Grupo B', country: '🇧🇦' },
  { name: 'Qatar',          league: 'Grupo B', country: '🇶🇦' },
  { name: 'Suiza',          league: 'Grupo B', country: '🇨🇭' },
  // Grupo C
  { name: 'Brasil',         league: 'Grupo C', country: '🇧🇷' },
  { name: 'Marruecos',      league: 'Grupo C', country: '🇲🇦' },
  { name: 'Haití',          league: 'Grupo C', country: '🇭🇹' },
  { name: 'Escocia',        league: 'Grupo C', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  // Grupo D
  { name: 'Estados Unidos', league: 'Grupo D', country: '🇺🇸' },
  { name: 'Paraguay',       league: 'Grupo D', country: '🇵🇾' },
  { name: 'Australia',      league: 'Grupo D', country: '🇦🇺' },
  { name: 'Turquía',        league: 'Grupo D', country: '🇹🇷' },
  // Grupo E
  { name: 'Alemania',       league: 'Grupo E', country: '🇩🇪' },
  { name: 'Curazao',        league: 'Grupo E', country: '🇨🇼' },
  { name: 'Costa de Marfil',league: 'Grupo E', country: '🇨🇮' },
  { name: 'Ecuador',        league: 'Grupo E', country: '🇪🇨' },
  // Grupo F
  { name: 'Países Bajos',   league: 'Grupo F', country: '🇳🇱' },
  { name: 'Japón',          league: 'Grupo F', country: '🇯🇵' },
  { name: 'Suecia',         league: 'Grupo F', country: '🇸🇪' },
  { name: 'Túnez',          league: 'Grupo F', country: '🇹🇳' },
  // Grupo G
  { name: 'Bélgica',        league: 'Grupo G', country: '🇧🇪' },
  { name: 'Egipto',         league: 'Grupo G', country: '🇪🇬' },
  { name: 'Irán',           league: 'Grupo G', country: '🇮🇷' },
  { name: 'Nueva Zelanda',  league: 'Grupo G', country: '🇳🇿' },
  // Grupo H
  { name: 'España',         league: 'Grupo H', country: '🇪🇸' },
  { name: 'Cabo Verde',     league: 'Grupo H', country: '🇨🇻' },
  { name: 'Arabia Saudita', league: 'Grupo H', country: '🇸🇦' },
  { name: 'Uruguay',        league: 'Grupo H', country: '🇺🇾' },
  // Grupo I
  { name: 'Francia',        league: 'Grupo I', country: '🇫🇷' },
  { name: 'Senegal',        league: 'Grupo I', country: '🇸🇳' },
  { name: 'Iraq',           league: 'Grupo I', country: '🇮🇶' },
  { name: 'Noruega',        league: 'Grupo I', country: '🇳🇴' },
  // Grupo J
  { name: 'Argentina',      league: 'Grupo J', country: '🇦🇷' },
  { name: 'Argelia',        league: 'Grupo J', country: '🇩🇿' },
  { name: 'Austria',        league: 'Grupo J', country: '🇦🇹' },
  { name: 'Jordania',       league: 'Grupo J', country: '🇯🇴' },
  // Grupo K
  { name: 'Portugal',       league: 'Grupo K', country: '🇵🇹' },
  { name: 'RD Congo',       league: 'Grupo K', country: '🇨🇩' },
  { name: 'Uzbekistán',     league: 'Grupo K', country: '🇺🇿' },
  { name: 'Colombia',       league: 'Grupo K', country: '🇨🇴' },
  // Grupo L
  { name: 'Inglaterra',     league: 'Grupo L', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Croacia',        league: 'Grupo L', country: '🇭🇷' },
  { name: 'Ghana',          league: 'Grupo L', country: '🇬🇭' },
  { name: 'Panamá',         league: 'Grupo L', country: '🇵🇦' },
]

// ── Registry ───────────────────────────────────────────────────────────────────
export const GAME_TYPES: GameType[] = [
  {
    id: 'fc26',
    label: 'EA Sports FC 26',
    emoji: '🎮',
    description: 'Torneo del videojuego — elige tu club de la liga',
    teams: FC26_TEAMS.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
  },
  {
    id: 'wc2026',
    label: 'FIFA 2026 World Cup',
    emoji: '🌍',
    description: 'Las 48 selecciones del Mundial 2026',
    teams: WC2026_TEAMS,
  },
]

export function getGameType(id: string): GameType {
  return GAME_TYPES.find(g => g.id === id) ?? GAME_TYPES[0]
}

export function getTeamsByLeague(gameTypeId: string): Record<string, GameTeam[]> {
  const teams = getGameType(gameTypeId).teams
  return teams.reduce((acc, t) => {
    if (!acc[t.league]) acc[t.league] = []
    acc[t.league].push(t)
    return acc
  }, {} as Record<string, GameTeam[]>)
}
