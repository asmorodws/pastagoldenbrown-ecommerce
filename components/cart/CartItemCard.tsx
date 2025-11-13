"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, Package, AlertCircle, Shield } from "lucide-react"

interface CartItemCardProps {
  item: {
    id: string
    productId: string
    name: string
    image: string
    price: number
    quantity: number
    variant?: string
    variantLabel?: string
    stock?: number
    slug?: string
  }
  mode?: "cart" | "checkout" | "review"
  onQuantityChange?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
  productUrl?: string
  hasMultipleVariants?: boolean
  variantCount?: number
}

export default function CartItemCard({
  item,
  mode = "cart",
  onQuantityChange,
  onRemove,
  productUrl,
  hasMultipleVariants = false,
  variantCount = 1,
}: CartItemCardProps) {
  const lowStock = item.stock !== undefined && item.stock < 10
  const outOfStock = item.stock !== undefined && item.stock === 0

  // Cart mode - compact, editable
  if (mode === "cart") {
    return (
      <div className="p-4 hover:bg-slate-50/50 transition-colors">
        <div className="flex gap-4 items-start">
          {/* Product Image - Compact */}
          {productUrl ? (
            <Link href={productUrl}>
              <div className="relative w-20 h-20 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden ring-1 ring-slate-200 hover:ring-blue-500 transition-all cursor-pointer">
                <Image
                  src={item.image || "/placeholder-product.jpg"}
                  alt={item.name}
                  fill
                  className="object-contain p-1.5"
                />
                {outOfStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">Habis</span>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <div className="relative w-20 h-20 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden ring-1 ring-slate-200">
              <Image
                src={item.image || "/placeholder-product.jpg"}
                alt={item.name}
                fill
                className="object-contain p-1.5"
              />
            </div>
          )}

          {/* Product Info - Compact */}
          <div className="flex-1 min-w-0">
            {/* Name & Variant in one line */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                {productUrl ? (
                  <Link href={productUrl}>
                    <h3 className="font-bold text-sm text-blue-900 line-clamp-1 hover:text-blue-700 transition-colors cursor-pointer">
                      {item.name}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="font-bold text-sm text-blue-900 line-clamp-1">
                    {item.name}
                  </h3>
                )}
                
                {/* Variant Badge - Compact */}
                <div className="flex items-center gap-2 mt-1">
                  {item.variant && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      <Package className="w-2.5 h-2.5" />
                      {item.variantLabel || item.variant}
                    </span>
                  )}
                  
                  {/* Stock Indicator - Inline */}
                  {item.stock !== undefined && (
                    <>
                      {outOfStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Habis
                        </span>
                      ) : lowStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                          Sisa {item.stock}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                          <Shield className="w-2.5 h-2.5" />
                          Tersedia
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Delete Button - Top Right */}
              {onRemove && (
                <button
                  onClick={() => onRemove(item.id)}
                  className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Hapus item"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Price, Quantity & Subtotal in one row */}
            <div className="flex items-center justify-between gap-3">
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-900">
                  Rp {item.price.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-slate-500">/ item</span>
              </div>

              {/* Quantity Controls - Compact */}
              {onQuantityChange ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded hover:bg-slate-200 transition-all disabled:opacity-40"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-blue-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded hover:bg-slate-200 transition-all disabled:opacity-40"
                    disabled={outOfStock || (item.stock !== undefined && item.quantity >= item.stock)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {item.quantity}x
                </span>
              )}

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-xs text-slate-500">Subtotal</p>
                <p className="text-base font-bold text-blue-900">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Checkout mode - larger, read-only
  if (mode === "checkout") {
    return (
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all">
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
            {hasMultipleVariants && variantCount > 1 && (
              <span className="flex-shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                {variantCount} ukuran
              </span>
            )}
          </div>
          
          {/* Variant Badge - More Prominent */}
          {item.variant && (
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                <Package className="w-2.5 h-2.5" />
                {item.variantLabel || `Ukuran: ${item.variant}`}
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
  }

  // Review mode - compact for order summary
  if (mode === "review") {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
        <div className="relative w-16 h-16 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden">
          <Image
            src={item.image || "/placeholder-product.jpg"}
            alt={item.name}
            fill
            className="object-contain p-1.5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-blue-900 line-clamp-2 leading-tight">{item.name}</p>
          {item.variant && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mt-1">
              <Package className="w-2.5 h-2.5" />
              {item.variantLabel || item.variant}
            </span>
          )}
          <p className="text-xs text-slate-600 mt-1">
            {item.quantity}x @ Rp {item.price.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-blue-900">
            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    )
  }

  return null
}
