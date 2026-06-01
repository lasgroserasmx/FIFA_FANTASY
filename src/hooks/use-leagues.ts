'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeagues, getLeague, getLeagueMembers, createLeague, joinLeague, leaveLeague, updateLeague } from '@/services/leagues'
import type { CreateLeagueInput } from '@/types'
import { toast } from 'sonner'

export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: getLeagues,
  })
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: ['league', id],
    queryFn: () => getLeague(id),
    enabled: !!id,
  })
}

export function useLeagueMembers(leagueId: string) {
  return useQuery({
    queryKey: ['league-members', leagueId],
    queryFn: () => getLeagueMembers(leagueId),
    enabled: !!leagueId,
  })
}

export function useCreateLeague() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateLeagueInput) => createLeague(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leagues'] })
      toast.success('League created!')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useJoinLeague() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => joinLeague(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leagues'] })
      toast.success('Joined league!')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useLeaveLeague() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (leagueId: string) => leaveLeague(leagueId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leagues'] })
      toast.success('Left league')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateLeague(leagueId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (updates: Parameters<typeof updateLeague>[1]) => updateLeague(leagueId, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['league', leagueId] })
      toast.success('League updated!')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
