# RajaOngkir V2 API Integration Guide

##  Update: RajaOngkir Migrasi ke Platform Baru!

RajaOngkir telah **migrasi ke platform baru** dengan API v2 yang lebih modern.

**Platform Baru:**
-  Website: https://collaborator.komerce.id
- 📡 Base URL: `https://rajaongkir.komerce.id/api/v1`
-  Postman Collection: Tersedia (sudah diintegrasikan)

---

##  Perubahan dari V1 ke V2

### Endpoint Changes

| V1 (Old) | V2 (New) | Status |
|----------|----------|--------|
| `/province` |  Removed | Use Search API |
| `/city` |  Removed | Use Search API |
| `/cost` | `/calculate/domestic-cost` |  Updated |
| - | `/destination/domestic-destination` |  NEW |
| - | `/destination/international-destination` |  NEW |
| - | `/track/waybill` |  NEW |

### Request Format Changes

**V1 (Old):**
```typescript
// Multiple single-courier requests
fetch('/api/rajaongkir/cost', {
  body: { courier: 'jne' }
})
fetch('/api/rajaongkir/cost', {
  body: { courier: 'pos' }
})
```

**V2 (New):**
```typescript
// Single request with colon-separated couriers
fetch('/api/rajaongkir/cost', {
  body: { courier: 'jne:pos:tiki:sicepat:jnt' }
})
```

### Response Format Changes

**V1:**
```json
{
  "rajaongkir": {
    "status": { "code": 200 },
    "results": [...]
  }
}
```

**V2:**
```json
{
  "data": [...]
}
```

---

##  Setup RajaOngkir V2

### 1. Daftar/Login ke Platform Baru

```bash
# Kunjungi platform baru
https://collaborator.komerce.id
```

**Langkah:**
1. Login atau daftar akun baru
2. Pilih package (Starter/Basic/Pro)
3. Lakukan pembayaran/renewal
4. Dapatkan API key dari dashboard

### 2. Konfigurasi Environment

Edit `.env`:
```env
# RajaOngkir V2 Configuration
RAJAONGKIR_API_KEY="your_api_key_from_dashboard"
RAJAONGKIR_BASE_URL="https://rajaongkir.komerce.id/api/v1"

# Store Location (Destination ID)
NEXT_PUBLIC_ORIGIN_CITY_ID="31555"  # Ganti dengan ID lokasi toko Anda
```

### 3. Cari Destination ID Toko Anda

**Cara 1: Menggunakan API (Recommended)**

```bash
# Test dengan curl (ganti YOUR_API_KEY)
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=jakarta&limit=10"
```

**Cara 2: Menggunakan Aplikasi**

1. Jalankan aplikasi: `npm run dev`
2. Buka browser console
3. Jalankan:
   ```javascript
   fetch('/api/rajaongkir/search?q=jakarta&limit=10')
     .then(r => r.json())
     .then(data => console.table(data))
   ```
4. Cari lokasi toko Anda dan catat `id` nya
5. Update `.env`: `NEXT_PUBLIC_ORIGIN_CITY_ID="ID_YANG_DICATAT"`

### 4. Restart Server

```bash
npm run dev
```

---

## 📡 API Endpoints (Internal)

### 1. Search Domestic Destination

**Endpoint:** `GET /api/rajaongkir/search`

**Parameters:**
- `q` (required): Search query (min 2 karakter)
- `limit` (optional): Jumlah hasil (default: 10)
- `offset` (optional): Offset pagination (default: 0)

**Example:**
```javascript
// Cari lokasi Jakarta
fetch('/api/rajaongkir/search?q=jakarta&limit=10')
  .then(r => r.json())
  .then(data => console.log(data))
```

**Response:**
```json
[
  {
    "id": "31555",
    "name": "Kebon Kelapa, Gambir, Jakarta Pusat, DKI Jakarta",
    "province": "DKI Jakarta",
    "city": "Jakarta Pusat",
    "district": "Gambir",
    "subdistrict": "Kebon Kelapa",
    "postal_code": "10120"
  }
]
```

### 2. Calculate Shipping Cost

**Endpoint:** `POST /api/rajaongkir/cost`

**Body:**
```json
{
  "origin": "31555",
  "destination": "68423",
  "weight": 1000,
  "courier": "jne:pos:tiki:sicepat:jnt:ninja:anteraja"
}
```

**Response:**
```json
[
  {
    "code": "jne",
    "name": "JNE",
    "costs": [
      {
        "service": "REG",
        "description": "Layanan Reguler",
        "cost": [
          {
            "value": 15000,
            "etd": "2-3",
            "note": ""
          }
        ]
      }
    ]
  }
]
```

---

## 🛠 Implementasi di Kode

### Backend (lib/rajaongkir.ts)

