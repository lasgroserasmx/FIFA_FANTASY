'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Star } from 'lucide-react'
import type { Player } from '@/types'
import { getPositionColor } from '@/utils/format'
import { cn } from '@/lib/utils'

interface PlayerCardProps {
  player: Player
  onAdd?: (player: Player) => void
  onRemove?: (player: Player) => void
  onSetCaptain?: (player: Player) => void
  isCaptain?: boolean
  isViceCaptain?: boolean
  isInTeam?: boolean
  compact?: boolean
}

export function PlayerCard({
  player,
  onAdd,
  onRemove,
  onSetCaptain,
  isCaptain,
  isViceCaptain,
  isInTeam,
  compact = false,
}: PlayerCardProps) {
  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      isCaptain && 'ring-2 ring-yellow-500/50',
      isViceCaptain && 'ring-2 ring-blue-500/50'
    )}>
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="relative flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
              {player.shirt_number || player.name[0]}
            </div>
            {(isCaptain || isViceCaptain) && (
              <div className={cn(
                'absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold',
                isCaptain ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'
              )}>
                {isCaptain ? 'C' : 'V'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{player.short_name || player.name}</span>
              <Badge variant="outline" className={cn('text-xs flex-shrink-0', getPositionColor(player.position))}>
                {player.position}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{player.team?.short_name || '—'}</p>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="font-bold text-primary text-sm">£{player.price}m</span>
            <div className="flex gap-1">
              {onSetCaptain && isInTeam && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onSetCaptain(player)}
                  title="Set Captain"
                >
                  <Star className="h-3 w-3" />
                </Button>
              )}
              {onAdd && !isInTeam && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-emerald-400 hover:text-emerald-300"
                  onClick={() => onAdd(player)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
              {onRemove && isInTeam && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300"
                  onClick={() => onRemove(player)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
