-- ============================================================
-- MIGRACIÓN 003 - Mundial 2026: 48 Equipos + 104 Partidos
-- Grupos A–L según fixture oficial FIFA
-- ============================================================

-- Limpiar datos anteriores (en orden por FK)
TRUNCATE public.player_match_stats CASCADE;
TRUNCATE public.fantasy_rosters CASCADE;
TRUNCATE public.fantasy_points CASCADE;
TRUNCATE public.predictions CASCADE;
TRUNCATE public.matches CASCADE;
TRUNCATE public.players CASCADE;
TRUNCATE public.teams CASCADE;

-- Ampliar el enum match_stage reconstruyéndolo (ADD VALUE no se puede usar
-- en la misma transacción que los INSERTs que lo usan — Postgres limita esto).
ALTER TABLE public.matches ALTER COLUMN stage DROP DEFAULT;
ALTER TABLE public.matches ALTER COLUMN stage TYPE text;
DROP TYPE public.match_stage;
CREATE TYPE public.match_stage AS ENUM (
  'group',
  'round_of_32',
  'round_of_16',
  'quarter_final',
  'semi_final',
  'third_place',
  'final'
);
ALTER TABLE public.matches ALTER COLUMN stage TYPE public.match_stage USING stage::public.match_stage;
ALTER TABLE public.matches ALTER COLUMN stage SET DEFAULT 'group'::public.match_stage;


-- ============================================================
-- 48 EQUIPOS - 12 GRUPOS (A–L)
-- ============================================================
INSERT INTO public.teams (id, name, short_name, country, group_name) VALUES
  -- GRUPO A
  ('aaa00001-0000-0000-0000-000000000001', 'México',           'MEX', 'México',           'A'),
  ('aaa00001-0000-0000-0000-000000000002', 'Sudáfrica',        'RSA', 'Sudáfrica',        'A'),
  ('aaa00001-0000-0000-0000-000000000003', 'Corea del Sur',    'KOR', 'Corea del Sur',    'A'),
  ('aaa00001-0000-0000-0000-000000000004', 'Rep. Checa',       'CZE', 'Rep. Checa',       'A'),
  -- GRUPO B
  ('aaa00002-0000-0000-0000-000000000001', 'Canadá',           'CAN', 'Canadá',           'B'),
  ('aaa00002-0000-0000-0000-000000000002', 'Bosnia-Herzeg.',   'BIH', 'Bosnia y Herzeg.', 'B'),
  ('aaa00002-0000-0000-0000-000000000003', 'Qatar',            'QAT', 'Qatar',            'B'),
  ('aaa00002-0000-0000-0000-000000000004', 'Suiza',            'SUI', 'Suiza',            'B'),
  -- GRUPO C
  ('aaa00003-0000-0000-0000-000000000001', 'Brasil',           'BRA', 'Brasil',           'C'),
  ('aaa00003-0000-0000-0000-000000000002', 'Marruecos',        'MAR', 'Marruecos',        'C'),
  ('aaa00003-0000-0000-0000-000000000003', 'Haití',            'HAI', 'Haití',            'C'),
  ('aaa00003-0000-0000-0000-000000000004', 'Escocia',          'SCO', 'Escocia',          'C'),
  -- GRUPO D
  ('aaa00004-0000-0000-0000-000000000001', 'Estados Unidos',   'USA', 'Estados Unidos',   'D'),
  ('aaa00004-0000-0000-0000-000000000002', 'Paraguay',         'PAR', 'Paraguay',         'D'),
  ('aaa00004-0000-0000-0000-000000000003', 'Australia',        'AUS', 'Australia',        'D'),
  ('aaa00004-0000-0000-0000-000000000004', 'Turquía',          'TUR', 'Turquía',          'D'),
  -- GRUPO E
  ('aaa00005-0000-0000-0000-000000000001', 'Alemania',         'GER', 'Alemania',         'E'),
  ('aaa00005-0000-0000-0000-000000000002', 'Curazao',          'CUW', 'Curazao',          'E'),
  ('aaa00005-0000-0000-0000-000000000003', 'Costa de Marfil',  'CIV', 'Costa de Marfil',  'E'),
  ('aaa00005-0000-0000-0000-000000000004', 'Ecuador',          'ECU', 'Ecuador',          'E'),
  -- GRUPO F
  ('aaa00006-0000-0000-0000-000000000001', 'Países Bajos',     'NED', 'Países Bajos',     'F'),
  ('aaa00006-0000-0000-0000-000000000002', 'Japón',            'JPN', 'Japón',            'F'),
  ('aaa00006-0000-0000-0000-000000000003', 'Suecia',           'SWE', 'Suecia',           'F'),
  ('aaa00006-0000-0000-0000-000000000004', 'Túnez',            'TUN', 'Túnez',            'F'),
  -- GRUPO G
  ('aaa00007-0000-0000-0000-000000000001', 'Bélgica',          'BEL', 'Bélgica',          'G'),
  ('aaa00007-0000-0000-0000-000000000002', 'Egipto',           'EGY', 'Egipto',           'G'),
  ('aaa00007-0000-0000-0000-000000000003', 'Irán',             'IRN', 'Irán',             'G'),
  ('aaa00007-0000-0000-0000-000000000004', 'Nueva Zelanda',    'NZL', 'Nueva Zelanda',    'G'),
  -- GRUPO H
  ('aaa00008-0000-0000-0000-000000000001', 'España',           'ESP', 'España',           'H'),
  ('aaa00008-0000-0000-0000-000000000002', 'Cabo Verde',       'CPV', 'Cabo Verde',       'H'),
  ('aaa00008-0000-0000-0000-000000000003', 'Arabia Saudita',   'KSA', 'Arabia Saudita',   'H'),
  ('aaa00008-0000-0000-0000-000000000004', 'Uruguay',          'URU', 'Uruguay',          'H'),
  -- GRUPO I
  ('aaa00009-0000-0000-0000-000000000001', 'Francia',          'FRA', 'Francia',          'I'),
  ('aaa00009-0000-0000-0000-000000000002', 'Senegal',          'SEN', 'Senegal',          'I'),
  ('aaa00009-0000-0000-0000-000000000003', 'Iraq',             'IRQ', 'Iraq',             'I'),
  ('aaa00009-0000-0000-0000-000000000004', 'Noruega',          'NOR', 'Noruega',          'I'),
  -- GRUPO J
  ('aaa00010-0000-0000-0000-000000000001', 'Argentina',        'ARG', 'Argentina',        'J'),
  ('aaa00010-0000-0000-0000-000000000002', 'Argelia',          'ALG', 'Argelia',          'J'),
  ('aaa00010-0000-0000-0000-000000000003', 'Austria',          'AUT', 'Austria',          'J'),
  ('aaa00010-0000-0000-0000-000000000004', 'Jordania',         'JOR', 'Jordania',         'J'),
  -- GRUPO K
  ('aaa00011-0000-0000-0000-000000000001', 'Portugal',         'POR', 'Portugal',         'K'),
  ('aaa00011-0000-0000-0000-000000000002', 'RD Congo',         'COD', 'RD Congo',         'K'),
  ('aaa00011-0000-0000-0000-000000000003', 'Uzbekistán',       'UZB', 'Uzbekistán',       'K'),
  ('aaa00011-0000-0000-0000-000000000004', 'Colombia',         'COL', 'Colombia',         'K'),
  -- GRUPO L
  ('aaa00012-0000-0000-0000-000000000001', 'Inglaterra',       'ENG', 'Inglaterra',       'L'),
  ('aaa00012-0000-0000-0000-000000000002', 'Croacia',          'CRO', 'Croacia',          'L'),
  ('aaa00012-0000-0000-0000-000000000003', 'Ghana',            'GHA', 'Ghana',            'L'),
  ('aaa00012-0000-0000-0000-000000000004', 'Panamá',           'PAN', 'Panamá',           'L');

