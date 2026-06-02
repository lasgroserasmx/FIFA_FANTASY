# -*- coding: utf-8 -*-
import re, sys, unicodedata
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

text = open(r'C:\FIFA_Fantasy_Challenge\tmp_squads_clean.txt', encoding='utf-8').read()

team_ids = {
    'México': 'aaa00001-0000-0000-0000-000000000001',
    'Sudáfrica': 'aaa00001-0000-0000-0000-000000000002',
    'Corea del Sur': 'aaa00001-0000-0000-0000-000000000003',
    'Rep. Checa': 'aaa00001-0000-0000-0000-000000000004',
    'Canadá': 'aaa00002-0000-0000-0000-000000000001',
    'Bosnia-Herzeg.': 'aaa00002-0000-0000-0000-000000000002',
    'Qatar': 'aaa00002-0000-0000-0000-000000000003',
    'Suiza': 'aaa00002-0000-0000-0000-000000000004',
    'Brasil': 'aaa00003-0000-0000-0000-000000000001',
    'Marruecos': 'aaa00003-0000-0000-0000-000000000002',
    'Haití': 'aaa00003-0000-0000-0000-000000000003',
    'Escocia': 'aaa00003-0000-0000-0000-000000000004',
    'Estados Unidos': 'aaa00004-0000-0000-0000-000000000001',
    'Paraguay': 'aaa00004-0000-0000-0000-000000000002',
    'Australia': 'aaa00004-0000-0000-0000-000000000003',
    'Turquía': 'aaa00004-0000-0000-0000-000000000004',
    'Alemania': 'aaa00005-0000-0000-0000-000000000001',
    'Curazao': 'aaa00005-0000-0000-0000-000000000002',
    'Costa de Marfil': 'aaa00005-0000-0000-0000-000000000003',
    'Ecuador': 'aaa00005-0000-0000-0000-000000000004',
    'Países Bajos': 'aaa00006-0000-0000-0000-000000000001',
    'Japón': 'aaa00006-0000-0000-0000-000000000002',
    'Suecia': 'aaa00006-0000-0000-0000-000000000003',
    'Túnez': 'aaa00006-0000-0000-0000-000000000004',
    'Bélgica': 'aaa00007-0000-0000-0000-000000000001',
    'Egipto': 'aaa00007-0000-0000-0000-000000000002',
    'Irán': 'aaa00007-0000-0000-0000-000000000003',
    'Nueva Zelanda': 'aaa00007-0000-0000-0000-000000000004',
    'España': 'aaa00008-0000-0000-0000-000000000001',
    'Cabo Verde': 'aaa00008-0000-0000-0000-000000000002',
    'Arabia Saudita': 'aaa00008-0000-0000-0000-000000000003',
    'Uruguay': 'aaa00008-0000-0000-0000-000000000004',
    'Francia': 'aaa00009-0000-0000-0000-000000000001',
    'Senegal': 'aaa00009-0000-0000-0000-000000000002',
    'Iraq': 'aaa00009-0000-0000-0000-000000000003',
    'Noruega': 'aaa00009-0000-0000-0000-000000000004',
    'Argentina': 'aaa00010-0000-0000-0000-000000000001',
    'Argelia': 'aaa00010-0000-0000-0000-000000000002',
    'Austria': 'aaa00010-0000-0000-0000-000000000003',
    'Jordania': 'aaa00010-0000-0000-0000-000000000004',
    'Portugal': 'aaa00011-0000-0000-0000-000000000001',
    'RD Congo': 'aaa00011-0000-0000-0000-000000000002',
    'Uzbekistán': 'aaa00011-0000-0000-0000-000000000003',
    'Colombia': 'aaa00011-0000-0000-0000-000000000004',
    'Inglaterra': 'aaa00012-0000-0000-0000-000000000001',
    'Croacia': 'aaa00012-0000-0000-0000-000000000002',
    'Ghana': 'aaa00012-0000-0000-0000-000000000003',
    'Panamá': 'aaa00012-0000-0000-0000-000000000004',
}

