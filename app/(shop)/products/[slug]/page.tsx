"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Minus, Plus, Heart, Share2, Package, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useCartStore } from "@/store/cart"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/ProductCard"

// ----------------------------
// Types
// ----------------------------

interface ProductVariant {
  id: string
  name: string
  label: string | null
  sku: string | null
  price: number | null
  stock: number
  image: string | null
  sortOrder: number
}

interface Category {
  id: string
  name: string
  slug: string
  halal: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  image: string | null
  images: string | null
  categoryId: string
  featured: boolean
  brand: string | null
  sku: string | null
  weight: number | null
  discount: number | null
  discountPrice: number | null
  category: Category
  variants: ProductVariant[]
}

// ----------------------------
// Components
// ----------------------------

const Breadcrumb = ({ categoryName, categorySlug, productName }: {
  categoryName: string
  categorySlug: string
  productName: string
}) => (
  <nav className="flex items-center gap-2 text-xs mb-8 text-gray-500 overflow-x-auto pb-2">
    <Link href="/" className="hover:text-blue-600 transition whitespace-nowrap">Home</Link>
    <span className="text-gray-300">/</span>
    <Link href="/products" className="hover:text-blue-600 transition whitespace-nowrap">Produk</Link>
    <span className="text-gray-300">/</span>
    <Link href={`/products?category=${categorySlug}`} className="hover:text-blue-600 transition whitespace-nowrap">
      {categoryName}
    </Link>
    <span className="text-gray-300">/</span>
    <span className="font-medium text-gray-700 truncate max-w-[200px]">{productName}</span>
  </nav>
)

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 group">
      {!imageError && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-300">
          <Package size={64} className="mb-2" />
          <span className="text-sm">Gambar tidak tersedia</span>
        </div>
      )}
    </div>
  )
}

