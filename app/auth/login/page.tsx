"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Login berhasil!")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login")
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
            <h2 className="text-3xl font-bold text-center mb-2">Selamat Datang</h2>
            <p className="text-center text-slate-300">Masuk ke akun EliteShop Anda</p>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Masukkan password Anda"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-400 mr-2" />
                  <span className="text-slate-600">Ingat saya</span>
                </label>
                <Link href="/auth/forgot-password" className="text-slate-600 hover:text-slate-900 font-medium">
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "Masuk"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-slate-800 hover:text-slate-600 font-bold">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Dengan masuk, Anda menyetujui{" "}
            <Link href="/terms" className="text-slate-700 hover:text-slate-900 font-medium">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/privacy" className="text-slate-700 hover:text-slate-900 font-medium">
              Kebijakan Privasi
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
