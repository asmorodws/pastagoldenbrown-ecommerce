#  Fix: Origin City ID vs Subdistrict ID

##  Masalah yang Ditemukan

Ketika admin mengset origin pengiriman melalui fitur search di admin settings, sistem menyimpan **subdistrict ID** (contoh: 17737) ke dalam `NEXT_PUBLIC_ORIGIN_CITY_ID`, padahal API RajaOngkir untuk perhitungan ongkir membutuhkan **city ID**.

### Kenapa Ini Terjadi?

1. Search API (`/destination/domestic-destination`) mengembalikan data **subdistrict-level**
2. ID yang dikembalikan adalah **subdistrict_id** (lebih spesifik: kelurahan)
3. Sistem awalnya menyimpan `city.id` tanpa validasi apakah itu city ID atau subdistrict ID
4. Shipping calculation API endpoint berbeda:
   - `/calculate/domestic-cost` → butuh **city ID** untuk origin dan destination
   - `/calculate/district/domestic-cost` → bisa pakai **subdistrict ID** tapi hanya untuk destination

##  Solusi yang Diimplementasikan

### 1. Enhanced Search Response

Update `lib/rajaongkir.ts` untuk menambahkan semua ID levels:

```typescript
return data.data.map((item: any) => ({
  id: item.id?.toString() || '',  // subdistrict ID
  province_id: item.province_id?.toString() || '',
  city_id: item.city_id?.toString() || '',
  district_id: item.district_id?.toString() || '',
  subdistrict_id: item.id?.toString() || '',
  // ... other fields
}))
```

### 2. Update Admin Settings

File: `app/admin/settings/page.tsx`

Sekarang menyimpan dua ID:
```typescript
const [shippingOrigin, setShippingOrigin] = useState({
  cityId: "501",        // City ID untuk basic shipping
  subdistrictId: "",    // Subdistrict ID untuk akurasi lebih tinggi
  cityName: "Jakarta Timur",
  provinceName: "DKI Jakarta",
})
```

Extract city_id dari search result:
```typescript
const handleSelectCity = async (city: any) => {
  const cityId = city.city_id || city.cityId || city.id
  const subdistrictId = city.id // Full location ID
  
  // Save both IDs
}
```

### 3. Enhanced Error Handling

File: `components/checkout/ShippingSelector.tsx`

```typescript
const response = await fetch("/api/rajaongkir/cost", {...})

if (!response.ok) {
  const errorData = await response.json().catch(() => ({}))
  console.error('Shipping cost API error:', errorData)
  throw new Error(errorData.error || "Failed to fetch shipping costs")
}
```

Sekarang menampilkan error message yang lebih jelas dari API.

##  Cara Mengecek dan Memperbaiki

### Langkah 1: Cek Current Origin ID

```bash
cat .env | grep NEXT_PUBLIC_ORIGIN_CITY_ID
```

Output contoh:
```
NEXT_PUBLIC_ORIGIN_CITY_ID=17737
```

### Langkah 2: Cek Apakah Itu City ID atau Subdistrict ID

ID dengan 5 digit (17737, 17735) biasanya adalah **subdistrict ID**.  
City ID biasanya 3-4 digit (501, 152, 153).

### Langkah 3: Dapatkan City ID yang Benar

#### Opsi A: Menggunakan API Province → City

1. Cari province ID untuk Jakarta:
```bash
curl http://localhost:3000/api/rajaongkir/provinces | jq '.[] | select(.name | contains("JAKARTA"))'
```

2. Dapatkan cities di Jakarta:
```bash
curl "http://localhost:3000/api/rajaongkir/cities?province=6" | jq '.[] | select(.name | contains("TIMUR"))'
```

Output contoh:
```json
{
  "id": 152,
  "name": "Jakarta Timur",
  "zip_code": "13xxx"
}
```

#### Opsi B: Manual dari Dokumentasi RajaOngkir

**Kota-kota Besar Indonesia:**

| Kota | City ID |
|------|---------|
| Jakarta Pusat | 151 |
| Jakarta Timur | 152 |
| Jakarta Selatan | 153 |
| Jakarta Barat | 154 |
| Jakarta Utara | 155 |
| Bandung | 22 |
| Surabaya | 444 |
| Medan | 152 |
| Bekasi | 36 |
| Tangerang | 455 |
| Depok | 107 |

### Langkah 4: Update .env

```env
NEXT_PUBLIC_ORIGIN_CITY_ID=152  # Ganti dengan city ID yang benar
```

### Langkah 5: Restart Server

```bash
npm run dev
```

##  Cara Identifikasi ID Type

### Berdasarkan Digit:
- **3-4 digit** (1-9999): Likely city ID
- **5+ digit** (10000+): Likely district/subdistrict ID

### Berdasarkan Response API:
Search API mengembalikan:
```json
{
  "id": 17737,              // subdistrict_id (kelurahan)
  "city_id": 152,           // city_id yang dibutuhkan
  "district_id": 1234,      // district_id (kecamatan)
  "province_id": 6,         // province_id
  "city_name": "JAKARTA TIMUR",
  "label": "KRAMAT JATI, KRAMAT JATI, JAKARTA TIMUR, DKI JAKARTA, 13540"
}
```

**Yang harus disimpan**: `city_id: 152`, bukan `id: 17737`

##  Dampak Jika Salah

Jika menggunakan subdistrict ID sebagai origin:

### Error yang Mungkin Muncul:
1. **"Tidak ada layanan pengiriman tersedia"** - API tidak bisa calculate
2. **500 Internal Server Error** - Invalid origin parameter
3. **Empty shipping options** - No courier results
4. **"Perhitungan Ongkir Otomatis Tidak Tersedia"** - Meskipun address punya cityId

### Kenapa?
- Endpoint `/calculate/domestic-cost` hanya terima **city ID** untuk origin
- Endpoint `/calculate/district/domestic-cost` hanya terima **subdistrict ID** untuk **destination**, bukan origin

##  Checklist Verifikasi

Setelah fix, pastikan:

- [ ] `.env` contains valid city ID (3-4 digits)
- [ ] Server restarted after `.env` change
- [ ] Admin settings shows correct city name
- [ ] Checkout page shows shipping options
- [ ] No errors in browser console
- [ ] Shipping costs calculate correctly

##  Future Improvements

### Database-based Settings

Instead of `.env`, store in database:

```prisma
model Settings {
  id String @id @default(cuid())
  key String @unique
  value String
  updatedAt DateTime @updatedAt
}
```

Benefits:
-  No server restart needed
-  Can store multiple locations
-  Audit trail
-  API can read directly

### Smart ID Detection

Auto-detect and extract city ID:

```typescript
function extractCityId(searchResult: any): string {
  if (searchResult.city_id) {
    return searchResult.city_id.toString()
  }
  
  // Fallback: parse from label or lookup
  // Implementation needed
}
```

##  Support

Jika masih error setelah fix:

1. Check `.env` file has correct city ID
2. Check API logs: `console.log` in shipping cost API
3. Test with curl directly:
```bash
curl -X POST http://localhost:3000/api/rajaongkir/cost \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "152",
    "destination": "501",
    "weight": 1000,
    "courier": "jne"
  }'
```

4. Check RajaOngkir API quota/status

---

**Status**:  Fixed  
**Version**: 1.0  
**Last Updated**: 2024
