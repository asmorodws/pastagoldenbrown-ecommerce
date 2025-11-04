"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderTree, 
  CreditCard, 
  Users, 
  Settings,
  LogOut,
  Store
} from "lucide-react"
import { signOut } from "next-auth/react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Produk", href: "/admin/products" },
  { icon: ShoppingCart, label: "Pesanan", href: "/admin/orders" },
  { icon: FolderTree, label: "Kategori", href: "/admin/categories" },
  { icon: CreditCard, label: "Pembayaran", href: "/admin/payments" },
  { icon: Users, label: "Pengguna", href: "/admin/users" },
  { icon: Settings, label: "Pengaturan", href: "/admin/settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-700">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-slate-400">E-Shop Management</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <Store className="w-5 h-5" />
          <span className="font-medium">Lihat Toko</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  )
}
