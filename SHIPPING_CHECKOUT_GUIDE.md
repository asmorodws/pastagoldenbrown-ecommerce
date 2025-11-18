# Panduan Pemilihan Jasa Pengiriman & Ongkir di Checkout

##  Status Implementasi: SELESAI

Fitur pemilihan jasa pengiriman dan perhitungan ongkir otomatis **sudah terintegrasi lengkap** di halaman checkout.

##  Alur Checkout dengan RajaOngkir V2

### Step 1: Keranjang Belanja
- User melihat produk yang akan dibeli
- Klik "Lanjut ke Pengiriman"

### Step 2: Informasi Pengiriman ⭐ (SHIPPING SELECTOR)

#### 2.1. Pilih/Tambah Alamat
User menggunakan **AddressSelector** dengan fitur search:
```
1. Klik "Tambah Alamat"
2. Ketik lokasi di search box (min 3 karakter)
   Contoh: "jakarta selatan" atau "kebayoran"
3. Pilih dari dropdown hasil pencarian
4. Form auto-fill: kota, provinsi, kode pos, cityId
5. Lengkapi nama penerima, telepon, alamat detail
6. Simpan
```

#### 2.2. Perhitungan Ongkir Otomatis 
Setelah alamat dipilih, jika alamat memiliki `cityId` (dari search RajaOngkir):

**ShippingSelector otomatis muncul dan:**
1. Menghitung total berat paket (dari semua item di cart)
2. Memanggil `/api/rajaongkir/cost` dengan:
   ```json
   {
     "origin": "31555",           // dari .env NEXT_PUBLIC_ORIGIN_CITY_ID
     "destination": "22",          // dari selectedAddress.cityId
     "weight": 1000,               // total gram
     "courier": "jne:sicepat:tiki", // multi-courier
     "price": "lowest"             // prioritas harga terendah
   }
   ```
3. Menampilkan opsi pengiriman dari 3 kurir (JNE, SiCepat, TIKI)

**Tampilan Opsi Pengiriman:**
```
┌─────────────────────────────────────────────────────┐
│ 🚛 SiCepat Express                                  │
│ Berat: 1 kg                                         │
├─────────────────────────────────────────────────────┤
│ ☑️ BBM - Berani Bayar Murah                         │
│    6-8 hari    Rp 24.500                          │
│                                                     │
│ ☐ REG - Reguler                                     │
│    5-7 hari    Rp 35.500                          │
│                                                     │
│ ☐ GOKIL - Cargo Per Kg (Minimal 10kg)              │
│    7-8 hari    Rp 190.000                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🚛 Jalur Nugraha Ekakurir (JNE)                     │
│ Berat: 1 kg                                         │
├─────────────────────────────────────────────────────┤
│ ☐ REG - Layanan Reguler                            │
│    3 hari      Rp 32.000                          │
│                                                     │
│ ☐ JTR - JNE Trucking                                │
│    7 hari      Rp 90.000                          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Citra Van Titipan Kilat (TIKI)                   │
│ Berat: 1 kg                                         │
├─────────────────────────────────────────────────────┤
│ ☐ ECO - Economy Service                             │
│    5 hari      Rp 35.000                          │
│                                                     │
│ ☐ REG - Reguler Service                             │
│    3 hari      Rp 38.000                          │
│                                                     │
│ ☐ ONS - Over Night Service                          │
│    1 hari      Rp 53.000                          │
└─────────────────────────────────────────────────────┘
```

4. User **klik salah satu opsi** untuk memilih
5. Ongkir langsung ditambahkan ke total pembayaran
6. Klik "Lanjut ke Pembayaran"

#### 2.3. Mode Manual (RajaOngkir Tidak Tersedia)
Jika alamat **tidak memiliki cityId** (diisi manual):
```
┌─────────────────────────────────────────────────────┐
│  Perhitungan Ongkir Otomatis Tidak Tersedia       │
│                                                     │
│ RajaOngkir API tidak tersedia. Biaya pengiriman    │
│ akan dikonfirmasi setelah pesanan dibuat.          │
└─────────────────────────────────────────────────────┘
```
- Tidak ada shipping selector
- Validasi tidak wajib pilih shipping
- Order tetap bisa dilanjutkan
- Admin akan konfirmasi ongkir manual

