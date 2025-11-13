"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Package, Truck, MapPin, Clock, CreditCard, Phone, Mail, ArrowLeft, Download, PackageCheck } from "lucide-react"

const statusConfig = {
  PENDING: {
    label: "Menunggu Pembayaran",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
    gradient: "from-yellow-500 to-yellow-600",
  },
  PROCESSING: {
    label: "Sedang Diproses",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Package,
    gradient: "from-blue-500 to-blue-600",
  },
  SHIPPED: {
    label: "Dalam Pengiriman",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
    gradient: "from-purple-500 to-purple-600",
  },
  DELIVERED: {
    label: "Pesanan Selesai",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    gradient: "from-green-500 to-green-600",
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: Package,
    gradient: "from-red-500 to-red-600",
  },
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setOrder(data.order)
        } else {
          router.push("/orders")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        router.push("/orders")
      } finally {
        setLoading(false)
      }
    }

    if (session && params.id) {
      fetchOrder()
    }
  }, [session, params.id, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600">Memuat detail pesanan...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-700 mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Pesanan
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Detail Pesanan</h1>
          <p className="text-slate-600">Order ID: #{order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        {/* Status Banner */}
        <div className={`bg-gradient-to-r ${statusInfo.gradient} rounded-2xl shadow-lg p-6 mb-8 text-white`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <StatusIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-sm mb-1">Status Pesanan</p>
              <h2 className="text-2xl font-bold">{statusInfo.label}</h2>
              <p className="text-white/80 text-sm mt-1">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm mb-1">Total Pembayaran</p>
              <p className="text-3xl font-bold text-white">
                Rp {parseFloat(order.total).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produk yang Dipesan
              </h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image || "/placeholder-product.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      
                      {/* Variant Badge */}
                      {item.variantName && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium mt-2">
                          <PackageCheck className="w-3.5 h-3.5" />
                          {item.variantName}
                        </div>
                      )}
                      
                      <p className="text-sm text-slate-600 mt-2">
                        Jumlah: {item.quantity} x Rp {parseFloat(item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-slate-900">
                        Rp {(parseFloat(item.price) * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    Rp {parseFloat(order.total).toLocaleString("id-ID")}
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
                        Rp {parseFloat(order.total).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline Pesanan
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${statusInfo.gradient} flex items-center justify-center`}>
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-bold text-slate-900">Pesanan Dibuat</p>
                    <p className="text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${["SHIPPED", "DELIVERED"].includes(order.status) ? "from-blue-500 to-blue-600" : "from-slate-300 to-slate-400"} flex items-center justify-center`}>
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-bold text-slate-900">Pesanan Diproses</p>
                      <p className="text-sm text-slate-600">Pesanan sedang disiapkan</p>
                    </div>
                  </div>
                )}

                {["SHIPPED", "DELIVERED"].includes(order.status) && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${order.status === "DELIVERED" ? "from-purple-500 to-purple-600" : "from-slate-300 to-slate-400"} flex items-center justify-center`}>
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-bold text-slate-900">Pesanan Dikirim</p>
                      <p className="text-sm text-slate-600">Dalam perjalanan ke alamat tujuan</p>
                    </div>
                  </div>
                )}

                {order.status === "DELIVERED" && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">Pesanan Selesai</p>
                      <p className="text-sm text-slate-600">Pesanan telah diterima</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Alamat Pengiriman
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-bold text-slate-900">{order.shippingName}</p>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{order.shippingPhone || "-"}</p>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{order.shippingEmail}</p>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{order.shippingAddress}</p>
                    <p>{order.shippingCity}, {order.shippingZip}</p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Metode Pembayaran
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="font-semibold text-slate-900 mb-1">
                  {order.paymentMethod === "bank_transfer" && "Transfer Bank"}
                  {order.paymentMethod === "ewallet" && "E-Wallet"}
                  {order.paymentMethod === "credit_card" && "Kartu Kredit"}
                  {!order.paymentMethod && "Transfer Bank"}
                </p>
                <p className="text-sm text-slate-600">
                  {order.status === "PENDING" ? "Menunggu pembayaran" : "Pembayaran diterima"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Butuh Bantuan?</h3>
              <p className="text-sm text-white/80 mb-4">
                Hubungi customer service kami untuk informasi lebih lanjut
              </p>
              <button className="w-full py-3 bg-white text-blue-800 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-md">
                Hubungi CS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