star_prices = {
    'Kylian Mbappé': 15.0, 'Erling Haaland': 15.0, 'Lionel Messi': 15.0,
    'Cristiano Ronaldo': 14.0, 'Jude Bellingham': 14.0, 'Kevin De Bruyne': 13.5,
    'Vinícius Jr.': 13.0, 'Vinicius Jr.': 13.0, 'Harry Kane': 13.0,
    'Mohamed Salah': 13.5, 'Son Heung-min': 11.5, 'Lamine Yamal': 12.5,
    'Pedri': 11.0, 'Darwin Núñez': 12.0, 'Federico Valverde': 11.5,
    'Achraf Hakimi': 11.0, 'Virgil van Dijk': 10.5, 'Cody Gakpo': 10.5,
    'Alphonso Davies': 11.0, 'Jonathan David': 11.5, 'Florian Wirtz': 11.0,
    'Martin Ødegaard': 12.5, 'Riyad Mahrez': 10.0, 'Luis Díaz': 12.0,
    'James Rodríguez': 10.5, 'Luka Modrić': 11.0, 'Bruno Fernandes': 11.5,
    'Rafael Leão': 10.5, 'Antoine Griezmann': 11.0, 'Sadio Mané': 11.0,
    'Hakan Çalhanoğlu': 10.0, 'Arda Güler': 10.0, 'Kenan Yıldız': 9.0,
    'Granit Xhaka': 9.0, 'Moisés Caicedo': 10.5, 'Jamal Musiala': 11.0,
    'Kai Havertz': 9.5, 'Amad Diallo': 9.0, 'Simon Adingra': 9.0,
    'Scott McTominay': 8.5, 'Andy Robertson': 9.0, 'Billy Gilmour': 8.0,
    'Christian Pulisic': 11.0, 'Folarin Balogun': 9.0, 'Miguel Almirón': 9.0,
    'Marcel Sabitzer': 9.0, 'David Alaba': 9.5, 'Lautaro Martínez': 11.0,
    'Julián Álvarez': 11.5, 'Mehdi Taremi': 9.5, 'Romelu Lukaku': 11.0,
    'Omar Marmoush': 10.5, 'Youssef En-Nesyri': 9.0, 'Kendry Páez': 9.0,
    'Bukayo Saka': 11.5, 'Phil Foden': 10.5, 'Raphinha': 10.5,
    'Neymar': 11.0, 'Ismaïla Sarr': 9.0, 'Alexander Isak': 11.0,
    'Dejan Kulusevski': 9.5, 'Yassine Bounou': 8.5, 'Sofyan Amrabat': 8.0,
}

def get_price(pos, name):
    if name in star_prices:
        return star_prices[name]
    return {'GK': 5.5, 'DEF': 6.0, 'MID': 7.0, 'FWD': 7.5}.get(pos, 6.0)

def esc(s):
    return s.replace("'", "''")

def short_name(name):
    name = re.sub(r'\s*\(c\)\s*', '', name).strip()
    parts = name.split()
    if len(parts) == 1:
        return name[:20]
    last = parts[-1]
    if len(last) <= 2 and len(parts) >= 3:
        return (parts[-2] + ' ' + last)[:20]
    return last[:20]

seen = set()
teams_done = set()   # skip a team once fully processed
players = []
sections = re.split(r'###\s+(.+?)\s*\(Coach:', text)

current_team = None
for i, part in enumerate(sections):
    if i % 2 == 1:
        team_raw = part.strip()
        current_team = None
        for key in team_ids:
            if key.lower() in team_raw.lower() or team_raw.lower() in key.lower():
                if key in teams_done:
                    current_team = None   # skip duplicate section
                else:
                    current_team = key
                break
    elif i > 0 and current_team:
        teams_done.add(current_team)
        for line in part.split('\n'):
            m = re.match(r'\|\s*([—\d]+)\s*\|\s*(GK|DEF|MID|FWD)\s*\|\s*(.+?)\s*\|', line)
            if m:
                num_str = m.group(1).strip()
                pos = m.group(2).strip()
                raw_name = m.group(3).strip()
                name = re.sub(r'\s*\(c\)\s*', '', raw_name).strip()
                # Normalize key: strip accents for dedup comparison
                def norm(s):
                    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
                key = (norm(current_team), norm(name))
                if key in seen:
                    continue
                seen.add(key)
                shirt = None if num_str == '—' else int(num_str)
                players.append({
                    'team_id': team_ids[current_team],
                    'team': current_team,
                    'name': name,
                    'short': short_name(name),
                    'pos': pos,
                    'shirt': shirt,
                    'price': get_price(pos, name),
                })

from collections import Counter
counts = Counter(p['team'] for p in players)
print(f'Total: {len(players)} jugadores en {len(counts)} equipos', file=sys.stderr)
for t, c in sorted(counts.items()):
    print(f'  {t}: {c}', file=sys.stderr)

players_sorted = sorted(players, key=lambda p: (p['team'], p['pos'], p['name']))

lines = [
    '-- ============================================================',
    '-- MIGRACIÓN 004 - Plantillas completas Mundial 2026',
    f'-- {len(players)} jugadores reales (26 por equipo aprox)',
    '-- ============================================================',
    '',
    '-- Limpiar jugadores anteriores (mantener equipos y partidos)',
    'TRUNCATE public.player_match_stats CASCADE;',
    'TRUNCATE public.fantasy_rosters CASCADE;',
    'TRUNCATE public.fantasy_points CASCADE;',
    'TRUNCATE public.players CASCADE;',
    '',
    'INSERT INTO public.players (team_id, name, short_name, position, nationality, shirt_number, price) VALUES',
]

rows = []
for p in players_sorted:
    shirt = 'NULL' if p['shirt'] is None else str(p['shirt'])
    nat = esc(p['team'])
    rows.append(
        f"  ('{p['team_id']}', '{esc(p['name'])}', '{esc(p['short'])}', '{p['pos']}', '{nat}', {shirt}, {p['price']})"
    )

lines.append(',\n'.join(rows) + ';')
sql = '\n'.join(lines)
out = r'C:\FIFA_Fantasy_Challenge\supabase\migrations\004_players_full.sql'
open(out, 'w', encoding='utf-8').write(sql)
print(f'SQL escrito: {len(sql):,} bytes', file=sys.stderr)