### Step 3: Metode Pembayaran
- Pilih: Transfer Bank / E-Wallet / Kartu Kredit
- Klik "Review Pesanan"

### Step 4: Review & Konfirmasi 

**Ringkasan Lengkap:**
```
┌─────────────────────────────────────────────────────┐
│  Produk yang Dipesan (3 item)                     │
│ - Pasta Carbonara Classic (x2) - Rp 60.000         │
│ - Pasta Aglio Olio (x1) - Rp 35.000                │
├─────────────────────────────────────────────────────┤
│ 📍 Informasi Pengiriman                             │
│ Nama: John Doe                                      │
│ Telepon: 08123456789                                │
│ Alamat: Jl. Sudirman No. 123, RT 01/02             │
│ Kota: Jakarta Selatan, DKI Jakarta                 │
│ Kode Pos: 12180                                     │
│                                                     │
│ Kurir: SiCepat Express                              │
│ Layanan: BBM - Berani Bayar Murah                   │
│ Estimasi: 6-8 hari                                  │
│ Biaya: Rp 24.500                                    │
├─────────────────────────────────────────────────────┤
│ 💳 Metode Pembayaran                                │
│ Transfer Bank (BCA, Mandiri, BNI, BRI)             │
├─────────────────────────────────────────────────────┤
│  Total Pembayaran                                 │
│ Subtotal         Rp 95.000                          │
│ Ongkos Kirim     Rp 24.500                          │
│ ─────────────────────────────                       │
│ TOTAL            Rp 119.500                         │
└─────────────────────────────────────────────────────┘

[Kembali]  [✓ Konfirmasi & Buat Pesanan]
```

Klik "Konfirmasi & Buat Pesanan" → Order dibuat!

##  Konfigurasi yang Diperlukan

### 1. File `.env`
```env
# RajaOngkir V2 API
RAJAONGKIR_API_KEY="20034d5f5c06592f4e2914c582d19a57"
RAJAONGKIR_BASE_URL="https://rajaongkir.komerce.id/api/v1"

# Origin City ID (lokasi toko Anda)
NEXT_PUBLIC_ORIGIN_CITY_ID="31555"
```

### 2. Cara Mendapatkan Origin City ID
```bash
# Search lokasi toko Anda
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=jakarta+selatan&limit=5"

# Response:
{
  "data": [
    {
      "id": "31555",  # <-- Gunakan ID ini
      "name": "Kebayoran Baru",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "postal_code": "12180"
    }
  ]
}

# Update .env
NEXT_PUBLIC_ORIGIN_CITY_ID="31555"
```

##  Integrasi Backend

### API Endpoint yang Digunakan

#### 1. Search Destination (untuk AddressSelector)
```
GET /api/rajaongkir/search?q=jakarta&limit=10
```
Response: List lokasi dengan id, nama, provinsi, kota, kode pos

#### 2. Calculate Shipping Cost (untuk ShippingSelector)
```
POST /api/rajaongkir/cost
Body: {
  "origin": "31555",
  "destination": "22",
  "weight": 1000,
  "courier": "jne:sicepat:tiki",
  "price": "lowest"
}
```
Response (normalized):
```json
[
  {
    "code": "sicepat",
    "name": "SiCepat Express",
    "costs": [
      {
        "service": "BBM",
        "description": "Berani Bayar Murah",
        "cost": [
          {
            "value": 24500,
            "etd": "6-8 day",
            "note": ""
          }
        ]
      }
    ]
  }
]
```

### Data yang Disimpan ke Order

Saat user konfirmasi pesanan, data shipping disimpan:
```typescript
{
  shipping: {
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    address: "Jl. Sudirman No. 123",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    zip: "12180",
    country: "Indonesia",
    
    // Shipping details (jika RajaOngkir tersedia)
    courier: "sicepat",
    courierName: "SiCepat Express",
    service: "BBM",
    serviceName: "Berani Bayar Murah",
    shippingCost: 24500,
    etd: "6-8 day",
    
    paymentMethod: "bank_transfer"
  }
}
```

##  Komponen UI

### 1. `components/AddressSelector.tsx`
**Fitur:**
- Search-based location picker (RajaOngkir V2)
- Autocomplete dropdown
- Manual input fallback
- Save multiple addresses
- Set default address

