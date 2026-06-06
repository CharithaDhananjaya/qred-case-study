import type { Company } from '@qred/shared'
import { ChevronDown } from '@/components/ui/icons'

export function CompanySelector({ company }: { company: Company }) {
  return (
    <div className="flex items-center justify-between bg-qred-light rounded-xl px-4 py-3 mb-3 cursor-pointer">
      <span className="text-sm font-medium text-qred-dark">{company.name}</span>
      <ChevronDown className="text-qred-dark" />
    </div>
  )
}
