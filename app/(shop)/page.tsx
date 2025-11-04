import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, CheckCircle2, Award, Truck, Users, Sparkles, Shield, Package, MessageCircle, UserPlus } from "lucide-react"
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
      <section className="relative text-white overflow-hidden bg-gradient-to-br from-[#05347e] via-[#032252] to-[#05347e]">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c49c0f] to-[#f0c514] text-[#05347e] px-6 py-3 rounded-full text-sm font-bold shadow-lg">
              <Award size={20} />
              Terpercaya Sejak 1980
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Golden Brown Pasta
            </h1>
            
            {/* Slogan */}
            <p className="text-2xl lg:text-4xl font-semibold bg-gradient-to-r from-[#c49c0f] via-[#f0c514] to-[#c49c0f] bg-clip-text text-transparent">
              Kualitas Terbaik, Harga Terjangkau
            </p>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Produsen pasta dan bahan makanan berkualitas dengan sertifikasi Halal MUI & BPOM. 
              Belanja mudah dengan promo eksklusif website!
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                href="/products"
                className="group bg-[#db0705] hover:bg-[#a60504] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={24} />
                Belanja Sekarang
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="#tentang-kami"
                className="border-2 border-white/30 hover:border-[#c49c0f] text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
              >
                Tentang Kami
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-12">
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-4xl lg:text-5xl font-bold text-[#c49c0f] mb-2">40+</div>
                <div className="text-sm text-gray-300">Tahun Pengalaman</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-4xl lg:text-5xl font-bold text-[#c49c0f] mb-2">100%</div>
                <div className="text-sm text-gray-300">Halal & BPOM</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-4xl lg:text-5xl font-bold text-[#c49c0f] mb-2">1000+</div>
                <div className="text-sm text-gray-300">Mitra UMKM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#05347e] mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-xl text-gray-600">Komitmen kami untuk kualitas dan kepercayaan pelanggan</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-[#05347e]">
              <div className="bg-[#05347e] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#db0705] transition-all shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#05347e]">Kualitas Produk Prioritas Utama</h3>
              <p className="text-gray-600 leading-relaxed">Produk Golden Brown Pasta menggunakan bahan pilihan dengan standar internasional dan food grade.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-[#05347e]">
              <div className="bg-[#05347e] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#db0705] transition-all shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#05347e]">Pelayanan Ramah & Terbaik</h3>
              <p className="text-gray-600 leading-relaxed">Tim kami siap memberikan pelayanan yang ramah, bersahabat, dan profesional untuk semua pelanggan.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-[#05347e]">
              <div className="bg-[#05347e] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#db0705] transition-all shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#05347e]">Higienis & Harga Terjangkau</h3>
              <p className="text-gray-600 leading-relaxed">Produk higienis dengan bahan berkualitas dan harga yang kompetitif untuk semua kalangan UMKM.</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-[#05347e]">
              <div className="bg-[#05347e] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#db0705] transition-all shadow-lg">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#05347e]">Bersaing di Pasar Global</h3>
              <p className="text-gray-600 leading-relaxed">Produk kami dapat bersaing dengan produk sejenis dari luar negeri dengan kualitas setara.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang-kami" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-[#c49c0f] to-[#f0c514] text-[#05347e] px-4 py-2 rounded-full text-sm font-bold">
                  Sejak 1980
                </span>
              </div>
              <h2 className="text-4xl font-bold text-[#05347e]">Tentang Golden Brown Pasta</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Golden Brown Pasta terbuat dari bahan-bahan pilihan dengan standar internasional 
                  untuk jenis bahan tambahan makanan dengan pewarna terbaik yang sudah dinyatakan 
                  layak makan (Food Grade) oleh BPOM R.I dan bersertifikat HALAL dari M.U.I.
                </p>
                <p>
                  Oleh karena itu, produk-produk kami memberikan kenyamanan dan keamanan bagi para 
                  customer dan reseller. Kami akan selalu berusaha untuk berkembang agar produk kami 
                  dapat lebih berkualitas dan unggul, sesuai dengan selera konsumen Indonesia.
                </p>
                <p className="font-semibold text-[#05347e]">
                  Berdiri sejak tahun 1980, kami berkomitmen selalu memberikan kenyamanan dan keamanan 
                  bagi para customer dan reseller, kami akan selalu berusaha untuk berkembang agar 
                  produk kami dapat lebih berkualitas dan unggul, sesuai dengan selera konsumen Indonesia.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <span className="text-sm font-semibold text-green-700">Halal MUI</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <CheckCircle2 className="text-blue-600" size={20} />
                  <span className="text-sm font-semibold text-blue-700">BPOM Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  <CheckCircle2 className="text-purple-600" size={20} />
                  <span className="text-sm font-semibold text-purple-700">Food Grade</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#05347e] to-[#032252] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-[#c49c0f]">Keunggulan Kami</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#c49c0f] rounded-lg flex items-center justify-center text-[#05347e] font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Sertifikasi Lengkap</h4>
                    <p className="text-sm text-gray-300">Produk kami telah tersertifikasi Halal MUI, BPJPH, terdaftar di BPOM dan memiliki NIB.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#c49c0f] rounded-lg flex items-center justify-center text-[#05347e] font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Inovasi Berbasis Kebutuhan Pasar</h4>
                    <p className="text-sm text-gray-300">Didukung tim R&D berpengalaman yang terus menghadirkan solusi rasa, warna, dan formulasi sesuai tren industri.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#c49c0f] rounded-lg flex items-center justify-center text-[#05347e] font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Formulasi Rasa Sesuai Permintaan</h4>
                    <p className="text-sm text-gray-300">Layanan formulasi khusus (custom flavoring & blending) untuk memenuhi kebutuhan setiap klien.*</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#c49c0f] rounded-lg flex items-center justify-center text-[#05347e] font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Skalabilitas Produksi</h4>
                    <p className="text-sm text-gray-300">Tersedia dalam berbagai ukuran dan volume, dari skala UMKM hingga industri manufaktur besar.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#c49c0f] rounded-lg flex items-center justify-center text-[#05347e] font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Jaringan Distribusi Nasional</h4>
                    <p className="text-sm text-gray-300">Sistem distribusi dan agen yang luas serta efisien menjangkau seluruh Indonesia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#05347e] mb-4">Kategori Produk</h2>
              <p className="text-xl text-gray-600">Temukan produk pasta dan bahan makanan sesuai kebutuhan Anda</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#05347e] hover:-translate-y-2"
                >
                  <div className="relative h-24 mb-4 flex items-center justify-center">
                    <div className="text-5xl group-hover:scale-110 transition-transform font-bold bg-gradient-to-br from-[#05347e] to-[#032252] bg-clip-text text-transparent group-hover:from-[#db0705] group-hover:to-[#c49c0f]">
                      <Package className="mx-auto text-[#05347e] group-hover:text-[#db0705] transition-colors" size={56} />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#05347e] group-hover:text-[#db0705] transition-colors">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-bold text-[#05347e] mb-2">Produk Unggulan</h2>
                <p className="text-xl text-gray-600">Pilihan terbaik untuk bisnis UMKM Anda</p>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-2 bg-[#05347e] hover:bg-[#db0705] text-white px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold"
              >
                Lihat Semua Produk
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={parseFloat(product.price.toString())}
                  discount={product.discount ? parseFloat(product.discount.toString()) : undefined}
                  discountPrice={product.discountPrice ? parseFloat(product.discountPrice.toString()) : undefined}
                  image={product.image || ""}
                  slug={product.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#05347e] via-[#032252] to-[#db0705] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#032252] via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-block">
              <span className="bg-gradient-to-r from-[#c49c0f] to-[#f0c514] text-[#05347e] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Penawaran Khusus UMKM
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Bergabung Dengan
              <span className="block bg-gradient-to-r from-[#c49c0f] via-[#f0c514] to-[#c49c0f] bg-clip-text text-transparent">
                1000+ Mitra UMKM Kami
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
              Daftar sekarang dan dapatkan harga spesial untuk pembelian grosir! 
              Produk berkualitas dengan sertifikasi lengkap untuk mendukung bisnis Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Golden%20Brown%20Pasta,%20saya%20ingin%20daftar%20jadi%20mitra%20UMKM"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#25D366] hover:bg-[#1fb855] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} />
                <span>Daftar via WhatsApp</span>
              </a>
              <Link
                href="/auth/register"
                className="group bg-[#db0705] hover:bg-[#a60504] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <UserPlus size={24} />
                <span>Daftar di Website</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-[#c49c0f]">40+</div>
                <div className="text-sm opacity-75">Tahun Pengalaman</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-[#c49c0f]">1000+</div>
                <div className="text-sm opacity-75">Mitra UMKM</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-[#c49c0f]">100%</div>
                <div className="text-sm opacity-75">Halal & BPOM</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-[#c49c0f]">24/7</div>
                <div className="text-sm opacity-75">Layanan Support</div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#c49c0f]" size={20} />
                <span className="font-semibold">Halal MUI & BPOM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#c49c0f]" size={20} />
                <span className="font-semibold">Food Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#c49c0f]" size={20} />
                <span className="font-semibold">Harga Grosir</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#c49c0f]" size={20} />
                <span className="font-semibold">Pengiriman Nasional</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
