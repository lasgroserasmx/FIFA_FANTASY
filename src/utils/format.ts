import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// Parsea una fecha siempre en UTC para evitar diferencias servidor/cliente
// (Vercel está en UTC, el usuario puede estar en otro huso horario)
function toUTC(date: string | Date): Date {
  if (typeof date === 'string') {
    // ISO strings con Z o +00:00 ya son UTC; las sin zona las tratamos como UTC
    return new Date(date.endsWith('Z') || date.includes('+') ? date : date + 'Z')
  }
  return date
}

export function formatDate(date: string | Date, pattern = 'dd MMM yyyy') {
  // Formatear usando valores UTC directamente para consistencia servidor/cliente
  const d = toUTC(date)
  const utcDate = new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()
  ))
  // Crear fecha local que represente los mismos valores que el UTC del servidor
  const fakeLocal = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
  return format(fakeLocal, pattern, { locale: es })
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export function formatRelative(date: string | Date) {
  const d = toUTC(date)
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

export function formatMatchTime(date: string | Date) {
  // Extraer hora UTC directamente del ISO string para evitar conversión de zona horaria
  if (typeof date === 'string') {
    const match = date.match(/T(\d{2}:\d{2})/)
    if (match) return match[1]
  }
  const d = toUTC(date)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

export function formatCurrency(amount: number, currency = 'USD') {
  // Formato manual y determinístico (sin Intl ni toLocaleString) para evitar
  // diferencias entre Node.js y el navegador que causan hydration error #418
  const symbol = currency === 'MXN' ? 'MX$' : currency === 'EUR' ? '€' : '$'
  const num = Math.abs(Number(amount))
  const parts = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${amount < 0 ? '-' : ''}${symbol}${parts}`
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
    round_of_32: 'Ronda de 32',
    round_of_16: 'Octavos de final',
    quarter_final: 'Cuartos de final',
    semi_final: 'Semifinal',
    third_place: '3er y 4to puesto',
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
