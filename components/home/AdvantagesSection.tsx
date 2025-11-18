import { ShieldCheck, FlaskConical, Blend, Factory, Truck } from "lucide-react"
import { AdvantageCard } from "@/components/ui/AdvantageCard"

const advantages = [
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Sertifikasi Lengkap", desc: "Halal MUI & BPJPH, terdaftar BPOM + NIB – keamanan, legalitas, dan kehalalan terjamin." },
  { icon: <FlaskConical className="w-6 h-6" />, title: "Inovasi Berbasis Kebutuhan Pasar", desc: "Tim R&D berpengalaman menghadirkan solusi rasa, warna, dan formulasi terkini." },
  { icon: <Blend className="w-6 h-6" />, title: "Formulasi Rasa Sesuai Permintaan", desc: "Layanan custom flavoring & blending untuk kebutuhan klien. *Syarat dan ketentuan berlaku." },
  { icon: <Factory className="w-6 h-6" />, title: "Skalabilitas Produksi", desc: "Tersedia untuk skala UMKM hingga industri manufaktur dalam berbagai volume." },
  { icon: <Truck className="w-6 h-6" />, title: "Jaringan Distribusi Nasional", desc: "Sistem distribusi dan agen efisien menjangkau seluruh Indonesia." },
]

export default function AdvantagesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">Keunggulan Kami</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12 justify-items-center">
          {advantages.map((a, i) => (
            <AdvantageCard key={i} icon={a.icon} title={a.title} desc={a.desc} />
          ))}
        </div>
      </div>
    </section>
  )
}
