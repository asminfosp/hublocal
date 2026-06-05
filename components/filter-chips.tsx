"use client"

import { useState } from "react"

const filters = [
  { id: "open", label: "Aberto agora" },
  { id: "rating", label: "Melhor avaliado" },
  { id: "nearby", label: "Mais perto" },
  { id: "verified", label: "Verificado" },
]

export function FilterChips() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-4">
      {filters.map(filter => {
        const isActive = activeFilters.includes(filter.id)
        return (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