-- ============================================================
-- JUGADORES CLAVE (4-5 por equipo, ~200 jugadores total)
-- Precios basados en popularidad/rendimiento estimado
-- ============================================================
INSERT INTO public.players (team_id, name, short_name, position, nationality, shirt_number, price) VALUES
  -- GRUPO A: MÉXICO
  ('aaa00001-0000-0000-0000-000000000001', 'Guillermo Ochoa',     'Ochoa',      'GK',  'México',        1,  7.0),
  ('aaa00001-0000-0000-0000-000000000001', 'Edson Álvarez',       'E. Álvarez', 'MID', 'México',        4,  8.5),
  ('aaa00001-0000-0000-0000-000000000001', 'Hirving Lozano',      'Lozano',     'FWD', 'México',        22, 9.0),
  ('aaa00001-0000-0000-0000-000000000001', 'Santiago Giménez',    'S. Giménez', 'FWD', 'México',        9,  10.5),
  ('aaa00001-0000-0000-0000-000000000001', 'César Montes',        'C. Montes',  'DEF', 'México',        3,  6.5),
  -- SUDÁFRICA
  ('aaa00001-0000-0000-0000-000000000002', 'Ronwen Williams',     'Williams',   'GK',  'Sudáfrica',     1,  5.5),
  ('aaa00001-0000-0000-0000-000000000002', 'Percy Tau',           'Tau',        'FWD', 'Sudáfrica',     13, 7.0),
  ('aaa00001-0000-0000-0000-000000000002', 'Bongani Zungu',       'Zungu',      'MID', 'Sudáfrica',     8,  6.0),
  ('aaa00001-0000-0000-0000-000000000002', 'Siyanda Xulu',        'Xulu',       'DEF', 'Sudáfrica',     5,  5.0),
  -- COREA DEL SUR
  ('aaa00001-0000-0000-0000-000000000003', 'Kim Seung-gyu',       'Kim S-G',    'GK',  'Corea del Sur', 1,  5.5),
  ('aaa00001-0000-0000-0000-000000000003', 'Son Heung-min',       'Son',        'FWD', 'Corea del Sur', 7,  11.5),
  ('aaa00001-0000-0000-0000-000000000003', 'Lee Kang-in',         'Lee K-I',    'MID', 'Corea del Sur', 19, 9.0),
  ('aaa00001-0000-0000-0000-000000000003', 'Kim Min-jae',         'Kim M-J',    'DEF', 'Corea del Sur', 3,  8.0),
  -- REP. CHECA
  ('aaa00001-0000-0000-0000-000000000004', 'Jiří Staněk',         'Staněk',     'GK',  'Rep. Checa',    1,  6.0),
  ('aaa00001-0000-0000-0000-000000000004', 'Patrik Schick',       'Schick',     'FWD', 'Rep. Checa',    9,  9.5),
  ('aaa00001-0000-0000-0000-000000000004', 'Tomáš Souček',        'Souček',     'MID', 'Rep. Checa',    6,  8.0),
  ('aaa00001-0000-0000-0000-000000000004', 'Vladimír Coufal',     'Coufal',     'DEF', 'Rep. Checa',    5,  6.5),

  -- GRUPO B: CANADÁ
  ('aaa00002-0000-0000-0000-000000000001', 'Milan Borjan',        'Borjan',     'GK',  'Canadá',        18, 6.0),
  ('aaa00002-0000-0000-0000-000000000001', 'Alphonso Davies',     'Davies',     'DEF', 'Canadá',        19, 11.0),
  ('aaa00002-0000-0000-0000-000000000001', 'Jonathan David',      'J. David',   'FWD', 'Canadá',        20, 11.5),
  ('aaa00002-0000-0000-0000-000000000001', 'Tajon Buchanan',      'Buchanan',   'MID', 'Canadá',        11, 8.0),
  ('aaa00002-0000-0000-0000-000000000001', 'Cyle Larin',          'Larin',      'FWD', 'Canadá',        9,  8.5),
  -- BOSNIA-HERZEG.
  ('aaa00002-0000-0000-0000-000000000002', 'Ibrahim Šehić',       'Šehić',      'GK',  'Bosnia',        1,  5.5),
  ('aaa00002-0000-0000-0000-000000000002', 'Edin Džeko',          'Džeko',      'FWD', 'Bosnia',        9,  8.5),
  ('aaa00002-0000-0000-0000-000000000002', 'Miralem Pjanić',      'Pjanić',     'MID', 'Bosnia',        8,  7.5),
  ('aaa00002-0000-0000-0000-000000000002', 'Sead Kolašinac',      'Kolašinac',  'DEF', 'Bosnia',        5,  6.0),
  -- QATAR
  ('aaa00002-0000-0000-0000-000000000003', 'Meshaal Barsham',     'Barsham',    'GK',  'Qatar',         1,  5.0),
  ('aaa00002-0000-0000-0000-000000000003', 'Akram Afif',          'Afif',       'FWD', 'Qatar',         11, 7.5),
  ('aaa00002-0000-0000-0000-000000000003', 'Hassan Al-Haydos',    'Al-Haydos',  'MID', 'Qatar',         10, 6.5),
  -- SUIZA
  ('aaa00002-0000-0000-0000-000000000004', 'Yann Sommer',         'Sommer',     'GK',  'Suiza',         1,  8.0),
  ('aaa00002-0000-0000-0000-000000000004', 'Granit Xhaka',        'Xhaka',      'MID', 'Suiza',         10, 9.0),
  ('aaa00002-0000-0000-0000-000000000004', 'Breel Embolo',        'Embolo',     'FWD', 'Suiza',         7,  8.5),
  ('aaa00002-0000-0000-0000-000000000004', 'Manuel Akanji',       'Akanji',     'DEF', 'Suiza',         5,  7.5),

  -- GRUPO C: BRASIL
  ('aaa00003-0000-0000-0000-000000000001', 'Alisson Becker',      'Alisson',    'GK',  'Brasil',        1,  9.5),
  ('aaa00003-0000-0000-0000-000000000001', 'Marquinhos',          'Marquinhos', 'DEF', 'Brasil',        4,  8.0),
  ('aaa00003-0000-0000-0000-000000000001', 'Casemiro',            'Casemiro',   'MID', 'Brasil',        5,  8.0),
  ('aaa00003-0000-0000-0000-000000000001', 'Vinícius Jr',         'Vini Jr',    'FWD', 'Brasil',        20, 13.0),
  ('aaa00003-0000-0000-0000-000000000001', 'Rodrygo',             'Rodrygo',    'FWD', 'Brasil',        11, 9.5),
  -- MARRUECOS
  ('aaa00003-0000-0000-0000-000000000002', 'Yassine Bounou',      'Bounou',     'GK',  'Marruecos',     1,  8.5),
  ('aaa00003-0000-0000-0000-000000000002', 'Achraf Hakimi',       'Hakimi',     'DEF', 'Marruecos',     2,  11.0),
  ('aaa00003-0000-0000-0000-000000000002', 'Hakim Ziyech',        'Ziyech',     'MID', 'Marruecos',     7,  8.5),
  ('aaa00003-0000-0000-0000-000000000002', 'Youssef En-Nesyri',   'En-Nesyri',  'FWD', 'Marruecos',     19, 9.0),
  ('aaa00003-0000-0000-0000-000000000002', 'Sofyan Amrabat',      'Amrabat',    'MID', 'Marruecos',     4,  8.0),
  -- HAITÍ
  ('aaa00003-0000-0000-0000-000000000003', 'Josué Duverger',      'Duverger',   'GK',  'Haití',         1,  4.5),
  ('aaa00003-0000-0000-0000-000000000003', 'Derrick Etienne Jr',  'Etienne',    'FWD', 'Haití',         7,  5.5),
  ('aaa00003-0000-0000-0000-000000000003', 'Frantzdy Pierrot',    'Pierrot',    'MID', 'Haití',         8,  5.0),
  -- ESCOCIA
  ('aaa00003-0000-0000-0000-000000000004', 'Angus Gunn',          'Gunn',       'GK',  'Escocia',       1,  6.5),
  ('aaa00003-0000-0000-0000-000000000004', 'Andy Robertson',      'Robertson',  'DEF', 'Escocia',       3,  9.0),
  ('aaa00003-0000-0000-0000-000000000004', 'Scott McTominay',     'McTominay',  'MID', 'Escocia',       5,  8.5),
  ('aaa00003-0000-0000-0000-000000000004', 'Che Adams',           'Adams',      'FWD', 'Escocia',       9,  7.5),

  -- GRUPO D: ESTADOS UNIDOS
  ('aaa00004-0000-0000-0000-000000000001', 'Matt Turner',         'Turner',     'GK',  'Estados Unidos',1,  7.0),
  ('aaa00004-0000-0000-0000-000000000001', 'Christian Pulisic',   'Pulisic',    'FWD', 'Estados Unidos',10, 11.0),
  ('aaa00004-0000-0000-0000-000000000001', 'Weston McKennie',     'McKennie',   'MID', 'Estados Unidos',8,  8.5),
  ('aaa00004-0000-0000-0000-000000000001', 'Antonee Robinson',    'Robinson',   'DEF', 'Estados Unidos',5,  7.5),
  ('aaa00004-0000-0000-0000-000000000001', 'Folarin Balogun',     'Balogun',    'FWD', 'Estados Unidos',9,  9.0),
  -- PARAGUAY
  ('aaa00004-0000-0000-0000-000000000002', 'Antony Silva',        'A. Silva',   'GK',  'Paraguay',      1,  5.5),
  ('aaa00004-0000-0000-0000-000000000002', 'Miguel Almirón',      'Almirón',    'MID', 'Paraguay',      10, 9.0),
  ('aaa00004-0000-0000-0000-000000000002', 'Julio Enciso',        'Enciso',     'FWD', 'Paraguay',      11, 8.0),
  ('aaa00004-0000-0000-0000-000000000002', 'Omar Alderete',       'Alderete',   'DEF', 'Paraguay',      5,  6.0),
  -- AUSTRALIA
  ('aaa00004-0000-0000-0000-000000000003', 'Mathew Ryan',         'M. Ryan',    'GK',  'Australia',     1,  7.0),
  ('aaa00004-0000-0000-0000-000000000003', 'Mathew Leckie',       'Leckie',     'FWD', 'Australia',     7,  7.5),
  ('aaa00004-0000-0000-0000-000000000003', 'Aaron Mooy',          'Mooy',       'MID', 'Australia',     13, 7.0),
  ('aaa00004-0000-0000-0000-000000000003', 'Harry Souttar',       'Souttar',    'DEF', 'Australia',     5,  6.5),
  -- TURQUÍA
  ('aaa00004-0000-0000-0000-000000000004', 'Mert Günok',          'Günok',      'GK',  'Turquía',       1,  6.5),
  ('aaa00004-0000-0000-0000-000000000004', 'Hakan Çalhanoğlu',    'Çalhanoğlu', 'MID', 'Turquía',       10, 10.0),
  ('aaa00004-0000-0000-0000-000000000004', 'Kerem Aktürkoğlu',    'Aktürkoğlu', 'FWD', 'Turquía',       11, 8.5),
  ('aaa00004-0000-0000-0000-000000000004', 'Merih Demiral',       'Demiral',    'DEF', 'Turquía',       3,  7.5),

  -- GRUPO E: ALEMANIA
  ('aaa00005-0000-0000-0000-000000000001', 'Manuel Neuer',        'Neuer',      'GK',  'Alemania',      1,  8.5),
  ('aaa00005-0000-0000-0000-000000000001', 'Joshua Kimmich',      'Kimmich',    'MID', 'Alemania',      6,  10.0),
  ('aaa00005-0000-0000-0000-000000000001', 'Kai Havertz',         'Havertz',    'FWD', 'Alemania',      9,  9.5),
  ('aaa00005-0000-0000-0000-000000000001', 'Florian Wirtz',       'Wirtz',      'MID', 'Alemania',      10, 11.0),
  ('aaa00005-0000-0000-0000-000000000001', 'Antonio Rüdiger',     'Rüdiger',    'DEF', 'Alemania',      2,  7.5),
  -- CURAZAO
  ('aaa00005-0000-0000-0000-000000000002', 'Eloy Room',           'Room',       'GK',  'Curazao',       1,  5.0),
  ('aaa00005-0000-0000-0000-000000000002', 'Cuco Martina',        'Martina',    'DEF', 'Curazao',       3,  4.5),
  ('aaa00005-0000-0000-0000-000000000002', 'Leandro Bacuna',      'Bacuna',     'MID', 'Curazao',       8,  5.0),
  -- COSTA DE MARFIL
  ('aaa00005-0000-0000-0000-000000000003', 'Badra Ali Sangaré',   'Sangaré',    'GK',  'Costa de Marfil',1, 5.5),
  ('aaa00005-0000-0000-0000-000000000003', 'Sébastien Haller',    'Haller',     'FWD', 'Costa de Marfil',9, 8.0),
  ('aaa00005-0000-0000-0000-000000000003', 'Franck Kessié',       'Kessié',     'MID', 'Costa de Marfil',5, 8.5),
  ('aaa00005-0000-0000-0000-000000000003', 'Simon Adingra',       'Adingra',    'FWD', 'Costa de Marfil',11,7.5),
  -- ECUADOR
  ('aaa00005-0000-0000-0000-000000000004', 'Hernán Galíndez',     'Galíndez',   'GK',  'Ecuador',       1,  6.0),
  ('aaa00005-0000-0000-0000-000000000004', 'Enner Valencia',      'E. Valencia','FWD', 'Ecuador',       13, 8.5),
  ('aaa00005-0000-0000-0000-000000000004', 'Moises Caicedo',      'Caicedo',    'MID', 'Ecuador',       10, 10.5),
  ('aaa00005-0000-0000-0000-000000000004', 'Piero Hincapié',      'Hincapié',   'DEF', 'Ecuador',       3,  7.5),

  -- GRUPO F: PAÍSES BAJOS
  ('aaa00006-0000-0000-0000-000000000001', 'Bart Verbruggen',     'Verbruggen', 'GK',  'Países Bajos',  1,  7.5),
  ('aaa00006-0000-0000-0000-000000000001', 'Virgil van Dijk',     'Van Dijk',   'DEF', 'Países Bajos',  4,  10.5),
  ('aaa00006-0000-0000-0000-000000000001', 'Frenkie de Jong',     'De Jong',    'MID', 'Países Bajos',  21, 10.0),
  ('aaa00006-0000-0000-0000-000000000001', 'Cody Gakpo',          'Gakpo',      'FWD', 'Países Bajos',  11, 10.5),
  ('aaa00006-0000-0000-0000-000000000001', 'Memphis Depay',       'Memphis',    'FWD', 'Países Bajos',  10, 9.0),
  -- JAPÓN
  ('aaa00006-0000-0000-0000-000000000002', 'Shuichi Gonda',       'Gonda',      'GK',  'Japón',         12, 6.5),
  ('aaa00006-0000-0000-0000-000000000002', 'Takehiro Tomiyasu',   'Tomiyasu',   'DEF', 'Japón',         5,  7.5),
  ('aaa00006-0000-0000-0000-000000000002', 'Daichi Kamada',       'Kamada',     'MID', 'Japón',         14, 8.5),
  ('aaa00006-0000-0000-0000-000000000002', 'Ritsu Doan',          'Doan',       'FWD', 'Japón',         9,  8.5),
  -- SUECIA
  ('aaa00006-0000-0000-0000-000000000003', 'Robin Olsen',         'Olsen',      'GK',  'Suecia',        1,  6.5),
  ('aaa00006-0000-0000-0000-000000000003', 'Alexander Isak',      'Isak',       'FWD', 'Suecia',        14, 11.0),
  ('aaa00006-0000-0000-0000-000000000003', 'Dejan Kulusevski',    'Kulusevski', 'MID', 'Suecia',        17, 9.5),
  ('aaa00006-0000-0000-0000-000000000003', 'Victor Nilsson Lindelöf','Lindelöf','DEF', 'Suecia',        2,  7.0),
  -- TÚNEZ
  ('aaa00006-0000-0000-0000-000000000004', 'Aymen Dahmen',        'Dahmen',     'GK',  'Túnez',         1,  5.5),
  ('aaa00006-0000-0000-0000-000000000004', 'Wahbi Khazri',        'Khazri',     'FWD', 'Túnez',         10, 7.0),
  ('aaa00006-0000-0000-0000-000000000004', 'Ellyes Skhiri',       'Skhiri',     'MID', 'Túnez',         8,  7.0),

  -- GRUPO G: BÉLGICA
  ('aaa00007-0000-0000-0000-000000000001', 'Koen Casteels',       'Casteels',   'GK',  'Bélgica',       1,  7.5),
  ('aaa00007-0000-0000-0000-000000000001', 'Kevin De Bruyne',     'De Bruyne',  'MID', 'Bélgica',       7,  13.5),
  ('aaa00007-0000-0000-0000-000000000001', 'Romelu Lukaku',       'Lukaku',     'FWD', 'Bélgica',       9,  11.0),
  ('aaa00007-0000-0000-0000-000000000001', 'Youri Tielemans',     'Tielemans',  'MID', 'Bélgica',       8,  8.5),
  ('aaa00007-0000-0000-0000-000000000001', 'Axel Witsel',         'Witsel',     'DEF', 'Bélgica',       6,  7.0),
  -- EGIPTO
  ('aaa00007-0000-0000-0000-000000000002', 'Mohamed El-Shenawy',  'El-Shenawy', 'GK',  'Egipto',        1,  6.0),
  ('aaa00007-0000-0000-0000-000000000002', 'Mohamed Salah',       'Salah',      'FWD', 'Egipto',        11, 14.0),
  ('aaa00007-0000-0000-0000-000000000002', 'Omar Marmoush',       'Marmoush',   'FWD', 'Egipto',        7,  10.5),
  ('aaa00007-0000-0000-0000-000000000002', 'Trezeguet',           'Trezeguet',  'MID', 'Egipto',        10, 7.5),
  -- IRÁN
  ('aaa00007-0000-0000-0000-000000000003', 'Alireza Beiranvand',  'Beiranvand', 'GK',  'Irán',          1,  6.5),
  ('aaa00007-0000-0000-0000-000000000003', 'Mehdi Taremi',        'Taremi',     'FWD', 'Irán',          9,  9.5),
  ('aaa00007-0000-0000-0000-000000000003', 'Sardar Azmoun',       'Azmoun',     'FWD', 'Irán',          7,  8.5),
  ('aaa00007-0000-0000-0000-000000000003', 'Alireza Jahanbakhsh', 'Jahanbakhsh','MID', 'Irán',          11, 7.5),
  -- NUEVA ZELANDA
  ('aaa00007-0000-0000-0000-000000000004', 'Oliver Sail',         'Sail',       'GK',  'Nueva Zelanda', 1,  5.0),
  ('aaa00007-0000-0000-0000-000000000004', 'Chris Wood',          'C. Wood',    'FWD', 'Nueva Zelanda', 9,  8.0),
  ('aaa00007-0000-0000-0000-000000000004', 'Tim Payne',           'Payne',      'MID', 'Nueva Zelanda', 8,  5.5),

  -- GRUPO H: ESPAÑA
  ('aaa00008-0000-0000-0000-000000000001', 'Unai Simón',          'U. Simón',   'GK',  'España',        23, 8.0),
  ('aaa00008-0000-0000-0000-000000000001', 'Pedri',               'Pedri',      'MID', 'España',        8,  11.0),
  ('aaa00008-0000-0000-0000-000000000001', 'Lamine Yamal',        'Yamal',      'FWD', 'España',        19, 12.5),
  ('aaa00008-0000-0000-0000-000000000001', 'Álvaro Morata',       'Morata',     'FWD', 'España',        7,  9.0),
  ('aaa00008-0000-0000-0000-000000000001', 'Dani Carvajal',       'Carvajal',   'DEF', 'España',        2,  7.5),
  -- CABO VERDE
  ('aaa00008-0000-0000-0000-000000000002', 'Vozinha',             'Vozinha',    'GK',  'Cabo Verde',    1,  5.0),
  ('aaa00008-0000-0000-0000-000000000002', 'Garry Rodrigues',     'G. Rodrigues','FWD','Cabo Verde',    11, 6.5),
  ('aaa00008-0000-0000-0000-000000000002', 'Ryan Mendes',         'R. Mendes',  'MID', 'Cabo Verde',    7,  6.0),
  -- ARABIA SAUDITA
  ('aaa00008-0000-0000-0000-000000000003', 'Mohammed Al-Owais',   'Al-Owais',   'GK',  'Arabia Saudita',1,  6.5),
  ('aaa00008-0000-0000-0000-000000000003', 'Salem Al-Dawsari',    'Al-Dawsari', 'FWD', 'Arabia Saudita',10, 8.0),
  ('aaa00008-0000-0000-0000-000000000003', 'Firas Al-Buraikan',   'Al-Buraikan','FWD', 'Arabia Saudita',9,  7.0),
  -- URUGUAY
  ('aaa00008-0000-0000-0000-000000000004', 'Sergio Rochet',       'Rochet',     'GK',  'Uruguay',       1,  7.0),
  ('aaa00008-0000-0000-0000-000000000004', 'Darwin Núñez',        'D. Núñez',   'FWD', 'Uruguay',       11, 12.0),
  ('aaa00008-0000-0000-0000-000000000004', 'Federico Valverde',   'Valverde',   'MID', 'Uruguay',       8,  11.5),
  ('aaa00008-0000-0000-0000-000000000004', 'Ronald Araújo',       'Araújo',     'DEF', 'Uruguay',       4,  8.5),

  -- GRUPO I: FRANCIA
  ('aaa00009-0000-0000-0000-000000000001', 'Mike Maignan',        'Maignan',    'GK',  'Francia',       16, 8.5),
  ('aaa00009-0000-0000-0000-000000000001', 'Kylian Mbappé',       'Mbappé',     'FWD', 'Francia',       10, 15.0),
  ('aaa00009-0000-0000-0000-000000000001', 'Antoine Griezmann',   'Griezmann',  'FWD', 'Francia',       7,  11.0),
  ('aaa00009-0000-0000-0000-000000000001', 'Aurélien Tchouaméni', 'Tchouaméni', 'MID', 'Francia',       8,  9.0),
  ('aaa00009-0000-0000-0000-000000000001', 'William Saliba',      'Saliba',     'DEF', 'Francia',       17, 8.5),
  -- SENEGAL
  ('aaa00009-0000-0000-0000-000000000002', 'Édouard Mendy',       'Mendy',      'GK',  'Senegal',       16, 7.5),
  ('aaa00009-0000-0000-0000-000000000002', 'Sadio Mané',          'Mané',       'FWD', 'Senegal',       10, 11.5),
  ('aaa00009-0000-0000-0000-000000000002', 'Kalidou Koulibaly',   'Koulibaly',  'DEF', 'Senegal',       3,  8.5),
  ('aaa00009-0000-0000-0000-000000000002', 'Ismaïla Sarr',        'Sarr',       'FWD', 'Senegal',       23, 9.0),
  -- IRAQ
  ('aaa00009-0000-0000-0000-000000000003', 'Jalal Hassan',        'J. Hassan',  'GK',  'Iraq',          1,  5.0),
  ('aaa00009-0000-0000-0000-000000000003', 'Aymen Hussein',       'A. Hussein', 'FWD', 'Iraq',          9,  6.0),
  ('aaa00009-0000-0000-0000-000000000003', 'Amjed Attwan',        'Attwan',     'MID', 'Iraq',          8,  5.5),
  -- NORUEGA
  ('aaa00009-0000-0000-0000-000000000004', 'Ørjan Nyland',        'Nyland',     'GK',  'Noruega',       13, 6.5),
  ('aaa00009-0000-0000-0000-000000000004', 'Erling Haaland',      'Haaland',    'FWD', 'Noruega',       9,  15.0),
  ('aaa00009-0000-0000-0000-000000000004', 'Martin Ødegaard',     'Ødegaard',   'MID', 'Noruega',       8,  12.5),
  ('aaa00009-0000-0000-0000-000000000004', 'Alexander Sørloth',   'Sørloth',    'FWD', 'Noruega',       17, 8.5),

  -- GRUPO J: ARGENTINA
  ('aaa00010-0000-0000-0000-000000000001', 'Emiliano Martínez',   'E. Martínez','GK',  'Argentina',     23, 9.5),
  ('aaa00010-0000-0000-0000-000000000001', 'Lionel Messi',        'Messi',      'FWD', 'Argentina',     10, 15.0),
  ('aaa00010-0000-0000-0000-000000000001', 'Lautaro Martínez',    'L. Martínez','FWD', 'Argentina',     22, 11.0),
  ('aaa00010-0000-0000-0000-000000000001', 'Rodrigo De Paul',     'De Paul',    'MID', 'Argentina',     7,  8.5),
  ('aaa00010-0000-0000-0000-000000000001', 'Julián Álvarez',      'J. Álvarez', 'FWD', 'Argentina',     9,  11.5),
  -- ARGELIA
  ('aaa00010-0000-0000-0000-000000000002', 'Réda Lahlali',        'Lahlali',    'GK',  'Argelia',       1,  5.5),
  ('aaa00010-0000-0000-0000-000000000002', 'Riyad Mahrez',        'Mahrez',     'FWD', 'Argelia',       26, 10.0),
  ('aaa00010-0000-0000-0000-000000000002', 'Islam Slimani',       'Slimani',    'FWD', 'Argelia',       9,  7.5),
  ('aaa00010-0000-0000-0000-000000000002', 'Yacine Brahimi',      'Brahimi',    'MID', 'Argelia',       17, 8.0),
  -- AUSTRIA
  ('aaa00010-0000-0000-0000-000000000003', 'Patrick Pentz',       'Pentz',      'GK',  'Austria',       1,  6.5),
  ('aaa00010-0000-0000-0000-000000000003', 'Marcel Sabitzer',     'Sabitzer',   'MID', 'Austria',       8,  9.0),
  ('aaa00010-0000-0000-0000-000000000003', 'Marko Arnautovic',    'Arnautovic', 'FWD', 'Austria',       7,  8.5),
  ('aaa00010-0000-0000-0000-000000000003', 'David Alaba',         'Alaba',      'DEF', 'Austria',       6,  9.5),
  -- JORDANIA
  ('aaa00010-0000-0000-0000-000000000004', 'Yazeed Abo Laila',    'Abo Laila',  'GK',  'Jordania',      1,  5.0),
  ('aaa00010-0000-0000-0000-000000000004', 'Musa Al-Taamari',     'Al-Taamari', 'FWD', 'Jordania',      11, 6.5),
  ('aaa00010-0000-0000-0000-000000000004', 'Ahmad Hayel',         'Hayel',      'MID', 'Jordania',      8,  5.5),

  -- GRUPO K: PORTUGAL
  ('aaa00011-0000-0000-0000-000000000001', 'Diogo Costa',         'D. Costa',   'GK',  'Portugal',      1,  8.0),
  ('aaa00011-0000-0000-0000-000000000001', 'Cristiano Ronaldo',   'Ronaldo',    'FWD', 'Portugal',      7,  13.5),
  ('aaa00011-0000-0000-0000-000000000001', 'Bruno Fernandes',     'B. Fernandes','MID','Portugal',      8,  11.5),
  ('aaa00011-0000-0000-0000-000000000001', 'Rafael Leão',         'Leão',       'FWD', 'Portugal',      11, 10.5),
  ('aaa00011-0000-0000-0000-000000000001', 'Rúben Dias',          'R. Dias',    'DEF', 'Portugal',      6,  9.0),
  -- RD CONGO
  ('aaa00011-0000-0000-0000-000000000002', 'Joël Kiassumbua',     'Kiassumbua', 'GK',  'RD Congo',      1,  5.0),
  ('aaa00011-0000-0000-0000-000000000002', 'Cédric Bakambu',      'Bakambu',    'FWD', 'RD Congo',      9,  7.0),
  ('aaa00011-0000-0000-0000-000000000002', 'Chancel Mbemba',      'Mbemba',     'DEF', 'RD Congo',      5,  6.5),
  -- UZBEKISTÁN
  ('aaa00011-0000-0000-0000-000000000003', 'Ulugbek Nishonov',    'Nishonov',   'GK',  'Uzbekistán',    1,  5.0),
  ('aaa00011-0000-0000-0000-000000000003', 'Eldor Shomurodov',    'Shomurodov', 'FWD', 'Uzbekistán',    9,  7.5),
  ('aaa00011-0000-0000-0000-000000000003', 'Jaloliddin Masharipov','Masharipov','MID', 'Uzbekistán',    10, 6.5),
  -- COLOMBIA
  ('aaa00011-0000-0000-0000-000000000004', 'Camilo Vargas',       'C. Vargas',  'GK',  'Colombia',      1,  7.0),
  ('aaa00011-0000-0000-0000-000000000004', 'Luis Díaz',           'L. Díaz',    'FWD', 'Colombia',      7,  12.0),
  ('aaa00011-0000-0000-0000-000000000004', 'James Rodríguez',     'James',      'MID', 'Colombia',      10, 10.5),
  ('aaa00011-0000-0000-0000-000000000004', 'Jhon Jader Durán',    'J. Durán',   'FWD', 'Colombia',      9,  9.5),
  ('aaa00011-0000-0000-0000-000000000004', 'Davinson Sánchez',    'D. Sánchez', 'DEF', 'Colombia',      2,  7.5),

  -- GRUPO L: INGLATERRA
  ('aaa00012-0000-0000-0000-000000000001', 'Jordan Pickford',     'Pickford',   'GK',  'Inglaterra',    1,  8.0),
  ('aaa00012-0000-0000-0000-000000000001', 'Harry Kane',          'Kane',       'FWD', 'Inglaterra',    9,  13.0),
  ('aaa00012-0000-0000-0000-000000000001', 'Jude Bellingham',     'Bellingham', 'MID', 'Inglaterra',    22, 14.0),
  ('aaa00012-0000-0000-0000-000000000001', 'Phil Foden',          'Foden',      'MID', 'Inglaterra',    47, 10.5),
  ('aaa00012-0000-0000-0000-000000000001', 'Bukayo Saka',         'Saka',       'FWD', 'Inglaterra',    17, 11.5),
  -- CROACIA
  ('aaa00012-0000-0000-0000-000000000002', 'Dominik Livaković',   'Livaković',  'GK',  'Croacia',       1,  8.0),
  ('aaa00012-0000-0000-0000-000000000002', 'Luka Modrić',         'Modrić',     'MID', 'Croacia',       10, 11.0),
  ('aaa00012-0000-0000-0000-000000000002', 'Ivan Perišić',        'Perišić',    'FWD', 'Croacia',       4,  8.5),
  ('aaa00012-0000-0000-0000-000000000002', 'Marcelo Brozović',    'Brozović',   'MID', 'Croacia',       11, 8.5),
  -- GHANA
  ('aaa00012-0000-0000-0000-000000000003', 'Lawrence Ati-Zigi',   'Ati-Zigi',   'GK',  'Ghana',         1,  6.0),
  ('aaa00012-0000-0000-0000-000000000003', 'Jordan Ayew',         'J. Ayew',    'FWD', 'Ghana',         10, 7.5),
  ('aaa00012-0000-0000-0000-000000000003', 'Mohammed Kudus',      'Kudus',      'MID', 'Ghana',         20, 9.5),
  ('aaa00012-0000-0000-0000-000000000003', 'Thomas Partey',       'Partey',     'MID', 'Ghana',         5,  9.0),
  -- PANAMÁ
  ('aaa00012-0000-0000-0000-000000000004', 'Luis Mejía',          'Mejía',      'GK',  'Panamá',        1,  5.5),
  ('aaa00012-0000-0000-0000-000000000004', 'Ismael Díaz',         'I. Díaz',    'FWD', 'Panamá',        9,  7.0),
  ('aaa00012-0000-0000-0000-000000000004', 'Adalberto Carrasquilla','Carrasquilla','MID','Panamá',       8,  6.5);

