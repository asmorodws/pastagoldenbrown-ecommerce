// footer.tsx - Redesigned
import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#c49c0f] text-[#05347e] w-10 h-10 flex items-center justify-center font-bold text-lg">
                GB
              </div>
              <div>
                <span className="text-lg font-bold text-white">Golden Brown</span>
                <p className="text-sm text-gray-500">Pasta & Bahan Makanan</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Produsen pasta dan bahan makanan berkualitas sejak 1980. 
              Bersertifikat Halal MUI dan BPOM dengan standar Food Grade.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Navigasi</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="#tentang-kami" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Daftar Mitra
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Bantuan</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Retur & Pengembalian
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#c49c0f] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  Jl. Raya Industri No. 123<br />
                  Jakarta, Indonesia
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-[#c49c0f] flex-shrink-0" />
                <span className="text-gray-400">+62 21-xxxx-xxxx</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[#c49c0f] flex-shrink-0" />
                <span className="text-gray-400">info@goldenbrown.co.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 text-center lg:text-left">
              © {new Date().getFullYear()} Golden Brown Pasta. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}