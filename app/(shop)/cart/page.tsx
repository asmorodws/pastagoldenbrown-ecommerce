"use client"

import { useCartStore } from "@/store/cart"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Shield } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-4xl font-bold text-[#05347e] mb-4">Keranjang Belanja Kosong</h1>
            <p className="text-gray-600 text-lg mb-8">
              Belum ada produk di keranjang. Yuk mulai belanja dan temukan produk favoritmu!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#05347e] to-[#032252] text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-[#032252] hover:to-[#05347e] transition-all shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#05347e] mb-2">Keranjang Belanja</h1>
          <p className="text-gray-600">Kamu punya {items.length} produk di keranjang</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <Image
                      src={item.image || "/placeholder-product.jpg"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#05347e] mb-2 line-clamp-2">{item.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#db0705]">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                        <span className="text-gray-500 text-xs">/ item</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-[#05347e] hover:text-white transition-all"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-12 text-center text-xl font-bold text-[#05347e]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-[#05347e] hover:text-white transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {/* Subtotal & Delete */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                          <p className="text-lg font-bold text-[#05347e]">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-10 h-10 flex items-center justify-center text-[#db0705] hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#05347e] mb-6">Ringkasan Pesanan</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal ({items.length} item)</span>
                  <span className="font-bold text-sm text-[#05347e]">
                    Rp {getTotal().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Biaya Layanan</span>
                  <span className="font-bold text-sm text-[#05347e]">Rp 1.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Ongkir</span>
                  </div>
                  <span className="font-bold text-sm text-green-600">GRATIS</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-br from-[#c49c0f]/10 to-[#f0c514]/10 rounded-xl p-4 mb-6 border border-[#c49c0f]/30">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-[#05347e]">Total Pembayaran</span>
                  <span className="text-xl font-bold text-[#db0705]">
                    Rp {(getTotal() + 1000).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-r from-[#db0705] to-[#a60504] text-white text-center py-4 rounded-xl font-bold text-lg hover:from-[#a60504] hover:to-[#db0705] transition-all shadow-lg hover:shadow-xl mb-3"
              >
                Lanjut ke Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full text-center py-3 text-[#05347e] hover:text-[#032252] transition font-semibold"
              >
                Lanjut Belanja
              </Link>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Pembayaran 100% Aman</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Gratis Ongkir Seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-[#c49c0f]/20 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#c49c0f]" />
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
