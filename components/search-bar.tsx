"use client"

import { Search, SlidersHorizontal } from "lucide-react"

export function SearchBar() {
  return (
    <div className="px-4 py-4">
      <div className="relative flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar negócios, produtos, serviços..."
            className="w-full h-12 pl-12 pr-4 bg-muted rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <button className="flex items-center justify-center w-12 h-12 bg-foreground rounded-2xl hover:bg-foreground/90 transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-background" />
        </button>
      </div>
    </div>
  )
}
