"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Terjadi kesalahan saat registrasi")
        return
      }

      toast.success(data.message)
      router.push("/auth/login")
    } catch (error) {
      toast.error("Terjadi kesalahan saat registrasi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white text-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                E
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2">Buat Akun Baru</h2>
            <p className="text-center text-slate-300">Bergabung dengan EliteShop sekarang</p>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-800 mb-2">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-2">
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="Minimal 6 karakter"
                />
                <p className="text-xs text-slate-500 mt-1.5">Minimal 6 karakter, kombinasi huruf dan angka</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-800 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="Ulangi password Anda"
                />
              </div>

              <div className="flex items-start pt-2">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400 mt-1 mr-3" 
                />
                <label className="text-sm text-slate-600">
                  Saya menyetujui{" "}
                  <Link href="/terms" className="text-slate-800 hover:text-slate-600 font-medium">
                    Syarat & Ketentuan
                  </Link>{" "}
                  dan{" "}
                  <Link href="/privacy" className="text-slate-800 hover:text-slate-600 font-medium">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-slate-800 hover:text-slate-600 font-bold">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-100">
            <div className="text-2xl mb-2 font-bold text-slate-800">30%</div>
            <p className="text-xs font-medium text-slate-700">Diskon Member</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-100">
            <div className="text-2xl mb-2 font-bold text-slate-800">Fast</div>
            <p className="text-xs font-medium text-slate-700">Pengiriman Cepat</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-100">
            <div className="text-2xl mb-2 font-bold text-slate-800">100%</div>
            <p className="text-xs font-medium text-slate-700">Original</p>
          </div>
        </div>
      </div>
    </div>
  )
}
