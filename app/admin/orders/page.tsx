"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Eye, X, Package, MapPin, User, CreditCard, Clock } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

const statusOptions = [
  { value: "PENDING", label: "Menunggu", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "PROCESSING", label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "SHIPPED", label: "Dikirim", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "DELIVERED", label: "Selesai", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "CANCELLED", label: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-200" },
]

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success("Status pesanan berhasil diupdate")
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        const data = await response.json()
        toast.error(data.error || "Gagal mengupdate status pesanan")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.orderCode && order.orderCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || "bg-slate-100 text-slate-700"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Kelola Pesanan</h1>
        <p className="text-slate-600 mt-1">Pantau dan kelola semua pesanan pelanggan</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari order ID, nama, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 appearance-none cursor-pointer"
            >
              <option value="">Semua Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <p>Menampilkan {filteredOrders.length} dari {orders.length} pesanan</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Pelanggan</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Items</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Tanggal</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">Tidak ada pesanan yang ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono text-slate-900">{order.orderCode || `#${order.id.slice(0, 8)}`}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-900">{order.user.name}</p>
                        <p className="text-xs text-slate-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">{order.items.length} produk</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-900">
                        Rp {parseFloat(order.total).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p className="text-slate-900">{new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
                        <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Detail Pesanan</h2>
                <p className="text-sm text-slate-600 mt-1">Order ID: {selectedOrder.orderCode || `#${selectedOrder.id.slice(0, 8)}`}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Informasi Pelanggan</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">Nama</p>
                    <p className="font-medium text-slate-900">{selectedOrder.user.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{selectedOrder.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Alamat Pengiriman</h3>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-slate-900">{selectedOrder.shippingName}</p>
                  <p className="text-slate-600">{selectedOrder.shippingAddress}</p>
                  <p className="text-slate-600">{selectedOrder.shippingCity}, {selectedOrder.shippingZip}</p>
                  <p className="text-slate-600">{selectedOrder.shippingCountry}</p>
                  <p className="text-slate-600">{selectedOrder.shippingEmail}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Produk yang Dipesan</h3>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder-product.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.product.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          Rp {parseFloat(item.price).toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-slate-600">
                          per item
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Ringkasan Pembayaran</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-900">
                      Rp {parseFloat(selectedOrder.subtotal || selectedOrder.total).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ongkos Kirim</span>
                    <span className="font-medium text-slate-900">
                      {selectedOrder.shippingCost > 0 ? `Rp ${parseFloat(selectedOrder.shippingCost).toLocaleString("id-ID")}` : "Gratis"}
                    </span>
                  </div>
                  {selectedOrder.courier && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Kurir</span>
                      <span className="font-medium text-slate-900">
                        {selectedOrder.courier.toUpperCase()} - {selectedOrder.courierService || "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-lg text-slate-900">
                      Rp {parseFloat(selectedOrder.total).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Status Pesanan</h3>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(selectedOrder.status)}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