```typescript
//  Sudah diimplementasikan:
export async function searchDomesticDestination(
  search: string,
  limit: number = 10,
  offset: number = 0
): Promise<RajaOngkirDestination[]>

export async function getShippingCost(params: {
  origin: string        // destination ID dari Search API
  destination: string   // destination ID dari Search API
  weight: number        // berat dalam gram
  courier: string       // jne:pos:tiki (colon separated)
}): Promise<RajaOngkirCourier[]>
```

### Frontend (ShippingSelector Component)

```typescript
//  Sudah diimplementasikan:
// - Single request untuk multiple couriers
// - Format courier: colon-separated
// - Support lebih banyak kurir (JNE, POS, TIKI, SiCepat, J&T, Ninja, etc)
```

---

##  Available Couriers (V2)

Berdasarkan package Anda, kurir yang tersedia:

| Courier Code | Name | Logo |
|--------------|------|------|
| `jne` | JNE | 🚛 |
| `pos` | POS Indonesia | 📮 |
| `tiki` | TIKI |  |
| `sicepat` | SiCepat |  |
| `jnt` | J&T Express | 📮 |
| `ninja` | Ninja Xpress | 🥷 |
| `anteraja` | AnterAja | 🚚 |
| `lion` | Lion Parcel | 🦁 |
| `ide` | ID Express |  |
| `sap` | SAP Express |  |
| `rex` | REX |  |
| `rpx` | RPX |  |
| `sentral` | Sentral Cargo |  |
| `star` | Star Cargo | ⭐ |
| `wahana` | Wahana |  |
| `dse` | DSE |  |
| `ncs` | NCS |  |

**Note:** Ketersediaan kurir tergantung package subscription Anda.

---

##  Testing

### Test Search API

```bash
# Terminal
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=bandung&limit=5"
```

### Test Cost Calculation

```bash
# Terminal
curl -X POST \
  -H "key: YOUR_API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "origin=31555&destination=68423&weight=1000&courier=jne:pos:tiki" \
  https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost
```

### Test dalam Aplikasi

1. Jalankan dev server: `npm run dev`
2. Buka halaman checkout
3. Tambah alamat (gunakan input manual dulu)
4. Setelah RajaOngkir aktif, akan otomatis calculate ongkir

---

##  Migration Checklist

-  Update base URL ke `rajaongkir.komerce.id/api/v1`
-  Implement Search Domestic Destination API
-  Update Cost Calculation (colon-separated couriers)
-  Remove province/city endpoints (use Search instead)
-  Update response parsing (v1 → v2 format)
-  Add new courier options
-  Update documentation
-  **TODO**: Get API key dari https://collaborator.komerce.id
-  **TODO**: Find dan set ORIGIN_CITY_ID untuk toko

---

##  Troubleshooting V2

### Error: "RajaOngkir API error: 401 Unauthorized"
-  **Solusi**: API key belum valid
  - Login ke https://collaborator.komerce.id
  - Copy API key dari dashboard
  - Update `.env`
  - Restart server

### Error: "No shipping options available"
-  **Solusi**: Origin atau destination ID tidak valid
  - Gunakan `/api/rajaongkir/search` untuk cari ID yang benar
  - Update `NEXT_PUBLIC_ORIGIN_CITY_ID`
  - Pastikan format ID sesuai (contoh: "31555")

### Courier tidak muncul
-  **Solusi**: Courier tidak tersedia di package Anda
  - Cek package subscription di dashboard
  - Sesuaikan courier list di `ShippingSelector.tsx`
  - Contoh: jika hanya ada JNE & POS, gunakan `"jne:pos"`

---

##  Keuntungan V2

1. **Lebih Banyak Kurir** 
   - V1: 3 kurir (JNE, POS, TIKI)
   - V2: 17+ kurir tersedia

2. **Single Request**
   - V1: 1 request per kurir
   - V2: 1 request untuk semua kurir

3. **Search Lebih Akurat**
   - Bisa search sampai kelurahan
   - Hasil lebih detail (province, city, district, subdistrict)

4. **Tracking Support**
   - Bisa track resi pengiriman
   - Monitor status real-time

5. **International Shipping**
   - Support pengiriman internasional
   - Lebih dari 200 negara tujuan

---

##  Next Steps

1.  **Setup API Key**
   - Daftar di https://collaborator.komerce.id
   - Dapatkan API key
   - Update `.env`

2.  **Find Origin ID**
   - Search lokasi toko
   - Catat destination ID
   - Set di `.env`

3.  **Test Checkout Flow**
   - Add to cart
   - Checkout
   - Pilih alamat
   - Lihat shipping options
   - Verify costs

4. 🔜 **Optional: Add Tracking**
   - Implement `/track/waybill` API
   - Add tracking page
   - Show delivery status

Aplikasi sudah siap menggunakan RajaOngkir V2! 
