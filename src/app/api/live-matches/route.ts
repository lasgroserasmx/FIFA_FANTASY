// ============================================================
// GET /api/live-matches
// Proxy ligero que devuelve partidos en vivo desde API-Football
// sin exponer la API key al cliente.
// El frontend puede hacer polling a este endpoint.
// ============================================================

import { NextResponse } from 'next/server'
import { getLiveFixtures, getNextFixtures } from '@/lib/api-football'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') ?? 'live'

  try {
    const fixtures = mode === 'next'
      ? await getNextFixtures(5)
      : await getLiveFixtures()

    return NextResponse.json(
      { fixtures, fetchedAt: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error fetching live matches' },
      { status: 500 }
    )
  }
}
