"use client"

import { ArrowLeft, SlidersHorizontal, MapPin } from "lucide-react"
import Link from "next/link"

interface SearchHeaderProps {
  query: string
  resultCount: number
}

export function SearchHeader({ query, resultCount }: SearchHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
              <span className="text-foreground font-medium truncate">{query}</span>
            </div>
          </div>
          
          <button className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>São Paulo, SP</span>
          </div>
          <span className="text-sm text-muted-foreground">{resultCount} resultados</span>
        </div>
      </div>
    </header>
  )
}
