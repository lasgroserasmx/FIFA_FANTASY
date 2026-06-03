// ============================================================
// Datos de equipos y jugadores por tipo de torneo
// EA Sports FC 26 — competición real de fútbol (temporada 2025/26)
// ============================================================

export interface GameTeam {
  name: string        // Nombre exacto del equipo en el juego
  league: string      // Liga
  country: string     // Emoji bandera
  stars?: number      // Estrellas del equipo (sistema del juego 1-5)
  rating?: number     // Rating numérico de referencia
}

export interface GamePlayer {
  name: string
  team: string        // Debe coincidir con GameTeam.name
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  ovr: number         // Rating overall en el juego
  price: number       // Precio Fantasy (millones £, estimado)
  league: string
}

export interface GameType {
  id: string
  label: string
  emoji: string
  description: string
  teams: GameTeam[]
  players?: GamePlayer[]
}

// ── EA Sports FC 26 — Equipos ──────────────────────────────────────────────────
// Nota: algunos equipos tienen nombres alternativos en la plataforma EA Sports:
//   Inter Milan → "Lombardia FC"
//   AC Milan    → "Milano FC"
//   Atalanta    → "Bergamo Calcio"

const FC26_TEAMS: GameTeam[] = [
  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
  { name: 'Liverpool FC',          league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 5,   rating: 91 },
  { name: 'Manchester City',       league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 5,   rating: 90 },
  { name: 'Arsenal FC',            league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 5,   rating: 89 },
  { name: 'Chelsea FC',            league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4.5, rating: 87 },
  { name: 'Newcastle United',      league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4.5, rating: 86 },
  { name: 'Aston Villa',           league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4.5, rating: 85 },
  { name: 'Manchester United',     league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4.5, rating: 85 },
  { name: 'Tottenham Hotspur',     league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4.5, rating: 84 },
  { name: 'Brighton',              league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4,   rating: 80 },
  { name: 'Fulham FC',             league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4,   rating: 78 },
  { name: 'West Ham United',       league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 4,   rating: 78 },
  { name: 'Brentford',             league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 77 },
  { name: 'Crystal Palace',        league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 76 },
  { name: 'Everton',               league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 75 },
  { name: 'Nottingham Forest',     league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 75 },
  { name: 'Wolves',                league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 74 },
  { name: 'Bournemouth',           league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 74 },
  { name: 'Leicester City',        league: 'Premier League', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stars: 3.5, rating: 74 },

  // 🇪🇸 La Liga
  { name: 'Real Madrid CF',        league: 'La Liga', country: '🇪🇸', stars: 5,   rating: 91 },
  { name: 'FC Barcelona',          league: 'La Liga', country: '🇪🇸', stars: 5,   rating: 89 },
  { name: 'Atlético de Madrid',    league: 'La Liga', country: '🇪🇸', stars: 4.5, rating: 87 },
  { name: 'Athletic Club',         league: 'La Liga', country: '🇪🇸', stars: 4,   rating: 82 },
  { name: 'Real Sociedad',         league: 'La Liga', country: '🇪🇸', stars: 4,   rating: 80 },
  { name: 'Villarreal CF',         league: 'La Liga', country: '🇪🇸', stars: 4,   rating: 79 },
  { name: 'Real Betis',            league: 'La Liga', country: '🇪🇸', stars: 3.5, rating: 78 },
  { name: 'Sevilla FC',            league: 'La Liga', country: '🇪🇸', stars: 3.5, rating: 77 },
  { name: 'Girona FC',             league: 'La Liga', country: '🇪🇸', stars: 3.5, rating: 76 },
  { name: 'Valencia CF',           league: 'La Liga', country: '🇪🇸', stars: 3.5, rating: 75 },
  { name: 'Rayo Vallecano',        league: 'La Liga', country: '🇪🇸', stars: 3,   rating: 73 },
  { name: 'Celta Vigo',            league: 'La Liga', country: '🇪🇸', stars: 3,   rating: 73 },
  { name: 'Getafe CF',             league: 'La Liga', country: '🇪🇸', stars: 3,   rating: 72 },
  { name: 'Osasuna',               league: 'La Liga', country: '🇪🇸', stars: 3,   rating: 72 },
  { name: 'RCD Mallorca',          league: 'La Liga', country: '🇪🇸', stars: 3,   rating: 71 },

  // 🇩🇪 Bundesliga
  { name: 'FC Bayern München',     league: 'Bundesliga', country: '🇩🇪', stars: 5,   rating: 90 },
  { name: 'Borussia Dortmund',     league: 'Bundesliga', country: '🇩🇪', stars: 4.5, rating: 86 },
  { name: 'Bayer 04 Leverkusen',   league: 'Bundesliga', country: '🇩🇪', stars: 4.5, rating: 85 },
  { name: 'RB Leipzig',            league: 'Bundesliga', country: '🇩🇪', stars: 4,   rating: 83 },
  { name: 'Borussia M\'gladbach',  league: 'Bundesliga', country: '🇩🇪', stars: 4,   rating: 79 },
  { name: 'Eintracht Frankfurt',   league: 'Bundesliga', country: '🇩🇪', stars: 3.5, rating: 78 },
  { name: 'VfB Stuttgart',         league: 'Bundesliga', country: '🇩🇪', stars: 3.5, rating: 78 },
  { name: 'SC Freiburg',           league: 'Bundesliga', country: '🇩🇪', stars: 3.5, rating: 77 },
  { name: 'Hoffenheim',            league: 'Bundesliga', country: '🇩🇪', stars: 3,   rating: 75 },
  { name: 'Union Berlin',          league: 'Bundesliga', country: '🇩🇪', stars: 3,   rating: 74 },

  // 🇮🇹 Serie A (nombres del juego por licencia)
  { name: 'SSC Napoli',            league: 'Serie A', country: '🇮🇹', stars: 4.5, rating: 88 },
  { name: 'Lombardia FC',          league: 'Serie A', country: '🇮🇹', stars: 4.5, rating: 87 }, // Inter Milan
  { name: 'Milano FC',             league: 'Serie A', country: '🇮🇹', stars: 4.5, rating: 86 }, // AC Milan
  { name: 'Juventus FC',           league: 'Serie A', country: '🇮🇹', stars: 4,   rating: 84 },
  { name: 'AS Roma',               league: 'Serie A', country: '🇮🇹', stars: 4,   rating: 83 },
  { name: 'Lazio',                 league: 'Serie A', country: '🇮🇹', stars: 4,   rating: 82 },
  { name: 'Fiorentina',            league: 'Serie A', country: '🇮🇹', stars: 3.5, rating: 80 },
  { name: 'Bergamo Calcio',        league: 'Serie A', country: '🇮🇹', stars: 4,   rating: 83 }, // Atalanta
  { name: 'Torino FC',             league: 'Serie A', country: '🇮🇹', stars: 3.5, rating: 78 },
  { name: 'Bologna FC',            league: 'Serie A', country: '🇮🇹', stars: 3.5, rating: 78 },

  // 🇫🇷 Ligue 1
  { name: 'Paris Saint-Germain',   league: 'Ligue 1', country: '🇫🇷', stars: 5,   rating: 90 },
  { name: 'Olympique de Marseille',league: 'Ligue 1', country: '🇫🇷', stars: 4,   rating: 82 },
  { name: 'AS Monaco',             league: 'Ligue 1', country: '🇲🇨', stars: 4,   rating: 81 },
  { name: 'Olympique Lyonnais',    league: 'Ligue 1', country: '🇫🇷', stars: 4,   rating: 80 },
  { name: 'OGC Nice',              league: 'Ligue 1', country: '🇫🇷', stars: 3.5, rating: 78 },
  { name: 'Stade Rennais FC',      league: 'Ligue 1', country: '🇫🇷', stars: 3.5, rating: 76 },
  { name: 'LOSC Lille',            league: 'Ligue 1', country: '🇫🇷', stars: 3.5, rating: 76 },

  // 🇵🇹 Primeira Liga
  { name: 'SL Benfica',            league: 'Primeira Liga', country: '🇵🇹', stars: 4.5, rating: 84 },
  { name: 'FC Porto',              league: 'Primeira Liga', country: '🇵🇹', stars: 4.5, rating: 83 },
  { name: 'Sporting CP',           league: 'Primeira Liga', country: '🇵🇹', stars: 4.5, rating: 83 },

  // 🇳🇱 Eredivisie
  { name: 'Ajax',                  league: 'Eredivisie', country: '🇳🇱', stars: 4,   rating: 82 },
  { name: 'PSV Eindhoven',         league: 'Eredivisie', country: '🇳🇱', stars: 4,   rating: 82 },
  { name: 'Feyenoord',             league: 'Eredivisie', country: '🇳🇱', stars: 4,   rating: 81 },

  // 🇲🇽 Liga MX (regresó en FC 26)
  { name: 'Club América',          league: 'Liga MX', country: '🇲🇽', stars: 4,   rating: 79 },
  { name: 'Guadalajara (Chivas)',  league: 'Liga MX', country: '🇲🇽', stars: 4,   rating: 78 },
  { name: 'Cruz Azul',             league: 'Liga MX', country: '🇲🇽', stars: 4,   rating: 78 },
  { name: 'CF Monterrey',          league: 'Liga MX', country: '🇲🇽', stars: 4,   rating: 78 },
  { name: 'Tigres UANL',           league: 'Liga MX', country: '🇲🇽', stars: 4,   rating: 77 },
  { name: 'Pumas UNAM',            league: 'Liga MX', country: '🇲🇽', stars: 3.5, rating: 74 },
  { name: 'Atlas FC',              league: 'Liga MX', country: '🇲🇽', stars: 3.5, rating: 73 },
  { name: 'Santos Laguna',         league: 'Liga MX', country: '🇲🇽', stars: 3.5, rating: 72 },
  { name: 'Club Necaxa',           league: 'Liga MX', country: '🇲🇽', stars: 3,   rating: 70 },
  { name: 'Toluca FC',             league: 'Liga MX', country: '🇲🇽', stars: 3,   rating: 71 },

  // 🇺🇸 MLS
  { name: 'Inter Miami CF',        league: 'MLS', country: '🇺🇸', stars: 4,   rating: 79 },
  { name: 'LA Galaxy',             league: 'MLS', country: '🇺🇸', stars: 3.5, rating: 76 },
  { name: 'LAFC',                  league: 'MLS', country: '🇺🇸', stars: 3.5, rating: 76 },
  { name: 'Seattle Sounders',      league: 'MLS', country: '🇺🇸', stars: 3.5, rating: 75 },
  { name: 'San Diego FC',          league: 'MLS', country: '🇺🇸', stars: 3.5, rating: 74 },
  { name: 'New England Revolution',league: 'MLS', country: '🇺🇸', stars: 3,   rating: 73 },

  // 🇧🇷 Série A Brasil
  { name: 'Flamengo',              league: 'Brasileirão', country: '🇧🇷', stars: 4,   rating: 79 },
  { name: 'Palmeiras',             league: 'Brasileirão', country: '🇧🇷', stars: 4,   rating: 79 },
  { name: 'Fluminense',            league: 'Brasileirão', country: '🇧🇷', stars: 3.5, rating: 76 },
  { name: 'Athletico Paranaense',  league: 'Brasileirão', country: '🇧🇷', stars: 3.5, rating: 75 },
  { name: 'Atlético Mineiro',      league: 'Brasileirão', country: '🇧🇷', stars: 3.5, rating: 76 },

  // 🇸🇦 Saudi Pro League
  { name: 'Al-Hilal',              league: 'Saudi Pro League', country: '🇸🇦', stars: 4,   rating: 81 },
  { name: 'Al-Nassr',              league: 'Saudi Pro League', country: '🇸🇦', stars: 4,   rating: 79 },
  { name: 'Al-Ittihad',            league: 'Saudi Pro League', country: '🇸🇦', stars: 3.5, rating: 77 },
  { name: 'Al-Ahli',              league: 'Saudi Pro League', country: '🇸🇦', stars: 3.5, rating: 76 },
]

