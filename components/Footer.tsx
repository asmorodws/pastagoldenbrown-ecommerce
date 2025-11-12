import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const links = {
    "Jelajahi": [
      { label: "Beranda", href: "/" },
      { label: "Produk Kami", href: "/products" },
      { label: "Tentang Kami", href: "#tentang-kami" },
      { label: "Gabung Mitra", href: "/auth/register" },
    ],
    "Bantuan": [
      { label: "Cara Belanja", href: "/how-to-order" },
      { label: "Pengiriman", href: "/shipping" },
      { label: "Retur & Refund", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow">
                GB
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Golden Brown</h3>
                <p className="text-xs text-gray-400">Pasta & Bahan Makanan</p>
              </div>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sejak 1980, kami berkomitmen menghadirkan pasta dan bahan makanan berkualitas dengan standar food-grade dan sertifikasi halal.
            </p>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Jelajahi</h4>
            <ul className="space-y-2 text-xs">
              {links.Jelajahi.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Bantuan</h4>
            <ul className="space-y-2 text-xs">
              {links.Bantuan.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-semibold text-sm mb-3">Hubungi Kami</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>
                  Jl. Raya Industri No. 123<br />
                  Jakarta, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 flex-shrink-0" />
                <span>Kantor Golden Brown +62214754521​</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 flex-shrink-0" />
                <span>info@goldenbrown.co.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Golden Brown Pasta. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}