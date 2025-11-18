# Shipping Origin & Destination - Penjelasan Lengkap

## 📍 Konsep Origin & Destination di RajaOngkir

### **1. Hierarchical Location System**

RajaOngkir menggunakan sistem lokasi berjenjang:

```
Province (Provinsi)
  └── City (Kota/Kabupaten)
      └── District (Kecamatan)
          └── Subdistrict (Kelurahan)
```

**Contoh:**
```
DKI JAKARTA (Province ID: 10)
  └── JAKARTA TIMUR (City ID: 139)
      └── PULO GADUNG (District)
          └── RAWAMANGUN (Subdistrict ID: 17737)
```

---

## 🚀 Dua Endpoint untuk Kalkulasi Ongkir

### **A. District Endpoint** (Paling Akurat) ⭐

**URL:** `POST /api/v1/calculate/district/domestic-cost`

**Parameter:**
- `origin`: District/Subdistrict ID (5+ digit)
- `destination`: District/Subdistrict ID (5+ digit)
- `weight`: Berat dalam gram
- `courier`: Kode kurir (jne:sicepat:anteraja:lion)
- `price`: 'lowest' atau 'highest'

**Contoh Request:**
```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost' \
  --header 'key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'origin=17737' \
  --data-urlencode 'destination=1376' \
  --data-urlencode 'weight=1000' \
  --data-urlencode 'courier=jne:sicepat:anteraja:lion' \
  --data-urlencode 'price=lowest'
```

**Keuntungan:**
- ✅ Perhitungan paling akurat (kelurahan ke kelurahan)
- ✅ Harga lebih presisi
- ✅ ETD (estimated time of delivery) lebih tepat
- ✅ Cocok untuk kota besar dengan banyak kecamatan

**Kapan Digunakan:**
- Jika KEDUA origin dan destination memiliki district/subdistrict ID
- Untuk e-commerce yang butuh precision tinggi

---

### **B. City Endpoint** (Fallback)

**URL:** `POST /api/v1/calculate/domestic-cost`

**Parameter:**
- `origin`: City ID (3-4 digit)
- `destination`: City ID (3-4 digit)
- `weight`: Berat dalam gram
- `courier`: Kode kurir
- `price`: 'lowest' atau 'highest'

**Contoh Request:**
```bash
curl --location 'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost' \
  --header 'key: YOUR_API_KEY' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'origin=139' \
  --data-urlencode 'destination=55' \
  --data-urlencode 'weight=1000' \
  --data-urlencode 'courier=jne:sicepat:anteraja:lion' \
  --data-urlencode 'price=lowest'
```

**Keuntungan:**
- ✅ Lebih sederhana
- ✅ Fallback jika district ID tidak tersedia

**Kekurangan:**
- ⚠️ Kurang akurat untuk kota besar
- ⚠️ Harga bisa berbeda signifikan antar kecamatan

**Kapan Digunakan:**
- Jika salah satu atau kedua lokasi tidak memiliki district ID
- Untuk kota kecil yang tidak memerlukan precision tinggi

---

## 🏪 Implementasi: Origin (Lokasi Toko/Warehouse)

### **Database Structure**

```sql
-- Table: Settings
-- Key: shipping_origin
-- Value: JSON

{
  "cityId": "139",           -- City-level ID (Jakarta Timur)
  "subdistrictId": "17737",  -- Subdistrict-level ID (Rawamangun)
  "cityName": "RAWAMANGUN, PULO GADUNG, JAKARTA TIMUR, DKI JAKARTA"
}
```

### **Pengaturan Origin di Admin Panel**

Admin dapat set origin di `/admin/settings`:
1. Cari lokasi toko (contoh: "rawamangun jakarta timur")
2. Pilih dari hasil search
3. Sistem akan menyimpan:
   - `cityId`: 139 (Jakarta Timur)
   - `subdistrictId`: 17737 (Rawamangun)

### **Component: ShippingSelector.tsx**

```typescript
const [originCityId, setOriginCityId] = useState<string>("")
const [originSubdistrictId, setOriginSubdistrictId] = useState<string>("")

// Fetch dari database
const fetchOrigin = async () => {
  const res = await fetch("/api/settings/shipping-origin")
  const data = await res.json()
  
  setOriginCityId(data.cityId)              // "139"
  setOriginSubdistrictId(data.subdistrictId) // "17737"
}

// Gunakan subdistrict jika ada, fallback ke city
const originId = originSubdistrictId || originCityId
```

---

## 📦 Implementasi: Destination (Alamat Customer)

### **Search API Problem**

Search API (`/destination/domestic-destination`) **tidak mengembalikan `city_id`**:

```json
{
  "id": 17737,                    // ❌ Ini subdistrict_id, bukan city_id!
  "label": "RAWAMANGUN, PULO GADUNG, JAKARTA TIMUR, DKI JAKARTA, 13220",
  "city_name": "JAKARTA TIMUR",   // ✅ Nama kota (string)
  "district_name": "PULO GADUNG",
  "subdistrict_name": "RAWAMANGUN"
  // Tidak ada city_id! ❌
}
```

### **Solusi: Derive city_id dari city_name**

**Helper Function:**
```typescript
// lib/rajaongkir.ts
export async function getCityIdFromName(
  cityName: string, 
  provinceId?: string
): Promise<string | null> {
  // 1. Get cities dari province
  const cities = await getCities(provinceId)
  
  // 2. Cari city yang cocok dengan nama
  const found = cities.find(c => 
    c.name.toUpperCase() === cityName.toUpperCase()
  )
  
  // 3. Return city_id
  return found ? found.id.toString() : null
}
```

