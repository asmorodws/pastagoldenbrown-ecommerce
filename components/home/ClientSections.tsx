"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
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
          <div className="relative w-72 md:w-96 h-[400px]">
            <Image
              src="/hero-product.png"
              alt="Golden Brown Pasta - Bahan Tambahan Pangan Campuran"
              fill
              sizes="(max-width: 768px) 288px, 384px"
              className="rounded-lg drop-shadow-lg object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function InspirasiSection() {
  return (
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
          className="columns-2 md:columns-3 lg:columns-4 gap-4"
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
                <div className="relative w-full">
                  <Image 
                    src={item.img} 
                    alt={item.name}
                    width={400}
                    height={0}
                    style={{ width: '100%', height: 'auto' }}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-semibold p-4 text-sm">{item.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
