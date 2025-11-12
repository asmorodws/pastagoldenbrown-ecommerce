"use client"

import Image from "next/image"

export default function ProductCoverage() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Jangkauan Produk</h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Jaringan distribusi Golden Brown Pasta menjangkau seluruh Indonesia
          </p>
        </div>
        
        {/* Map Container */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="p-6 md:p-8">
            <div className="relative w-full rounded-lg overflow-hidden">
              <Image
                src="/jangkauan.png"
                alt="Peta Jangkauan Distribusi Golden Brown Pasta di Indonesia"
                width={1600}
                height={600}
                className="w-full h-auto"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