// ── EA Sports FC 26 — Jugadores destacados ─────────────────────────────────────
// OVR = Rating overall en el juego. Price = precio estimado Fantasy (£m)
export const FC26_PLAYERS: GamePlayer[] = [
  // ─── GLOBAL TOP ───────────────────────────────────────────────────────────────
  { name: 'Mohamed Salah',         team: 'Liverpool FC',          position: 'FWD', ovr: 91, price: 15.0, league: 'Premier League' },
  { name: 'Kylian Mbappé',         team: 'Real Madrid CF',        position: 'FWD', ovr: 91, price: 15.0, league: 'La Liga' },
  { name: 'Ousmane Dembélé',       team: 'Paris Saint-Germain',   position: 'FWD', ovr: 90, price: 14.0, league: 'Ligue 1' },
  { name: 'Rodri',                 team: 'Manchester City',       position: 'MID', ovr: 90, price: 13.0, league: 'Premier League' },
  { name: 'Virgil van Dijk',       team: 'Liverpool FC',          position: 'DEF', ovr: 90, price: 13.0, league: 'Premier League' },
  { name: 'Jude Bellingham',       team: 'Real Madrid CF',        position: 'MID', ovr: 90, price: 14.0, league: 'La Liga' },
  { name: 'Erling Haaland',        team: 'Manchester City',       position: 'FWD', ovr: 90, price: 14.5, league: 'Premier League' },

  // ─── PREMIER LEAGUE ───────────────────────────────────────────────────────────
  { name: 'Florian Wirtz',         team: 'Liverpool FC',          position: 'MID', ovr: 89, price: 13.5, league: 'Premier League' },
  { name: 'Alisson',               team: 'Liverpool FC',          position: 'GK',  ovr: 89, price: 12.0, league: 'Premier League' },
  { name: 'Alexander Isak',        team: 'Newcastle United',      position: 'FWD', ovr: 88, price: 12.0, league: 'Premier League' },
  { name: 'Bukayo Saka',           team: 'Arsenal FC',            position: 'FWD', ovr: 88, price: 12.0, league: 'Premier League' },
  { name: 'Gabriel Magalhães',     team: 'Arsenal FC',            position: 'DEF', ovr: 88, price: 10.0, league: 'Premier League' },
  { name: 'Viktor Gyokeres',       team: 'Arsenal FC',            position: 'FWD', ovr: 87, price: 11.0, league: 'Premier League' },
  { name: 'Declan Rice',           team: 'Arsenal FC',            position: 'MID', ovr: 87, price: 11.0, league: 'Premier League' },
  { name: 'Martin Odegaard',       team: 'Arsenal FC',            position: 'MID', ovr: 87, price: 11.5, league: 'Premier League' },
  { name: 'William Saliba',        team: 'Arsenal FC',            position: 'DEF', ovr: 87, price: 10.0, league: 'Premier League' },
  { name: 'David Raya',            team: 'Arsenal FC',            position: 'GK',  ovr: 87, price: 10.0, league: 'Premier League' },
  { name: 'Cole Palmer',           team: 'Chelsea FC',            position: 'MID', ovr: 87, price: 11.5, league: 'Premier League' },
  { name: 'Moises Caicedo',        team: 'Chelsea FC',            position: 'MID', ovr: 87, price: 10.0, league: 'Premier League' },
  { name: 'Alexis Mac Allister',   team: 'Liverpool FC',          position: 'MID', ovr: 87, price: 10.5, league: 'Premier League' },
  { name: 'Bruno Fernandes',       team: 'Manchester United',     position: 'MID', ovr: 87, price: 11.0, league: 'Premier League' },
  { name: 'Trent Alexander-Arnold',team: 'Real Madrid CF',        position: 'DEF', ovr: 86, price: 10.0, league: 'La Liga' },
  { name: 'Raúl Jiménez',          team: 'Fulham FC',             position: 'FWD', ovr: 77, price: 7.0,  league: 'Premier League' },

  // ─── LA LIGA ──────────────────────────────────────────────────────────────────
  { name: 'Raphinha',              team: 'FC Barcelona',          position: 'FWD', ovr: 89, price: 13.0, league: 'La Liga' },
  { name: 'Lamine Yamal',          team: 'FC Barcelona',          position: 'FWD', ovr: 89, price: 13.0, league: 'La Liga' },
  { name: 'Pedri',                 team: 'FC Barcelona',          position: 'MID', ovr: 89, price: 12.5, league: 'La Liga' },
  { name: 'Federico Valverde',     team: 'Real Madrid CF',        position: 'MID', ovr: 89, price: 12.0, league: 'La Liga' },
  { name: 'Vinícius Jr.',          team: 'Real Madrid CF',        position: 'FWD', ovr: 89, price: 13.0, league: 'La Liga' },
  { name: 'Thibaut Courtois',      team: 'Real Madrid CF',        position: 'GK',  ovr: 89, price: 11.5, league: 'La Liga' },
  { name: 'Robert Lewandowski',    team: 'FC Barcelona',          position: 'FWD', ovr: 88, price: 11.0, league: 'La Liga' },
  { name: 'Jan Oblak',             team: 'Atlético de Madrid',    position: 'GK',  ovr: 88, price: 11.0, league: 'La Liga' },
  { name: 'Frenkie de Jong',       team: 'FC Barcelona',          position: 'MID', ovr: 87, price: 10.5, league: 'La Liga' },
  { name: 'Jules Koundé',          team: 'FC Barcelona',          position: 'DEF', ovr: 87, price: 10.0, league: 'La Liga' },
  { name: 'Julián Álvarez',        team: 'Atlético de Madrid',    position: 'FWD', ovr: 87, price: 11.0, league: 'La Liga' },
  { name: 'Antonio Rüdiger',       team: 'Real Madrid CF',        position: 'DEF', ovr: 86, price: 9.5,  league: 'La Liga' },
  { name: 'Nico Williams',         team: 'Athletic Club',         position: 'FWD', ovr: 86, price: 10.0, league: 'La Liga' },
  { name: 'Marc-André ter Stegen', team: 'FC Barcelona',          position: 'GK',  ovr: 86, price: 10.0, league: 'La Liga' },
  { name: 'Antoine Griezmann',     team: 'Atlético de Madrid',    position: 'FWD', ovr: 85, price: 9.5,  league: 'La Liga' },

  // ─── BUNDESLIGA ───────────────────────────────────────────────────────────────
  { name: 'Joshua Kimmich',        team: 'FC Bayern München',     position: 'MID', ovr: 89, price: 11.5, league: 'Bundesliga' },
  { name: 'Harry Kane',            team: 'FC Bayern München',     position: 'FWD', ovr: 89, price: 13.0, league: 'Bundesliga' },
  { name: 'Jamal Musiala',         team: 'FC Bayern München',     position: 'MID', ovr: 88, price: 12.0, league: 'Bundesliga' },
  { name: 'Serhou Guirassy',       team: 'Borussia Dortmund',     position: 'FWD', ovr: 87, price: 10.0, league: 'Bundesliga' },
  { name: 'Jonathan Tah',          team: 'FC Bayern München',     position: 'DEF', ovr: 87, price: 9.0,  league: 'Bundesliga' },
  { name: 'Michael Olise',         team: 'FC Bayern München',     position: 'FWD', ovr: 86, price: 10.0, league: 'Bundesliga' },
  { name: 'Gregor Kobel',          team: 'Borussia Dortmund',     position: 'GK',  ovr: 86, price: 9.5,  league: 'Bundesliga' },
  { name: 'Luis Díaz',             team: 'FC Bayern München',     position: 'FWD', ovr: 85, price: 9.5,  league: 'Bundesliga' },
  { name: 'Nico Schlotterbeck',    team: 'Borussia Dortmund',     position: 'DEF', ovr: 85, price: 8.5,  league: 'Bundesliga' },
  { name: 'Patrik Schick',         team: 'Bayer 04 Leverkusen',   position: 'FWD', ovr: 85, price: 9.0,  league: 'Bundesliga' },
  { name: 'Alphonso Davies',       team: 'FC Bayern München',     position: 'DEF', ovr: 84, price: 8.5,  league: 'Bundesliga' },
  { name: 'Grimaldo',              team: 'Bayer 04 Leverkusen',   position: 'DEF', ovr: 84, price: 8.5,  league: 'Bundesliga' },
  { name: 'Manuel Neuer',          team: 'FC Bayern München',     position: 'GK',  ovr: 84, price: 8.0,  league: 'Bundesliga' },
  { name: 'Julian Brandt',         team: 'Borussia Dortmund',     position: 'MID', ovr: 83, price: 8.0,  league: 'Bundesliga' },

  // ─── SERIE A ──────────────────────────────────────────────────────────────────
  { name: 'Lautaro Martínez',      team: 'Lombardia FC',          position: 'FWD', ovr: 88, price: 11.5, league: 'Serie A' },
  { name: 'Alessandro Bastoni',    team: 'Lombardia FC',          position: 'DEF', ovr: 87, price: 10.0, league: 'Serie A' },
  { name: 'Kevin De Bruyne',       team: 'SSC Napoli',            position: 'MID', ovr: 87, price: 11.0, league: 'Serie A' },
  { name: 'Yann Sommer',           team: 'Lombardia FC',          position: 'GK',  ovr: 87, price: 9.5,  league: 'Serie A' },
  { name: 'Mike Maignan',          team: 'Milano FC',             position: 'GK',  ovr: 87, price: 9.5,  league: 'Serie A' },
  { name: 'Nicolò Barella',        team: 'Lombardia FC',          position: 'MID', ovr: 87, price: 10.5, league: 'Serie A' },
  { name: 'Paulo Dybala',          team: 'AS Roma',               position: 'MID', ovr: 86, price: 9.5,  league: 'Serie A' },
  { name: 'Hakan Çalhanoğlu',      team: 'Lombardia FC',          position: 'MID', ovr: 86, price: 9.5,  league: 'Serie A' },
  { name: 'Federico Dimarco',      team: 'Lombardia FC',          position: 'DEF', ovr: 85, price: 9.0,  league: 'Serie A' },
  { name: 'Scott McTominay',       team: 'SSC Napoli',            position: 'MID', ovr: 85, price: 9.0,  league: 'Serie A' },
  { name: 'Marcus Thuram',         team: 'Lombardia FC',          position: 'FWD', ovr: 85, price: 9.5,  league: 'Serie A' },
  { name: 'David De Gea',          team: 'Fiorentina',            position: 'GK',  ovr: 85, price: 9.0,  league: 'Serie A' },
  { name: 'Rafael Leão',           team: 'Milano FC',             position: 'FWD', ovr: 84, price: 9.0,  league: 'Serie A' },
  { name: 'Romelu Lukaku',         team: 'SSC Napoli',            position: 'FWD', ovr: 84, price: 8.5,  league: 'Serie A' },
  { name: 'Ademola Lookman',       team: 'Bergamo Calcio',        position: 'FWD', ovr: 84, price: 8.5,  league: 'Serie A' },
  { name: 'Christian Pulisic',     team: 'Milano FC',             position: 'FWD', ovr: 84, price: 8.5,  league: 'Serie A' },
  { name: 'Santiago Giménez',      team: 'Milano FC',             position: 'FWD', ovr: 79, price: 7.5,  league: 'Serie A' },

  // ─── LIGUE 1 ──────────────────────────────────────────────────────────────────
  { name: 'Achraf Hakimi',         team: 'Paris Saint-Germain',   position: 'DEF', ovr: 89, price: 11.0, league: 'Ligue 1' },
  { name: 'Vitinha',               team: 'Paris Saint-Germain',   position: 'MID', ovr: 89, price: 10.5, league: 'Ligue 1' },
  { name: 'Gianluigi Donnarumma',  team: 'Paris Saint-Germain',   position: 'GK',  ovr: 89, price: 11.0, league: 'Ligue 1' },
  { name: 'Khvicha Kvaratskhelia', team: 'Paris Saint-Germain',   position: 'FWD', ovr: 87, price: 10.0, league: 'Ligue 1' },
  { name: 'Marquinhos',            team: 'Paris Saint-Germain',   position: 'DEF', ovr: 87, price: 9.5,  league: 'Ligue 1' },
  { name: 'Nuno Mendes',           team: 'Paris Saint-Germain',   position: 'DEF', ovr: 86, price: 9.0,  league: 'Ligue 1' },
  { name: 'Désiré Doué',           team: 'Paris Saint-Germain',   position: 'MID', ovr: 85, price: 9.0,  league: 'Ligue 1' },
  { name: 'Fabian Ruiz',           team: 'Paris Saint-Germain',   position: 'MID', ovr: 85, price: 8.5,  league: 'Ligue 1' },
  { name: 'João Neves',            team: 'Paris Saint-Germain',   position: 'MID', ovr: 85, price: 8.5,  league: 'Ligue 1' },
  { name: 'Bradley Barcola',       team: 'Paris Saint-Germain',   position: 'FWD', ovr: 84, price: 8.5,  league: 'Ligue 1' },

  // ─── LIGA MX (regresó en FC 26) ───────────────────────────────────────────────
  { name: 'Henry Martín',          team: 'Club América',          position: 'FWD', ovr: 78, price: 7.0,  league: 'Liga MX' },
  { name: 'Jonathan Rodríguez',    team: 'Club América',          position: 'FWD', ovr: 76, price: 6.5,  league: 'Liga MX' },
  { name: 'Diego Valdés',          team: 'Club América',          position: 'MID', ovr: 76, price: 6.5,  league: 'Liga MX' },
  { name: 'Chicote Calderón',      team: 'Guadalajara (Chivas)',  position: 'FWD', ovr: 75, price: 6.0,  league: 'Liga MX' },
  { name: 'Fernando Beltrán',      team: 'Guadalajara (Chivas)',  position: 'MID', ovr: 74, price: 6.0,  league: 'Liga MX' },
  { name: 'Carlos Salcedo',        team: 'Cruz Azul',             position: 'DEF', ovr: 75, price: 6.0,  league: 'Liga MX' },
  { name: 'Rodrigo Huescas',       team: 'Cruz Azul',             position: 'MID', ovr: 74, price: 6.0,  league: 'Liga MX' },
  { name: 'Germán Berterame',      team: 'CF Monterrey',          position: 'FWD', ovr: 77, price: 6.5,  league: 'Liga MX' },
  { name: 'Jesús Gallardo',        team: 'CF Monterrey',          position: 'DEF', ovr: 76, price: 6.0,  league: 'Liga MX' },
  { name: 'André-Pierre Gignac',   team: 'Tigres UANL',           position: 'FWD', ovr: 78, price: 7.0,  league: 'Liga MX' },
  { name: 'Guido Pizarro',         team: 'Tigres UANL',           position: 'MID', ovr: 75, price: 6.0,  league: 'Liga MX' },
]

