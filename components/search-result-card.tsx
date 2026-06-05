"use client"

import { Star, MapPin, MessageCircle, Phone, Clock } from "lucide-react"

interface SearchResultCardProps {
  name: string
  rating: number
  reviewCount: number
  distance: string
  isOpen: boolean
  closingTime?: string
  image: string
  specialty?: string
}

export function SearchResultCard({ 
  name, 
  rating, 
  reviewCount, 
  distance, 
  isOpen,
  closingTime,
  image,
  specialty
}: SearchResultCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all active:scale-[0.99]">
      <div className="flex gap-3 p-3">
        <div className="relative shrink-0">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-xl object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-background border border-border px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-[10px] font-bold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="font-semibold text-foreground truncate text-[15px]">{name}</h3>
            {specialty && (
              <p className="text-xs text-muted-foreground mt-0.5">{specialty}</p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>
            <span className="text-muted-foreground">
              {reviewCount} avaliações
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {isOpen ? (
              <span className="text-xs">
                <span className="text-green-600 font-medium">Aberto</span>
                {closingTime && <span className="text-muted-foreground"> · Fecha às {closingTime}</span>}
              </span>
            ) : (
              <span className="text-xs text-red-500 font-medium">Fechado</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-3 pb-3 flex gap-2">
        <button className="flex-1 h-10 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
        <button className="h-10 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95">
          <Phone className="w-4 h-4" />
          Ligar
        </button>
        <button className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors active:scale-95">
          Ver Perfil
        </button>
      </div>
    </div>
  )
}
