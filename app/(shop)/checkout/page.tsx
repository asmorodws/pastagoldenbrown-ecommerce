"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartStore } from "@/store/cart"
import toast from "react-hot-toast"
import Image from "next/image"
import { ShoppingBag, MapPin, CreditCard, CheckCircle, Truck, Phone, Mail, User, Home, Building2, AlertCircle } from "lucide-react"

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

  // Group items by productId to show which products have multiple variants
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = []
    }
    acc[item.productId].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Checkout</h1>
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
                            ? "bg-green-600 text-white shadow-lg"
                            : isActive
                            ? "bg-blue-800 text-white shadow-lg"
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
                          isActive || isCompleted ? "text-blue-900" : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                          isCompleted ? "bg-green-600" : "bg-slate-200"
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
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Keranjang */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">Keranjang Belanja</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item: any) => {
                    // Check if this product has multiple variants in cart
                    const productVariants = groupedItems[item.productId] || []
                    const hasMultipleVariants = productVariants.length > 1
                    
                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
                        <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-xl overflow-hidden ring-2 ring-slate-100">
                          <Image
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <p className="font-bold text-blue-900 line-clamp-2 flex-1">{item.name}</p>
                            {hasMultipleVariants && (
                              <span className="flex-shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                                {productVariants.length} ukuran
                              </span>
                            )}
                          </div>
                          
                          {/* Variant Badge - More Prominent */}
                          {item.variant && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg shadow-sm">
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Ukuran: {item.variant}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-600">Jumlah:</span>
                            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                          <p className="font-bold text-xl text-blue-900">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            @Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-4 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
                >
                  Lanjut ke Pengiriman
                </button>
              </div>
            )}

            {/* Step 2: Informasi Pengiriman */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">Informasi Pengiriman</h2>
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
                      className="flex-1 py-4 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
                    >
                      Lanjut ke Pembayaran
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Metode Pembayaran */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">Metode Pembayaran</h2>
                </div>

                <div className="space-y-4">
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
                          <p className="font-bold text-blue-900">Transfer Bank</p>
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
                          <p className="font-bold text-blue-900">E-Wallet</p>
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
                          <p className="font-bold text-blue-900">Kartu Kredit/Debit</p>
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
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 py-4 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
                    >
                      Review Pesanan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Konfirmasi */}
            {currentStep === 4 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900">Review & Konfirmasi Pesanan</h2>
                  </div>

                  {/* Order Summary Section */}
                  <div className="space-y-6">
                    {/* Items Review */}
                    <div>
                      <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Produk yang Dipesan ({items.length} item)
                      </h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                              <Image
                                src={item.image || "/placeholder-product.jpg"}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-blue-900 line-clamp-1">{item.name}</p>
                              {item.variant && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded">
                                  {item.variant}
                                </span>
                              )}
                              <p className="text-xs text-slate-600 mt-1">Qty: {item.quantity} × Rp {item.price.toLocaleString("id-ID")}</p>
                            </div>
                            <p className="text-sm font-bold text-blue-900">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info Review */}
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Informasi Pengiriman
                      </h3>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-slate-600">Nama:</span>
                          <span className="col-span-2 font-semibold text-blue-900">{formData.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-slate-600">Email:</span>
                          <span className="col-span-2 font-semibold text-blue-900">{formData.email}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-slate-600">Telepon:</span>
                          <span className="col-span-2 font-semibold text-blue-900">{formData.phone}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-slate-600">Alamat:</span>
                          <span className="col-span-2 font-semibold text-blue-900">{formData.address}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-slate-600">Kota:</span>
                          <span className="col-span-2 font-semibold text-blue-900">{formData.city}, {formData.province}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <span className="text-slate-600">Kode Pos:</span>
                          <span className="col-span-2 font-semibold text-blue-900">{formData.zip}</span>
                        </div>
                        {formData.notes && (
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Catatan:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{formData.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Review */}
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Metode Pembayaran
                      </h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="font-semibold text-blue-900">
                          {paymentMethod === "bank_transfer" && "Transfer Bank (BCA, Mandiri, BNI, BRI)"}
                          {paymentMethod === "ewallet" && "E-Wallet (GoPay, OVO, DANA, ShopeePay)"}
                          {paymentMethod === "credit_card" && "Kartu Kredit/Debit (Visa, Mastercard, JCB)"}
                        </p>
                      </div>
                    </div>

                    {/* Total Price Summary */}
                    <div className="border-t border-slate-200 pt-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <div className="space-y-3">
                          <div className="flex justify-between text-blue-900">
                            <span>Subtotal</span>
                            <span className="font-semibold">Rp {getTotal().toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex justify-between text-blue-900">
                            <span>Ongkos Kirim</span>
                            <span className="font-semibold text-green-600">Gratis</span>
                          </div>
                          <div className="border-t border-blue-300 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-blue-900">Total Pembayaran</span>
                              <span className="text-2xl font-bold text-blue-900">
                                Rp {totalAmount.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">Perhatian</p>
                          <p className="text-sm text-amber-800">
                            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku. 
                            Pastikan semua informasi yang Anda berikan sudah benar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={loading}
                      className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Konfirmasi & Buat Pesanan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Ringkasan Pesanan
                </h2>
                <span className="text-sm font-bold text-white bg-blue-600 px-2.5 py-1 rounded-full">
                  {items.length}
                </span>
              </div>
              
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden ring-1 ring-slate-200">
                      <Image
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-blue-900 line-clamp-2 leading-tight">{item.name}</p>
                      
                      {/* Variant Badge */}
                      {item.variant && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-md">
                            <ShoppingBag className="w-2.5 h-2.5" />
                            {item.variant}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-600">Qty: <span className="font-bold text-blue-900">{item.quantity}</span></p>
                        <p className="text-sm font-bold text-blue-900">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-blue-900">
                    Rp {getTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-900">Total Pembayaran</span>
                      <span className="text-2xl font-bold text-blue-900">
                        Rp {totalAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
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