// ── FIFA 2026 World Cup — Selecciones ──────────────────────────────────────────
const WC2026_TEAMS: GameTeam[] = [
  // Grupo A
  { name: 'México',         league: 'Grupo A', country: '🇲🇽', rating: 79 },
  { name: 'Ecuador',        league: 'Grupo A', country: '🇪🇨', rating: 76 },
  { name: 'Jamaica',        league: 'Grupo A', country: '🇯🇲', rating: 65 },
  { name: 'Irak',           league: 'Grupo A', country: '🇮🇶', rating: 66 },
  // Grupo B
  { name: 'España',         league: 'Grupo B', country: '🇪🇸', rating: 90 },
  { name: 'Brasil',         league: 'Grupo B', country: '🇧🇷', rating: 86 },
  { name: 'Japón',          league: 'Grupo B', country: '🇯🇵', rating: 82 },
  { name: 'Camerún',        league: 'Grupo B', country: '🇨🇲', rating: 72 },
  // Grupo C
  { name: 'Colombia',       league: 'Grupo C', country: '🇨🇴', rating: 82 },
  { name: 'Marruecos',      league: 'Grupo C', country: '🇲🇦', rating: 79 },
  { name: 'Haití',          league: 'Grupo C', country: '🇭🇹', rating: 62 },
  { name: 'Escocia',        league: 'Grupo C', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 74 },
  // Grupo D
  { name: 'Estados Unidos', league: 'Grupo D', country: '🇺🇸', rating: 80 },
  { name: 'Paraguay',       league: 'Grupo D', country: '🇵🇾', rating: 74 },
  { name: 'Australia',      league: 'Grupo D', country: '🇦🇺', rating: 73 },
  { name: 'Turquía',        league: 'Grupo D', country: '🇹🇷', rating: 79 },
  // Grupo E
  { name: 'Alemania',       league: 'Grupo E', country: '🇩🇪', rating: 87 },
  { name: 'Curazao',        league: 'Grupo E', country: '🇨🇼', rating: 63 },
  { name: 'Costa de Marfil',league: 'Grupo E', country: '🇨🇮', rating: 75 },
  { name: 'Costa Rica',     league: 'Grupo E', country: '🇨🇷', rating: 72 },
  // Grupo F
  { name: 'Países Bajos',   league: 'Grupo F', country: '🇳🇱', rating: 86 },
  { name: 'Suecia',         league: 'Grupo F', country: '🇸🇪', rating: 78 },
  { name: 'Túnez',          league: 'Grupo F', country: '🇹🇳', rating: 72 },
  { name: 'Perú',           league: 'Grupo F', country: '🇵🇪', rating: 74 },
  // Grupo G
  { name: 'Bélgica',        league: 'Grupo G', country: '🇧🇪', rating: 84 },
  { name: 'Egipto',         league: 'Grupo G', country: '🇪🇬', rating: 73 },
  { name: 'Irán',           league: 'Grupo G', country: '🇮🇷', rating: 72 },
  { name: 'Nueva Zelanda',  league: 'Grupo G', country: '🇳🇿', rating: 67 },
  // Grupo H
  { name: 'Uruguay',        league: 'Grupo H', country: '🇺🇾', rating: 83 },
  { name: 'Cabo Verde',     league: 'Grupo H', country: '🇨🇻', rating: 68 },
  { name: 'Arabia Saudita', league: 'Grupo H', country: '🇸🇦', rating: 74 },
  { name: 'Venezuela',      league: 'Grupo H', country: '🇻🇪', rating: 73 },
  // Grupo I
  { name: 'Francia',        league: 'Grupo I', country: '🇫🇷', rating: 90 },
  { name: 'Senegal',        league: 'Grupo I', country: '🇸🇳', rating: 77 },
  { name: 'Noruega',        league: 'Grupo I', country: '🇳🇴', rating: 78 },
  { name: 'Chile',          league: 'Grupo I', country: '🇨🇱', rating: 76 },
  // Grupo J
  { name: 'Argentina',      league: 'Grupo J', country: '🇦🇷', rating: 88 },
  { name: 'Argelia',        league: 'Grupo J', country: '🇩🇿', rating: 72 },
  { name: 'Austria',        league: 'Grupo J', country: '🇦🇹', rating: 78 },
  { name: 'Jordania',       league: 'Grupo J', country: '🇯🇴', rating: 65 },
  // Grupo K
  { name: 'Portugal',       league: 'Grupo K', country: '🇵🇹', rating: 87 },
  { name: 'RD Congo',       league: 'Grupo K', country: '🇨🇩', rating: 70 },
  { name: 'Uzbekistán',     league: 'Grupo K', country: '🇺🇿', rating: 67 },
  { name: 'Bolivia',        league: 'Grupo K', country: '🇧🇴', rating: 67 },
  // Grupo L
  { name: 'Inglaterra',     league: 'Grupo L', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 86 },
  { name: 'Croacia',        league: 'Grupo L', country: '🇭🇷', rating: 81 },
  { name: 'Ghana',          league: 'Grupo L', country: '🇬🇭', rating: 71 },
  { name: 'Panamá',         league: 'Grupo L', country: '🇵🇦', rating: 68 },
]

