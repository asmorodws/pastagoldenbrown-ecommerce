"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCartStore } from "@/store/cart"
import toast from "react-hot-toast"
import { ShoppingBag, MapPin, CreditCard, CheckCircle, Truck, Phone, Mail, User, Home, Building2, AlertCircle } from "lucide-react"
import CartItemCard from "@/components/cart/CartItemCard"
import OrderSummary from "@/components/cart/OrderSummary"
import AddressSelector from "@/components/AddressSelector"
import ShippingSelector from "@/components/checkout/ShippingSelector"

interface SelectedAddress {
  id: string
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  province: string
  zipCode: string
  country: string
  isDefault: boolean
  cityId?: string | null
  provinceId?: string | null
  districtId?: string | null
}

interface ShippingOption {
  courier: string
  courierName: string
  service: string
  serviceName: string
  cost: number
  etd: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [formData, setFormData] = useState({
    notes: "",
  })

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!session) {
      router.push("/auth/login")
    } else if (items.length === 0) {
      router.push("/cart")
    }
  }, [session, items, router])

  // Calculate total weight from cart items (in grams)
  // Assuming each product has a weight of 500g by default (you'll need to add weight field to Product model)
  const getTotalWeight = () => {
    const DEFAULT_WEIGHT = 500 // grams per item
    return items.reduce((total, item) => {
      const itemWeight = (item as any).weight || DEFAULT_WEIGHT
      return total + (itemWeight * item.quantity)
    }, 0)
  }

  // Show loading while checking auth or redirecting
  if (!session || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat...</p>
        </div>
      </div>
    )
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate address is selected
    if (!selectedAddress) {
      toast.error("Pilih alamat pengiriman terlebih dahulu")
      return
    }

    // Validate shipping is selected (only if cityId exists)
    if (selectedAddress.cityId && !selectedShipping) {
      toast.error("Pilih metode pengiriman terlebih dahulu")
      return
    }

    setLoading(true)

    try {
      const shippingData: any = {
        name: selectedAddress.recipientName,
        email: session?.user?.email || "",
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        zip: selectedAddress.zipCode,
        country: selectedAddress.country,
        province: selectedAddress.province,
        paymentMethod,
      }

      // Add shipping details if available
      if (selectedShipping) {
        shippingData.courier = selectedShipping.courier
        shippingData.courierName = selectedShipping.courierName
        shippingData.service = selectedShipping.service
        shippingData.serviceName = selectedShipping.serviceName
        shippingData.shippingCost = selectedShipping.cost
        shippingData.etd = selectedShipping.etd
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping: shippingData,
          addressId: selectedAddress.id,
          notes: formData.notes,
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

  const shippingCost = selectedShipping?.cost || 0
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
                      <CartItemCard
                        key={item.id}
                        item={item}
                        mode="checkout"
                        hasMultipleVariants={hasMultipleVariants}
                        variantCount={productVariants.length}
                      />
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900">Informasi Pengiriman</h2>
                  </div>
                </div>

                {/* Address Selector */}
                <AddressSelector
                  selectedAddressId={selectedAddress?.id}
                  onSelectAddress={(addr) => {
                    console.log('Selected address:', addr)
                    console.log('Has cityId:', !!addr.cityId, 'Value:', addr.cityId)
                    setSelectedAddress(addr)
                  }}
                />

                {/* Shipping Selector - shown only when address has cityId (RajaOngkir available) */}
                {selectedAddress?.cityId && (
                  <div className="mt-6">
                    <ShippingSelector
                      destinationCityId={selectedAddress.cityId}
                      destinationDistrictId={selectedAddress.districtId || undefined}
                      totalWeight={getTotalWeight()}
                      onSelectShipping={(shipping) => setSelectedShipping(shipping)}
                      selectedShipping={selectedShipping || undefined}
                    />
                  </div>
                )}

                {/* Warning if no cityId (manual input mode) */}
                {selectedAddress && !selectedAddress.cityId && (
                  <div className="mt-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <p className="text-amber-800 font-semibold mb-2">⚠️ Perhitungan Ongkir Otomatis Tidak Tersedia</p>
                    <p className="text-amber-700 text-sm mb-3">
                      Alamat ini dibuat dengan input manual. Untuk mengaktifkan perhitungan ongkir otomatis, silakan:
                    </p>
                    <ol className="text-amber-700 text-sm list-decimal list-inside space-y-1">
                      <li>Klik tombol edit alamat (ikon pensil)</li>
                      <li>Gunakan fitur pencarian lokasi (ketik nama kota/kecamatan)</li>
                      <li>Pilih lokasi dari hasil pencarian</li>
                      <li>Simpan alamat</li>
                    </ol>
                    <p className="text-amber-700 text-sm mt-3 font-semibold">
                      Atau tambah alamat baru dengan fitur pencarian untuk perhitungan ongkir otomatis.
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedAddress && (
                  <div className="mt-6 space-y-4">
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
                        type="button"
                        onClick={() => {
                          // Only require shipping selection if cityId exists (RajaOngkir available)
                          if (selectedAddress?.cityId && !selectedShipping) {
                            toast.error("Pilih metode pengiriman terlebih dahulu")
                            return
                          }
                          setCurrentStep(3)
                        }}
                        className="flex-1 py-4 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
                      >
                        Lanjut ke Pembayaran
                      </button>
                    </div>
                  </div>
                )}
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
                          <CartItemCard
                            key={item.id}
                            item={item}
                            mode="review"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info Review */}
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Informasi Pengiriman
                      </h3>
                      {selectedAddress && (
                        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {selectedAddress.label}
                            </span>
                            {selectedAddress.isDefault && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Nama:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{selectedAddress.recipientName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Email:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{session?.user?.email}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Telepon:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{selectedAddress.phone}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Alamat:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{selectedAddress.address}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Kota:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{selectedAddress.city}, {selectedAddress.province}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <span className="text-slate-600">Kode Pos:</span>
                            <span className="col-span-2 font-semibold text-blue-900">{selectedAddress.zipCode}</span>
                          </div>
                          {selectedShipping && (
                            <>
                              <div className="border-t border-slate-300 my-3"></div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-slate-600">Kurir:</span>
                                <span className="col-span-2 font-semibold text-blue-900">{selectedShipping.courierName}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-slate-600">Layanan:</span>
                                <span className="col-span-2 font-semibold text-blue-900">{selectedShipping.service} - {selectedShipping.serviceName}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-slate-600">Estimasi:</span>
                                <span className="col-span-2 font-semibold text-blue-900">{selectedShipping.etd} hari</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-slate-600">Biaya:</span>
                                <span className="col-span-2 font-bold text-green-600">Rp {selectedShipping.cost.toLocaleString("id-ID")}</span>
                              </div>
                            </>
                          )}
                          {formData.notes && (
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <span className="text-slate-600">Catatan:</span>
                              <span className="col-span-2 font-semibold text-blue-900">{formData.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
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
                            <span className="font-semibold">
                              {shippingCost > 0 ? `Rp ${shippingCost.toLocaleString("id-ID")}` : "Rp 0"}
                            </span>
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
                  <CartItemCard
                    key={item.id}
                    item={item}
                    mode="review"
                  />
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
                  <span className="font-semibold text-blue-900">
                    {shippingCost > 0 ? `Rp ${shippingCost.toLocaleString("id-ID")}` : "Rp 0"}
                  </span>
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
                  <span>Ongkir dihitung otomatis dari RajaOngkir</span>
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
