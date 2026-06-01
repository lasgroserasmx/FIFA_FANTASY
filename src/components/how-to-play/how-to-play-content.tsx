'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LinkButton } from '@/components/ui/link-button'
import {
  Trophy, Star, Target, Users, Zap, Shield, Goal,
  CheckCircle, AlertCircle, Info, ChevronRight, Award,
  TrendingUp, Clock, Lock, Crown, Shuffle
} from 'lucide-react'

// ─── Sección: Qué es el juego ────────────────────────────────────────────────
function QueesSecccion() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">¿Qué es FIFA Fantasy Challenge?</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          FIFA Fantasy Challenge es la plataforma definitiva para vivir el Mundial de Fútbol al máximo.
          Combina dos modos de juego: <strong className="text-foreground">Fantasy Football</strong> (arma tu equipo soñado)
          y <strong className="text-foreground">Predicciones (Quiniela)</strong> (adivina los marcadores).
          Compite contra amigos en ligas privadas, acumula puntos y gana el bote del premio.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Users,
            title: 'Crea o únete a una liga',
            desc: 'Invita a tus amigos con un código único de 8 caracteres y compite de forma privada.',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
          },
          {
            icon: Star,
            title: 'Fantasy Football',
            desc: 'Ficha jugadores reales con tu presupuesto, elige capitán y suma puntos con sus actuaciones.',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
          },
          {
            icon: Target,
            title: 'Quiniela de predicciones',
            desc: 'Predice el marcador exacto de cada partido y el campeón del torneo.',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
          },
        ].map(({ icon: Icon, title, desc, color, bg }) => (
          <Card key={title}>
            <CardContent className="p-5">
              <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Sección: Fantasy ─────────────────────────────────────────────────────────
function FantasySeccion() {
  const steps = [
    {
      num: '01',
      icon: Users,
      title: 'Únete o crea una liga',
      desc: 'Ve a "Ligas" y crea tu propia liga o únete a una existente con el código de invitación. Puedes configurar el presupuesto, el tamaño de la plantilla y las cuotas de inscripción.',
    },
    {
      num: '02',
      icon: Star,
      title: 'Nombra tu equipo',
      desc: 'Una vez dentro de la liga, entra al modo Fantasy, ponle nombre a tu equipo y empieza a fichar jugadores.',
    },
    {
      num: '03',
      icon: Shuffle,
      title: 'Arma tu plantilla',
      desc: 'Tienes un presupuesto de £100m por defecto (configurable). Ficha hasta 15 jugadores de cualquier selección: 2 porteros, 5 defensas, 5 centrocampistas y 3 delanteros.',
    },
    {
      num: '04',
      icon: Crown,
      title: 'Elige tu capitán',
      desc: 'El capitán multiplica sus puntos ×2 cada jornada. El vicecapitán actúa como sustituto si el capitán no juega. Cámbialo antes de cada jornada.',
    },
    {
      num: '05',
      icon: TrendingUp,
      title: 'Acumula puntos',
      desc: 'Los puntos se calculan automáticamente con las estadísticas reales de cada partido. Sigue tu posición en la clasificación en tiempo real.',
    },
    {
      num: '06',
      icon: Shuffle,
      title: 'Haz transferencias',
      desc: 'Puedes vender y comprar jugadores libremente durante el torneo. La venta recupera el precio de compra del jugador.',
    },
  ]

  const scoring = [
    { action: 'Gol marcado', points: '+5', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { action: 'Asistencia', points: '+3', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { action: 'Portería a cero', points: '+4', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { action: 'Parada (portero)', points: '+1', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { action: 'Tarjeta amarilla', points: '-1', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { action: 'Tarjeta roja', points: '-3', color: 'text-red-400', bg: 'bg-red-500/10' },
    { action: 'Gol en propia', points: '-2', color: 'text-red-400', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Pasos */}
      <div>
        <h2 className="text-xl font-bold mb-4">Cómo jugar al Fantasy</h2>
        <div className="space-y-3">
          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="flex gap-4 p-4 rounded-xl bg-card border border-border/60 hover:border-primary/30 transition-colors">
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-primary/30">{num}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sistema de puntuación */}
      <div>
        <h2 className="text-xl font-bold mb-4">Sistema de puntuación Fantasy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {scoring.map(({ action, points, color, bg }) => (
            <Card key={action} className="overflow-hidden">
              <CardContent className={`p-4 flex items-center justify-between ${bg}`}>
                <span className="text-sm font-medium">{action}</span>
                <span className={`text-xl font-black ${color}`}>{points}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-4 border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4 flex gap-3">
            <Crown className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-yellow-400">Bonus de Capitán ×2</p>
              <p className="text-sm text-muted-foreground">Los puntos del capitán se multiplican por 2. Si no juega, el vicecapitán recibe el multiplicador automáticamente.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estrategia */}
      <div>
        <h2 className="text-xl font-bold mb-4">Consejos estratégicos</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: CheckCircle, text: 'Pon de capitán al jugador con más partidos seguidos en la próxima jornada.', color: 'text-emerald-400' },
            { icon: CheckCircle, text: 'Diversifica entre selecciones para no depender de un solo equipo.', color: 'text-emerald-400' },
            { icon: CheckCircle, text: 'Los porteros de selecciones fuertes acumulan muchas paradas y porterías a cero.', color: 'text-emerald-400' },
            { icon: CheckCircle, text: 'Vende jugadores lesionados o expulsados antes del siguiente partido.', color: 'text-emerald-400' },
            { icon: AlertCircle, text: 'No gastes todo el presupuesto al inicio: guarda margen para refuerzos.', color: 'text-yellow-400' },
            { icon: AlertCircle, text: 'Evita fichar a jugadores que han acumulado tarjetas y podrían ser sancionados.', color: 'text-yellow-400' },
          ].map(({ icon: Icon, text, color }, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-card border border-border/50">
              <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${color}`} />
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sección: Predicciones ────────────────────────────────────────────────────
function PrediccionesSeccion() {
  const scoring = [
    {
      icon: Target,
      title: 'Resultado correcto',
      points: '+3 pts',
      desc: 'Aciertas quién gana, pierde o si es empate.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      example: 'Predices "España gana" y España gana 2-0. ✓',
    },
    {
      icon: TrendingUp,
      title: 'Diferencia de goles correcta',
      points: '+5 pts',
      desc: 'Aciertas quién gana Y por cuántos goles de diferencia.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      example: 'Predices 3-1 y el resultado es 2-0 → ambos ganan por 2. ✓',
    },
    {
      icon: Award,
      title: 'Marcador exacto',
      points: '+10 pts',
      desc: '¡Aciertas el resultado exacto del partido!',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      example: 'Predices 2-1 y el resultado es exactamente 2-1. ✓',
    },
  ]

  const steps = [
    'Ve a "Predicciones" y selecciona tu liga.',
    'Para cada partido, introduce el marcador que crees que habrá (ej. 2-1).',
    'El sistema detecta automáticamente qué equipo crees que ganará.',
    'Los puntos se calculan automáticamente cuando termina el partido.',
    'También puedes predecir el Campeón del torneo en el apartado especial.',
    'El admin de la liga puede bloquear las predicciones antes de cada partido.',
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Cómo funcionan las predicciones</h2>
        <p className="text-muted-foreground text-sm mb-4">
          La Quiniela te permite predecir el marcador de cada partido del torneo. Cuanto más preciso seas, más puntos ganas.
        </p>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <p className="text-sm text-muted-foreground pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Sistema de puntuación Quiniela</h2>
        <div className="space-y-3">
          {scoring.map(({ icon: Icon, title, points, desc, color, bg, example }) => (
            <Card key={title}>
              <CardContent className="p-4 flex gap-4">
                <div className={`h-12 w-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <Badge variant="outline" className={`text-sm font-bold ${color}`}>{points}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{desc}</p>
                  <p className="text-xs text-muted-foreground italic">Ejemplo: {example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-4 border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-blue-400">Los puntos son acumulables</p>
              <p className="text-sm text-muted-foreground">
                Si aciertas el marcador exacto (10 pts), también se suman los puntos de diferencia correcta (5 pts) y resultado correcto (3 pts).
                Máximo: <strong className="text-foreground">18 puntos</strong> por partido.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Predicción del campeón</h2>
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <Trophy className="h-8 w-8 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">¿Quién ganará el Mundial?</h3>
                <p className="text-sm text-muted-foreground">
                  Además de los partidos individuales, puedes predecir qué selección ganará el torneo completo.
                  Esta predicción especial se evalúa al final y puede darte una ventaja decisiva en la clasificación.
                  El admin define los puntos extra por acertar al campeón.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Sección: Ligas ───────────────────────────────────────────────────────────
function LigasSeccion() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Crear y gestionar ligas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: Trophy,
              title: 'Crear una liga',
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
              steps: [
                'Ve a "Ligas" → "Crear"',
                'Elige el nombre, modo de juego y configuración',
                'Comparte el código de invitación de 8 caracteres',
                'Gestiona la liga desde el panel de administración',
              ],
            },
            {
              icon: Zap,
              title: 'Unirse a una liga',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
              steps: [
                'Ve a "Ligas" → "Unirme"',
                'Introduce el código de 8 caracteres',
                'Confirma y empieza a jugar',
                'Puedes estar en múltiples ligas simultáneamente',
              ],
            },
          ].map(({ icon: Icon, title, color, bg, steps }) => (
            <Card key={title}>
              <CardHeader>
                <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-2`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Opciones de configuración (Admin)</h2>
        <div className="space-y-2">
          {[
            { icon: Star, label: 'Puntuación Fantasy personalizada', desc: 'Modifica los puntos por gol, asistencia, parada, etc.' },
            { icon: Target, label: 'Puntuación de predicciones', desc: 'Configura cuánto vale acertar el resultado, la diferencia o el marcador exacto.' },
            { icon: Users, label: 'Número máximo de participantes', desc: 'Limita cuánta gente puede unirse a tu liga.' },
            { icon: Trophy, label: 'Cuota de inscripción y bote', desc: 'Establece una entrada económica y gestiona el premio final.' },
            { icon: Lock, label: 'Bloqueo de predicciones', desc: 'Bloquea las predicciones antes del inicio de los partidos.' },
            { icon: Clock, label: 'Plazo del draft', desc: 'Configura la fecha límite para fichar jugadores.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex gap-3 p-3 rounded-lg bg-card border border-border/50">
              <Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex gap-3">
          <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Roles en la liga</p>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Admin:</span> El creador de la liga. Puede modificar reglas, bloquear predicciones y gestionar todo.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Miembro:</span> Puede participar en el Fantasy y las Predicciones de la liga.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Sección: Preguntas frecuentes ────────────────────────────────────────────
function FaqSeccion() {
  const faqs = [
    {
      q: '¿Puedo participar en más de una liga?',
      a: 'Sí. Puedes estar en tantas ligas como quieras. Tendrás un equipo Fantasy y predicciones independientes en cada una.',
    },
    {
      q: '¿Cuándo se actualizan los puntos?',
      a: 'Los puntos Fantasy y de predicciones se actualizan cuando el admin del sistema introduce las estadísticas del partido finalizado.',
    },
    {
      q: '¿Puedo cambiar mi capitán después de que empiece un partido?',
      a: 'Mientras el partido no haya comenzado puedes cambiar el capitán libremente. Una vez iniciado, el capitán queda bloqueado para esa jornada.',
    },
    {
      q: '¿Qué pasa si un jugador que fichaste se lesiona?',
      a: 'Puedes venderlo en el mercado de transferencias y usar el dinero para fichar a otro jugador. Recuperarás el precio de compra original.',
    },
    {
      q: '¿Puedo predecir partidos que ya han comenzado?',
      a: 'No. Las predicciones solo están disponibles mientras el partido tiene estado "Programado". El admin también puede bloquearlas manualmente.',
    },
    {
      q: '¿Cómo se reparte el bote del premio?',
      a: 'El admin de la liga gestiona el bote. Al finalizar el torneo, puede repartirlo entre los primeros clasificados según las normas que haya configurado.',
    },
    {
      q: '¿Puedo salir de una liga?',
      a: 'Sí, puedes salir de una liga en cualquier momento desde la página de la liga. El admin no puede salir (tendría que eliminar la liga).',
    },
    {
      q: '¿El Fantasy y las Predicciones son independientes?',
      a: 'Sí. Cada modo tiene su propio marcador. En la clasificación general se muestran ambos por separado y también el total combinado.',
    },
  ]

  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Preguntas frecuentes</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <Card
            key={i}
            className={`cursor-pointer transition-colors ${open === i ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/20'}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-sm">{faq.q}</p>
                <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${open === i ? 'rotate-90 text-primary' : ''}`} />
              </div>
              {open === i && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">{faq.a}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function HowToPlayContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabecera */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 mx-auto">
          <Trophy className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black">Cómo jugar</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Todo lo que necesitas saber para convertirte en el mejor manager del FIFA Fantasy Challenge.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <LinkButton href="/auth/register" size="sm">
            <Zap className="mr-2 h-4 w-4" /> Crear cuenta gratis
          </LinkButton>
          <LinkButton href="/ligas/crear" variant="outline" size="sm">
            <Trophy className="mr-2 h-4 w-4" /> Crear liga
          </LinkButton>
        </div>
      </div>

      {/* Pestañas */}
      <Tabs defaultValue="que-es">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1 p-1">
          <TabsTrigger value="que-es" className="text-xs">¿Qué es?</TabsTrigger>
          <TabsTrigger value="fantasy" className="text-xs">Fantasy</TabsTrigger>
          <TabsTrigger value="predicciones" className="text-xs">Quiniela</TabsTrigger>
          <TabsTrigger value="ligas" className="text-xs">Ligas</TabsTrigger>
          <TabsTrigger value="faq" className="text-xs">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="que-es" className="mt-6"><QueesSecccion /></TabsContent>
        <TabsContent value="fantasy" className="mt-6"><FantasySeccion /></TabsContent>
        <TabsContent value="predicciones" className="mt-6"><PrediccionesSeccion /></TabsContent>
        <TabsContent value="ligas" className="mt-6"><LigasSeccion /></TabsContent>
        <TabsContent value="faq" className="mt-6"><FaqSeccion /></TabsContent>
      </Tabs>

      {/* CTA final */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="p-6 text-center space-y-3">
          <Trophy className="h-10 w-10 text-primary mx-auto" />
          <h3 className="text-xl font-bold">¿Listo para competir?</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Crea tu cuenta, únete a una liga y demuestra que eres el mejor manager del Mundial.
          </p>
          <div className="flex gap-3 justify-center pt-1">
            <LinkButton href="/ligas/unirse" variant="outline" size="sm">
              <Zap className="mr-2 h-4 w-4" /> Unirme con código
            </LinkButton>
            <LinkButton href="/ligas/crear" size="sm">
              <Trophy className="mr-2 h-4 w-4" /> Crear mi liga
            </LinkButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
