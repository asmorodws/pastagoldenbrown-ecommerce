"use client"

import Link from "next/link"
import { Truck, Shield, Tag } from "lucide-react"

interface OrderSummaryProps {
  subtotal: number
  itemCount: number
  serviceFee?: number
  shippingFee?: number
  showCheckoutButton?: boolean
  checkoutUrl?: string
  showContinueShopping?: boolean
  continueShoppingUrl?: string
  isProcessing?: boolean
}

export default function OrderSummary({
  subtotal,
  itemCount,
  serviceFee = 1000,
  shippingFee = 0,
  showCheckoutButton = true,
  checkoutUrl = "/checkout",
  showContinueShopping = true,
  continueShoppingUrl = "/products",
  isProcessing = false,
}: OrderSummaryProps) {
  const total = subtotal + serviceFee + shippingFee

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-24">
      <h2 className="text-lg font-bold text-blue-900 mb-5">Ringkasan Pesanan</h2>
      
      {/* Summary Details */}
      <div className="space-y-3 mb-5 pb-5 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Subtotal ({itemCount} item)</span>
          <span className="font-bold text-sm text-blue-900">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>
        
        {serviceFee > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Biaya Layanan</span>
            <span className="font-bold text-sm text-blue-900">
              Rp {serviceFee.toLocaleString("id-ID")}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-green-600" />
            <span className="text-sm text-slate-600">Ongkir</span>
          </div>
          <span className="font-bold text-sm text-green-600">
            {shippingFee === 0 ? "GRATIS" : `Rp ${shippingFee.toLocaleString("id-ID")}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-5 border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-blue-900">Total</span>
          <span className="text-xl font-bold text-blue-900">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {showCheckoutButton && (
        <Link
          href={checkoutUrl}
          className={`block w-full bg-blue-800 text-white text-center py-3.5 rounded-lg font-bold hover:bg-blue-900 transition-all shadow-md hover:shadow-lg mb-2 ${
            isProcessing ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {isProcessing ? 'Memproses...' : 'Lanjut ke Checkout'}
        </Link>
      )}

      {showContinueShopping && (
        <Link
          href={continueShoppingUrl}
          className="block w-full text-center py-2.5 text-blue-800 hover:text-blue-900 transition text-sm font-semibold"
        >
          Lanjut Belanja
        </Link>
      )}

      {/* Benefits - Compact */}
      <div className="mt-5 pt-5 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-green-600" />
          </div>
          <span>Pembayaran 100% Aman</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span>Gratis Ongkir Seluruh Indonesia</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span>Garansi Produk Original</span>
        </div>
      </div>
    </div>
  )
}
