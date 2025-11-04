"use client"

import { Bell, Search, Menu, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk, pesanan, pelanggan..."
            className="bg-transparent outline-none text-sm flex-1 text-slate-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-slate-700 rounded-full"></span>
        </button>

        {/* User Profile */}
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-slate-700 hidden md:block">
            {session?.user?.name}
            <p className="text-xs text-slate-500">{session?.user?.email}</p>
          </p>
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
