export const dynamic = 'force-dynamic'

import { AppLayout } from '@/components/layout/app-layout'

export default function FantasyLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
