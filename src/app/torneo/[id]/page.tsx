import { AppLayout } from '@/components/layout/app-layout'
import { TorneoDetailPage } from '@/components/torneo/torneo-detail'

interface Props {
  params: { id: string }
}

export default function TorneoIdPage({ params }: Props) {
  return (
    <AppLayout>
      <TorneoDetailPage torneoId={params.id} />
    </AppLayout>
  )
}
