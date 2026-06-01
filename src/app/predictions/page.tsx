'use client'
import Link from 'next/link'
import { Target, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { useLeagues } from '@/hooks/use-leagues'

export default function PredictionsPage() {
  const { data: leagues, isLoading } = useLeagues()
  const predLeagues = leagues?.filter(l => l.mode === 'prediction' || l.mode === 'both')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Predictions</h1>
        <p className="text-muted-foreground text-sm mt-1">Select a league to submit predictions</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="animate-pulse"><CardContent className="h-20" /></Card>)}</div>
      ) : predLeagues?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No prediction leagues</h3>
            <p className="text-muted-foreground text-sm mb-4">Join or create a league with prediction mode enabled</p>
            <LinkButton href="/leagues">Browse Leagues</LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {predLeagues?.map(league => (
            <Link key={league.id} href={`/predictions/${league.id}`}>
              <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{league.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">Exact: +{league.pred_exact_score}pts</Badge>
                      <Badge variant="outline" className="text-xs">Outcome: +{league.pred_correct_outcome}pts</Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
