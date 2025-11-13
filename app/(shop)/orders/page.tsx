"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, Eye, Calendar, CreditCard, PackageCheck } from "lucide-react"

const statusConfig = {
  PENDING: {
    label: "Menunggu",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
    gradient: "from-yellow-500 to-yellow-600",
  },
  PROCESSING: {
    label: "Diproses",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Package,
    gradient: "from-blue-500 to-blue-600",
  },
  SHIPPED: {
    label: "Dikirim",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
    gradient: "from-purple-500 to-purple-600",
  },
  DELIVERED: {
    label: "Selesai",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    gradient: "from-green-500 to-green-600",
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    gradient: "from-red-500 to-red-600",
  },
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        const data = await response.json()

        if (response.ok) {
          setOrders(data.orders)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchOrders()
    }
  }, [session])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600">Memuat pesanan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Pesanan Saya</h1>
          <p className="text-slate-600">Pantau status dan riwayat pesanan Anda</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Belum Ada Pesanan</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Anda belum memiliki pesanan. Jelajahi koleksi produk kami dan mulai belanja sekarang!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const config = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = config.icon

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <StatusIcon className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-white/80 text-sm mb-1">Order ID</p>
                          <p className="text-xl font-bold">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-sm mb-1">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-white">
                          Rp {parseFloat(order.total).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Order Info */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className={`px-4 py-2 rounded-full border-2 ${config.color} font-semibold text-sm`}>
                        {config.label}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
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
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
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
                              {item.quantity} item × Rp {parseFloat(item.price).toLocaleString("id-ID")}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-lg text-slate-900">
                              Rp {(parseFloat(item.price) * item.quantity).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <p className="font-semibold text-blue-900 mb-2">Alamat Pengiriman</p>
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold">{order.shippingName}</p>
                        <p>{order.shippingAddress}</p>
                        <p>
                          {order.shippingCity}, {order.shippingZip}
                        </p>
                        <p>{order.shippingCountry}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/orders/${order.id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                      Lihat Detail Pesanan
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
