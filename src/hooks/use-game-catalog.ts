'use client'
import { useQuery } from '@tanstack/react-query'
import {
  getTeamsByGameType,
  getPlayersByGameType,
  getFixturesByGameType,
  groupTeamsByLeague,
  groupPlayersByTeam,
  groupFixturesByCompetition,
  type DbGameTeam,
  type DbGamePlayer,
  type DbGameFixture,
} from '@/services/game-catalog'

export function useGameTeams(gameTypeId: string) {
  return useQuery({
    queryKey: ['game-teams', gameTypeId],
    queryFn: () => getTeamsByGameType(gameTypeId),
    staleTime: 1000 * 60 * 60, // 1 hora — datos estables
    enabled: !!gameTypeId,
    select: (data) => ({
      teams: data,
      byLeague: groupTeamsByLeague(data),
    }),
  })
}

export function useGamePlayers(gameTypeId: string) {
  return useQuery({
    queryKey: ['game-players', gameTypeId],
    queryFn: () => getPlayersByGameType(gameTypeId),
    staleTime: 1000 * 60 * 60,
    enabled: !!gameTypeId,
    select: (data) => ({
      players: data,
      byTeam: groupPlayersByTeam(data),
    }),
  })
}

export function useGameFixtures(gameTypeId: string) {
  return useQuery({
    queryKey: ['game-fixtures', gameTypeId],
    queryFn: () => getFixturesByGameType(gameTypeId),
    staleTime: 1000 * 60 * 5, // 5 min — pueden actualizar scores
    enabled: !!gameTypeId,
    select: (data) => ({
      fixtures: data,
      byCompetition: groupFixturesByCompetition(data),
    }),
  })
}

export type { DbGameTeam, DbGamePlayer, DbGameFixture }
