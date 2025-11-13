"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingCart, Minus, Plus, Heart, Share2, Star, Package, Shield, Truck, Check, PackageSearch } from "lucide-react"
import { useCartStore } from "@/store/cart"
import toast from "react-hot-toast"
import ProductCard from "@/components/ProductCard"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const addItem = useCartStore((state: { addItem: any }) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`)
        const data = await response.json()

        if (response.ok) {
          setProduct(data.product)
          setRelatedProducts(data.relatedProducts)
          
          // Initialize with first variant
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariantId(data.product.variants[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return

    // Get selected variant
    const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId)
    
    if (!selectedVariant) {
      toast.error("Silakan pilih varian produk")
      return
    }

    // Get variant image or fallback to product image
    const variantImage = selectedVariant.image || product.image || ""
    
    // Get variant price or fallback to product price
    const variantPrice = selectedVariant.price || product.price

    addItem({
      id: product.id,
      productId: product.id,
      productVariantId: selectedVariant.id, // Send variant ID
      name: product.name,
      slug: product.slug,
      price: parseFloat(variantPrice),
      image: variantImage,
      quantity,
      variant: selectedVariant.name, // e.g., "30g", "100g"
      variantLabel: selectedVariant.label || `Ukuran: ${selectedVariant.name}`,
      stock: selectedVariant.stock,
    })
    
    toast.success(`${product.name} (${selectedVariant.name}) ditambahkan ke keranjang`)
  }

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="h-[500px] bg-gray-200 rounded-2xl"></div>
              <div className="space-y-5">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-14 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-6">
          <PackageSearch className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-900 mb-3">Produk Tidak Ditemukan</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Maaf, produk yang Anda cari tidak tersedia atau telah dihapus
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-all font-semibold shadow-lg"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    )
  }

  // Get variants array (now from database, not JSON)
  const variants = product.variants || []
  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId)
  
  // Get product images
  const productImages = product.images ? JSON.parse(product.images) as string[] : [product.image || "/placeholder-product.jpg"]
  
  // Use variant image if available, otherwise use gallery
  const currentImage = selectedVariant?.image || productImages[selectedImageIndex] || productImages[0]
  
  // Get variant-specific stock
  const currentStock = selectedVariant?.stock || 0
  const inStock = currentStock > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
          <Link href="/" className="text-slate-600 hover:text-blue-800 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="text-slate-600 hover:text-blue-800 transition-colors">
            Produk
          </Link>
          <span className="text-gray-300">/</span>
          <Link 
            href={`/products?category=${product.category.slug}`} 
            className="text-slate-600 hover:text-blue-800 transition-colors"
          >
            {product.category.name}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-blue-900 font-semibold">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  Featured
                </div>
              )}
              {!inStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                  Stok Habis
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-blue-800 shadow-md scale-105'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-blue-800 text-white rounded-full text-xs font-bold">
                  {product.category.name}
                </span>
                {product.brand && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    {product.brand}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-slate-600 text-sm">(128 ulasan)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-blue-900">
                  Rp {parseFloat(product.price).toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-slate-600 mt-1 text-sm">Harga sudah termasuk PPN</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                inStock ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <Package className="w-4 h-4" />
                <span className="font-semibold text-sm">
                  {inStock ? `Stok: ${currentStock} unit` : 'Stok Habis'}
                </span>
              </div>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">
                    Pilih Ukuran
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant.id)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                          selectedVariantId === variant.id
                            ? 'border-blue-800 bg-blue-800 text-white shadow-sm'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{variant.name}</span>
                          <span className="text-xs opacity-75">
                            Stok: {variant.stock}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">Jumlah</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <Minus size={18} className="text-gray-700" />
                </button>
                <span className="text-2xl font-bold text-blue-900 w-14 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={!inStock}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3.5 px-6 rounded-xl font-bold text-base hover:from-blue-900 hover:to-blue-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={20} />
                <span>{inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}</span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all group">
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 group-hover:fill-red-500" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group">
                <Share2 className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-blue-800" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Halal MUI</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5 text-blue-800" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Gratis Ongkir</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 text-blue-800" />
                </div>
                <p className="text-xs font-semibold text-gray-700">BPOM RI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 mb-16">
          {/* Tab Headers */}
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 px-2 font-bold text-sm transition-all relative ${
                activeTab === 'description'
                  ? 'text-blue-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Deskripsi
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 px-2 font-bold text-sm transition-all relative ${
                activeTab === 'specs'
                  ? 'text-blue-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Spesifikasi
              {activeTab === 'specs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 px-2 font-bold text-sm transition-all relative ${
                activeTab === 'reviews'
                  ? 'text-blue-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Ulasan
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="prose prose-slate max-w-none">
            {activeTab === 'description' && (
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base">
                  {product.description || "Tidak ada deskripsi untuk produk ini."}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid md:grid-cols-2 gap-4">
                {product.brand && (
                  <div className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="font-semibold text-blue-900 text-sm">Brand</span>
                    <span className="text-gray-700 text-sm">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="font-semibold text-blue-900 text-sm">SKU</span>
                    <span className="text-gray-700 text-sm">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="font-semibold text-blue-900 text-sm">Berat</span>
                    <span className="text-gray-700 text-sm">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="font-semibold text-blue-900 text-sm">Dimensi</span>
                    <span className="text-gray-700 text-sm">{product.dimensions}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-bold text-blue-900">5.0</span>
                    <span className="text-slate-600 text-sm">dari 128 ulasan</span>
                  </div>
                </div>
                <p className="text-gray-500 text-center py-8 text-sm">Ulasan pelanggan akan segera hadir</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Produk Terkait</h2>
              <p className="text-slate-600 text-sm">Produk lain yang mungkin Anda sukai</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={parseFloat(relatedProduct.price)}
                  image={relatedProduct.image || ""}
                  slug={relatedProduct.slug}
                  stock={relatedProduct.variants?.[0]?.stock || 0}
                  variants={relatedProduct.variants || []}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
