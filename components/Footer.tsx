import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#032252] text-gray-300 border-t border-[#05347e]">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#c49c0f] text-[#05347e] w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
                GB
              </div>
              <span className="text-xl font-bold text-white">Golden Brown Pasta</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Produsen pasta dan bahan makanan berkualitas sejak 1980. Bersertifikat Halal MUI dan BPOM 
              dengan standar Food Grade untuk mendukung bisnis UMKM Indonesia.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="bg-[#05347e] hover:bg-[#db0705] p-3 rounded-lg transition-all group shadow-md">
                <Facebook size={20} className="text-white" />
              </a>
              <a href="#" className="bg-[#05347e] hover:bg-[#db0705] p-3 rounded-lg transition-all group shadow-md">
                <Twitter size={20} className="text-white" />
              </a>
              <a href="#" className="bg-[#05347e] hover:bg-[#db0705] p-3 rounded-lg transition-all group shadow-md">
                <Instagram size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Navigasi Cepat</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/#tentang-kami" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Daftar Mitra
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Layanan Pelanggan</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Info Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#c49c0f] transition-colors flex items-center group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Kontak Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="bg-[#05347e] p-2 rounded-lg mt-0.5 group-hover:bg-[#db0705] transition-colors shadow-md">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Alamat Pabrik</div>
                  <span className="text-sm text-gray-300 leading-relaxed">
                    Jl. Raya Industri No. 123<br/>Jakarta, Indonesia
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="bg-[#05347e] p-2 rounded-lg group-hover:bg-[#db0705] transition-colors shadow-md">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Telepon</div>
                  <span className="text-sm text-gray-300">+62 21-xxxx-xxxx</span>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="bg-[#05347e] p-2 rounded-lg group-hover:bg-[#db0705] transition-colors shadow-md">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <span className="text-sm text-gray-300">info@goldenbrownpasta.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#05347e] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} <span className="text-[#c49c0f] font-semibold">Golden Brown Pasta</span>. Sejak 1980. Semua hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-[#c49c0f] transition-colors">Kebijakan Privasi</Link>
              <span className="text-gray-700">•</span>
              <Link href="/terms" className="hover:text-[#c49c0f] transition-colors">Syarat & Ketentuan</Link>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-green-400 font-semibold">Halal MUI & BPOM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
