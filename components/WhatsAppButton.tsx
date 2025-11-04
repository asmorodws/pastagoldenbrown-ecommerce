"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
  const phoneNumber = "6281234567890" // Nomor WhatsApp Golden Brown Pasta
  const message = encodeURIComponent("Halo Golden Brown Pasta! Saya ingin bertanya tentang produk Anda.")

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1fb855] text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:animate-pulse" />
      <span className="hidden md:inline-block font-semibold pr-2">
        Chat Sekarang
      </span>
    </a>
  )
}
