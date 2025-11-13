# RajaOngkir Shipping Integration

⚠️ **PENTING: RajaOngkir Sudah Migrasi ke Platform Baru!**

RajaOngkir telah migrasi ke platform baru di **https://collaborator.komerce.id**

**Langkah untuk menggunakan API:**
1. Kunjungi https://collaborator.komerce.id
2. Login atau daftar akun baru
3. Renewal package Anda (jika sudah punya akun lama)
4. Dapatkan API key baru dari dashboard
5. Update konfigurasi di `.env`

---

Integrasi lengkap dengan RajaOngkir API untuk pengecekan ongkos kirim otomatis berdasarkan tujuan.

## 🎯 Fitur yang Telah Diimplementasikan

### 1. Backend API
- ✅ Utility functions untuk RajaOngkir API (`lib/rajaongkir.ts`)
- ✅ Endpoint `/api/rajaongkir/provinces` - Ambil semua provinsi
- ✅ Endpoint `/api/rajaongkir/cities` - Ambil kota/kabupaten (dengan filter provinsi)
- ✅ Endpoint `/api/rajaongkir/cost` - Hitung ongkos kirim

### 2. Database Schema
- ✅ Tabel `Address` ditambahkan field:
  - `cityId` - RajaOngkir city ID
  - `provinceId` - RajaOngkir province ID
- ✅ Migration sudah dijalankan dan Prisma Client sudah di-generate

### 3. Frontend Components
- ✅ **AddressSelector** - Updated untuk menggunakan dropdown provinsi dan kota dari RajaOngkir
  - Auto-fill dari data RajaOngkir
  - Kode pos otomatis terisi dari data kota
  - Simpan cityId dan provinceId untuk perhitungan ongkir
  
- ✅ **ShippingSelector** - Komponen baru untuk memilih kurir dan layanan
  - Tampilkan opsi dari 3 kurir (JNE, POS, TIKI)
  - Multiple layanan per kurir (REG, YES, OKE, dll)
  - Tampilkan biaya dan estimasi pengiriman
  - Real-time calculation berdasarkan berat dan tujuan

### 4. Checkout Integration
- ✅ Checkout page terintegrasi dengan ShippingSelector
- ✅ Ongkos kirim dihitung otomatis berdasarkan:
  - Alamat tujuan (cityId)
  - Total berat produk di keranjang
  - Kurir dan layanan yang dipilih
- ✅ Total pembayaran termasuk ongkir
- ✅ Validasi: user harus pilih alamat dan metode pengiriman
- ✅ Review order menampilkan detail shipping lengkap

## 🔧 Konfigurasi yang Diperlukan

### ⚠️ LANGKAH PENTING: Migrasi ke Platform Baru

**RajaOngkir sudah tidak aktif di rajaongkir.com!**

1. **Kunjungi Platform Baru**: https://collaborator.komerce.id
2. **Login/Daftar Akun**:
   - Jika sudah punya akun RajaOngkir lama, login dengan kredensial yang sama
   - Jika belum punya, daftar akun baru
3. **Renewal Package**: 
   - Pilih package yang sesuai (Starter, Basic, Pro)
   - Lakukan pembayaran/renewal
4. **Dapatkan API Key**: 
   - Setelah renewal, masuk ke dashboard
   - Copy API key baru Anda
5. **Cek Base URL Terbaru**: 
   - Lihat dokumentasi API di dashboard
   - Base URL mungkin berubah (kemungkinan: `https://api.komerce.id/rajaongkir/starter`)

### 1. RajaOngkir API Configuration

Edit file `.env`:
```env
# Update dengan API key dari https://collaborator.komerce.id
RAJAONGKIR_API_KEY="YOUR_NEW_API_KEY_FROM_KOMERCE"

# Base URL - cek dokumentasi terbaru di dashboard Komerce
# Kemungkinan salah satu dari:
RAJAONGKIR_BASE_URL="https://api.komerce.id/rajaongkir/starter"
# atau
# RAJAONGKIR_BASE_URL="https://api.rajaongkir.com/starter"
```

**Catatan**: Base URL mungkin berbeda tergantung package Anda (Starter/Basic/Pro). Selalu cek dokumentasi terbaru di dashboard Komerce.

### 2. Lokasi Toko (Origin City ID)
Tentukan city_id toko Anda untuk perhitungan ongkir.

