'use client'

import { useState, useRef, useEffect } from 'react'
import type { Company } from '@qred/shared'
import { ChevronDown } from '@/components/ui/icons'

export function CompanySelector({ company }: { company: Company }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative mb-3" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-qred-light rounded-xl px-4 py-3 cursor-pointer"
      >
        <span className="text-sm font-medium text-qred-dark">{company.name}</span>
        <ChevronDown
          className={`text-qred-dark transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-qred-light rounded-xl shadow-md z-30 overflow-hidden">
          <div className="px-4 py-3 border-b border-qred-light">
            <span className="text-sm font-medium text-qred-dark">{company.name}</span>
          </div>
          <a
            href="https://www.qred.se/en/business-credit-card"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 text-sm text-qred-dark/60 hover:bg-qred-light transition-colors"
            onClick={() => setOpen(false)}
          >
            <span className="text-base">+</span>
            Register for a new card to see here
          </a>
        </div>
      )}
    </div>
  )
}
