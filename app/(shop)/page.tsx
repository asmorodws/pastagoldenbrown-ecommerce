// page.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  FlaskConical,
  Blend,
  Factory,
  Truck,
  Star,
  Award,
  Handshake,
  BadgeCheck,
} from "lucide-react"
import { AdvantageCard } from "@/components/ui/AdvantageCard"
import ProductCoverage from "@/components/ui/ProductCoverage"
import ProductCard from "@/components/ProductCard"
import VideoGallery from "@/components/VideoGallery"

const featured = [
  { id: "p1", name: "Pasta Pandan", price: 38500, discount: 5, discountPrice: 36575, image: "/assets/best_product/Pandan.png", slug: "pasta-pandan" },
  { id: "p2", name: "Pasta Vanila Crown", price: 40000, discount: 5, discountPrice: 38000, image: "/assets/best_product/Vanilla Crown.png", slug: "pasta-vanila-crown" },
  { id: "p3", name: "Pasta Red Velvet", price: 41000, discount: 5, discountPrice: 38950, image: "/assets/best_product/Red Velvet.png", slug: "pasta-red-velvet" },
  { id: "p4", name: "Pasta Moka", price: 39000, discount: 5, discountPrice: 37050, image: "/assets/best_product/Moka.png", slug: "pasta-moka" },
  { id: "p5", name: "Pasta Mangga", price: 37500, discount: 5, discountPrice: 35625, image: "/assets/best_product/Mangga.png", slug: "pasta-mangga" },
  { id: "p6", name: "Pasta Moka Hopyes", price: 42000, discount: 5, discountPrice: 39900, image: "/assets/best_product/Moka Hopyes.png", slug: "pasta-moka-hopyes" },
  { id: "p7", name: "Pasta Susu", price: 36000, discount: 5, discountPrice: 34200, image: "/assets/best_product/Susu.PNG", slug: "pasta-susu" },
  { id: "p8", name: "Pasta Cokelat", price: 39500, discount: 5, discountPrice: 37525, image: "/assets/best_product/Cokelat.png", slug: "pasta-cokelat" },
  { id: "p9", name: "Pasta Vanila", price: 38000, discount: 5, discountPrice: 36100, image: "/assets/best_product/Vanila.png", slug: "pasta-vanila" },
  { id: "p10", name: "Pasta Cokelat Blackforest", price: 43000, discount: 5, discountPrice: 40850, image: "/assets/best_product/Cokelat Blackforest.png", slug: "pasta-cokelat-blackforest" },
]

const advantages = [
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Sertifikasi Lengkap", desc: "Halal MUI & BPJPH, terdaftar BPOM + NIB – keamanan, legalitas, dan kehalalan terjamin." },
  { icon: <FlaskConical className="w-6 h-6" />, title: "Inovasi Berbasis Kebutuhan Pasar", desc: "Tim R&D berpengalaman menghadirkan solusi rasa, warna, dan formulasi terkini." },
  { icon: <Blend className="w-6 h-6" />, title: "Formulasi Rasa Sesuai Permintaan", desc: "Layanan custom flavoring & blending untuk kebutuhan klien. *Syarat dan ketentuan berlaku." },
  { icon: <Factory className="w-6 h-6" />, title: "Skalabilitas Produksi", desc: "Tersedia untuk skala UMKM hingga industri manufaktur dalam berbagai volume." },
  { icon: <Truck className="w-6 h-6" />, title: "Jaringan Distribusi Nasional", desc: "Sistem distribusi dan agen efisien menjangkau seluruh Indonesia." },
]

