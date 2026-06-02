// ============================================================
// POST /api/calculate-points?match_id=<uuid>
// Recalcula puntos de quiniela + fantasy para un partido.
// Útil si el trigger falló o para re-procesar un partido.
// Protegido con CRON_SECRET.
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('match_id')

  if (!matchId) {
    return NextResponse.json({ error: 'match_id requerido' }, { status: 400 })
  }

  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .rpc('calculate_match_points', { p_match_id: matchId })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('[calculate-points]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/calculate-points',
    method: 'POST',
    params: { match_id: 'UUID del partido (requerido)' },
    description: 'Recalcula puntos de quiniela y fantasy para un partido terminado',
  })
}