-- ============================================================
-- 104 PARTIDOS - FIXTURE OFICIAL FIFA MUNDIAL 2026
-- Horarios en UTC (España: UTC+2 en verano)
-- Formato: YYYY-MM-DD HH:MM:SS+00
-- ============================================================

-- -------------------------------------------------------
-- FASE DE GRUPOS - JORNADA 1 (11–17 junio 2026)
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  -- Grupo A
  ('33333333-0000-0000-0000-000000000001', 'aaa00001-0000-0000-0000-000000000001', 'aaa00001-0000-0000-0000-000000000002', '2026-06-11 19:00:00+00', 'Ciudad de México', 'group', 'finished', 1),
  ('33333333-0000-0000-0000-000000000002', 'aaa00001-0000-0000-0000-000000000003', 'aaa00001-0000-0000-0000-000000000004', '2026-06-12 02:00:00+00', 'Guadalajara',      'group', 'finished', 1),
  -- Grupo B
  ('33333333-0000-0000-0000-000000000003', 'aaa00002-0000-0000-0000-000000000001', 'aaa00002-0000-0000-0000-000000000002', '2026-06-12 19:00:00+00', 'Toronto',          'group', 'finished', 1),
  ('33333333-0000-0000-0000-000000000004', 'aaa00002-0000-0000-0000-000000000003', 'aaa00002-0000-0000-0000-000000000004', '2026-06-13 19:00:00+00', 'Vancouver',        'group', 'finished', 1),
  -- Grupo C
  ('33333333-0000-0000-0000-000000000005', 'aaa00003-0000-0000-0000-000000000001', 'aaa00003-0000-0000-0000-000000000002', '2026-06-14 22:00:00+00', 'Nueva York/NJ',    'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000006', 'aaa00003-0000-0000-0000-000000000003', 'aaa00003-0000-0000-0000-000000000004', '2026-06-14 01:00:00+00', 'Boston',           'group', 'scheduled', 1),
  -- Grupo D
  ('33333333-0000-0000-0000-000000000007', 'aaa00004-0000-0000-0000-000000000001', 'aaa00004-0000-0000-0000-000000000002', '2026-06-13 01:00:00+00', 'Los Ángeles',      'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000008', 'aaa00004-0000-0000-0000-000000000003', 'aaa00004-0000-0000-0000-000000000004', '2026-06-14 04:00:00+00', 'San Francisco',    'group', 'scheduled', 1),
  -- Grupo E
  ('33333333-0000-0000-0000-000000000009', 'aaa00005-0000-0000-0000-000000000001', 'aaa00005-0000-0000-0000-000000000002', '2026-06-14 17:00:00+00', 'Houston',          'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000010', 'aaa00005-0000-0000-0000-000000000003', 'aaa00005-0000-0000-0000-000000000004', '2026-06-15 01:00:00+00', 'Filadelfia',       'group', 'scheduled', 1),
  -- Grupo F
  ('33333333-0000-0000-0000-000000000011', 'aaa00006-0000-0000-0000-000000000001', 'aaa00006-0000-0000-0000-000000000002', '2026-06-14 20:00:00+00', 'Dallas',           'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000012', 'aaa00006-0000-0000-0000-000000000003', 'aaa00006-0000-0000-0000-000000000004', '2026-06-15 04:00:00+00', 'Monterrey',        'group', 'scheduled', 1),
  -- Grupo G
  ('33333333-0000-0000-0000-000000000013', 'aaa00007-0000-0000-0000-000000000001', 'aaa00007-0000-0000-0000-000000000002', '2026-06-15 19:00:00+00', 'Seattle',          'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000014', 'aaa00007-0000-0000-0000-000000000003', 'aaa00007-0000-0000-0000-000000000004', '2026-06-16 01:00:00+00', 'Los Ángeles',      'group', 'scheduled', 1),
  -- Grupo H
  ('33333333-0000-0000-0000-000000000015', 'aaa00008-0000-0000-0000-000000000001', 'aaa00008-0000-0000-0000-000000000002', '2026-06-15 16:00:00+00', 'Atlanta',          'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000016', 'aaa00008-0000-0000-0000-000000000003', 'aaa00008-0000-0000-0000-000000000004', '2026-06-15 22:00:00+00', 'Miami',            'group', 'scheduled', 1),
  -- Grupo I
  ('33333333-0000-0000-0000-000000000017', 'aaa00009-0000-0000-0000-000000000001', 'aaa00009-0000-0000-0000-000000000002', '2026-06-16 19:00:00+00', 'Nueva York/NJ',    'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000018', 'aaa00009-0000-0000-0000-000000000003', 'aaa00009-0000-0000-0000-000000000004', '2026-06-17 01:00:00+00', 'Boston',           'group', 'scheduled', 1),
  -- Grupo J
  ('33333333-0000-0000-0000-000000000019', 'aaa00010-0000-0000-0000-000000000001', 'aaa00010-0000-0000-0000-000000000002', '2026-06-17 01:00:00+00', 'Kansas City',      'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000020', 'aaa00010-0000-0000-0000-000000000003', 'aaa00010-0000-0000-0000-000000000004', '2026-06-17 20:00:00+00', 'San Francisco',    'group', 'scheduled', 1),
  -- Grupo K
  ('33333333-0000-0000-0000-000000000021', 'aaa00011-0000-0000-0000-000000000001', 'aaa00011-0000-0000-0000-000000000002', '2026-06-17 17:00:00+00', 'Houston',          'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000022', 'aaa00011-0000-0000-0000-000000000003', 'aaa00011-0000-0000-0000-000000000004', '2026-06-18 02:00:00+00', 'Guadalajara',      'group', 'scheduled', 1),
  -- Grupo L
  ('33333333-0000-0000-0000-000000000023', 'aaa00012-0000-0000-0000-000000000001', 'aaa00012-0000-0000-0000-000000000002', '2026-06-17 20:00:00+00', 'Dallas',           'group', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000024', 'aaa00012-0000-0000-0000-000000000003', 'aaa00012-0000-0000-0000-000000000004', '2026-06-18 00:00:00+00', 'Toronto',          'group', 'scheduled', 1);

-- -------------------------------------------------------
-- FASE DE GRUPOS - JORNADA 2 (18–24 junio 2026)
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  -- Grupo A
  ('33333333-0000-0000-0000-000000000025', 'aaa00001-0000-0000-0000-000000000001', 'aaa00001-0000-0000-0000-000000000003', '2026-06-18 16:00:00+00', 'Atlanta',          'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000026', 'aaa00001-0000-0000-0000-000000000002', 'aaa00001-0000-0000-0000-000000000004', '2026-06-18 19:00:00+00', 'Los Ángeles',      'group', 'scheduled', 2),
  -- Grupo B
  ('33333333-0000-0000-0000-000000000027', 'aaa00002-0000-0000-0000-000000000001', 'aaa00002-0000-0000-0000-000000000003', '2026-06-19 19:00:00+00', 'Vancouver',        'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000028', 'aaa00002-0000-0000-0000-000000000002', 'aaa00002-0000-0000-0000-000000000004', '2026-06-19 22:00:00+00', 'San Francisco',    'group', 'scheduled', 2),
  -- Grupo C
  ('33333333-0000-0000-0000-000000000029', 'aaa00003-0000-0000-0000-000000000001', 'aaa00003-0000-0000-0000-000000000003', '2026-06-20 22:00:00+00', 'Filadelfia',       'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000030', 'aaa00003-0000-0000-0000-000000000002', 'aaa00003-0000-0000-0000-000000000004', '2026-06-20 00:00:00+00', 'Miami',            'group', 'scheduled', 2),
  -- Grupo D
  ('33333333-0000-0000-0000-000000000031', 'aaa00004-0000-0000-0000-000000000001', 'aaa00004-0000-0000-0000-000000000003', '2026-06-20 20:00:00+00', 'Seattle',          'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000032', 'aaa00004-0000-0000-0000-000000000002', 'aaa00004-0000-0000-0000-000000000004', '2026-06-20 04:00:00+00', 'Toronto',          'group', 'scheduled', 2),
  -- Grupo E
  ('33333333-0000-0000-0000-000000000033', 'aaa00005-0000-0000-0000-000000000001', 'aaa00005-0000-0000-0000-000000000003', '2026-06-21 00:00:00+00', 'Kansas City',      'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000034', 'aaa00005-0000-0000-0000-000000000002', 'aaa00005-0000-0000-0000-000000000004', '2026-06-21 17:00:00+00', 'Monterrey',        'group', 'scheduled', 2),
  -- Grupo F
  ('33333333-0000-0000-0000-000000000035', 'aaa00006-0000-0000-0000-000000000001', 'aaa00006-0000-0000-0000-000000000003', '2026-06-21 19:00:00+00', 'Dallas',           'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000036', 'aaa00006-0000-0000-0000-000000000002', 'aaa00006-0000-0000-0000-000000000004', '2026-06-22 01:00:00+00', 'Monterrey',        'group', 'scheduled', 2),
  -- Grupo G
  ('33333333-0000-0000-0000-000000000037', 'aaa00007-0000-0000-0000-000000000001', 'aaa00007-0000-0000-0000-000000000003', '2026-06-22 01:00:00+00', 'Vancouver',        'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000038', 'aaa00007-0000-0000-0000-000000000002', 'aaa00007-0000-0000-0000-000000000004', '2026-06-21 22:00:00+00', 'Miami',            'group', 'scheduled', 2),
  -- Grupo H
  ('33333333-0000-0000-0000-000000000039', 'aaa00008-0000-0000-0000-000000000001', 'aaa00008-0000-0000-0000-000000000003', '2026-06-22 22:00:00+00', 'Boston',           'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000040', 'aaa00008-0000-0000-0000-000000000002', 'aaa00008-0000-0000-0000-000000000004', '2026-06-23 01:00:00+00', 'Nueva York/NJ',    'group', 'scheduled', 2),
  -- Grupo I
  ('33333333-0000-0000-0000-000000000041', 'aaa00009-0000-0000-0000-000000000001', 'aaa00009-0000-0000-0000-000000000003', '2026-06-22 19:00:00+00', 'Filadelfia',       'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000042', 'aaa00009-0000-0000-0000-000000000002', 'aaa00009-0000-0000-0000-000000000004', '2026-06-23 05:00:00+00', 'Kansas City',      'group', 'scheduled', 2),
  -- Grupo J
  ('33333333-0000-0000-0000-000000000043', 'aaa00010-0000-0000-0000-000000000001', 'aaa00010-0000-0000-0000-000000000003', '2026-06-23 22:00:00+00', 'Dallas',           'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000044', 'aaa00010-0000-0000-0000-000000000002', 'aaa00010-0000-0000-0000-000000000004', '2026-06-24 01:00:00+00', 'San Francisco',    'group', 'scheduled', 2),
  -- Grupo K
  ('33333333-0000-0000-0000-000000000045', 'aaa00011-0000-0000-0000-000000000001', 'aaa00011-0000-0000-0000-000000000003', '2026-06-23 19:00:00+00', 'Houston',          'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000046', 'aaa00011-0000-0000-0000-000000000002', 'aaa00011-0000-0000-0000-000000000004', '2026-06-24 02:00:00+00', 'Toronto',          'group', 'scheduled', 2),
  -- Grupo L
  ('33333333-0000-0000-0000-000000000047', 'aaa00012-0000-0000-0000-000000000001', 'aaa00012-0000-0000-0000-000000000003', '2026-06-24 22:00:00+00', 'Atlanta',          'group', 'scheduled', 2),
  ('33333333-0000-0000-0000-000000000048', 'aaa00012-0000-0000-0000-000000000002', 'aaa00012-0000-0000-0000-000000000004', '2026-06-25 01:00:00+00', 'Los Ángeles',      'group', 'scheduled', 2);

-- -------------------------------------------------------
-- FASE DE GRUPOS - JORNADA 3 (24–28 junio 2026)
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  -- Grupo A (simultáneos)
  ('33333333-0000-0000-0000-000000000049', 'aaa00001-0000-0000-0000-000000000001', 'aaa00001-0000-0000-0000-000000000004', '2026-06-25 01:00:00+00', 'Ciudad de México',  'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000050', 'aaa00001-0000-0000-0000-000000000002', 'aaa00001-0000-0000-0000-000000000003', '2026-06-25 01:00:00+00', 'Monterrey',         'group', 'scheduled', 3),
  -- Grupo B
  ('33333333-0000-0000-0000-000000000051', 'aaa00002-0000-0000-0000-000000000001', 'aaa00002-0000-0000-0000-000000000004', '2026-06-24 19:00:00+00', 'Vancouver',         'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000052', 'aaa00002-0000-0000-0000-000000000002', 'aaa00002-0000-0000-0000-000000000003', '2026-06-24 19:00:00+00', 'Seattle',           'group', 'scheduled', 3),
  -- Grupo C
  ('33333333-0000-0000-0000-000000000053', 'aaa00003-0000-0000-0000-000000000001', 'aaa00003-0000-0000-0000-000000000004', '2026-06-25 22:00:00+00', 'Boston',            'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000054', 'aaa00003-0000-0000-0000-000000000002', 'aaa00003-0000-0000-0000-000000000003', '2026-06-25 22:00:00+00', 'Atlanta',           'group', 'scheduled', 3),
  -- Grupo D
  ('33333333-0000-0000-0000-000000000055', 'aaa00004-0000-0000-0000-000000000001', 'aaa00004-0000-0000-0000-000000000004', '2026-06-25 20:00:00+00', 'Filadelfia',        'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000056', 'aaa00004-0000-0000-0000-000000000002', 'aaa00004-0000-0000-0000-000000000003', '2026-06-25 20:00:00+00', 'Nueva York/NJ',     'group', 'scheduled', 3),
  -- Grupo E
  ('33333333-0000-0000-0000-000000000057', 'aaa00005-0000-0000-0000-000000000001', 'aaa00005-0000-0000-0000-000000000004', '2026-06-25 19:00:00+00', 'Dallas',            'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000058', 'aaa00005-0000-0000-0000-000000000002', 'aaa00005-0000-0000-0000-000000000003', '2026-06-25 19:00:00+00', 'Houston',           'group', 'scheduled', 3),
  -- Grupo F
  ('33333333-0000-0000-0000-000000000059', 'aaa00006-0000-0000-0000-000000000001', 'aaa00006-0000-0000-0000-000000000004', '2026-06-26 02:00:00+00', 'Los Ángeles',       'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000060', 'aaa00006-0000-0000-0000-000000000002', 'aaa00006-0000-0000-0000-000000000003', '2026-06-26 02:00:00+00', 'San Francisco',     'group', 'scheduled', 3),
  -- Grupo G
  ('33333333-0000-0000-0000-000000000061', 'aaa00007-0000-0000-0000-000000000001', 'aaa00007-0000-0000-0000-000000000004', '2026-06-27 03:00:00+00', 'Seattle',           'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000062', 'aaa00007-0000-0000-0000-000000000002', 'aaa00007-0000-0000-0000-000000000003', '2026-06-27 03:00:00+00', 'Los Ángeles',       'group', 'scheduled', 3),
  -- Grupo H
  ('33333333-0000-0000-0000-000000000063', 'aaa00008-0000-0000-0000-000000000001', 'aaa00008-0000-0000-0000-000000000004', '2026-06-27 01:00:00+00', 'Atlanta',           'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000064', 'aaa00008-0000-0000-0000-000000000002', 'aaa00008-0000-0000-0000-000000000003', '2026-06-27 01:00:00+00', 'Guadalajara',       'group', 'scheduled', 3),
  -- Grupo I
  ('33333333-0000-0000-0000-000000000065', 'aaa00009-0000-0000-0000-000000000001', 'aaa00009-0000-0000-0000-000000000004', '2026-06-26 19:00:00+00', 'Boston',            'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000066', 'aaa00009-0000-0000-0000-000000000002', 'aaa00009-0000-0000-0000-000000000003', '2026-06-26 19:00:00+00', 'Toronto',           'group', 'scheduled', 3),
  -- Grupo J
  ('33333333-0000-0000-0000-000000000067', 'aaa00010-0000-0000-0000-000000000001', 'aaa00010-0000-0000-0000-000000000004', '2026-06-27 22:00:00+00', 'Miami',             'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000068', 'aaa00010-0000-0000-0000-000000000002', 'aaa00010-0000-0000-0000-000000000003', '2026-06-27 22:00:00+00', 'Kansas City',       'group', 'scheduled', 3),
  -- Grupo K
  ('33333333-0000-0000-0000-000000000069', 'aaa00011-0000-0000-0000-000000000001', 'aaa00011-0000-0000-0000-000000000004', '2026-06-28 01:00:00+00', 'Dallas',            'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000070', 'aaa00011-0000-0000-0000-000000000002', 'aaa00011-0000-0000-0000-000000000003', '2026-06-28 01:00:00+00', 'Guadalajara',       'group', 'scheduled', 3),
  -- Grupo L
  ('33333333-0000-0000-0000-000000000071', 'aaa00012-0000-0000-0000-000000000001', 'aaa00012-0000-0000-0000-000000000004', '2026-06-27 21:00:00+00', 'Nueva York/NJ',     'group', 'scheduled', 3),
  ('33333333-0000-0000-0000-000000000072', 'aaa00012-0000-0000-0000-000000000002', 'aaa00012-0000-0000-0000-000000000003', '2026-06-27 21:00:00+00', 'Filadelfia',        'group', 'scheduled', 3);

-- -------------------------------------------------------
-- RONDA DE 32 (28 jun – 4 jul 2026) — 16 partidos
-- Clasificados TBD (equipos reales se actualizarán via API)
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  ('33333333-0000-0000-0000-000000000073', NULL, NULL, '2026-06-28 19:00:00+00', 'Los Ángeles',    'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000074', NULL, NULL, '2026-06-29 20:30:00+00', 'Boston',         'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000075', NULL, NULL, '2026-06-30 01:00:00+00', 'Monterrey',      'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000076', NULL, NULL, '2026-06-29 17:00:00+00', 'Houston',        'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000077', NULL, NULL, '2026-06-30 21:00:00+00', 'Nueva York/NJ',  'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000078', NULL, NULL, '2026-06-30 17:00:00+00', 'Dallas',         'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000079', NULL, NULL, '2026-07-01 01:00:00+00', 'Ciudad de México','round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000080', NULL, NULL, '2026-07-01 16:00:00+00', 'Atlanta',        'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000081', NULL, NULL, '2026-07-02 00:00:00+00', 'San Francisco',  'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000082', NULL, NULL, '2026-07-01 20:00:00+00', 'Seattle',        'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000083', NULL, NULL, '2026-07-02 23:00:00+00', 'Toronto',        'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000084', NULL, NULL, '2026-07-02 19:00:00+00', 'Los Ángeles',    'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000085', NULL, NULL, '2026-07-03 03:00:00+00', 'Vancouver',      'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000086', NULL, NULL, '2026-07-03 22:00:00+00', 'Miami',          'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000087', NULL, NULL, '2026-07-04 01:30:00+00', 'Kansas City',    'round_of_32', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000088', NULL, NULL, '2026-07-03 18:00:00+00', 'Dallas',         'round_of_32', 'scheduled', 1);

-- -------------------------------------------------------
-- OCTAVOS DE FINAL (4–7 jul 2026) — 8 partidos
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  ('33333333-0000-0000-0000-000000000089', NULL, NULL, '2026-07-04 17:00:00+00', 'Houston',        'round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000090', NULL, NULL, '2026-07-04 21:00:00+00', 'Filadelfia',     'round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000091', NULL, NULL, '2026-07-05 20:00:00+00', 'Nueva York/NJ',  'round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000092', NULL, NULL, '2026-07-06 00:00:00+00', 'Ciudad de México','round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000093', NULL, NULL, '2026-07-06 19:00:00+00', 'Dallas',         'round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000094', NULL, NULL, '2026-07-07 00:00:00+00', 'Seattle',        'round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000095', NULL, NULL, '2026-07-07 16:00:00+00', 'Atlanta',        'round_of_16', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000096', NULL, NULL, '2026-07-07 20:00:00+00', 'Vancouver',      'round_of_16', 'scheduled', 1);

-- -------------------------------------------------------
-- CUARTOS DE FINAL (9–12 jul 2026) — 4 partidos
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  ('33333333-0000-0000-0000-000000000097', NULL, NULL, '2026-07-09 20:00:00+00', 'Boston',         'quarter_final', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000098', NULL, NULL, '2026-07-10 19:00:00+00', 'Los Ángeles',    'quarter_final', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000099', NULL, NULL, '2026-07-11 21:00:00+00', 'Miami',          'quarter_final', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000100', NULL, NULL, '2026-07-12 01:00:00+00', 'Kansas City',    'quarter_final', 'scheduled', 1);

-- -------------------------------------------------------
-- SEMIFINALES (14–15 jul 2026) — 2 partidos
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  ('33333333-0000-0000-0000-000000000101', NULL, NULL, '2026-07-14 19:00:00+00', 'Dallas',         'semi_final', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000102', NULL, NULL, '2026-07-15 19:00:00+00', 'Atlanta',        'semi_final', 'scheduled', 1);

-- -------------------------------------------------------
-- TERCER PUESTO Y FINAL
-- -------------------------------------------------------
INSERT INTO public.matches (id, home_team_id, away_team_id, match_date, venue, stage, status, matchday) VALUES
  ('33333333-0000-0000-0000-000000000103', NULL, NULL, '2026-07-18 21:00:00+00', 'Miami',          'third_place', 'scheduled', 1),
  ('33333333-0000-0000-0000-000000000104', NULL, NULL, '2026-07-19 19:00:00+00', 'Nueva York/NJ',  'final',       'scheduled', 1);

-- -------------------------------------------------------
-- RESULTADOS REALES - JORNADA 1 ya jugada
-- (Actualiza con los resultados reales)
-- -------------------------------------------------------
UPDATE public.matches SET home_score = 1, away_score = 0, status = 'finished' WHERE id = '33333333-0000-0000-0000-000000000001'; -- México 1-0 Sudáfrica
UPDATE public.matches SET home_score = 3, away_score = 0, status = 'finished' WHERE id = '33333333-0000-0000-0000-000000000002'; -- Corea 3-0 Rep. Checa
UPDATE public.matches SET home_score = 0, away_score = 0, status = 'finished' WHERE id = '33333333-0000-0000-0000-000000000003'; -- Canadá 0-0 Bosnia
UPDATE public.matches SET home_score = 1, away_score = 2, status = 'finished' WHERE id = '33333333-0000-0000-0000-000000000004'; -- Qatar 1-2 Suiza
