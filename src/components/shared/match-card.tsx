import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Match } from '@/types'
import { formatDate, formatMatchTime, getStatusColor, getStageLabel, getStatusLabel } from '@/utils/format'
import { cn } from '@/lib/utils'

interface MatchCardProps {
  match: Match
  className?: string
  compact?: boolean
}

export function MatchCard({ match, className, compact = false }: MatchCardProps) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <Card className={cn('overflow-hidden', isLive && 'border-red-500/30', className)}>
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="outline" className={cn('text-xs', getStatusColor(match.status))}>
            {getStatusLabel(match.status)}
          </Badge>
          <span className="text-xs text-muted-foreground">{getStageLabel(match.stage)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-end gap-1 flex-1">
            <span className={cn('font-semibold text-right', compact ? 'text-sm' : 'text-base')}>
              {match.home_team?.short_name || 'TBD'}
            </span>
            {!compact && <span className="text-xs text-muted-foreground text-right">{match.home_team?.name}</span>}
          </div>

          <div className="flex items-center gap-2 min-w-[80px] justify-center">
            {isFinished || isLive ? (
              <span className={cn('font-bold tabular-nums', compact ? 'text-lg' : 'text-2xl')}>
                {match.home_score ?? 0} - {match.away_score ?? 0}
              </span>
            ) : (
              <div className="text-center">
                <div className="text-xs text-muted-foreground">{formatDate(match.match_date, 'dd MMM')}</div>
                <div className={cn('font-bold text-primary', compact ? 'text-sm' : 'text-base')}>
                  {formatMatchTime(match.match_date)}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-1 flex-1">
            <span className={cn('font-semibold', compact ? 'text-sm' : 'text-base')}>
              {match.away_team?.short_name || 'TBD'}
            </span>
            {!compact && <span className="text-xs text-muted-foreground">{match.away_team?.name}</span>}
          </div>
        </div>

        {match.venue && !compact && (
          <p className="text-xs text-muted-foreground text-center mt-2">📍 {match.venue}</p>
        )}
      </CardContent>
    </Card>
  )
}
