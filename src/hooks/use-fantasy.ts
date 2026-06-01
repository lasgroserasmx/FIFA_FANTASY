'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFantasyTeam, getLeagueFantasyTeams, createFantasyTeam, addPlayerToTeam, removePlayerFromTeam, setCaptain } from '@/services/fantasy'
import { toast } from 'sonner'

export function useFantasyTeam(leagueId: string) {
  return useQuery({
    queryKey: ['fantasy-team', leagueId],
    queryFn: () => getFantasyTeam(leagueId),
    enabled: !!leagueId,
  })
}

export function useLeagueFantasyTeams(leagueId: string) {
  return useQuery({
    queryKey: ['fantasy-teams', leagueId],
    queryFn: () => getLeagueFantasyTeams(leagueId),
    enabled: !!leagueId,
  })
}

export function useCreateFantasyTeam(leagueId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createFantasyTeam(leagueId, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fantasy-team', leagueId] })
      toast.success('Fantasy team created!')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useAddPlayer(leagueId: string, fantasyTeamId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ playerId, price }: { playerId: string; price: number }) =>
      addPlayerToTeam(fantasyTeamId, playerId, price),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fantasy-team', leagueId] })
      toast.success('Player added!')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useRemovePlayer(leagueId: string, fantasyTeamId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (playerId: string) => removePlayerFromTeam(fantasyTeamId, playerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fantasy-team', leagueId] })
      toast.success('Player removed')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useSetCaptain(leagueId: string, fantasyTeamId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ playerId, isVice }: { playerId: string; isVice?: boolean }) =>
      setCaptain(fantasyTeamId, playerId, isVice),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fantasy-team', leagueId] })
      toast.success('Captain updated!')
    },
  })
}