Edit file `.env`:
```env
# Contoh city_id untuk beberapa kota besar:
# Jakarta Timur: 501
# Bandung: 23
# Surabaya: 444
# Yogyakarta: 419
NEXT_PUBLIC_ORIGIN_CITY_ID="501"
```

**Cara mencari city_id:**
1. Jalankan aplikasi
2. Buka browser console
3. Panggil API: `fetch('/api/rajaongkir/cities').then(r => r.json()).then(console.log)`
4. Cari kota Anda dan catat `city_id`-nya

### 3. Restart Development Server
Setelah update `.env`, restart Next.js:
```bash
npm run dev
```

## 📋 Cara Menggunakan

### Untuk User (Customer):
1. **Tambah Alamat Pengiriman**
   - Pilih provinsi dari dropdown
   - Pilih kota/kabupaten dari dropdown (otomatis terfilter)
   - Kode pos otomatis terisi
   - Simpan alamat

2. **Checkout**
   - Pilih alamat pengiriman
   - Sistem otomatis tampilkan opsi kurir dan biaya
   - Pilih kurir dan layanan yang diinginkan
   - Total pembayaran termasuk ongkir
   - Review dan konfirmasi pesanan

### Untuk Developer:

#### Memanggil RajaOngkir API:
```typescript
import { getProvinces, getCities, getShippingCost } from '@/lib/rajaongkir'

// Ambil provinsi
const provinces = await getProvinces()

// Ambil kota (semua atau filter by provinsi)
const allCities = await getCities()
const citiesInProvince = await getCities('6') // Provinsi ID 6

// Hitung ongkir
const costs = await getShippingCost({
  origin: '501', // Jakarta Timur
  destination: '23', // Bandung
  weight: 1000, // 1 kg (dalam gram)
  courier: 'jne' // jne, pos, atau tiki
})
```

#### Kurir yang Tersedia (Starter Plan):
- **JNE** - Jalur Nugraha Ekakurir
- **POS Indonesia** - Pos Indonesia
- **TIKI** - Titipan Kilat

## 🚀 Fitur Lanjutan (Opsional)

### 1. Tambah Field Berat Produk
Saat ini berat default adalah 500 gram per item. Untuk lebih akurat:

```typescript
// prisma/schema.prisma
model Product {
  // ... existing fields
  weight Int @default(500) // dalam gram
}
```

Migration:
```bash
npx prisma migrate dev --name add_product_weight
```

Update checkout calculation di `app/(shop)/checkout/page.tsx`:
```typescript
const getTotalWeight = () => {
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 500 // use actual weight
    return total + (itemWeight * item.quantity)
  }, 0)
}
```

### 2. Simpan Data Shipping ke Order
Update `prisma/schema.prisma`:
```prisma
model Order {
  // ... existing fields
  shippingCourier   String? // JNE, POS, TIKI
  shippingService   String? // REG, YES, OKE, etc
  shippingCost      Decimal @default(0)
  shippingEtd       String? // estimasi hari
}
```

Migration:
```bash
npx prisma migrate dev --name add_shipping_to_order
```

Update order creation di `app/api/orders/route.ts`:
```typescript
const order = await prisma.order.create({
  data: {
    // ... existing data
    shippingCourier: shipping.courier,
    shippingService: shipping.service,
    shippingCost: shipping.shippingCost,
    shippingEtd: shipping.etd,
  }
})
```

### 3. Tracking Number (untuk Admin)
Tambahkan field `trackingNumber` ke Order model untuk update status pengiriman.

## 🔍 Testing

### Test dengan Data Development:
1. **Test Provinsi API**:
   ```bash
   curl http://localhost:3000/api/rajaongkir/provinces
   ```

2. **Test Cities API**:
   ```bash
   # Semua kota
   curl http://localhost:3000/api/rajaongkir/cities
   
   # Kota di provinsi tertentu
   curl "http://localhost:3000/api/rajaongkir/cities?province=6"
   ```

3. **Test Cost Calculation**:
   ```bash
   curl -X POST http://localhost:3000/api/rajaongkir/cost \
     -H "Content-Type: application/json" \
     -d '{
       "origin": "501",
       "destination": "23",
       "weight": 1000,
       "courier": "jne"
     }'
   ```

### Test End-to-End:
1. Login ke aplikasi
2. Tambah produk ke keranjang
3. Checkout
4. Tambah alamat baru (perhatikan dropdown provinsi dan kota)
5. Pilih alamat
6. Lihat opsi shipping yang muncul
7. Pilih kurir dan layanan
8. Review total (harus termasuk ongkir)
9. Konfirmasi order

