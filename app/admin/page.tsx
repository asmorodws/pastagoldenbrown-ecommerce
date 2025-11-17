import { prisma } from "@/lib/prisma"
import { ShoppingBag, Package, Users, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

async function getStats() {
  try {
    const [totalProducts, totalOrders, totalUsers, totalRevenue, pendingOrders, deliveredOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.order.count({
        where: { status: "PENDING" }
      }),
      prisma.order.count({
        where: { status: "DELIVERED" }
      }),
    ])

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      deliveredOrders,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
    }
  }
}

async function getRecentOrders() {
  try {
    const orders = await prisma.order.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          }
        },
      },
    })
    return orders
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return []
  }
}

async function getLowStockProducts() {
  try {
    // Get variants with low stock
    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: {
          lte: 10,
        }
      },
      take: 5,
      orderBy: {
        stock: "asc",
      },
      include: {
        product: {
          include: {
            category: true,
          }
        }
      }
    })
    
    // Transform to include variant info with product
    return lowStockVariants.map((variant: any) => ({
      ...variant.product,
      variantInfo: {
        id: variant.id,
        name: variant.name,
        stock: variant.stock,
        sku: variant.sku,
      }
    }))
  } catch (error) {
    console.error("Error fetching low stock products:", error)
    return []
  }
}

export default async function AdminPage() {
  const stats = await getStats()
  const recentOrders = await getRecentOrders()
  const lowStockProducts = await getLowStockProducts()

  const statusLabels: Record<string, string> = {
    PENDING: "Menunggu",
    PROCESSING: "Diproses",
    SHIPPED: "Dikirim",
    DELIVERED: "Selesai",
    CANCELLED: "Dibatalkan",
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-600 mt-1">Selamat datang kembali! Berikut ringkasan toko Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-slate-700" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-slate-900">Rp {parseFloat(stats.totalRevenue.toString()).toLocaleString("id-ID")}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-slate-700" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
          <p className="text-xs text-slate-500 mt-2">{stats.pendingOrders} menunggu konfirmasi</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-slate-700" />
            </div>
            <span className="flex items-center gap-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              <TrendingDown className="w-4 h-4" />
              -2%
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Total Produk</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
          <p className="text-xs text-slate-500 mt-2">{lowStockProducts.length} stok menipis</p>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-700" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-4 h-4" />
              +15%
            </span>
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">Total Pengguna</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Pesanan Terbaru</h2>
            <Link 
              href="/admin/orders"
              className="text-sm text-slate-700 hover:text-slate-900 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Pelanggan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-mono text-slate-900">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{order.user.name}</p>
                        <p className="text-xs text-slate-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600">{order.items.length} produk</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-slate-900">
                        Rp {parseFloat(order.total.toString()).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "SHIPPED"
                            ? "bg-purple-100 text-purple-700"
                            : order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status === "PENDING" && <Clock className="w-3 h-3" />}
                        {order.status === "DELIVERED" && <CheckCircle className="w-3 h-3" />}
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Stok Menipis</h2>
            <Link 
              href="/admin/products"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product: any) => (
                <div key={`${product.id}-${product.variantInfo.id}`} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-500">{product.category.name}</p>
                      <span className="text-xs text-blue-600 font-medium">• {product.variantInfo.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{product.variantInfo.stock}</p>
                    <p className="text-xs text-slate-500">tersisa</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Semua produk stok aman</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
