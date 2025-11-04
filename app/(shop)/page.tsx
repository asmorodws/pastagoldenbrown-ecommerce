// page.tsx - Fixed with Indonesian language and Best Seller section
import Link from "next/link"
import { ArrowRight, CheckCircle, Factory, Truck, Award, Users, Shield, Star, FileText, Scale, ChevronRight, ShoppingBag } from "lucide-react"

export default function Home() {
  // Sample best seller products data
  const bestSellerProducts = [
    {
      id: 1,
      name: "Pasta Spaghetti Premium",
      price: "Rp 45.000",
      image: "/api/placeholder/300/300",
      category: "Pasta Kering"
    },
    {
      id: 2,
      name: "Bumbu Pasta Carbonara",
      price: "Rp 32.000",
      image: "/api/placeholder/300/300",
      category: "Bumbu Instan"
    },
    {
      id: 3,
      name: "Pasta Fusilli Organik",
      price: "Rp 38.000",
      image: "/api/placeholder/300/300",
      category: "Pasta Organik"
    },
    {
      id: 4,
      name: "Pasta Penne Whole Wheat",
      price: "Rp 42.000",
      image: "/api/placeholder/300/300",
      category: "Pasta Gandum"
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Modern Hero Section */}
      <section className="relative bg-white overflow-hidden">
        {/* Geometric Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-[#05347e]/5 transform -skew-y-3 origin-top-right"></div>
          <div className="absolute bottom-0 right-0 w-full h-64 bg-[#c49c0f]/10 transform skew-y-3 origin-bottom-left"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 py-32 lg:py-40 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline */}
            <div className="space-y-6 mb-8">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight">
                GOLDEN BROWN
                <span className="block text-[#05347e] text-4xl lg:text-6xl font-bold mt-2">PASTA</span>
              </h1>
              
              {/* Quality Slogan */}
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-[#c49c0f]/10 transform -skew-x-6"></div>
                <p className="relative text-2xl lg:text-3xl font-bold text-[#05347e] px-6 py-3">
                  QUALITY IS OUR PRIORITY
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
              Produsen pasta dan bahan makanan premium dengan sertifikasi lengkap Halal MUI & BPOM. 
              Mendukung bisnis UMKM Indonesia dengan standar kualitas tertinggi sejak 1980.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="#tentang-kami"
                className="group bg-[#05347e] hover:bg-[#032252] text-white px-10 py-4 font-bold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>JELAJAHI CERITA KAMI</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/products"
                className="group border-2 border-gray-800 hover:border-[#05347e] text-gray-800 hover:text-[#05347e] px-10 py-4 font-bold text-lg transition-all duration-300 flex items-center space-x-3"
              >
                <span>LIHAT PRODUK</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-gray-200 pt-12">
              <div className="text-center">
                <div className="text-3xl font-black text-[#05347e] mb-2">40+</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tahun Pengalaman</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#05347e] mb-2">1000+</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mitra Bisnis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#05347e] mb-2">100%</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Kualitas Bersertifikat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produk Unggulan Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center space-x-2 text-sm font-bold text-[#c49c0f] uppercase tracking-wider mb-4">
                <div className="w-8 h-0.5 bg-[#c49c0f]"></div>
                <span>Pilihan Terbaik</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                PRODUK UNGGULAN
              </h2>
              <div className="w-20 h-1 bg-[#db0705] mx-auto"></div>
              <p className="text-gray-600 mt-6 text-lg">
                Produk terlaris kami dengan kualitas terjamin untuk bisnis Anda
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellerProducts.map((product) => (
                <div key={product.id} className="group bg-white border border-gray-200 hover:border-[#05347e] transition-all duration-300 hover:-translate-y-2">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <div className="absolute top-4 left-4 bg-[#05347e] text-white px-3 py-1 text-xs font-bold">
                      BEST SELLER
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-[#05347e] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#05347e]">{product.price}</span>
                      <button className="bg-[#db0705] hover:bg-[#a60504] text-white p-2 transition-colors">
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Products Button */}
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center space-x-3 bg-[#05347e] hover:bg-[#032252] text-white px-8 py-4 font-bold transition-colors"
              >
                <span>LIHAT SEMUA PRODUK</span>
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section - Fixed Background */}
      <section id="tentang-kami" className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background Pattern - Fixed */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-full max-w-[50%] h-full bg-[#05347e]/3 transform skew-x-12 origin-top-right"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left Column - Visual */}
              <div className="relative">
                <div className="bg-[#05347e] p-8 lg:p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c49c0f] transform translate-x-16 -translate-y-16 rotate-45"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl lg:text-3xl font-black mb-6">WARISAN KAMI</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#c49c0f] p-2 flex-shrink-0 mt-1">
                          <Award className="text-[#05347e]" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Pendekatan Kualitas Utama</h4>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            Setiap produk melalui proses quality control ketat dengan standar internasional
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#c49c0f] p-2 flex-shrink-0 mt-1">
                          <Shield className="text-[#05347e]" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Keunggulan Bersertifikat</h4>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            Halal MUI, BPOM, dan sertifikasi food grade untuk keamanan maksimal
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="bg-[#c49c0f] p-2 flex-shrink-0 mt-1">
                          <Users className="text-[#05347e]" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Dukungan UMKM</h4>
                          <p className="text-blue-100 text-sm leading-relaxed">
                            Harga kompetitif dan konsultasi gratis untuk pengembangan bisnis
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Accent Element */}
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#db0705]"></div>
              </div>

              {/* Right Column - Content */}
              <div className="space-y-8">
                {/* Section Header */}
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 text-sm font-bold text-[#c49c0f] uppercase tracking-wider">
                    <div className="w-8 h-0.5 bg-[#c49c0f]"></div>
                    <span>Sejak 1980</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                    TENTANG<br />GOLDEN BROWN PASTA
                  </h2>
                  <div className="w-20 h-1 bg-[#db0705]"></div>
                </div>

                {/* Content */}
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg font-medium">
                    Golden Brown Pasta terbuat dari bahan-bahan pilihan dengan standar internasional 
                    untuk jenis bahan tambahan makanan dengan pewarna terbaik yang sudah dinyatakan 
                    layak makan (Food Grade) oleh BPOM R.I dan bersertifikat HALAL dari M.U.I.
                  </p>
                  
                  <p>
                    Oleh karena itu, produk-produk kami memberikan kenyamanan dan keamanan bagi para 
                    customer dan reseller. Kami akan selalu berusaha untuk berkembang agar produk kami 
                    dapat lebih berkualitas dan unggul, sesuai dengan selera konsumen Indonesia.
                  </p>

                  <p className="font-bold text-[#05347e] text-lg">
                    Berdiri sejak tahun 1980, kami berkomitmen selalu memberikan kenyamanan dan keamanan 
                    bagi para customer dan reseller.
                  </p>
                </div>

                {/* Certifications */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 border-l-4 border-[#05347e]">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-sm font-bold text-gray-900">Halal MUI</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 border-l-4 border-[#05347e]">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-sm font-bold text-gray-900">BPOM RI</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 border-l-4 border-[#05347e]">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-sm font-bold text-gray-900">Food Grade</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 border-l-4 border-[#05347e]">
                    <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                    <span className="text-sm font-bold text-gray-900">40+ Tahun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Kami Section - Fixed */}
      <section className="py-24 lg:py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern - Fixed */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#032252] to-[#05347e] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-[#c49c0f]/10 transform -skew-y-3 origin-top-left"></div>
          <div className="absolute bottom-0 right-0 w-full h-32 bg-[#db0705]/10 transform skew-y-3 origin-bottom-right"></div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center space-x-2 text-sm font-bold text-[#c49c0f] uppercase tracking-wider mb-4">
                <div className="w-8 h-0.5 bg-[#c49c0f]"></div>
                <span>Keunggulan Kami</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                MENGAPA MEMILIH<br />PRODUK KAMI
              </h2>
              <div className="w-20 h-1 bg-[#db0705] mx-auto"></div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c49c0f] transition-all duration-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#c49c0f] transform translate-x-8 -translate-y-8 rotate-45"></div>
                <div className="relative z-10">
                  <div className="bg-[#05347e] p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#c49c0f] transition-colors">
                    <FileText className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white">Sertifikasi Lengkap</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Produk kami telah tersertifikasi oleh Halal MUI dan BPJPH, serta terdaftar di BPOM 
                    dan memiliki NIB, sehingga menjamin keamanan, legalitas, dan kehalalan produk.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c49c0f] transition-all duration-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#c49c0f] transform translate-x-8 -translate-y-8 rotate-45"></div>
                <div className="relative z-10">
                  <div className="bg-[#05347e] p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#c49c0f] transition-colors">
                    <Users className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white">Inovasi Berbasis Kebutuhan Pasar</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Didukung tim R&D berpengalaman yang terus menghadirkan solusi rasa, warna, dan 
                    formulasi sesuai tren dan permintaan industri makanan.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c49c0f] transition-all duration-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#c49c0f] transform translate-x-8 -translate-y-8 rotate-45"></div>
                <div className="relative z-10">
                  <div className="bg-[#05347e] p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#c49c0f] transition-colors">
                    <Scale className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white">Formulasi Rasa Kustom</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Layanan formulasi khusus (custom flavoring & blending) untuk memenuhi kebutuhan 
                    setiap klien. *Syarat dan ketentuan berlaku.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c49c0f] transition-all duration-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#c49c0f] transform translate-x-8 -translate-y-8 rotate-45"></div>
                <div className="relative z-10">
                  <div className="bg-[#05347e] p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#c49c0f] transition-colors">
                    <Factory className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white">Skalabilitas Produksi</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Produk tersedia dalam berbagai ukuran dan volume, mulai dari skala kecil (UMKM) 
                    hingga besar (industri manufaktur).
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c49c0f] transition-all duration-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#c49c0f] transform translate-x-8 -translate-y-8 rotate-45"></div>
                <div className="relative z-10">
                  <div className="bg-[#05347e] p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#c49c0f] transition-colors">
                    <Truck className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white">Jaringan Distribusi Nasional</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Didukung sistem distribusi dan agen yang luas serta efisien untuk menjangkau 
                    pelanggan di seluruh Indonesia.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-[#c49c0f] transition-all duration-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#c49c0f] transform translate-x-8 -translate-y-8 rotate-45"></div>
                <div className="relative z-10">
                  <div className="bg-[#05347e] p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-[#c49c0f] transition-colors">
                    <Award className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-white">Pengalaman 40+ Tahun</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Didukung oleh pengalaman lebih dari 4 dekade dalam industri makanan, memahami 
                    kebutuhan dan tren pasar Indonesia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}