import { AppLayout } from '@/components/layout/app-layout'
import { ApuestaDetail } from '@/components/torneo/apuesta-detail'

interface Props {
  params: { id: string }
}

export default function TorneoIdPage({ params }: Props) {
  return (
    <AppLayout>
      <ApuestaDetail apuestaId={params.id} />
    </AppLayout>
  )
}
