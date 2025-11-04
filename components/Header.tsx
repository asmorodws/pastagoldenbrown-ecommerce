"use client"

import Link from "next/link"
import { ShoppingCart, User, Search, Menu } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useCartStore } from "@/store/cart"

export default function Header() {
  const { data: session } = useSession()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-[#05347e] border-b border-[#032252] sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-[#05347e]/95">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-[#c49c0f] text-[#05347e] w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
              GB
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white">
              Golden Brown Pasta
            </span>
          </Link>

          
          {/* Navigation */}
          <nav className="flex items-center space-x-2 lg:space-x-4">
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 text-white hover:text-[#c49c0f] font-medium transition-colors rounded-lg hover:bg-white/10"
              >
                Admin
              </Link>
            )}
            
            <Link href="/products" className="px-4 py-2 text-white hover:text-[#c49c0f] font-medium transition-colors rounded-lg hover:bg-white/10">
              Produk
            </Link>

            <Link href="/cart" className="relative p-2 text-white hover:text-[#c49c0f] transition-colors rounded-lg hover:bg-white/10">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#db0705] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group/profile">
                <button className="flex items-center space-x-2 px-4 py-2 text-white hover:text-[#c49c0f] font-medium transition-colors rounded-lg hover:bg-white/10">
                  <div className="w-8 h-8 bg-[#c49c0f] rounded-full flex items-center justify-center text-[#05347e] font-semibold text-sm shadow-md">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline text-white">{session.user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-[#05347e]">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    className="block px-4 py-2.5 text-[#05347e] hover:bg-gray-50 hover:text-[#db0705] transition-colors"
                  >
                    Pesanan Saya
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-[#05347e] hover:bg-gray-50 hover:text-[#db0705] transition-colors"
                  >
                    Profile
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2.5 text-[#db0705] hover:bg-gray-100 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-[#db0705] text-white px-6 py-2.5 rounded-lg hover:bg-[#a60504] transition-colors shadow-md"
              >
                Login
              </Link>
            )}

            <button className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg">
              <Menu size={24} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
