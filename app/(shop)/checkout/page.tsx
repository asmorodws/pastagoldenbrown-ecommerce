"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartStore } from "@/store/cart"
import toast from "react-hot-toast"
import Image from "next/image"
import { ShoppingBag, MapPin, CreditCard, CheckCircle, Truck, Phone, Mail, User, Home, Building2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "Indonesia",
    province: "",
    notes: "",
  })

  if (!session) {
    router.push("/auth/login")
    return null
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping: {
            ...formData,
            paymentMethod,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Terjadi kesalahan saat checkout")
        return
      }

      toast.success("Pesanan berhasil dibuat!")
      clearCart()
      router.push(`/orders/${data.order.id}`)
    } catch (error) {
      toast.error("Terjadi kesalahan saat checkout")
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Keranjang", icon: ShoppingBag },
    { number: 2, title: "Pengiriman", icon: MapPin },
    { number: 3, title: "Pembayaran", icon: CreditCard },
    { number: 4, title: "Selesai", icon: CheckCircle },
  ]

  const shippingCost = 0 // Free shipping
  const totalAmount = getTotal() + shippingCost

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Selesaikan pesanan Anda dengan mudah dan aman</p>
        </div>

        {/* Steps */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                
                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                            : isActive
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <p
                        className={`mt-2 text-sm font-semibold ${
                          isActive || isCompleted ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                          isCompleted ? "bg-green-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">{currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Keranjang Belanja</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item: any) => (
                    <div key={item.productId} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder-product.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-slate-600 mt-1">Jumlah: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-slate-900">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-slate-600">
                          @Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Lanjut ke Pengiriman
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Informasi Pengiriman</h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }} className="space-y-4">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                        placeholder="08123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      placeholder="johndoe@email.com"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Alamat Lengkap
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                      rows={3}
                      placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Provinsi
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                        placeholder="DKI Jakarta"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Kota/Kabupaten
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                        placeholder="Jakarta Selatan"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                        placeholder="12345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Negara
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                      rows={2}
                      placeholder="Catatan untuk pengiriman..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                      Lanjut ke Pembayaran
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Metode Pembayaran</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {/* Bank Transfer */}
                    <div
                      onClick={() => setPaymentMethod("bank_transfer")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "bank_transfer"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "bank_transfer" ? "border-blue-600" : "border-slate-300"
                        }`}>
                          {paymentMethod === "bank_transfer" && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">Transfer Bank</p>
                          <p className="text-sm text-slate-600">BCA, Mandiri, BNI, BRI</p>
                        </div>
                        <p className="text-sm font-semibold text-green-600">Gratis</p>
                      </div>
                    </div>

                    {/* E-Wallet */}
                    <div
                      onClick={() => setPaymentMethod("ewallet")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "ewallet"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "ewallet" ? "border-blue-600" : "border-slate-300"
                        }`}>
                          {paymentMethod === "ewallet" && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">E-Wallet</p>
                          <p className="text-sm text-slate-600">GoPay, OVO, DANA, ShopeePay</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-600">1.5%</p>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "credit_card"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "credit_card" ? "border-blue-600" : "border-slate-300"
                        }`}>
                          {paymentMethod === "credit_card" && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">Kartu Kredit/Debit</p>
                          <p className="text-sm text-slate-600">Visa, Mastercard, JCB</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-600">2.9%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Pembayaran Aman</p>
                        <p className="text-sm text-blue-700">
                          Semua transaksi dilindungi dengan enkripsi SSL 256-bit
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                      disabled={loading}
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50"
                    >
                      {loading ? "Memproses..." : "Buat Pesanan"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Ringkasan Pesanan
              </h2>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item: any) => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-600">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900 flex-shrink-0">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    Rp {getTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Gratis ongkir seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Garansi uang kembali 100%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Pembayaran aman & terenkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