// ── Mundial de Clubes FIFA 2025 — 32 equipos reales ───────────────────────────
const CWC2025_TEAMS: GameTeam[] = [
  // Grupo A
  { name: 'Palmeiras',          league: 'Grupo A', country: '🇧🇷', rating: 82 },
  { name: 'Porto',              league: 'Grupo A', country: '🇵🇹', rating: 80 },
  { name: 'Al Ahly',            league: 'Grupo A', country: '🇪🇬', rating: 72 },
  { name: 'Inter Miami',        league: 'Grupo A', country: '🇺🇸', rating: 76 },

  // Grupo B
  { name: 'Paris Saint-Germain',league: 'Grupo B', country: '🇫🇷', rating: 88 },
  { name: 'Atlético de Madrid', league: 'Grupo B', country: '🇪🇸', rating: 87 },
  { name: 'Botafogo',           league: 'Grupo B', country: '🇧🇷', rating: 75 },
  { name: 'Seattle Sounders',   league: 'Grupo B', country: '🇺🇸', rating: 68 },

  // Grupo C
  { name: 'Bayern München',     league: 'Grupo C', country: '🇩🇪', rating: 90 },
  { name: 'Boca Juniors',       league: 'Grupo C', country: '🇦🇷', rating: 78 },
  { name: 'Benfica',            league: 'Grupo C', country: '🇵🇹', rating: 82 },
  { name: 'Auckland City',      league: 'Grupo C', country: '🇳🇿', rating: 55 },

  // Grupo D
  { name: 'Flamengo',           league: 'Grupo D', country: '🇧🇷', rating: 83 },
  { name: 'Chelsea',            league: 'Grupo D', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 86 },
  { name: 'Léon',               league: 'Grupo D', country: '🇲🇽', rating: 74 },
  { name: 'ES Tunis',           league: 'Grupo D', country: '🇹🇳', rating: 65 },

  // Grupo E
  { name: 'River Plate',        league: 'Grupo E', country: '🇦🇷', rating: 82 },
  { name: 'Inter Milan',        league: 'Grupo E', country: '🇮🇹', rating: 87 },
  { name: 'Monterrey',          league: 'Grupo E', country: '🇲🇽', rating: 76 },
  { name: 'Urawa Red Diamonds', league: 'Grupo E', country: '🇯🇵', rating: 66 },

  // Grupo F
  { name: 'Fluminense',         league: 'Grupo F', country: '🇧🇷', rating: 78 },
  { name: 'Borussia Dortmund',  league: 'Grupo F', country: '🇩🇪', rating: 85 },
  { name: 'Ulsan HD',           league: 'Grupo F', country: '🇰🇷', rating: 67 },
  { name: 'Mamelodi Sundowns',  league: 'Grupo F', country: '🇿🇦', rating: 63 },

  // Grupo G
  { name: 'Manchester City',    league: 'Grupo G', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 90 },
  { name: 'Juventus',           league: 'Grupo G', country: '🇮🇹', rating: 84 },
  { name: 'Wydad AC',           league: 'Grupo G', country: '🇲🇦', rating: 64 },
  { name: 'Al Ain',             league: 'Grupo G', country: '🇦🇪', rating: 62 },

  // Grupo H
  { name: 'Real Madrid',        league: 'Grupo H', country: '🇪🇸', rating: 92 },
  { name: 'Al Hilal',           league: 'Grupo H', country: '🇸🇦', rating: 79 },
  { name: 'Pachuca',            league: 'Grupo H', country: '🇲🇽', rating: 73 },
  { name: 'RB Salzburg',        league: 'Grupo H', country: '🇦🇹', rating: 77 },
]