## 📊 Limitasi RajaOngkir Starter Plan

- ✅ 3 kurir tersedia: JNE, POS Indonesia, TIKI
- ❌ Tidak tersedia: J&T, SiCepat, Anteraja, dll
- ✅ Unlimited API calls
- ✅ Estimasi biaya real-time
- ✅ Multiple service options per kurir

Untuk upgrade ke Pro Plan (lebih banyak kurir), kunjungi: https://collaborator.komerce.id

## 🚨 Perhatian Penting!

**RajaOngkir telah migrasi ke platform baru:**
- ❌ **TIDAK AKTIF**: https://rajaongkir.com (API endpoint lama sudah mati)
- ✅ **AKTIF**: https://collaborator.komerce.id (Platform baru)

**Yang harus dilakukan:**
1. ✅ Daftar/Login di https://collaborator.komerce.id
2. ✅ Renewal package Anda (Starter/Basic/Pro)
3. ✅ Dapatkan API key baru
4. ✅ Update `RAJAONGKIR_API_KEY` di `.env`
5. ✅ Cek dan update `RAJAONGKIR_BASE_URL` jika diperlukan
6. ✅ Restart development server

**Link Penting:**
- Platform Baru: https://collaborator.komerce.id
- Dokumentasi: Tersedia di dashboard setelah login
- Support: Hubungi support Komerce jika ada kendala migrasi

## 🐛 Troubleshooting

### Error: "city_id not found"
- Pastikan address memiliki cityId yang valid
- Check apakah user sudah pilih kota dari dropdown (bukan input manual)

### Error: "RAJAONGKIR_API_KEY is not defined"
- Pastikan `.env` sudah diisi dengan API key yang benar dari https://collaborator.komerce.id
- Restart development server setelah update `.env`
- Pastikan sudah renewal package di platform baru

### Error: "Endpoint API ini sudah tidak aktif"
- RajaOngkir sudah migrasi ke https://collaborator.komerce.id
- Perlu renewal package di platform baru
- Update `RAJAONGKIR_BASE_URL` di `.env` sesuai dokumentasi terbaru
- Dapatkan API key baru dari dashboard Komerce

### Shipping options tidak muncul
- Check console browser untuk error
- Pastikan alamat memiliki cityId (tidak null)
- Pastikan NEXT_PUBLIC_ORIGIN_CITY_ID sudah diset di `.env`

### Total weight = 0
- Tambahkan field weight ke Product model
- Atau pastikan default weight calculation berjalan

## 📝 Notes

- RajaOngkir API menggunakan city_id sebagai identifier unik
- Setiap kota/kabupaten memiliki postal_code default
- ETD (Estimated Time of Delivery) dalam satuan hari
- Biaya dalam satuan Rupiah
- Weight harus dalam gram (1 kg = 1000 gram)

## 🎉 Selesai!

Integrasi RajaOngkir sudah selesai diimplementasikan. 

**CHECKLIST SEBELUM MENGGUNAKAN:**

1. ✅ **Migrasi ke Platform Baru** ⚠️ WAJIB!
   - Kunjungi https://collaborator.komerce.id
   - Login/Daftar dan renewal package
   - Dapatkan API key baru

2. ✅ **Set Configuration di `.env`**
   - `RAJAONGKIR_API_KEY` = API key dari dashboard Komerce
   - `RAJAONGKIR_BASE_URL` = URL sesuai dokumentasi (cek di dashboard)
   - `NEXT_PUBLIC_ORIGIN_CITY_ID` = city_id toko Anda

3. ✅ **Restart Development Server**
   ```bash
   npm run dev
   ```

4. ✅ **Test End-to-End Flow**
   - Tambah alamat dengan dropdown provinsi/kota
   - Checkout dan lihat opsi shipping
   - Verifikasi biaya ongkir muncul dengan benar

5. ✅ **(Opsional) Tambah Field Weight ke Product**
   - Untuk kalkulasi berat yang lebih akurat

**Jika mengalami masalah:**
- Pastikan sudah renewal package di https://collaborator.komerce.id
- Cek error message di browser console
- Verifikasi API key dan base URL sudah benar
- Hubungi support Komerce jika API masih error

Happy coding! 🚀
