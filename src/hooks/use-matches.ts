'use client'
import { useQuery } from '@tanstack/react-query'
import { getMatches, getUpcomingMatches, getLiveMatches } from '@/services/matches'

export function useMatches(status?: string) {
  return useQuery({
    queryKey: ['matches', status],
    queryFn: () => getMatches(status),
    refetchInterval: status === 'live' ? 30_000 : undefined,
  })
}

export function useUpcomingMatches(limit = 5) {
  return useQuery({
    queryKey: ['matches', 'upcoming', limit],
    queryFn: () => getUpcomingMatches(limit),
    refetchInterval: 60_000,
  })
}

export function useLiveMatches() {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: getLiveMatches,
    refetchInterval: 30_000,
  })
}
