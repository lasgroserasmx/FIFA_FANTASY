'use client'
import { useQuery } from '@tanstack/react-query'
import { getPlayers } from '@/services/players'

export function usePlayers(filters?: { position?: string; teamId?: string; search?: string }) {
  return useQuery({
    queryKey: ['players', filters],
    queryFn: () => getPlayers(filters),
  })
}
