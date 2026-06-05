"use client"

import { MapPin, Bell } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg leading-tight">HUB LOCAL</h1>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <MapPin className="w-3 h-3" />
              <span>São Paulo, SP</span>
            </div>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  )
}
