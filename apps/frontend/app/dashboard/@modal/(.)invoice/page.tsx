import { api } from '@/lib/api'
import { InvoiceDrawer } from '@/components/dashboard/InvoiceDrawer'

export default async function InvoiceModal() {
  const invoice = await api.getInvoice()
  if (!invoice) return null
  return <InvoiceDrawer invoice={invoice} />
}
