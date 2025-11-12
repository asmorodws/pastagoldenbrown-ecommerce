# Product Coverage Map Component

Komponen peta Indonesia yang menampilkan jangkauan distribusi produk Golden Brown Pasta.

## Fitur
- ✅ Peta Indonesia berbasis SVG (ringan & responsif)
- ✅ 34+ titik lokasi distribusi
- ✅ Warna sesuai brand (hijau untuk area terjangkau, abu-abu untuk area belum terjangkau)
- ✅ Marker merah untuk setiap kota
- ✅ Tooltip saat hover di setiap marker
- ✅ Section statistik di bawah peta
- ✅ Responsive untuk mobile & desktop

## Cara Menggunakan

```tsx
import ProductCoverage from "@/components/ui/ProductCoverage"

export default function Page() {
  return (
    <div>
      <ProductCoverage />
    </div>
  )
}
```

## Kustomisasi

### Menambah/Mengedit Lokasi
Edit array `locations` di file `ProductCoverage.tsx`:

```tsx
const locations = [
  { name: "Nama Kota", x: 100, y: 150 },
  // x dan y adalah koordinat SVG (0-1000 untuk x, 0-400 untuk y)
]
```

### Mengubah Warna
- Warna area hijau (terjangkau): ubah `fill="#70bf63"`
- Warna area abu-abu (tidak terjangkau): ubah `fill="#b0b0b0"`
- Warna marker: ubah `fill="#db0705"` (merah)
- Warna border pulau: ubah `stroke="#ffffff"`

### Mengubah Statistik
Edit bagian Stats Section di bawah peta:

```tsx
<div className="text-center p-4 bg-[#f7f7f7] rounded-lg">
  <div className="text-3xl font-bold text-[#05347e] mb-2">34+</div>
  <div className="text-sm text-gray-600">Kota Terjangkau</div>
</div>
```

## Lokasi yang Ditampilkan

### Sumatera (6 kota)
- Medan, Pekanbaru, Batam, Jambi, Bengkulu, Lampung

### Jawa (18 kota)
- DKI Jakarta, Bekasi, Depok, Bogor, Karawang, Garut, Tasikmalaya, Cirebon
- Tangerang, Purwakarta, Bandung, Wonosobo, Semarang, Yogyakarta
- Malang, Sidoarjo, Surabaya, Bali

### Kalimantan (3 kota)
- Pontianak, Balikpapan, Banjarmasin

### Sulawesi (3 kota)
- Palu, Manado, Makassar

### Papua (1 area)
- Papua

**Total: 34+ lokasi**

## Tips Posisi Marker
- Kiri (Sumatera): x = 40-170
- Tengah (Jawa/Kalimantan): x = 210-465
- Kanan (Sulawesi): x = 485-570
- Paling Kanan (Papua): x = 785-925
- Atas (Utara): y = 65-150
- Tengah: y = 150-250
- Bawah (Selatan): y = 250-300

## Notes
- Peta ini adalah simplified version untuk keperluan visual
- Koordinat marker sudah disesuaikan dengan posisi relatif kota di Indonesia
- Untuk akurasi geografis yang lebih tinggi, gunakan library seperti react-simple-maps atau Leaflet
