"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Percent, Eye, Package } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart"
import toast from "react-hot-toast"

interface ProductCardProps {
  id: string
  name: string
  price: number
  discount?: number
  discountPrice?: number
  image?: string
  slug: string
  stock?: number
  variants?: Array<{
    id: string
    name: string
    stock: number
    price?: number
  }>
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
  variants = [],
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  
  // Hitung diskon dengan benar
  // hasDiscount hanya true jika ada discount > 0
  const hasDiscount = discount && discount > 0
  
  // Hitung harga setelah diskon
  const displayPrice = hasDiscount 
    ? price - (price * discount / 100)
    : price
  
  // Gunakan persentase diskon langsung dari field discount
  const actualDiscountPercent = hasDiscount ? Math.round(discount) : 0
  
  // Calculate total stock from all variants
  const totalStock = variants.length > 0 
    ? variants.reduce((sum, v) => sum + v.stock, 0)
    : stock
    
  const isLowStock = totalStock <= 5 && totalStock > 0
  const isOutOfStock = totalStock === 0
  
  // Get variant info for display
  const variantNames = variants.map(v => v.name).join(', ')
  const hasVariants = variants.length > 0

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isOutOfStock) return

    // Jika produk punya lebih dari 1 variant, arahkan ke halaman detail
    if (variants.length > 1) {
      toast.success("Silakan pilih variant terlebih dahulu", {
        icon: "📦",
        duration: 2000,
      })
      router.push(`/products/${slug}`)
      return
    }

    // Jika hanya ada 1 variant atau tidak ada variant, langsung tambahkan ke cart
    const variantToAdd = variants.length === 1 ? variants[0] : null
    
    addItem({
      id: variantToAdd ? `${id}-${variantToAdd.id}` : id,
      productId: id,
      productVariantId: variantToAdd?.id,
      name: name,
      slug: slug,
      price: variantToAdd?.price || displayPrice || price,
      image: image || "/placeholder-product.jpg",
      stock: variantToAdd?.stock || stock,
      variant: variantToAdd?.name,
    })

    toast.success(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={image || "/placeholder-product.jpg"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Ditambahkan ke keranjang</p>
            <p className="text-xs text-gray-600 truncate max-w-[200px]">{name}</p>
          </div>
        </div>
      ),
      {
        duration: 3000,
        style: {
          background: '#fff',
          color: '#111',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          padding: '12px',
        },
      }
    )
  }

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
      <div className="relative h-40 md:h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
        {!imageError && image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-contain p-3 transition-transform duration-500 ${
              isOutOfStock ? "grayscale opacity-50" : "group-hover:scale-105"
            }`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <Package size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">Gambar tidak tersedia</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5">
          {hasDiscount && !isOutOfStock && actualDiscountPercent > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white shadow-md bg-gradient-to-r from-red-600 to-red-700">
              <Percent size={11} className="shrink-0" />
              -{actualDiscountPercent}%
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-amber-800 bg-amber-100 border border-amber-200">
              <Package size={10} />
              Sisa {totalStock}
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
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* Product Title - Fixed height dengan line-clamp */}
        <h3
          className={`font-medium text-sm leading-snug text-gray-800 group-hover:text-blue-800 transition-colors duration-200 mb-2 ${
            isOutOfStock ? "text-gray-400" : ""
          } line-clamp-2 min-h-[2.25rem]`}
        >
          {name}
        </h3>

        {/* Variant Info */}
        {hasVariants && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    variant.stock > 0
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-400 border border-gray-200 line-through'
                  }`}
                >
                  {variant.name}
                </span>
              ))}
              {variants.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                  +{variants.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price Section - Margin top auto untuk push ke bawah */}
        <div className="space-y-1 mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-base md:text-lg font-bold ${
                isOutOfStock ? "text-gray-400" : "text-gray-900"
              }`}
            >
              Rp {displayPrice?.toLocaleString("id-ID")}
            </span>
            {hasDiscount && !isOutOfStock && actualDiscountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through">
                Rp {price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-2 pt-2 mt-2 border-t border-gray-100">
          <button
            className={`flex-1 relative z-20 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 active:scale-95 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900 text-white shadow-sm hover:shadow-md"
            }`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={hasVariants ? "Tambah" : "Tambah"}
          >
            <ShoppingCart size={14} />
            <span>
              {isOutOfStock 
                ? "Habis" 
                : "Tambah"}
            </span>
          </button>

          <Link
            href={`/products/${slug}`}
            className="relative z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
            aria-label="Lihat detail"
          >
            <Eye size={14} />
          </Link>
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
