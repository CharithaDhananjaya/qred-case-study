import { api } from '@/lib/api'
import { DashboardView } from '@/components/dashboard/DashboardView'

export default async function DashboardPage() {
  const data = await api.getDashboard()
  return <DashboardView data={data} />
}
