"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingCart, Minus, Plus, Heart, Share2, Star, Package, Shield, Truck, Check } from "lucide-react"
import { useCartStore } from "@/store/cart"
import toast from "react-hot-toast"
import ProductCard from "@/components/ProductCard"

interface Variant {
  name: string
  options: string[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
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
          
          // Initialize selected variants
          if (data.product.variants) {
            const variants = JSON.parse(data.product.variants) as Variant[]
            const initial: Record<string, string> = {}
            variants.forEach(v => {
              if (v.options.length > 0) {
                initial[v.name] = v.options[0]
              }
            })
            setSelectedVariants(initial)
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

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image || "",
      quantity,
    })

    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-32 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="h-[600px] bg-slate-200 rounded-3xl"></div>
              <div className="space-y-6">
                <div className="h-12 bg-slate-200 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                <div className="h-24 bg-slate-200 rounded"></div>
                <div className="h-16 bg-slate-200 rounded"></div>
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-slate-600 mb-8">Maaf, produk yang Anda cari tidak tersedia</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-all font-medium"
          >
            Kembali ke Produk
          </Link>
        </div>
      </div>
    )
  }

  const variants = product.variants ? JSON.parse(product.variants) as Variant[] : []
  const inStock = product.stock > 0
  const productImages = product.images ? JSON.parse(product.images) as string[] : [product.image || "/placeholder-product.jpg"]
  const currentImage = productImages[selectedImageIndex] || productImages[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link>
          <span className="text-slate-400">/</span>
          <Link href="/products" className="text-slate-600 hover:text-slate-900">Produk</Link>
          <span className="text-slate-400">/</span>
          <Link href={`/products?category=${product.category.slug}`} className="text-slate-600 hover:text-slate-900">
            {product.category.name}
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200 group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Featured
                </div>
              )}
              {!inStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
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
                    className={`relative aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-slate-900 scale-105'
                        : 'border-slate-200 hover:border-slate-400'
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
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-sm font-semibold">
                  {product.category.name}
                </span>
                {product.brand && (
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                    {product.brand}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-slate-600 text-sm">(128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Rp {parseFloat(product.price).toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-slate-600 mt-2">Termasuk PPN</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <Package className="w-5 h-5" />
                <span className="font-semibold">
                  {inStock ? `${product.stock} unit tersedia` : 'Stok Habis'}
                </span>
              </div>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="space-y-4">
                {variants.map((variant) => (
                  <div key={variant.name}>
                    <label className="block text-sm font-bold text-slate-900 mb-3">
                      Pilih {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleVariantChange(variant.name, option)}
                          className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all ${
                            selectedVariants[variant.name] === option
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Jumlah</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
                >
                  <Minus size={20} className="text-slate-700" />
                </button>
                <span className="text-2xl font-bold text-slate-900 w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={!inStock}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} className="text-slate-700" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-gradient-to-r from-slate-900 to-slate-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-slate-800 hover:to-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={24} />
                <span>{inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}</span>
              </button>
              <button className="w-14 h-14 flex items-center justify-center bg-white border-2 border-slate-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all group">
                <Heart className="w-6 h-6 text-slate-600 group-hover:text-red-500 group-hover:fill-red-500" />
              </button>
              <button className="w-14 h-14 flex items-center justify-center bg-white border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all">
                <Share2 className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Garansi Resmi</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Gratis Ongkir</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-xs font-semibold text-slate-700">100% Original</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-16">
          {/* Tab Headers */}
          <div className="flex gap-6 border-b border-slate-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 px-2 font-bold transition-all relative ${
                activeTab === 'description'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Deskripsi
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 px-2 font-bold transition-all relative ${
                activeTab === 'specs'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Spesifikasi
              {activeTab === 'specs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 px-2 font-bold transition-all relative ${
                activeTab === 'reviews'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Review
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="prose prose-slate max-w-none">
            {activeTab === 'description' && (
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  {product.description || "Tidak ada deskripsi untuk produk ini."}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid md:grid-cols-2 gap-6">
                {product.brand && (
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Brand</span>
                    <span className="text-slate-700">{product.brand}</span>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">SKU</span>
                    <span className="text-slate-700">{product.sku}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Berat</span>
                    <span className="text-slate-700">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Dimensi</span>
                    <span className="text-slate-700">{product.dimensions}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">5.0</span>
                    <span className="text-slate-600">dari 128 review</span>
                  </div>
                </div>
                <p className="text-slate-600 text-center py-8">Review akan segera hadir</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Produk Terkait</h2>
              <p className="text-slate-600">Produk lain yang mungkin Anda sukai</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={parseFloat(relatedProduct.price)}
                  image={relatedProduct.image || ""}
                  slug={relatedProduct.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
