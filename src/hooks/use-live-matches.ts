'use client'
import { useQuery } from '@tanstack/react-query'
import type { APIFixture } from '@/lib/api-football'

interface LiveMatchesResponse {
  fixtures: APIFixture[]
  fetchedAt: string
}

/** Hook para mostrar partidos EN VIVO directamente desde API-Football (via proxy) */
export function useLiveMatchesAPI() {
  return useQuery<LiveMatchesResponse>({
    queryKey: ['live-matches-api'],
    queryFn: async () => {
      const res = await fetch('/api/live-matches')
      if (!res.ok) throw new Error('Error obteniendo partidos en vivo')
      return res.json()
    },
    refetchInterval: 30_000,  // actualiza cada 30 segundos
    staleTime: 25_000,
  })
}

/** Hook para ver los próximos partidos desde API-Football */
export function useNextMatchesAPI() {
  return useQuery<LiveMatchesResponse>({
    queryKey: ['next-matches-api'],
    queryFn: async () => {
      const res = await fetch('/api/live-matches?mode=next')
      if (!res.ok) throw new Error('Error obteniendo próximos partidos')
      return res.json()
    },
    refetchInterval: 300_000, // actualiza cada 5 minutos
    staleTime: 290_000,
  })
}
