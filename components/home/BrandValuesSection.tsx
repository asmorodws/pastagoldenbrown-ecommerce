import { Star, Handshake, ShieldCheck, Award } from "lucide-react"

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

export default function BrandValuesSection() {
  return (
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
  )
}
