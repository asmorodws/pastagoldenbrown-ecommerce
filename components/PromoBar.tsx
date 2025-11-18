"use client"

import { X, Sparkles } from "lucide-react"
import { useState } from "react"

export default function PromoBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-[#db0705] via-[#ff0805] to-[#db0705] text-white py-3 px-4 sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 justify-center text-sm md:text-base">
          <Sparkles size={20} className="text-[#c49c0f] animate-pulse" />
          <span className="font-bold">
            PROMO WEBSITE EKSKLUSIF! Diskon hingga 30% untuk Member Baru!
          </span>
          <Sparkles size={20} className="text-[#c49c0f] animate-pulse" />
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="hover:bg-white/20 rounded-full p-1 transition-all flex-shrink-0"
          aria-label="Tutup promo banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
