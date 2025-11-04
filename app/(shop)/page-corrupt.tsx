import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Truck, CreditCard, HeadphonesIcon } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import { prisma } from "@/lib/prisma"

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      take: 8,
      include: { category: true },
    })
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      take: 6,
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                  Premium Quality Products
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Belanja Premium
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Pengalaman Elite
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed">
                Temukan koleksi eksklusif produk berkualitas tinggi dengan layanan terbaik di kelasnya
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/products"
                  className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    Jelajahi Koleksi
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
                <Link
                  href="/products?featured=true"
                  className="border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all text-center"
                >
                  Produk Unggulan
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-slate-400 mt-1">Produk Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm text-slate-400 mt-1">Pelanggan Puas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.9</div>
                  <div className="text-sm text-slate-400 mt-1">Rating</div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative h-[500px] w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">E</div>
                    <p className="text-2xl font-semibold text-white">Shopping Elite</p>
                    <p className="text-slate-300">Kualitas Premium untuk Anda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Kenapa Memilih Kami?</h2>
            <p className="text-xl text-slate-600">Pengalaman berbelanja terbaik dengan layanan premium</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Gratis Ongkir</h3>
              <p className="text-slate-600 leading-relaxed">Pengiriman gratis untuk pembelian di atas Rp 100.000 ke seluruh Indonesia</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Pembayaran Aman</h3>
              <p className="text-slate-600 leading-relaxed">Sistem pembayaran terenkripsi dengan berbagai metode pilihan</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <ShoppingBag className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Produk Original</h3>
              <p className="text-slate-600 leading-relaxed">100% produk original bergaransi resmi dari brand terpercaya</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <HeadphonesIcon className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">Support 24/7</h3>
              <p className="text-slate-600 leading-relaxed">Tim customer service profesional siap membantu Anda kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Jelajahi Kategori</h2>
              <p className="text-xl text-slate-600">Temukan produk sesuai kebutuhan Anda</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-300 hover:-translate-y-2"
                >
                  <div className="relative h-24 mb-4 flex items-center justify-center">
                    <div className="text-5xl group-hover:scale-110 transition-transform font-bold bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {category.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-slate-700">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Produk Pilihan</h2>
                <p className="text-xl text-slate-600">Koleksi terbaik spesial untuk Anda</p>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                Lihat Semua Produk
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={parseFloat(product.price.toString())}
                  image={product.image || ""}
                  slug={product.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                Penawaran Spesial
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Bergabung dengan
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                10,000+ Pelanggan Premium
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed">
              Daftar sekarang dan nikmati diskon hingga 50% untuk member baru, plus gratis ongkir tanpa minimum pembelian!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/auth/register"
                className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Daftar Gratis Sekarang
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                href="/products"
                className="border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Jelajahi Produk
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Gratis Ongkir
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Original 100%
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> Garansi Resmi
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
