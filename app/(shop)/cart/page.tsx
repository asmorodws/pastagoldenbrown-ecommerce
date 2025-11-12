"use client"

import { useCartStore } from "@/store/cart"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield, Package, AlertCircle, TrendingDown, RefreshCw, Eye } from "lucide-react"
import { useState } from "react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, removeProductAllVariants, updateVariant } = useCartStore()
  const [changingVariant, setChangingVariant] = useState<string | null>(null)

  // Group items by productId for better visual organization
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = []
    }
    acc[item.productId].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Calculate savings for bulk sizes
  const calculateSavings = (productItems: typeof items) => {
    if (productItems.length < 2) return null
    
    // Find smallest and largest size
    const sortedBySize = [...productItems].sort((a, b) => {
      const aSize = parseFloat(a.variant || '0')
      const bSize = parseFloat(b.variant || '0')
      return aSize - bSize
    })
    
    const smallest = sortedBySize[0]
    const largest = sortedBySize[sortedBySize.length - 1]
    
    if (!smallest.variant || !largest.variant) return null
    
    const smallSize = parseFloat(smallest.variant)
    const largeSize = parseFloat(largest.variant)
    
    if (smallSize === 0 || largeSize === 0) return null
    
    const pricePerGramSmall = smallest.price / smallSize
    const pricePerGramLarge = largest.price / largeSize
    
    const savingsPercent = ((pricePerGramSmall - pricePerGramLarge) / pricePerGramSmall) * 100
    
    if (savingsPercent > 5) {
      return {
        smallVariant: smallest.variant,
        largeVariant: largest.variant,
        savingsPercent: savingsPercent.toFixed(0)
      }
    }
    
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-blue-300" />
            </div>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Keranjang Belanja Kosong</h1>
            <p className="text-slate-600 text-lg mb-8">
              Belum ada produk di keranjang. Yuk mulai belanja dan temukan produk favoritmu!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Mulai Belanja
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Keranjang Belanja</h1>
          <p className="text-slate-600">
            Kamu punya {items.length} item di keranjang
            {Object.keys(groupedItems).length < items.length && 
              ` dari ${Object.keys(groupedItems).length} produk`
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(([productId, productItems]) => {
              const hasMultipleVariants = productItems.length > 1
              const savings = calculateSavings(productItems)
              
              return (
                <div
                  key={productId}
                  className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Product Header */}
                  {hasMultipleVariants && (
                    <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-3 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-semibold text-blue-900">
                            {productItems[0].name} - {productItems.length} varian ukuran
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus semua varian ${productItems[0].name} dari keranjang?`)) {
                              removeProductAllVariants(productId)
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus Semua
                        </button>
                      </div>
                    </div>
                  )}

                  

                  {/* Variant Items */}
                  <div className={hasMultipleVariants ? "divide-y divide-slate-100" : ""}>
                    {productItems.map((item: any) => {
                      const isChangingVariant = changingVariant === item.id
                      const lowStock = item.stock !== undefined && item.stock < 10
                      const outOfStock = item.stock !== undefined && item.stock === 0
                      
                      return (
                        <div
                          key={item.id}
                          className="p-6 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex gap-6">
                            {/* Product Image - Clickable */}
                            <Link href={`/products/${item.slug || item.productId}`}>
                              <div className="relative w-28 h-28 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden ring-2 ring-slate-100 hover:ring-blue-500 transition-all cursor-pointer">
                                <Image
                                  src={item.image || "/placeholder-product.jpg"}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-2"
                                />
                                {outOfStock && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">Habis</span>
                                  </div>
                                )}
                              </div>
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                {/* Product Name - Clickable */}
                                <Link href={`/products/${item.slug || item.productId}`}>
                                  <h3 className="font-bold text-base text-blue-900 mb-1 line-clamp-2 hover:text-blue-700 transition-colors cursor-pointer">
                                    {item.name}
                                  </h3>
                                </Link>
                                
                                {/* Variant Selector or Badge */}
                                {isChangingVariant && item.allVariants && item.allVariants.length > 1 ? (
                                  <div className="flex items-center gap-2 mb-3">
                                    <select
                                      value={item.variant}
                                      onChange={(e) => {
                                        const newVariant = e.target.value
                                        updateVariant(item.id, newVariant, `Ukuran: ${newVariant}`)
                                        setChangingVariant(null)
                                      }}
                                      className="px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      autoFocus
                                    >
                                      {item.allVariants.map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => setChangingVariant(null)}
                                      className="text-xs text-slate-600 hover:text-slate-800"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                                      <Package className="w-3.5 h-3.5" />
                                      {item.variant}
                                    </div>
                                    {item.allVariants && item.allVariants.length > 1 && (
                                      <button
                                        onClick={() => setChangingVariant(item.id)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        title="Ubah ukuran"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                        Ubah
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Stock Indicator */}
                                {item.stock !== undefined && (
                                  <div className="mb-2">
                                    {outOfStock ? (
                                      <div className="inline-flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                                        <AlertCircle className="w-3 h-3" />
                                        Stok Habis
                                      </div>
                                    ) : lowStock ? (
                                      <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                        <AlertCircle className="w-3 h-3" />
                                        Stok Tersisa: {item.stock}
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                        <Shield className="w-3 h-3" />
                                        Stok Tersedia
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between gap-3 mt-2">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-900">
                                      Rp {item.price.toLocaleString("id-ID")}
                                    </span>
                                    <span className="text-slate-500 text-xs">/ item</span>
                                  </div>
                                  
                                  {/* View Detail Button - Simple Icon */}
                                  <Link 
                                    href={`/products/${item.slug || item.productId}`}
                                    className="flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all group"
                                    title="Lihat Detail Produk"
                                  >
                                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </Link>
                                </div>
                              </div>

                              {/* Quantity Controls & Actions */}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-800 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="w-12 text-center text-lg font-bold text-blue-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-blue-800 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-slate-100 disabled:hover:text-slate-400"
                                    disabled={outOfStock || (item.stock !== undefined && item.quantity >= item.stock)}
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>

                                {/* Subtotal & Delete */}
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-0.5">Subtotal</p>
                                    <p className="text-lg font-bold text-blue-900">
                                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Hapus item"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-blue-900 mb-6">Ringkasan Pesanan</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Subtotal ({items.length} item)</span>
                  <span className="font-bold text-sm text-blue-900">
                    Rp {getTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Biaya Layanan</span>
                  <span className="font-bold text-sm text-blue-900">Rp 1.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600">Ongkir</span>
                  </div>
                  <span className="font-bold text-sm text-green-600">GRATIS</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-blue-900">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-blue-900">
                    Rp {(getTotal() + 1000).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full bg-blue-800 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl mb-3"
              >
                Lanjut ke Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center py-3 text-blue-800 hover:text-blue-900 transition font-semibold"
              >
                Lanjut Belanja
              </Link>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Pembayaran 100% Aman</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Gratis Ongkir Seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>Garansi Produk Original</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
