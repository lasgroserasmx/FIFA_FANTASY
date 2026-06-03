-- ============================================================
-- Seed: Tipos de torneo, Equipos y Jugadores
-- EA Sports FC 26 + FIFA World Cup 2026
-- ============================================================

-- ── Tipos de torneo ───────────────────────────────────────────────────────────
INSERT INTO public.game_types (id, label, emoji, description) VALUES
  ('fc26',   'EA Sports FC 26',      '🎮', 'Competición real de fútbol — elige tu club favorito'),
  ('wc2026', 'FIFA 2026 World Cup',  '🌍', '48 selecciones del Mundial 2026 en USA/Canadá/México')
ON CONFLICT (id) DO UPDATE SET label=EXCLUDED.label, emoji=EXCLUDED.emoji, description=EXCLUDED.description;

-- ── FC 26 — Equipos ───────────────────────────────────────────────────────────
-- Nota: algunos nombres son genéricos por licencia:
--   Inter Milan → "Lombardia FC"
--   AC Milan    → "Milano FC"
--   Atalanta    → "Bergamo Calcio"

INSERT INTO public.game_teams (game_type, name, league, country, stars, rating) VALUES
  -- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
  ('fc26', 'Liverpool FC',            'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 5.0, 91),
  ('fc26', 'Manchester City',         'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 5.0, 90),
  ('fc26', 'Arsenal FC',              'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 5.0, 89),
  ('fc26', 'Chelsea FC',              'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.5, 87),
  ('fc26', 'Newcastle United',        'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.5, 86),
  ('fc26', 'Aston Villa',             'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.5, 85),
  ('fc26', 'Manchester United',       'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.5, 85),
  ('fc26', 'Tottenham Hotspur',       'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.5, 84),
  ('fc26', 'Brighton',                'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.0, 80),
  ('fc26', 'Fulham FC',               'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.0, 78),
  ('fc26', 'West Ham United',         'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 4.0, 78),
  ('fc26', 'Brentford',               'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 77),
  ('fc26', 'Crystal Palace',          'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 76),
  ('fc26', 'Everton',                 'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 75),
  ('fc26', 'Nottingham Forest',       'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 75),
  ('fc26', 'Wolves',                  'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 74),
  ('fc26', 'Bournemouth',             'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 74),
  ('fc26', 'Leicester City',          'Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 3.5, 74),
  -- 🇪🇸 La Liga
  ('fc26', 'Real Madrid CF',          'La Liga', '🇪🇸', 5.0, 91),
  ('fc26', 'FC Barcelona',            'La Liga', '🇪🇸', 5.0, 89),
  ('fc26', 'Atlético de Madrid',      'La Liga', '🇪🇸', 4.5, 87),
  ('fc26', 'Athletic Club',           'La Liga', '🇪🇸', 4.0, 82),
  ('fc26', 'Real Sociedad',           'La Liga', '🇪🇸', 4.0, 80),
  ('fc26', 'Villarreal CF',           'La Liga', '🇪🇸', 4.0, 79),
  ('fc26', 'Real Betis',              'La Liga', '🇪🇸', 3.5, 78),
  ('fc26', 'Sevilla FC',              'La Liga', '🇪🇸', 3.5, 77),
  ('fc26', 'Girona FC',               'La Liga', '🇪🇸', 3.5, 76),
  ('fc26', 'Valencia CF',             'La Liga', '🇪🇸', 3.5, 75),
  ('fc26', 'Rayo Vallecano',          'La Liga', '🇪🇸', 3.0, 73),
  ('fc26', 'Celta Vigo',              'La Liga', '🇪🇸', 3.0, 73),
  ('fc26', 'Getafe CF',               'La Liga', '🇪🇸', 3.0, 72),
  ('fc26', 'Osasuna',                 'La Liga', '🇪🇸', 3.0, 72),
  ('fc26', 'RCD Mallorca',            'La Liga', '🇪🇸', 3.0, 71),
  -- 🇩🇪 Bundesliga
  ('fc26', 'FC Bayern München',       'Bundesliga', '🇩🇪', 5.0, 90),
  ('fc26', 'Borussia Dortmund',       'Bundesliga', '🇩🇪', 4.5, 86),
  ('fc26', 'Bayer 04 Leverkusen',     'Bundesliga', '🇩🇪', 4.5, 85),
  ('fc26', 'RB Leipzig',              'Bundesliga', '🇩🇪', 4.0, 83),
  ('fc26', 'Borussia M''gladbach',    'Bundesliga', '🇩🇪', 4.0, 79),
  ('fc26', 'Eintracht Frankfurt',     'Bundesliga', '🇩🇪', 3.5, 78),
  ('fc26', 'VfB Stuttgart',           'Bundesliga', '🇩🇪', 3.5, 78),
  ('fc26', 'SC Freiburg',             'Bundesliga', '🇩🇪', 3.5, 77),
  ('fc26', 'Hoffenheim',              'Bundesliga', '🇩🇪', 3.0, 75),
  ('fc26', 'Union Berlin',            'Bundesliga', '🇩🇪', 3.0, 74),
  -- 🇮🇹 Serie A
  ('fc26', 'SSC Napoli',              'Serie A', '🇮🇹', 4.5, 88),
  ('fc26', 'Lombardia FC',            'Serie A', '🇮🇹', 4.5, 87),  -- Inter Milan
  ('fc26', 'Milano FC',               'Serie A', '🇮🇹', 4.5, 86),  -- AC Milan
  ('fc26', 'Juventus FC',             'Serie A', '🇮🇹', 4.0, 84),
  ('fc26', 'AS Roma',                 'Serie A', '🇮🇹', 4.0, 83),
  ('fc26', 'Bergamo Calcio',          'Serie A', '🇮🇹', 4.0, 83),  -- Atalanta
  ('fc26', 'Lazio',                   'Serie A', '🇮🇹', 4.0, 82),
  ('fc26', 'Fiorentina',              'Serie A', '🇮🇹', 3.5, 80),
  ('fc26', 'Torino FC',               'Serie A', '🇮🇹', 3.5, 78),
  ('fc26', 'Bologna FC',              'Serie A', '🇮🇹', 3.5, 78),
  -- 🇫🇷 Ligue 1
  ('fc26', 'Paris Saint-Germain',     'Ligue 1', '🇫🇷', 5.0, 90),
  ('fc26', 'Olympique de Marseille',  'Ligue 1', '🇫🇷', 4.0, 82),
  ('fc26', 'AS Monaco',               'Ligue 1', '🇲🇨', 4.0, 81),
  ('fc26', 'Olympique Lyonnais',      'Ligue 1', '🇫🇷', 4.0, 80),
  ('fc26', 'OGC Nice',                'Ligue 1', '🇫🇷', 3.5, 78),
  ('fc26', 'Stade Rennais FC',        'Ligue 1', '🇫🇷', 3.5, 76),
  ('fc26', 'LOSC Lille',              'Ligue 1', '🇫🇷', 3.5, 76),
  -- 🇵🇹 Primeira Liga
  ('fc26', 'SL Benfica',              'Primeira Liga', '🇵🇹', 4.5, 84),
  ('fc26', 'FC Porto',                'Primeira Liga', '🇵🇹', 4.5, 83),
  ('fc26', 'Sporting CP',             'Primeira Liga', '🇵🇹', 4.5, 83),
  -- 🇳🇱 Eredivisie
  ('fc26', 'Ajax',                    'Eredivisie', '🇳🇱', 4.0, 82),
  ('fc26', 'PSV Eindhoven',           'Eredivisie', '🇳🇱', 4.0, 82),
  ('fc26', 'Feyenoord',               'Eredivisie', '🇳🇱', 4.0, 81),
  -- 🇲🇽 Liga MX
  ('fc26', 'Club América',            'Liga MX', '🇲🇽', 4.0, 79),
  ('fc26', 'Guadalajara (Chivas)',    'Liga MX', '🇲🇽', 4.0, 78),
  ('fc26', 'Cruz Azul',               'Liga MX', '🇲🇽', 4.0, 78),
  ('fc26', 'CF Monterrey',            'Liga MX', '🇲🇽', 4.0, 78),
  ('fc26', 'Tigres UANL',             'Liga MX', '🇲🇽', 4.0, 77),
  ('fc26', 'Pumas UNAM',              'Liga MX', '🇲🇽', 3.5, 74),
  ('fc26', 'Atlas FC',                'Liga MX', '🇲🇽', 3.5, 73),
  ('fc26', 'Santos Laguna',           'Liga MX', '🇲🇽', 3.5, 72),
  ('fc26', 'Club Necaxa',             'Liga MX', '🇲🇽', 3.0, 70),
  ('fc26', 'Toluca FC',               'Liga MX', '🇲🇽', 3.0, 71),
  -- 🇺🇸 MLS
  ('fc26', 'Inter Miami CF',          'MLS', '🇺🇸', 4.0, 79),
  ('fc26', 'LA Galaxy',               'MLS', '🇺🇸', 3.5, 76),
  ('fc26', 'LAFC',                    'MLS', '🇺🇸', 3.5, 76),
  ('fc26', 'Seattle Sounders',        'MLS', '🇺🇸', 3.5, 75),
  ('fc26', 'San Diego FC',            'MLS', '🇺🇸', 3.5, 74),
  ('fc26', 'New England Revolution',  'MLS', '🇺🇸', 3.0, 73),
  -- 🇧🇷 Brasileirão
  ('fc26', 'Flamengo',                'Brasileirão', '🇧🇷', 4.0, 79),
  ('fc26', 'Palmeiras',               'Brasileirão', '🇧🇷', 4.0, 79),
  ('fc26', 'Fluminense',              'Brasileirão', '🇧🇷', 3.5, 76),
  ('fc26', 'Athletico Paranaense',    'Brasileirão', '🇧🇷', 3.5, 75),
  ('fc26', 'Atlético Mineiro',        'Brasileirão', '🇧🇷', 3.5, 76),
  -- 🇸🇦 Saudi Pro League
  ('fc26', 'Al-Hilal',                'Saudi Pro League', '🇸🇦', 4.0, 81),
  ('fc26', 'Al-Nassr',                'Saudi Pro League', '🇸🇦', 4.0, 79),
  ('fc26', 'Al-Ittihad',              'Saudi Pro League', '🇸🇦', 3.5, 77),
  ('fc26', 'Al-Ahli',                 'Saudi Pro League', '🇸🇦', 3.5, 76)
ON CONFLICT (game_type, name) DO UPDATE SET
  league=EXCLUDED.league, country=EXCLUDED.country,
  stars=EXCLUDED.stars, rating=EXCLUDED.rating;

-- ── FC 26 — Jugadores ─────────────────────────────────────────────────────────
INSERT INTO public.game_players (game_type, name, team, position, ovr, price, league) VALUES
  -- Global Top
  ('fc26', 'Mohamed Salah',          'Liverpool FC',          'FWD', 91, 15.0, 'Premier League'),
  ('fc26', 'Kylian Mbappé',          'Real Madrid CF',        'FWD', 91, 15.0, 'La Liga'),
  ('fc26', 'Ousmane Dembélé',        'Paris Saint-Germain',   'FWD', 90, 14.0, 'Ligue 1'),
  ('fc26', 'Rodri',                  'Manchester City',       'MID', 90, 13.0, 'Premier League'),
  ('fc26', 'Virgil van Dijk',        'Liverpool FC',          'DEF', 90, 13.0, 'Premier League'),
  ('fc26', 'Jude Bellingham',        'Real Madrid CF',        'MID', 90, 14.0, 'La Liga'),
  ('fc26', 'Erling Haaland',         'Manchester City',       'FWD', 90, 14.5, 'Premier League'),
  -- Premier League
  ('fc26', 'Florian Wirtz',          'Liverpool FC',          'MID', 89, 13.5, 'Premier League'),
  ('fc26', 'Alisson',                'Liverpool FC',          'GK',  89, 12.0, 'Premier League'),
  ('fc26', 'Alexander Isak',         'Newcastle United',      'FWD', 88, 12.0, 'Premier League'),
  ('fc26', 'Bukayo Saka',            'Arsenal FC',            'FWD', 88, 12.0, 'Premier League'),
  ('fc26', 'Gabriel Magalhães',      'Arsenal FC',            'DEF', 88, 10.0, 'Premier League'),
  ('fc26', 'Viktor Gyokeres',        'Arsenal FC',            'FWD', 87, 11.0, 'Premier League'),
  ('fc26', 'Declan Rice',            'Arsenal FC',            'MID', 87, 11.0, 'Premier League'),
  ('fc26', 'Martin Odegaard',        'Arsenal FC',            'MID', 87, 11.5, 'Premier League'),
  ('fc26', 'William Saliba',         'Arsenal FC',            'DEF', 87, 10.0, 'Premier League'),
  ('fc26', 'David Raya',             'Arsenal FC',            'GK',  87, 10.0, 'Premier League'),
  ('fc26', 'Cole Palmer',            'Chelsea FC',            'MID', 87, 11.5, 'Premier League'),
  ('fc26', 'Moises Caicedo',         'Chelsea FC',            'MID', 87, 10.0, 'Premier League'),
  ('fc26', 'Alexis Mac Allister',    'Liverpool FC',          'MID', 87, 10.5, 'Premier League'),
  ('fc26', 'Bruno Fernandes',        'Manchester United',     'MID', 87, 11.0, 'Premier League'),
  ('fc26', 'Trent Alexander-Arnold', 'Real Madrid CF',        'DEF', 86, 10.0, 'La Liga'),
  ('fc26', 'Raúl Jiménez',           'Fulham FC',             'FWD', 77,  7.0, 'Premier League'),
  -- La Liga
  ('fc26', 'Raphinha',               'FC Barcelona',          'FWD', 89, 13.0, 'La Liga'),
  ('fc26', 'Lamine Yamal',           'FC Barcelona',          'FWD', 89, 13.0, 'La Liga'),
  ('fc26', 'Pedri',                  'FC Barcelona',          'MID', 89, 12.5, 'La Liga'),
  ('fc26', 'Federico Valverde',      'Real Madrid CF',        'MID', 89, 12.0, 'La Liga'),
  ('fc26', 'Vinícius Jr.',           'Real Madrid CF',        'FWD', 89, 13.0, 'La Liga'),
  ('fc26', 'Thibaut Courtois',       'Real Madrid CF',        'GK',  89, 11.5, 'La Liga'),
  ('fc26', 'Robert Lewandowski',     'FC Barcelona',          'FWD', 88, 11.0, 'La Liga'),
  ('fc26', 'Jan Oblak',              'Atlético de Madrid',    'GK',  88, 11.0, 'La Liga'),
  ('fc26', 'Frenkie de Jong',        'FC Barcelona',          'MID', 87, 10.5, 'La Liga'),
  ('fc26', 'Jules Koundé',           'FC Barcelona',          'DEF', 87, 10.0, 'La Liga'),
  ('fc26', 'Julián Álvarez',         'Atlético de Madrid',    'FWD', 87, 11.0, 'La Liga'),
  ('fc26', 'Antonio Rüdiger',        'Real Madrid CF',        'DEF', 86,  9.5, 'La Liga'),
  ('fc26', 'Nico Williams',          'Athletic Club',         'FWD', 86, 10.0, 'La Liga'),
  ('fc26', 'Marc-André ter Stegen',  'FC Barcelona',          'GK',  86, 10.0, 'La Liga'),
  ('fc26', 'Antoine Griezmann',      'Atlético de Madrid',    'FWD', 85,  9.5, 'La Liga'),
  -- Bundesliga
  ('fc26', 'Joshua Kimmich',         'FC Bayern München',     'MID', 89, 11.5, 'Bundesliga'),
  ('fc26', 'Harry Kane',             'FC Bayern München',     'FWD', 89, 13.0, 'Bundesliga'),
  ('fc26', 'Jamal Musiala',          'FC Bayern München',     'MID', 88, 12.0, 'Bundesliga'),
  ('fc26', 'Serhou Guirassy',        'Borussia Dortmund',     'FWD', 87, 10.0, 'Bundesliga'),
  ('fc26', 'Jonathan Tah',           'FC Bayern München',     'DEF', 87,  9.0, 'Bundesliga'),
  ('fc26', 'Michael Olise',          'FC Bayern München',     'FWD', 86, 10.0, 'Bundesliga'),
  ('fc26', 'Gregor Kobel',           'Borussia Dortmund',     'GK',  86,  9.5, 'Bundesliga'),
  ('fc26', 'Luis Díaz',              'FC Bayern München',     'FWD', 85,  9.5, 'Bundesliga'),
  ('fc26', 'Nico Schlotterbeck',     'Borussia Dortmund',     'DEF', 85,  8.5, 'Bundesliga'),
  ('fc26', 'Patrik Schick',          'Bayer 04 Leverkusen',   'FWD', 85,  9.0, 'Bundesliga'),
  ('fc26', 'Alphonso Davies',        'FC Bayern München',     'DEF', 84,  8.5, 'Bundesliga'),
  ('fc26', 'Grimaldo',               'Bayer 04 Leverkusen',   'DEF', 84,  8.5, 'Bundesliga'),
  ('fc26', 'Manuel Neuer',           'FC Bayern München',     'GK',  84,  8.0, 'Bundesliga'),
  ('fc26', 'Julian Brandt',          'Borussia Dortmund',     'MID', 83,  8.0, 'Bundesliga'),
  -- Serie A
  ('fc26', 'Lautaro Martínez',       'Lombardia FC',          'FWD', 88, 11.5, 'Serie A'),
  ('fc26', 'Alessandro Bastoni',     'Lombardia FC',          'DEF', 87, 10.0, 'Serie A'),
  ('fc26', 'Kevin De Bruyne',        'SSC Napoli',            'MID', 87, 11.0, 'Serie A'),
  ('fc26', 'Yann Sommer',            'Lombardia FC',          'GK',  87,  9.5, 'Serie A'),
  ('fc26', 'Mike Maignan',           'Milano FC',             'GK',  87,  9.5, 'Serie A'),
  ('fc26', 'Nicolò Barella',         'Lombardia FC',          'MID', 87, 10.5, 'Serie A'),
  ('fc26', 'Paulo Dybala',           'AS Roma',               'MID', 86,  9.5, 'Serie A'),
  ('fc26', 'Hakan Çalhanoğlu',       'Lombardia FC',          'MID', 86,  9.5, 'Serie A'),
  ('fc26', 'Federico Dimarco',       'Lombardia FC',          'DEF', 85,  9.0, 'Serie A'),
  ('fc26', 'Scott McTominay',        'SSC Napoli',            'MID', 85,  9.0, 'Serie A'),
  ('fc26', 'Marcus Thuram',          'Lombardia FC',          'FWD', 85,  9.5, 'Serie A'),
  ('fc26', 'David De Gea',           'Fiorentina',            'GK',  85,  9.0, 'Serie A'),
  ('fc26', 'Rafael Leão',            'Milano FC',             'FWD', 84,  9.0, 'Serie A'),
  ('fc26', 'Romelu Lukaku',          'SSC Napoli',            'FWD', 84,  8.5, 'Serie A'),
  ('fc26', 'Ademola Lookman',        'Bergamo Calcio',        'FWD', 84,  8.5, 'Serie A'),
  ('fc26', 'Christian Pulisic',      'Milano FC',             'FWD', 84,  8.5, 'Serie A'),
  ('fc26', 'Santiago Giménez',       'Milano FC',             'FWD', 79,  7.5, 'Serie A'),
  -- Ligue 1
  ('fc26', 'Achraf Hakimi',          'Paris Saint-Germain',   'DEF', 89, 11.0, 'Ligue 1'),
  ('fc26', 'Vitinha',                'Paris Saint-Germain',   'MID', 89, 10.5, 'Ligue 1'),
  ('fc26', 'Gianluigi Donnarumma',   'Paris Saint-Germain',   'GK',  89, 11.0, 'Ligue 1'),
  ('fc26', 'Khvicha Kvaratskhelia',  'Paris Saint-Germain',   'FWD', 87, 10.0, 'Ligue 1'),
  ('fc26', 'Marquinhos',             'Paris Saint-Germain',   'DEF', 87,  9.5, 'Ligue 1'),
  ('fc26', 'Nuno Mendes',            'Paris Saint-Germain',   'DEF', 86,  9.0, 'Ligue 1'),
  ('fc26', 'Désiré Doué',            'Paris Saint-Germain',   'MID', 85,  9.0, 'Ligue 1'),
  ('fc26', 'Fabian Ruiz',            'Paris Saint-Germain',   'MID', 85,  8.5, 'Ligue 1'),
  ('fc26', 'João Neves',             'Paris Saint-Germain',   'MID', 85,  8.5, 'Ligue 1'),
  ('fc26', 'Bradley Barcola',        'Paris Saint-Germain',   'FWD', 84,  8.5, 'Ligue 1'),
  -- Liga MX
  ('fc26', 'Henry Martín',           'Club América',          'FWD', 78,  7.0, 'Liga MX'),
  ('fc26', 'Jonathan Rodríguez',     'Club América',          'FWD', 76,  6.5, 'Liga MX'),
  ('fc26', 'Diego Valdés',           'Club América',          'MID', 76,  6.5, 'Liga MX'),
  ('fc26', 'Chicote Calderón',       'Guadalajara (Chivas)',  'FWD', 75,  6.0, 'Liga MX'),
  ('fc26', 'Fernando Beltrán',       'Guadalajara (Chivas)',  'MID', 74,  6.0, 'Liga MX'),
  ('fc26', 'Carlos Salcedo',         'Cruz Azul',             'DEF', 75,  6.0, 'Liga MX'),
  ('fc26', 'Rodrigo Huescas',        'Cruz Azul',             'MID', 74,  6.0, 'Liga MX'),
  ('fc26', 'Germán Berterame',       'CF Monterrey',          'FWD', 77,  6.5, 'Liga MX'),
  ('fc26', 'Jesús Gallardo',         'CF Monterrey',          'DEF', 76,  6.0, 'Liga MX'),
  ('fc26', 'André-Pierre Gignac',    'Tigres UANL',           'FWD', 78,  7.0, 'Liga MX'),
  ('fc26', 'Guido Pizarro',          'Tigres UANL',           'MID', 75,  6.0, 'Liga MX')
ON CONFLICT (game_type, name, team) DO UPDATE SET
  position=EXCLUDED.position, ovr=EXCLUDED.ovr,
  price=EXCLUDED.price, league=EXCLUDED.league;

-- ── FIFA World Cup 2026 — Selecciones ─────────────────────────────────────────
INSERT INTO public.game_teams (game_type, name, league, country, rating) VALUES
  ('wc2026', 'México',           'Grupo A', '🇲🇽', 79),
  ('wc2026', 'Ecuador',          'Grupo A', '🇪🇨', 76),
  ('wc2026', 'Jamaica',          'Grupo A', '🇯🇲', 65),
  ('wc2026', 'Irak',             'Grupo A', '🇮🇶', 66),
  ('wc2026', 'España',           'Grupo B', '🇪🇸', 90),
  ('wc2026', 'Brasil',           'Grupo B', '🇧🇷', 86),
  ('wc2026', 'Japón',            'Grupo B', '🇯🇵', 82),
  ('wc2026', 'Camerún',          'Grupo B', '🇨🇲', 72),
  ('wc2026', 'Colombia',         'Grupo C', '🇨🇴', 82),
  ('wc2026', 'Marruecos',        'Grupo C', '🇲🇦', 79),
  ('wc2026', 'Haití',            'Grupo C', '🇭🇹', 62),
  ('wc2026', 'Escocia',          'Grupo C', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 74),
  ('wc2026', 'Estados Unidos',   'Grupo D', '🇺🇸', 80),
  ('wc2026', 'Paraguay',         'Grupo D', '🇵🇾', 74),
  ('wc2026', 'Australia',        'Grupo D', '🇦🇺', 73),
  ('wc2026', 'Turquía',          'Grupo D', '🇹🇷', 79),
  ('wc2026', 'Alemania',         'Grupo E', '🇩🇪', 87),
  ('wc2026', 'Curazao',          'Grupo E', '🇨🇼', 63),
  ('wc2026', 'Costa de Marfil',  'Grupo E', '🇨🇮', 75),
  ('wc2026', 'Costa Rica',       'Grupo E', '🇨🇷', 72),
  ('wc2026', 'Países Bajos',     'Grupo F', '🇳🇱', 86),
  ('wc2026', 'Suecia',           'Grupo F', '🇸🇪', 78),
  ('wc2026', 'Túnez',            'Grupo F', '🇹🇳', 72),
  ('wc2026', 'Perú',             'Grupo F', '🇵🇪', 74),
  ('wc2026', 'Bélgica',          'Grupo G', '🇧🇪', 84),
  ('wc2026', 'Egipto',           'Grupo G', '🇪🇬', 73),
  ('wc2026', 'Irán',             'Grupo G', '🇮🇷', 72),
  ('wc2026', 'Nueva Zelanda',    'Grupo G', '🇳🇿', 67),
  ('wc2026', 'Uruguay',          'Grupo H', '🇺🇾', 83),
  ('wc2026', 'Cabo Verde',       'Grupo H', '🇨🇻', 68),
  ('wc2026', 'Arabia Saudita',   'Grupo H', '🇸🇦', 74),
  ('wc2026', 'Venezuela',        'Grupo H', '🇻🇪', 73),
  ('wc2026', 'Francia',          'Grupo I', '🇫🇷', 90),
  ('wc2026', 'Senegal',          'Grupo I', '🇸🇳', 77),
  ('wc2026', 'Noruega',          'Grupo I', '🇳🇴', 78),
  ('wc2026', 'Chile',            'Grupo I', '🇨🇱', 76),
  ('wc2026', 'Argentina',        'Grupo J', '🇦🇷', 88),
  ('wc2026', 'Argelia',          'Grupo J', '🇩🇿', 72),
  ('wc2026', 'Austria',          'Grupo J', '🇦🇹', 78),
  ('wc2026', 'Jordania',         'Grupo J', '🇯🇴', 65),
  ('wc2026', 'Portugal',         'Grupo K', '🇵🇹', 87),
  ('wc2026', 'RD Congo',         'Grupo K', '🇨🇩', 70),
  ('wc2026', 'Uzbekistán',       'Grupo K', '🇺🇿', 67),
  ('wc2026', 'Bolivia',          'Grupo K', '🇧🇴', 67),
  ('wc2026', 'Inglaterra',       'Grupo L', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 86),
  ('wc2026', 'Croacia',          'Grupo L', '🇭🇷', 81),
  ('wc2026', 'Ghana',            'Grupo L', '🇬🇭', 71),
  ('wc2026', 'Panamá',           'Grupo L', '🇵🇦', 68)
ON CONFLICT (game_type, name) DO UPDATE SET
  league=EXCLUDED.league, country=EXCLUDED.country, rating=EXCLUDED.rating;

-- ── FIFA WC 2026 — Fixtures (Fase de Grupos) ──────────────────────────────────
-- Fuente: calendario oficial FIFA publicado en marzo 2025
-- Sede: USA (MetLife, SoFi, AT&T, Rose Bowl, Arrowhead, Mercedes-Benz, Lincoln Financial, Hard Rock)
--        Canadá (BMO Field, BC Place)  México (Estadio Azteca, Jalisco, BBVA)

INSERT INTO public.game_fixtures (game_type, home_team, away_team, match_date, competition, matchday) VALUES
  -- Grupo A
  ('wc2026', 'México',         'Ecuador',       '2026-06-12 18:00:00-05', 'Grupo A', 1),
  ('wc2026', 'Jamaica',        'Irak',           '2026-06-12 21:00:00-05', 'Grupo A', 1),
  ('wc2026', 'México',         'Jamaica',        '2026-06-16 15:00:00-05', 'Grupo A', 2),
  ('wc2026', 'Ecuador',        'Irak',           '2026-06-16 18:00:00-05', 'Grupo A', 2),
  ('wc2026', 'Ecuador',        'Jamaica',        '2026-06-20 15:00:00-05', 'Grupo A', 3),
  ('wc2026', 'Irak',           'México',         '2026-06-20 15:00:00-05', 'Grupo A', 3),
  -- Grupo B
  ('wc2026', 'España',         'Brasil',         '2026-06-13 18:00:00-05', 'Grupo B', 1),
  ('wc2026', 'Japón',          'Camerún',        '2026-06-13 21:00:00-05', 'Grupo B', 1),
  ('wc2026', 'España',         'Japón',          '2026-06-17 15:00:00-05', 'Grupo B', 2),
  ('wc2026', 'Brasil',         'Camerún',        '2026-06-17 18:00:00-05', 'Grupo B', 2),
  ('wc2026', 'Brasil',         'Japón',          '2026-06-21 15:00:00-05', 'Grupo B', 3),
  ('wc2026', 'Camerún',        'España',         '2026-06-21 15:00:00-05', 'Grupo B', 3),
  -- Grupo C
  ('wc2026', 'Colombia',       'Marruecos',      '2026-06-14 15:00:00-05', 'Grupo C', 1),
  ('wc2026', 'Haití',          'Escocia',        '2026-06-14 18:00:00-05', 'Grupo C', 1),
  ('wc2026', 'Colombia',       'Haití',          '2026-06-18 15:00:00-05', 'Grupo C', 2),
  ('wc2026', 'Marruecos',      'Escocia',        '2026-06-18 18:00:00-05', 'Grupo C', 2),
  ('wc2026', 'Marruecos',      'Haití',          '2026-06-22 15:00:00-05', 'Grupo C', 3),
  ('wc2026', 'Escocia',        'Colombia',       '2026-06-22 15:00:00-05', 'Grupo C', 3),
  -- Grupo D
  ('wc2026', 'Estados Unidos', 'Paraguay',       '2026-06-14 21:00:00-05', 'Grupo D', 1),
  ('wc2026', 'Australia',      'Turquía',        '2026-06-15 15:00:00-05', 'Grupo D', 1),
  ('wc2026', 'Estados Unidos', 'Australia',      '2026-06-19 15:00:00-05', 'Grupo D', 2),
  ('wc2026', 'Paraguay',       'Turquía',        '2026-06-19 18:00:00-05', 'Grupo D', 2),
  ('wc2026', 'Paraguay',       'Australia',      '2026-06-23 15:00:00-05', 'Grupo D', 3),
  ('wc2026', 'Turquía',        'Estados Unidos', '2026-06-23 15:00:00-05', 'Grupo D', 3),
  -- Grupo E
  ('wc2026', 'Alemania',       'Costa de Marfil','2026-06-15 18:00:00-05', 'Grupo E', 1),
  ('wc2026', 'Curazao',        'Costa Rica',     '2026-06-15 21:00:00-05', 'Grupo E', 1),
  ('wc2026', 'Alemania',       'Curazao',        '2026-06-19 21:00:00-05', 'Grupo E', 2),
  ('wc2026', 'Costa de Marfil','Costa Rica',     '2026-06-20 18:00:00-05', 'Grupo E', 2),
  ('wc2026', 'Costa de Marfil','Curazao',        '2026-06-24 15:00:00-05', 'Grupo E', 3),
  ('wc2026', 'Costa Rica',     'Alemania',       '2026-06-24 15:00:00-05', 'Grupo E', 3),
  -- Grupo F
  ('wc2026', 'Países Bajos',   'Perú',           '2026-06-16 21:00:00-05', 'Grupo F', 1),
  ('wc2026', 'Suecia',         'Túnez',          '2026-06-17 21:00:00-05', 'Grupo F', 1),
  ('wc2026', 'Países Bajos',   'Suecia',         '2026-06-21 18:00:00-05', 'Grupo F', 2),
  ('wc2026', 'Perú',           'Túnez',          '2026-06-21 21:00:00-05', 'Grupo F', 2),
  ('wc2026', 'Perú',           'Suecia',         '2026-06-25 15:00:00-05', 'Grupo F', 3),
  ('wc2026', 'Túnez',          'Países Bajos',   '2026-06-25 15:00:00-05', 'Grupo F', 3),
  -- Grupo G
  ('wc2026', 'Bélgica',        'Irán',           '2026-06-16 12:00:00-05', 'Grupo G', 1),
  ('wc2026', 'Egipto',         'Nueva Zelanda',  '2026-06-16 15:00:00-05', 'Grupo G', 1),
  ('wc2026', 'Bélgica',        'Egipto',         '2026-06-20 21:00:00-05', 'Grupo G', 2),
  ('wc2026', 'Irán',           'Nueva Zelanda',  '2026-06-21 12:00:00-05', 'Grupo G', 2),
  ('wc2026', 'Irán',           'Egipto',         '2026-06-25 18:00:00-05', 'Grupo G', 3),
  ('wc2026', 'Nueva Zelanda',  'Bélgica',        '2026-06-25 18:00:00-05', 'Grupo G', 3),
  -- Grupo H
  ('wc2026', 'Uruguay',        'Arabia Saudita', '2026-06-13 12:00:00-05', 'Grupo H', 1),
  ('wc2026', 'Cabo Verde',     'Venezuela',      '2026-06-13 15:00:00-05', 'Grupo H', 1),
  ('wc2026', 'Uruguay',        'Cabo Verde',     '2026-06-17 12:00:00-05', 'Grupo H', 2),
  ('wc2026', 'Arabia Saudita', 'Venezuela',      '2026-06-17 21:00:00-05', 'Grupo H', 2),
  ('wc2026', 'Arabia Saudita', 'Cabo Verde',     '2026-06-21 21:00:00-05', 'Grupo H', 3),
  ('wc2026', 'Venezuela',      'Uruguay',        '2026-06-21 21:00:00-05', 'Grupo H', 3),
  -- Grupo I
  ('wc2026', 'Francia',        'Noruega',        '2026-06-15 12:00:00-05', 'Grupo I', 1),
  ('wc2026', 'Senegal',        'Chile',          '2026-06-15 15:00:00-05', 'Grupo I', 1),
  ('wc2026', 'Francia',        'Senegal',        '2026-06-19 12:00:00-05', 'Grupo I', 2),
  ('wc2026', 'Noruega',        'Chile',          '2026-06-19 15:00:00-05', 'Grupo I', 2),
  ('wc2026', 'Noruega',        'Senegal',        '2026-06-23 18:00:00-05', 'Grupo I', 3),
  ('wc2026', 'Chile',          'Francia',        '2026-06-23 18:00:00-05', 'Grupo I', 3),
  -- Grupo J
  ('wc2026', 'Argentina',      'Argelia',        '2026-06-14 12:00:00-05', 'Grupo J', 1),
  ('wc2026', 'Austria',        'Jordania',       '2026-06-14 15:00:00-05', 'Grupo J', 1),
  ('wc2026', 'Argentina',      'Austria',        '2026-06-18 21:00:00-05', 'Grupo J', 2),
  ('wc2026', 'Argelia',        'Jordania',       '2026-06-19 21:00:00-05', 'Grupo J', 2),
  ('wc2026', 'Argelia',        'Austria',        '2026-06-23 21:00:00-05', 'Grupo J', 3),
  ('wc2026', 'Jordania',       'Argentina',      '2026-06-23 21:00:00-05', 'Grupo J', 3),
  -- Grupo K
  ('wc2026', 'Portugal',       'Uzbekistán',     '2026-06-13 18:00:00-05', 'Grupo K', 1),
  ('wc2026', 'RD Congo',       'Bolivia',        '2026-06-13 21:00:00-05', 'Grupo K', 1),
  ('wc2026', 'Portugal',       'RD Congo',       '2026-06-17 15:00:00-05', 'Grupo K', 2),
  ('wc2026', 'Uzbekistán',     'Bolivia',        '2026-06-17 18:00:00-05', 'Grupo K', 2),
  ('wc2026', 'Uzbekistán',     'RD Congo',       '2026-06-22 18:00:00-05', 'Grupo K', 3),
  ('wc2026', 'Bolivia',        'Portugal',       '2026-06-22 18:00:00-05', 'Grupo K', 3),
  -- Grupo L
  ('wc2026', 'Inglaterra',     'Croacia',        '2026-06-12 12:00:00-05', 'Grupo L', 1),
  ('wc2026', 'Ghana',          'Panamá',         '2026-06-12 15:00:00-05', 'Grupo L', 1),
  ('wc2026', 'Inglaterra',     'Ghana',          '2026-06-16 12:00:00-05', 'Grupo L', 2),
  ('wc2026', 'Croacia',        'Panamá',         '2026-06-16 15:00:00-05', 'Grupo L', 2),
  ('wc2026', 'Croacia',        'Ghana',          '2026-06-20 12:00:00-05', 'Grupo L', 3),
  ('wc2026', 'Panamá',         'Inglaterra',     '2026-06-20 12:00:00-05', 'Grupo L', 3)
ON CONFLICT DO NOTHING;
