"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer id="kontak" className="bg-[#1a1f2e] text-gray-300">
      <div className="container mx-auto px-6 lg:px-16 py-20">

        {/* === 3 COLUMN LAYOUT === */}
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_auto] gap-16 lg:gap-20 items-start">

          {/* LEFT COLUMN — LOGO + SOSMED */}
          <div className="flex flex-col items-start gap-8">

            {/* LOGO */}
            <Link href="/" className="group">
              <div className="relative w-40 h-28 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Golden Brown Logo"
                  width={150}
                  height={112}
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML =
                        '<div class="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl"><span class="text-white font-black text-5xl">GB</span></div>'
                    }
                  }}
                />
              </div>
            </Link>

            {/* SOSIAL MEDIA */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Ikuti Kami</h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-11 h-11 rounded-xl bg-gray-800/50 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-11 h-11 rounded-xl bg-gray-800/50 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-600/20"
                >
                  <Instagram size={20} />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-11 h-11 rounded-xl bg-gray-800/50 hover:bg-sky-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/20"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN — TEXT PERUSAHAAN */}
          <div className="flex items-start pt-2">
            <p className="text-base text-gray-400 min-w-[280px] leading-relaxed max-w-xl">
              Sejak 1980, kami berkomitmen menghadirkan pasta dan bahan makanan berkualitas tinggi 
              dengan standar food-grade internasional serta sertifikasi halal MUI. Golden Brown 
              menjadi pilihan tepercaya bagi ribuan distributor dan pelanggan di seluruh Indonesia.
            </p>
          </div>

          {/* RIGHT COLUMN — HUBUNGI KAMI */}
          <div className="space-y-7 min-w-[280px]">
            <h4 className="text-white font-bold text-xl relative inline-block pb-3">
              Hubungi Kami
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
            </h4>

            <div className="space-y-5">

              {/* Address */}
              {/* <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-amber-400/30 group-hover:to-amber-600/30 transition-all duration-300">
                  <MapPin size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Alamat</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Jl. Raya Industri No. 123<br />
                    Jakarta, Indonesia 12345
                  </p>
                </div>
              </div> */}

              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-amber-400/30 group-hover:to-amber-600/30 transition-all duration-300">
                  <Phone size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Telepon</p>
                  <a href="tel:+62214754521" className="text-sm text-gray-300 hover:text-amber-400 transition-colors block font-medium">
                    +62 21 475 4521
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Senin–Jumat, 08:00–17:00 WIB</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-amber-400/30 group-hover:to-amber-600/30 transition-all duration-300">
                  <Mail size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-wide">Email</p>
                  <a
                    href="mailto:info@goldenbrown.co.id"
                    className="text-sm text-gray-300 hover:text-amber-400 transition-colors break-all font-medium"
                  >
                    info@goldenbrown.co.id
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-gray-800/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Golden Brown Pasta.
            </p>

            
          </div>
        </div>

      </div>
    </footer>
  )
}