// ── Registry ───────────────────────────────────────────────────────────────────
export const GAME_TYPES: GameType[] = [
  {
    id: 'cwc2025',
    label: 'Mundial de Clubes FIFA 2025',
    emoji: '🏆',
    description: '32 clubes reales — 8 grupos — USA 2025',
    teams: CWC2025_TEAMS,
  },
  {
    id: 'fc26',
    label: 'EA Sports FC 26',
    emoji: '🎮',
    description: 'Competición real de fútbol — elige tu club favorito',
    teams: FC26_TEAMS.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
    players: FC26_PLAYERS.sort((a, b) => b.ovr - a.ovr),
  },
  {
    id: 'wc2026',
    label: 'FIFA 2026 World Cup',
    emoji: '🌍',
    description: '48 selecciones del Mundial 2026 en USA/Canadá/México',
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

export function getPlayersByTeam(gameTypeId: string): Record<string, GamePlayer[]> {
  const players = getGameType(gameTypeId).players ?? []
  return players.reduce((acc, p) => {
    if (!acc[p.team]) acc[p.team] = []
    acc[p.team].push(p)
    return acc
  }, {} as Record<string, GamePlayer[]>)
}

export function getPlayersByPosition(gameTypeId: string, position: GamePlayer['position']): GamePlayer[] {
  return (getGameType(gameTypeId).players ?? []).filter(p => p.position === position)
}
