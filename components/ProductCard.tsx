"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Percent, Eye, Package } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  discount?: number
  discountPrice?: number
  image?: string
  slug: string
  stock?: number
}

export default function ProductCard({
  id,
  name,
  price,
  discount,
  discountPrice,
  image,
  slug,
  stock = 99,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasDiscount = discount && discount > 0
  const displayPrice = hasDiscount ? discountPrice : price
  const isLowStock = stock <= 5 && stock > 0
  const isOutOfStock = stock === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-800 flex flex-col h-full ${
        isOutOfStock ? "opacity-70" : ""
      }`}
    >
      {/* Clickable overlay */}
      <Link
        href={`/products/${slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Lihat detail ${name}`}
      />

      {/* Product Image - Fixed Height */}
      <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
        {!imageError && image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-contain p-4 transition-transform duration-500 ${
              isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-105"
            }`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <Package size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">Gambar tidak tersedia</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {hasDiscount && !isOutOfStock && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-md bg-gradient-to-r from-red-600 to-red-700">
              <Percent size={12} className="shrink-0" />
              -{Math.round(discount)}%
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium text-amber-800 bg-amber-100 border border-amber-200">
              <Package size={10} />
              Sisa {stock}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-20 backdrop-blur-sm">
            <span className="text-white font-bold text-sm tracking-wide">
              STOK HABIS
            </span>
          </div>
        )}
      </div>

      {/* Product Info - Flex grow to fill remaining space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Title - Fixed height dengan line-clamp */}
        <h3
          className={`font-medium text-sm md:text-base leading-snug text-gray-800 group-hover:text-blue-800 transition-colors duration-200 mb-3 ${
            isOutOfStock ? "text-gray-400" : ""
          } line-clamp-2 min-h-[2.5rem]`}
        >
          {name}
        </h3>

        {/* Price Section - Margin top auto untuk push ke bawah */}
        <div className="space-y-2 mt-auto">
          <div className="text-[11px] text-gray-500 uppercase font-medium">
            Harga
          </div>
          <div className="flex items-baseline gap-2 flex-wrap min-h-[2rem]">
            <span
              className={`text-lg md:text-xl font-bold ${
                isOutOfStock ? "text-gray-400" : "text-gray-900"
              }`}
            >
              Rp {displayPrice?.toLocaleString("id-ID")}
            </span>
            {hasDiscount && !isOutOfStock && (
              <span className="text-xs md:text-sm text-gray-400 line-through">
                Rp {price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-2 pt-3 mt-3 border-t border-gray-100">
          <button
            className={`flex-1 relative z-20 inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 active:scale-95 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900 text-white shadow-sm hover:shadow-md"
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!isOutOfStock) {
                console.log(`Add to cart: ${id}`)
              }
            }}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">{isOutOfStock ? "Stok Habis" : "Tambah"}</span>
            <span className="sm:hidden">{isOutOfStock ? "Habis" : "+"}</span>
          </button>

          <button
            className="relative z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 md:p-2.5 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log(`Quick view: ${id}`)
            }}
            aria-label="Lihat detail"
          >
            <Eye size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* Skeleton Loader */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="h-56 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

/* Error State */
export function ProductCardError({ retry }: { retry?: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
      <div className="text-red-600 mb-3 text-sm font-medium">
        ⚠️ Gagal memuat produk
      </div>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  )
}
