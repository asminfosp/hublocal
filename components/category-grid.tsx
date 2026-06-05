"use client"

import { Car, Dog, HeartPulse, Scissors, Utensils, Wrench } from "lucide-react"

const categories = [
  { icon: Utensils, label: "Alimentacao", color: "bg-orange-50 text-orange-600" },
  { icon: Wrench, label: "Servicos", color: "bg-blue-50 text-blue-600" },
  { icon: Car, label: "Automotivo", color: "bg-slate-100 text-slate-700" },
  { icon: HeartPulse, label: "Saude", color: "bg-emerald-50 text-emerald-600" },
  { icon: Scissors, label: "Beleza", color: "bg-purple-50 text-purple-600" },
  { icon: Dog, label: "Pet Shops", color: "bg-rose-50 text-rose-600" },
]

export function CategoryGrid() {
  return (
    <div className="px-4 pb-6">
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => (
          <button
            key={category.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md active:scale-95"
          >
            <div className={`flex size-12 items-center justify-center rounded-xl ${category.color}`}>
              <category.icon className="size-6" />
            </div>
            <span className="text-center text-xs font-medium leading-tight text-foreground">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