**Usage di AddressSelector.tsx:**
```typescript
const handleSelectDestination = async (destination: any) => {
  let cityId = destination.city_id || ""
  
  // Jika API tidak return city_id, derive dari city_name
  if (!cityId && destination.city_name) {
    const derivedCityId = await getCityIdFromName(
      destination.city_name, 
      destination.province_id
    )
    cityId = derivedCityId || destination.id
  }
  
  setFormData({
    cityId: cityId,           // 139 (Jakarta Timur)
    districtId: destination.id // 17737 (Rawamangun)
  })
}
```

---

## 🎯 Decision Logic: District vs City Endpoint

```typescript
// ShippingSelector.tsx
const fetchShippingCosts = async () => {
  // Prioritas 1: Gunakan subdistrict ID jika ada
  const originId = originSubdistrictId || originCityId
  const destinationId = destinationDistrictId || destinationCityId
  
  // Gunakan district endpoint jika KEDUA lokasi punya subdistrict ID
  const useDistrictEndpoint = !!(
    originSubdistrictId && destinationDistrictId
  )
  
  // API call
  const response = await fetch("/api/rajaongkir/cost", {
    method: "POST",
    body: JSON.stringify({
      origin: originId,
      destination: destinationId,
      useDistrict: useDistrictEndpoint
    })
  })
}
```

**Logic:**
- ✅ Jika origin=17737 & destination=1376 → **District Endpoint**
- ⚠️ Jika origin=139 & destination=1376 → **City Endpoint** (fallback)
- ⚠️ Jika origin=17737 & destination=55 → **City Endpoint** (fallback)

---

## 🎨 UI Indicator

User bisa lihat endpoint mana yang digunakan:

```tsx
{originSubdistrictId && destinationDistrictId ? (
  <span className="badge-green">
    ✓ Perhitungan Akurat (District)
  </span>
) : (
  <span className="badge-amber">
    ⓘ Estimasi (City)
  </span>
)}
```

**Badge Hijau:** District endpoint → Harga akurat
**Badge Kuning:** City endpoint → Harga estimasi

---

## 📊 Comparison Example

### Scenario: Jakarta Timur → Bandung

**District Endpoint:**
```bash
origin=17737 (Rawamangun, Jakarta Timur)
destination=1376 (Kelurahan di Bandung)

Response:
- JNE REG: Rp 140,000 (11 hari)
- Lion REGPACK: Rp 145,500 (8-12 hari)
```

**City Endpoint:**
```bash
origin=139 (Jakarta Timur)
destination=55 (Bandung)

Response:
- JNE REG: Rp 148,000 (11 hari) -- ⚠️ Lebih mahal Rp 8,000
- Lion REGPACK: Rp 162,000 (5-8 hari) -- ⚠️ Lebih mahal Rp 16,500
```

**Kesimpulan:** District endpoint memberikan harga lebih murah dan akurat! 💰

---

## ✅ Best Practices

### **1. Always Collect District-Level Data**

Saat customer input alamat, gunakan **search API** untuk dapatkan subdistrict ID:
- ✅ GOOD: User search "rawamangun jakarta" → Pilih dari hasil → Dapat subdistrict_id
- ❌ BAD: User manual input → Hanya dapat city name → Harus derive city_id

### **2. Store Both City & District IDs**

Di database `Address` table:
```typescript
{
  cityId: "139",       // City-level (required)
  districtId: "17737"  // District-level (optional but recommended)
}
```

### **3. Graceful Fallback**

Jika district ID tidak ada:
```typescript
const originId = originSubdistrictId || originCityId  // ✅ Fallback
const destinationId = destinationDistrictId || destinationCityId  // ✅ Fallback
```

### **4. User Transparency**

Tunjukkan ke user endpoint mana yang digunakan:
- Badge "Perhitungan Akurat" → District
- Badge "Estimasi" → City

---

## 🐛 Troubleshooting

### **Problem: Harga tidak sesuai**
**Cause:** Menggunakan subdistrict_id di city endpoint
**Solution:** Check `useDistrict` parameter

### **Problem: "Origin or Destination not found"**
**Cause:** Salah endpoint (district ID di city endpoint atau sebaliknya)
**Solution:** Pastikan:
- District endpoint → Both IDs must be 5+ digit
- City endpoint → Both IDs must be 3-4 digit

### **Problem: cityId tersimpan sebagai subdistrict_id**
**Cause:** `cityId: destination.id` (subdistrict)
**Solution:** Use helper `getCityIdFromName()` untuk derive

---

## 📝 Summary

| Aspect | District Endpoint | City Endpoint |
|--------|------------------|---------------|
| **Accuracy** | ⭐⭐⭐⭐⭐ Very High | ⭐⭐⭐ Medium |
| **Price** | ✅ Lebih murah | ⚠️ Lebih mahal |
| **ETD** | ✅ Lebih akurat | ⚠️ Kurang akurat |
| **ID Required** | Subdistrict (5+ digit) | City (3-4 digit) |
| **Use Case** | Default (jika ada) | Fallback |
| **Endpoint** | `/calculate/district/domestic-cost` | `/calculate/domestic-cost` |

**Recommendation:** Selalu gunakan **District Endpoint** jika memungkinkan! 🚀
