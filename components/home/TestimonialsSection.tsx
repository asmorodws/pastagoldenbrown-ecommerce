import { Handshake, Star } from "lucide-react"

export default function TestimonialsSection() {
  return (
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
  )
}
