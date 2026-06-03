'use client'
import { useLeague } from '@/hooks/use-leagues'
import { TorneoApp } from './torneo-app'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface Props {
  ligaId: string
}

export function TorneoLigaPage({ ligaId }: Props) {
  const { data: league, isLoading } = useLeague(ligaId)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!league) return
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) return
      // el admin es el creador de la liga
      setIsAdmin(league.admin_id === data.user.id)
    })
  }, [league])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!league || !league.torneo_id) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-muted-foreground">Esta liga no tiene un torneo activo.</p>
        <Link href="/ligas" className="text-primary underline text-sm">Volver a ligas</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back link */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Link
          href={`/ligas/${ligaId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {league.name}
        </Link>
      </div>

      <TorneoApp
        torneoId={league.torneo_id}
        torneoName={league.name}
        gameType={league.tournament_type ?? 'fc26'}
        isOwner={isAdmin}
      />
    </div>
  )
}