// Data dari gambar
const brandValues = [
  {
    icon: <Star className="w-8 h-8" />,
    title: "Kualitas Produk #1",
    desc: "Kualitas produk menjadi prioritas utama Golden Brown Pasta. Setiap batch melalui kontrol ketat untuk konsistensi rasa dan standar tertinggi."
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: "Pelayanan Terbaik",
    desc: "Pelayanan yang ramah, bersahabat, dan terbaik untuk setiap pelanggan. Kami siap membantu kebutuhan Anda dengan cepat dan profesional."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Produk Higienis & Berkualitas",
    desc: "Produk yang higienis dengan bahan berkualitas premium namun tetap terjangkau. Keseimbangan sempurna untuk bisnis Anda."
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Standar Internasional",
    desc: "Dapat bersaing dengan produk sejenis dari luar negeri. Kami membuktikan kualitas Indonesia bisa setara global."
  }
]

export default function Home() {
  return (
    <>
      {/* ===== 1. HERO SECTION ===== */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 gap-10">
          
          {/* Text Section */}
          <motion.div 
            className="text-center md:text-left max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
              Quality is Our Priority
            </h1>
            <p className="text-slate-600 mt-4 text-lg">
              Nikmati Pasta Terbaik dari <span className="font-semibold text-amber-500">Golden Brown</span>
            </p>

            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
              >
                Belanja Sekarang
              </Link>
              <Link
                href="#tentang-kami"
                className="px-6 py-3 rounded-xl border-2 border-blue-200 bg-white text-blue-900 font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                Hubungi Kami
              </Link>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div 
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-72 md:w-96 h-auto">
              <img
                src="/hero-product.png"
                alt="Golden Brown Pasta - Bahan Tambahan Pangan Campuran"
                className="rounded-lg drop-shadow-lg w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. TENTANG KAMI ===== */}
<section id="tentang-kami" className="py-20 bg-white">
  <div className="container mx-auto px-6 max-w-6xl">
    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* Left Content */}
      <div className="flex flex-col">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Tentang Kami</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Golden Brown Pasta berdiri sejak 1980, menghadirkan bahan tambahan makanan berstandar internasional. Semua produk menggunakan pewarna Food Grade terbaik dan telah dinyatakan layak oleh BPOM R.I serta bersertifikat HALAL MUI.
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Komitmen kami: memberikan kenyamanan & keamanan bagi customer maupun reseller, terus berinovasi agar produk kami tetap berkualitas dan sesuai selera konsumen Indonesia.
        </p>
        
        {/* Visual Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <MetricCard value="35+" label="Tahun Pengalaman" />
          <MetricCard value="30+" label="Distributor dan Agen" />
          <CertCard label="Halal MUI" />
          <CertCard label="BPOM RI" />
        </div>
      </div>
      
      {/* Right Content - Images */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-rows-2 gap-4">
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
            <img 
              src="/assets/img/Rainbow Cake Kukus.png" 
              alt="Rainbow Cake Kukus"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
            <img 
              src="/assets/img/Martabak Red Velvet.png" 
              alt="Martabak Red Velvet"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="grid grid-rows-2 gap-4">
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
            <img 
              src="/assets/img/Pandan Mocca Layer Cake.png" 
              alt="Pandan Mocca Layer Cake"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
            <img 
              src="/assets/img/Bolu Green Tea.png" 
              alt="Bolu Green Tea"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ===== 3. KEUNGGULAN KAMI ===== */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Keunggulan Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {advantages.map((a, i) => (
              <AdvantageCard key={i} icon={a.icon} title={a.title} desc={a.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. PRODUK UNGGULAN ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900">Produk Unggulan</h2>
            <p className="mt-3 text-slate-600 text-base md:text-lg">10 varian best-seller yang sudah dipercaya ribuan pelanggan.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-12 auto-rows-fr"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {featured.map((p, index) => (
              <motion.div
                key={p.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard 
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  discount={p.discount}
                  discountPrice={p.discountPrice}
                  image={p.image}
                  slug={p.slug}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/products" className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg">
              Lihat Semua Produk <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 6. MENGAPA GOLDEN BROWN ===== */}
      <section id="mengapa-kami" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Mengapa Golden Brown?</h2>
            <p className="mt-3 text-slate-600 text-base md:text-lg">Empat alasan utama mengapa ribuan pelanggan mempercayakan bahan baku mereka kepada kami.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brandValues.map((value, i) => (
              <div 
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg group-hover:bg-blue-800 group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. TESTIMONI ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Testimoni Pelanggan</h2>
            <p className="mt-3 text-slate-600 text-base md:text-lg">
              Apa kata pelanggan kami tentang Golden Brown Pasta
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
            {/* Testimoni 1 - Distributor */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0 group-hover:bg-blue-800 transition-colors">
                    <Handshake className="w-7 h-7 text-blue-800 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">Deni Setia Erawan</h3>
                    <p className="text-sm text-blue-800 font-semibold mt-1">Distributor</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -top-3 -left-2 text-6xl text-blue-200 opacity-50 font-serif leading-none">"</div>
                  <p className="text-gray-700 leading-relaxed relative z-10 pl-6 text-sm">
                    Sebagai distributor, kami sangat senang dan bangga telah bekerja sama dalam hal memasarkan produk GOLDEN BROWN selama ini. Produk GOLDEN BROWN sampai saat ini, masih menjadi spesialis handal perisa dan aroma pasta untuk Cake & Bakery. Produk GOLDEN BROWN sangat banyak diminati pelaku Bisnis Cake & Bakery, terbukti dari banyaknya Customer kami yang tersebar di JABODETABEK bahkan diluar kota seperti Bandung, Surabaya, Palembang, dan kota lainnya. Banyak keunggulan yang kami dapat dari GOLDEN BROWN. Misalnya, banyak varian rasa yang tersedia, harga yang terjangkau dan bersaing, lengkapnya ukuran kemasan, cara penggunaan yang sangat mudah. Dan mudah didapat.
                  </p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* ===== 8. INSPIRASI KREASI ===== */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Inspirasi Kreasi</h2>
            <p className="mt-3 text-slate-600 text-base md:text-lg">
              Lihat berbagai kreasi lezat yang bisa Anda buat dengan pasta Golden Brown
            </p>
          </motion.div>

          {/* Gallery Grid - Masonry Layout */}
          <motion.div 
            className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { img: "/assets/img/Rainbow Pudding.png", name: "Rainbow Pudding" },
              { img: "/assets/img/Moka Hopyes Roll Cake.png", name: "Moka Hopyes Roll Cake" },
              { img: "/assets/img/Putu Ayu Red Velvet.png", name: "Putu Ayu Red Velvet" },
              { img: "/assets/img/Martabak Manis Green Tea.png", name: "Martabak Green Tea" },
              { img: "/assets/img/Kue Lumpur Lapindo.png", name: "Kue Lumpur" },
              { img: "/assets/img/Coffee Boy Petite Fours.png", name: "Coffee Petite Fours" },
              { img: "/assets/img/Kue Mangkok Gula Aren.png", name: "Kue Mangkok" },
              { img: "/assets/img/Lemon Butter Cheese Cake.png", name: "Lemon Cheese Cake" },
              { img: "/assets/img/Red Velvet Oreo Pudding.png", name: "Red Velvet Pudding" },
              { img: "/assets/img/Bolu Gulung Rainbow.png", name: "Bolu Gulung Rainbow" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="break-inside-avoid mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white font-semibold p-4 text-sm">{item.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>


        </div>
      </section>

      {/* ===== 9. VIDEO TUTORIAL ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Video</h2>
            <p className="mt-3 text-slate-600 text-base md:text-lg">
              Pelajari cara membuat berbagai kreasi lezat dengan pasta Golden Brown
            </p>
          </div>

          <VideoGallery />
        </div>
      </section>

      {/* ===== 10. PRODUCT COVERAGE ===== */}
    </>
  )
}

/* ---------- helpers ---------- */
function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
      <p className="text-2xl font-bold text-blue-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  )
}

function CertCard({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center border border-gray-100">
      <CheckCircle className="text-green-600 w-7 h-7 mb-2" />
      <p className="text-sm font-semibold text-blue-900">{label}</p>
    </div>
  )
}