const ThumbnailButton = ({
  src,
  selected,
  onClick,
}: {
  src: string
  selected: boolean
  onClick: () => void
}) => {
  const [imageError, setImageError] = useState(false)

  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selected ? "border-blue-600 ring-1 ring-blue-200" : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
        }`}
    >
      {!imageError && src ? (
        <Image
          src={src}
          alt="Thumbnail"
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <Package size={16} className="text-gray-300" />
        </div>
      )}
    </button>
  )
}

const VariantButton = ({
  variant,
  selected,
  onClick,
  disabled,
}: {
  variant: ProductVariant
  selected: boolean
  onClick: () => void
  disabled?: boolean
}) => {
  const isOutOfStock = variant.stock === 0
  const isLowStock = variant.stock > 0 && variant.stock <= 5

  return (
    <button
      onClick={onClick}
      disabled={disabled || isOutOfStock}
      className={`px-5 py-3 rounded-lg border-2 text-sm font-medium transition-all min-w-[100px] ${selected
        ? "border-blue-600 bg-blue-600 text-white"
        : isOutOfStock
          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
          : "border-gray-200 bg-white hover:border-blue-300 text-gray-800"
        }`}
    >
      <div className="flex flex-col gap-1">
        <span className={isOutOfStock ? 'line-through' : ''}>{variant.name}</span>

        {isLowStock && !isOutOfStock && (
          <span className="text-[10px] text-amber-600 font-medium">Sisa {variant.stock}</span>
        )}
      </div>
    </button>
  )
}

const QuantitySelector = ({
  quantity,
  setQuantity,
  maxStock,
}: {
  quantity: number
  setQuantity: (val: number) => void
  maxStock: number
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">Jumlah</span>
    <div className="flex items-center gap-0 border-2 border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={quantity <= 1}
      >
        <Minus size={16} className="text-gray-600" />
      </button>
      <span className="w-14 text-center text-base font-semibold border-x-2 border-gray-200">{quantity}</span>
      <button
        onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={quantity >= maxStock}
      >
        <Plus size={16} className="text-gray-600" />
      </button>
    </div>
  </div>
)

const AddToCartButton = ({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2 active:scale-[.98] transition-all"
  >
    <ShoppingCart size={20} strokeWidth={2.5} />
    <span className="text-base">
      {loading ? "Menambahkan..." : disabled ? "Stok Habis" : "Tambah ke Keranjang"}
    </span>
  </button>
)

// ----------------------------
// Main Page
// ----------------------------

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { slug } = await params
        const response = await fetch(`/api/products/${slug}`)

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()
        setProduct(data.product)
        setRelatedProducts(data.relatedProducts || [])

        // Set default variant (first available with stock)
        if (data.product.variants && data.product.variants.length > 0) {
          const firstAvailable = data.product.variants.find((v: ProductVariant) => v.stock > 0)
          const defaultVariant = firstAvailable || data.product.variants[0]
          setSelectedVariant(defaultVariant)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Gagal memuat produk')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params])

  // Parse images with useMemo to prevent re-creation on every render
  const images = useMemo(() => {
    if (!product) return ['/placeholder-product.jpg']
    if (product.images) {
      try {
        return JSON.parse(product.images)
      } catch (e) {
        console.error('Error parsing product images:', e)
        return product.image ? [product.image] : ['/placeholder-product.jpg']
      }
    }
    return product.image ? [product.image] : ['/placeholder-product.jpg']
  }, [product])

  // Sync image when variant changes
  useEffect(() => {
    if (!selectedVariant?.image || images.length === 0) return

    const variantImageIndex = images.findIndex((img: string) => img === selectedVariant.image)
    if (variantImageIndex !== -1 && variantImageIndex !== selectedImageIndex) {
      console.log('🖼️ Switching to variant image:', selectedVariant.name, selectedVariant.image)
      setSelectedImageIndex(variantImageIndex)
    } else if (variantImageIndex === -1) {
      console.log('⚠️ Variant image not found in images array:', selectedVariant.image)
    }
  }, [selectedVariant?.id, selectedVariant?.image])

  // Calculate price and stock
  // Dapatkan harga base (variant price atau product price)
  const basePrice = selectedVariant?.price || product?.price || 0

  // Cek apakah ada diskon (field discount > 0)
  const hasDiscount = product?.discount && product.discount > 0

  // Hitung harga setelah diskon berdasarkan persentase discount field
  const displayPrice = hasDiscount && product.discount
    ? basePrice - (basePrice * product.discount / 100)
    : basePrice

  // Gunakan persentase diskon langsung dari field discount
  const actualDiscount = hasDiscount && product.discount ? Math.round(product.discount) : 0

  const maxStock = selectedVariant?.stock || 0
  const isOutOfStock = maxStock === 0

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return
    if (isOutOfStock) {
      toast.error('Produk ini sedang habis')
      return
    }

    if (product.variants.length > 0 && !selectedVariant) {
      toast.error('Silakan pilih variant terlebih dahulu')
      return
    }

    const cartItem = {
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      productVariantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: displayPrice,
      image: selectedVariant?.image || product.image || images[0] || '/placeholder-product.jpg',
      variant: selectedVariant?.name,
      variantLabel: selectedVariant?.label || undefined,
      stock: maxStock,
      quantity: quantity,
    }

    addItem(cartItem)
    toast.custom((t) => (
  <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } w-80 bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex gap-3 relative`}
  >
    {/* Icon */}
    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3.5 h-3.5 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>

    {/* Text */}
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-900 leading-tight">
        Ditambahkan ke keranjang
      </p>

      <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
        {product.name}
      </p>

      <div className="mt-2">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            router.push("/cart");
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-all"
        >
          <ShoppingCart size={13} />
          Lihat Keranjang
        </button>
      </div>
    </div>

    {/* Close */}
    <button
      onClick={() => toast.dismiss(t.id)}
      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
), {
  duration: 3500,
});



  }

  // Handle share
  const handleShare = async () => {
    if (!product) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || '',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link berhasil disalin')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-3 bg-gray-100 rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="aspect-square bg-gray-100 rounded-xl mb-4" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-16 bg-gray-100 rounded" />
                <div className="h-12 bg-gray-100 rounded" />
                <div className="h-12 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto text-center py-32">
          <Package size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Produk Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-8 text-sm">Produk yang Anda cari tidak tersedia</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Produk</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          categoryName={product.category.name}
          categorySlug={product.category.slug}
          productName={product.name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Images */}
          <div>
            <ProductImage src={images[selectedImageIndex]} alt={product.name} />

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <ThumbnailButton
                    key={idx}
                    src={img}
                    selected={selectedImageIndex === idx}
                    onClick={() => setSelectedImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            {/* Back button mobile */}
            <button
              onClick={() => router.back()}
              className="lg:hidden inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </button>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Halal Badge */}
            <div>
              {product.category.halal ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Halal MUI
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Non-Halal
                </span>
              )}
            </div>

            {/* Description Preview */}
            {product.description && (
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Price */}
            <div className="border-t border-b border-gray-100 py-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Rp {displayPrice.toLocaleString('id-ID')}
                </span>
                {hasDiscount && actualDiscount > 0 && displayPrice < basePrice && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      Rp {basePrice.toLocaleString('id-ID')}
                    </span>
                    <span className="px-2.5 py-0.5 bg-red-600 text-white text-xs font-semibold rounded-md">
                      -{actualDiscount}%
                    </span>
                  </>
                )}
              </div>
              {maxStock > 0 && maxStock <= 10 && (
                <p className="text-sm text-amber-600 mt-2 font-medium">
                  Tersisa {maxStock} item
                </p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pilih Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <VariantButton
                      key={v.id}
                      variant={v}
                      selected={selectedVariant?.id === v.id}
                      onClick={() => {
                        console.log('🔄 Variant clicked:', v.name, 'Image:', v.image)
                        setSelectedVariant(v)
                        setQuantity(1)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                maxStock={maxStock}
              />
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                loading={false}
              />
              <button
                onClick={handleShare}
                className="px-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shrink-0"
                title="Bagikan Produk"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Ulasan Section */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Ulasan Produk</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Ulasan</h3>
              <p className="text-gray-500">Jadilah yang pertama memberikan ulasan untuk produk ini.</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-xl font-bold mb-8 text-gray-900">Produk Terkait</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  slug={relatedProduct.slug}
                  price={relatedProduct.price}
                  discount={relatedProduct.discount ?? undefined}
                  discountPrice={relatedProduct.discountPrice ?? undefined}
                  image={relatedProduct.image ?? undefined}
                  variants={relatedProduct.variants.map(v => ({
                    id: v.id,
                    name: v.name,
                    stock: v.stock,
                    price: v.price ?? undefined
                  }))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
