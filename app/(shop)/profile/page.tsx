"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { User, Mail, Calendar, ShoppingBag, Package, LogOut, Edit, Save, X, Phone } from "lucide-react"
import { signOut } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || ""
      })
      fetchOrderStats()
    }
  }, [session])

  const fetchOrderStats = async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        const orders = data.orders || [] // API returns { orders: [...] }
        const stats = {
          total: orders.length,
          pending: orders.filter((o: any) => o.status === "PENDING").length,
          processing: orders.filter((o: any) => o.status === "PROCESSING").length,
          completed: orders.filter((o: any) => ["SHIPPED", "DELIVERED"].includes(o.status)).length
        }
        setOrderStats(stats)
      }
    } catch (error) {
      console.error("Error fetching order stats:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API to update user profile
      // For now, just simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || ""
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Profil Saya</h1>
          <p className="text-slate-600">Kelola informasi akun dan preferensi Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Avatar & Name Section */}
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <h2 className="text-2xl font-bold text-blue-900 mb-2">{session.user.name}</h2>
                      <p className="text-slate-600 flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4" />
                        {session.user.email}
                      </p>
                      {session.user.phone && (
                        <p className="text-slate-600 flex items-center gap-2 mb-4">
                          <Phone className="w-4 h-4" />
                          {session.user.phone}
                        </p>
                      )}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium mt-4"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profil
                      </button>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nama</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">No. Telepon</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-medium disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-4">Informasi Akun</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-600">Bergabung Sejak</p>
                      <p className="font-semibold text-slate-900">
                        {new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <User className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm text-slate-600">Role</p>
                      <p className="font-semibold text-slate-900 capitalize">{session.user.role || "Customer"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-semibold border-2 border-red-200"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>

          {/* Order Stats Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Total Pesanan</p>
                  <p className="text-3xl font-bold">{orderStats.total}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-sm">Menunggu</span>
                  <span className="font-bold">{orderStats.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-sm">Diproses</span>
                  <span className="font-bold">{orderStats.processing}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-sm">Selesai</span>
                  <span className="font-bold">{orderStats.completed}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4">Menu Cepat</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors text-left"
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Lihat Pesanan</span>
                </button>
                <button
                  onClick={() => router.push("/products")}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors text-left"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Belanja Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
