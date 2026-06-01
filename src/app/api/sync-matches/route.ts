// ============================================================
// POST /api/sync-matches
// Sincroniza partidos en vivo desde API-Football → Supabase
// Llamar desde un cron job cada 60 segundos durante partidos
// o manualmente desde el panel de admin.
// Protegido con CRON_SECRET para evitar accesos no autorizados.
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLiveFixtures, getAllFixtures, mapAPIStatus, getFixtureEvents } from '@/lib/api-football'

// Cliente admin (service role) — solo en servidor
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// Mapa: short_name del equipo → UUID en Supabase
// Se construye dinámicamente consultando la tabla teams
async function buildTeamMap(supabase: ReturnType<typeof getAdminClient>) {
  const { data } = await supabase.from('teams').select('id, short_name, name')
  const map = new Map<string, string>()
  for (const t of data ?? []) {
    map.set(t.name.toLowerCase(), t.id)
    map.set(t.short_name.toLowerCase(), t.id)
  }
  return map
}

export async function POST(request: Request) {
  // Verificar secret para proteger el endpoint
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getAdminClient()
    const teamMap = await buildTeamMap(supabase)

    // ¿Sincronización completa o solo en vivo?
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') ?? 'live' // 'live' | 'all'

    const fixtures = mode === 'all' ? await getAllFixtures() : await getLiveFixtures()

    let updated = 0
    let eventsAdded = 0

    for (const f of fixtures) {
      const homeId = teamMap.get(f.teams.home.name.toLowerCase())
      const awayId = teamMap.get(f.teams.away.name.toLowerCase())
      const status = mapAPIStatus(f.fixture.status.short)

      // Buscar el partido en Supabase por equipos y fecha aproximada
      const matchDate = new Date(f.fixture.date)
      const dayStart = new Date(matchDate)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(matchDate)
      dayEnd.setHours(23, 59, 59, 999)

      let matchQuery = supabase
        .from('matches')
        .select('id')
        .gte('match_date', dayStart.toISOString())
        .lte('match_date', dayEnd.toISOString())

      if (homeId) matchQuery = matchQuery.eq('home_team_id', homeId)
      if (awayId) matchQuery = matchQuery.eq('away_team_id', awayId)

      const { data: matchRows } = await matchQuery.limit(1)
      const matchId = matchRows?.[0]?.id

      if (!matchId) continue // partido no encontrado en DB (fases eliminatorias aún sin equipos)

      // Actualizar resultado y status
      const { error } = await supabase
        .from('matches')
        .update({
          home_score: f.goals.home ?? null,
          away_score: f.goals.away ?? null,
          status,
        })
        .eq('id', matchId)

      if (!error) updated++

      // Si el partido está en vivo o terminó, sincronizar eventos
      if (status === 'live' || status === 'finished') {
        const events = await getFixtureEvents(f.fixture.id)
        for (const ev of events) {
          if (ev.type !== 'Goal') continue

          const teamId = teamMap.get(ev.team.name.toLowerCase())
          if (!teamId) continue

          // Buscar jugador en Supabase por nombre aproximado
          const { data: playerRows } = await supabase
            .from('players')
            .select('id')
            .eq('team_id', teamId)
            .ilike('name', `%${ev.player.name.split(' ').pop()}%`)
            .limit(1)

          const playerId = playerRows?.[0]?.id
          if (!playerId) continue

          // Upsert estadística (evitar duplicados)
          const { error: statError } = await supabase
            .from('player_match_stats')
            .upsert(
              {
                match_id: matchId,
                player_id: playerId,
                goals: 1,
                minutes_played: ev.time.elapsed,
              },
              { onConflict: 'match_id,player_id', ignoreDuplicates: false }
            )

          if (!statError) eventsAdded++
        }
      }
    }

    return NextResponse.json({
      ok: true,
      mode,
      fixturesProcessed: fixtures.length,
      matchesUpdated: updated,
      eventsAdded,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[sync-matches]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET para verificar que el endpoint responde (healthcheck)
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/sync-matches',
    methods: ['POST'],
    modes: ['live', 'all'],
    description: 'Sincroniza partidos desde API-Football hacia Supabase',
  })
}
