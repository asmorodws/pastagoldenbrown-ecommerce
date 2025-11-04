// header.tsx - Fixed
"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, ChevronDown } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useCartStore } from "@/store/cart"
import { useState } from "react"

export default function Header() {
  const { data: session } = useSession()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-sm bg-[#c49c0f] text-[#05347e]">
              GB
            </div>
            <div className="flex flex-col text-gray-900">
              <span className="text-lg font-bold leading-tight">Golden Brown</span>
              <span className="text-xs opacity-80">Pasta & Bahan Makanan</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/products"
              className="px-4 py-2 font-medium transition-colors text-sm text-gray-700 hover:text-[#05347e]"
            >
              Produk
            </Link>

            <Link
              href="#tentang-kami"
              className="px-4 py-2 font-medium transition-colors text-sm text-gray-700 hover:text-[#05347e]"
            >
              Tentang Kami
            </Link>

            <Link
              href="/contact"
              className="px-4 py-2 font-medium transition-colors text-sm text-gray-700 hover:text-[#05347e]"
            >
              Kontak
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 transition-colors relative text-gray-700 hover:text-[#05347e]"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#db0705] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 transition-colors text-gray-700"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-[#05347e] text-white">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{session.user.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        signOut()
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-[#db0705] hover:bg-gray-50 transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="transition-colors text-sm text-gray-700 hover:text-[#05347e]"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#db0705] hover:bg-[#a60504] text-white px-4 py-2 text-sm transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 transition-colors text-gray-700">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}