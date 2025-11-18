import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function AboutSection() {
  return (
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
          <div className="columns-2 gap-4">
            {[
              { img: "/assets/img/Rainbow Cake Kukus.png", alt: "Rainbow Cake Kukus" },
              { img: "/assets/img/Martabak Red Velvet.png", alt: "Martabak Red Velvet" },
              { img: "/assets/img/Pandan Mocca Layer Cake.png", alt: "Pandan Mocca Layer Cake" },
              { img: "/assets/img/Bolu Green Tea.png", alt: "Bolu Green Tea" },
            ].map((item, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group max-h-[250px]">
                  <Image 
                    src={item.img} 
                    alt={item.alt}
                    width={300}
                    height={250}
                    style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

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
