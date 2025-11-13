"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu, X, LogOut, Package, User2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useCartStore } from "@/store/cart"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { data: session } = useSession()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const close = () => {
      setIsProfileOpen(false)
      setIsMobileOpen(false)
    }
    window.addEventListener("resize", close)
    return () => window.removeEventListener("resize", close)
  }, [])

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Produk", href: "/products" },
    { label: "Tentang Kami", href: "#tentang-kami" },
    { label: "Kontak", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="Golden Brown" width={42} height={42} className="w-10 h-10" />
            <span className="text-xl font-semibold text-amber-700 group-hover:text-amber-800 transition-colors">
              Golden Brown
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {/* CART */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-600 transition"
              aria-label={`Keranjang belanja (${cartCount})`}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4.5 h-4.5 flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* USER MENU */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white text-sm font-semibold hover:shadow-md transition"
                  aria-label="Menu pengguna"
                >
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package size={14} /> Pesanan Saya
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User2 size={14} /> Profil
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          signOut()
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut size={14} /> Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-amber-600 transition"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-md transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-amber-600"
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden border-t border-gray-100 pt-3 pb-5"
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                    {item.label}
                  </Link>
                ))}
                {session && (
                  <>
                    <Link
                      href="/orders"
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <Package size={14} /> Pesanan Saya
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <User2 size={14} /> Profil
                    </Link>
                  </>
                )}
                {!session && (
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileOpen(false)}
                    className="mt-3 mx-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md text-center"
                  >
                    Daftar Sekarang
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