### 2. `components/checkout/ShippingSelector.tsx`
**Fitur:**
- Auto-calculate total weight
- Fetch multi-courier costs in single request
- Display courier logos & service details
- Show price, ETD, service description
- Select shipping method
- Error handling & retry

### 3. `app/(shop)/checkout/page.tsx`
**Fitur:**
- Multi-step checkout (4 steps)
- Address selection integration
- Shipping selector integration
- Payment method selection
- Order review & confirmation
- Conditional validation (shipping required only if cityId exists)

##  Validasi & Error Handling

### Validasi di Step 2 (Pengiriman)
```typescript
// Klik "Lanjut ke Pembayaran"
if (selectedAddress?.cityId && !selectedShipping) {
  toast.error("Pilih metode pengiriman terlebih dahulu")
  return
}
// Jika cityId tidak ada (manual mode), langsung lanjut
setCurrentStep(3)
```

### Error Handling
1. **API tidak tersedia**: Fallback ke manual input
2. **Tidak ada layanan**: Tampilkan pesan "Tidak ada layanan tersedia"
3. **Request gagal**: Tombol "Coba Lagi"
4. **Timeout**: Auto-retry dengan debouncing

##  Testing

### Test Local API
```bash
# 1. Start server
npm run dev

# 2. Test calculate cost
curl -X POST http://localhost:3000/api/rajaongkir/cost \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "31555",
    "destination": "22",
    "weight": 1000,
    "courier": "jne:sicepat:tiki",
    "price": "lowest"
  }'
```

Expected response: Array of couriers with services and costs

### Test Flow di Browser
1. Tambah produk ke cart
2. Buka `/checkout`
3. **Step 1**: Lihat produk → Klik "Lanjut ke Pengiriman"
4. **Step 2**: 
   - Klik "Tambah Alamat"
   - Search lokasi (ketik min 3 huruf)
   - Pilih dari dropdown
   - Simpan alamat
   - Lihat ShippingSelector muncul otomatis
   - Pilih kurir & layanan
   - Klik "Lanjut ke Pembayaran"
5. **Step 3**: Pilih metode pembayaran → "Review Pesanan"
6. **Step 4**: Cek semua detail → "Konfirmasi & Buat Pesanan"
7. Redirect ke halaman order detail

## 📌 Fitur Tambahan

### Sidebar Summary (Sticky)
- Ringkasan produk
- Real-time total update
- Subtotal + Ongkir = Total
- Fitur benefits (garansi, aman, dll)

### Responsive Design
- Mobile-friendly
- Collapsible sections
- Touch-optimized buttons
- Scrollable product list

### User Experience
- Loading indicators
- Success/error toasts
- Konfirmasi sebelum submit
- Auto-fill user data
- Remember selected address

##  Performance

### Optimizations
- **Debounced search**: 500ms delay
- **Conditional rendering**: Shipping selector hanya muncul jika cityId ada
- **Grouped API calls**: Multi-courier dalam 1 request
- **Lazy loading**: Components di-import on-demand
- **Memoization**: Prevent unnecessary re-renders

### API Usage
- Search: ~2-5 calls per address form (dengan debouncing)
- Cost calculation: 1 call per address selection
- Total: ~3-6 API calls per checkout session

##  Dokumentasi Terkait

- **Setup Guide**: `RAJAONGKIR_V2_MIGRATION.md`
- **Search Implementation**: `RAJAONGKIR_SEARCH_IMPLEMENTATION.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **API Changes**: `CHANGELOG_RAJAONGKIR_V2.md`

---

##  Kesimpulan

Form pemilihan jasa pengiriman dan perhitungan ongkir **sudah lengkap dan berfungsi** di halaman checkout!

**Yang perlu Anda lakukan:**
1.  Pastikan `RAJAONGKIR_API_KEY` terisi di `.env`
2.  Set `NEXT_PUBLIC_ORIGIN_CITY_ID` sesuai lokasi toko
3.  Test flow checkout end-to-end
4.  Deploy dan monitor API usage

**Fitur yang sudah berjalan:**
-  Search-based address selection
-  Auto-calculate shipping cost
-  Multi-courier comparison (JNE, SiCepat, TIKI, dll)
-  Real-time price update
-  Manual mode fallback
-  Complete order creation with shipping details

**Status: PRODUCTION READY** 
