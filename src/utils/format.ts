import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string | Date, pattern = 'dd MMM yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: es })
}

export function formatDateTime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "dd/MM/yyyy HH:mm", { locale: es })
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

export function formatMatchTime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm')
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount)
}

export function formatPoints(points: number) {
  return points >= 0 ? `+${points}` : `${points}`
}

export function getPositionColor(position: string) {
  const colors: Record<string, string> = {
    GK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    MID: 'bg-green-500/20 text-green-400 border-green-500/30',
    FWD: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return colors[position] || 'bg-gray-500/20 text-gray-400'
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    live: 'bg-red-500/20 text-red-400 border-red-500/30',
    finished: 'bg-gray-500/20 text-gray-400',
    scheduled: 'bg-blue-500/20 text-blue-400',
    postponed: 'bg-yellow-500/20 text-yellow-400',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

export function getStageLabel(stage: string) {
  const labels: Record<string, string> = {
    group: 'Fase de grupos',
    round_of_16: 'Octavos de final',
    quarter_final: 'Cuartos de final',
    semi_final: 'Semifinal',
    final: 'Final',
  }
  return labels[stage] || stage
}

export function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    live: '● EN VIVO',
    finished: 'FINALIZADO',
    scheduled: 'PROGRAMADO',
    postponed: 'APLAZADO',
  }
  return labels[status] || status.toUpperCase()
}
