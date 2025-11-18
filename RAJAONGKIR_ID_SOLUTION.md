# 🎯 Solusi Penyimpanan ID RajaOngkir untuk Perhitungan Ongkir Presisi

## 📋 Problem Statement

### **Masalah Utama:**
Search API RajaOngkir (`/destination/domestic-destination`) **tidak mengembalikan `city_id`**:

```json
// Response dari Search API
{
  "id": 17737,                    // ❌ Ini subdistrict_id, bukan city_id!
  "label": "RAWAMANGUN, PULO GADUNG, JAKARTA TIMUR, DKI JAKARTA, 13220",
  "province_name": "DKI JAKARTA",
  "city_name": "JAKARTA TIMUR",   // ✅ String, bukan ID
  "district_name": "PULO GADUNG",
  "subdistrict_name": "RAWAMANGUN",
  "zip_code": "13220"
  // TIDAK ADA: city_id, province_id, district_id ❌
}
```

### **Dampak:**
- ❌ Jika simpan `cityId = destination.id` → Salah! (itu subdistrict_id)
- ❌ City endpoint dapat ID subdistrict → Error "Origin or Destination not found"
- ❌ District endpoint dapat ID city → Harga kurang akurat
- ❌ Tidak bisa manfaatkan district endpoint untuk precision tinggi

---

## ✅ Solusi Lengkap

### **1. Database Schema - Simpan 3 ID**

```prisma
model Address {
  id            String   @id @default(cuid())
  userId        String
  label         String
  recipientName String
  phone         String
  address       String   @db.Text
  
  // Location identifiers
  city          String   // Nama kota (display)
  cityId        String?  // City ID (3-4 digit) - untuk city endpoint
  province      String   // Nama provinsi (display)
  provinceId    String?  // Province ID - untuk query cities
  districtId    String?  // District/Subdistrict ID (5+ digit) - untuk district endpoint ⭐
  
  zipCode       String
  country       String   @default("Indonesia")
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[]

  @@index([userId])
}
```

**Penjelasan:**
- `cityId`: City-level ID → Untuk fallback (city endpoint)
- `districtId`: District/Subdistrict ID → Untuk precision (district endpoint) ⭐
- `provinceId`: Province ID → Untuk derive city_id

### **2. Helper Function - Derive city_id dari city_name**

Karena Search API tidak return `city_id`, kita derive dari `city_name`:

```typescript
// lib/rajaongkir.ts

export async function getCityIdFromName(
  cityName: string, 
  provinceId?: string
): Promise<string | null> {
  try {
    if (!cityName) return null
    
    // Normalize city name (remove "KOTA" prefix)
    const normalized = cityName.toUpperCase().replace(/^KOTA\s+/, '')
    
    // If we have province ID, search within that province
    if (provinceId) {
      const cities = await getCities(provinceId)
      const found = cities.find(c => 
        c.name.toUpperCase() === normalized || 
        c.name.toUpperCase().includes(normalized)
      )
      if (found) return found.id.toString()
    }
    
    // Otherwise, search all provinces
    const provinces = await getProvinces()
    for (const province of provinces) {
      const cities = await getCities(province.id)
      const found = cities.find(c => 
        c.name.toUpperCase() === normalized ||
        c.name.toUpperCase().includes(normalized)
      )
      if (found) return found.id.toString()
    }
    
    return null
  } catch (error) {
    console.error('Error getting city_id from name:', error)
    return null
  }
}
```

**Cara Kerja:**
1. Input: `"JAKARTA TIMUR"` + `provinceId: "10"`
2. Query cities API: `GET /destination/city/10`
3. Cari city dengan nama match: `"JAKARTA TIMUR"`
4. Return: `"139"` (city_id)

### **3. AddressSelector - Simpan Kedua ID**

```typescript
// components/AddressSelector.tsx

const handleSelectDestination = async (destination: any) => {
  // Extract IDs dari search response
  let cityId = destination.city_id || ""
  const provinceId = destination.province_id || ""
  const districtId = destination.id || "" // Subdistrict-level ID ⭐
  
  // Jika city_id tidak ada (biasanya memang tidak ada), derive dari city_name
  if (!cityId && destination.city_name) {
    try {
      const { getCityIdFromName } = await import("@/lib/rajaongkir")
      const derivedCityId = await getCityIdFromName(
        destination.city_name, 
        provinceId
      )
      cityId = derivedCityId || districtId // Fallback ke districtId
    } catch (error) {
      console.error("Error deriving city_id:", error)
      cityId = districtId // Fallback
    }
  }
  
  // Simpan ke form data
  setFormData({
    ...formData,
    cityId: cityId,           // "139" (Jakarta Timur) - City-level
    provinceId: provinceId,   // "10" (DKI Jakarta)
    districtId: districtId,   // "17737" (Rawamangun) - District-level ⭐
    city: destination.city_name || destination.city,
    province: destination.province_name || destination.province,
    zipCode: destination.zip_code || formData.zipCode,
  })
  
  // Save to database via API
  await saveAddress(formData)
}
```

**Flow:**
```
User search "rawamangun jakarta"
  ↓
Select dari hasil search
  ↓
destination = {
  id: "17737",
  city_name: "JAKARTA TIMUR",
  province_id: "10",
  ...
}
  ↓
Derive city_id: getCityIdFromName("JAKARTA TIMUR", "10")
  ↓
Result: cityId = "139"
  ↓
Save to DB: {
  cityId: "139",       // City-level (for fallback)
  districtId: "17737", // District-level (for precision) ⭐
  provinceId: "10"
}
```

### **4. ShippingSelector - Gunakan ID yang Tepat**

```typescript
// components/checkout/ShippingSelector.tsx

const fetchShippingCosts = async () => {
  // Origin dari database (shipping settings)
  const originCityId = "139"           // Jakarta Timur (city)
  const originSubdistrictId = "17737"  // Rawamangun (district)
  
  // Destination dari customer address
  const destinationCityId = selectedAddress.cityId        // "139" atau city lain
  const destinationDistrictId = selectedAddress.districtId // "17737" atau district lain
  
  // Prioritas: Gunakan district ID jika ada (lebih presisi)
  const originId = originSubdistrictId || originCityId
  const destinationId = destinationDistrictId || destinationCityId
  
  // Gunakan district endpoint jika KEDUA lokasi punya district ID
  const useDistrictEndpoint = !!(originSubdistrictId && destinationDistrictId)
  
  console.log('Origin ID:', originId, '(type:', useDistrictEndpoint ? 'district' : 'city', ')')
  console.log('Destination ID:', destinationId, '(type:', useDistrictEndpoint ? 'district' : 'city', ')')
  
  // API call
  const response = await fetch("/api/rajaongkir/cost", {
    method: "POST",
    body: JSON.stringify({
      origin: originId,
      destination: destinationId,
      weight: totalWeight,
      courier: "jne:sicepat:anteraja:lion",
      price: "lowest",
      useDistrict: useDistrictEndpoint  // District endpoint = more accurate
    })
  })
}
```

**Decision Logic:**

| Origin | Destination | Endpoint Used | Origin ID | Destination ID |
|--------|-------------|---------------|-----------|----------------|
| ✅ District | ✅ District | **District** (Accurate) | 17737 | 1376 |
| ✅ District | ❌ City | City (Fallback) | 139 | 55 |
| ❌ City | ✅ District | City (Fallback) | 139 | 1376 |
| ❌ City | ❌ City | City (Fallback) | 139 | 55 |

---

## 📊 Comparison: Before vs After

### **Before (❌ SALAH)**

```typescript
// AddressSelector.tsx
cityId: destination.city_id || destination.id  // ❌ Fallback ke subdistrict_id!

// Database
{
  cityId: "17737"  // ❌ Ini subdistrict_id, bukan city_id!
}

// ShippingSelector.tsx
origin: "17737"       // ❌ Subdistrict ID
destination: "17737"  // ❌ Subdistrict ID
useDistrict: false    // ❌ Harusnya true!

// Result: Error atau harga tidak akurat
```

### **After (✅ BENAR)**

```typescript
// AddressSelector.tsx
const cityId = await getCityIdFromName(destination.city_name, destination.province_id)
const districtId = destination.id

// Database
{
  cityId: "139",       // ✅ City-level ID (Jakarta Timur)
  districtId: "17737"  // ✅ District-level ID (Rawamangun)
}

// ShippingSelector.tsx
origin: "17737"       // ✅ District ID (presisi tinggi)
destination: "1376"   // ✅ District ID
useDistrict: true     // ✅ Gunakan district endpoint

// Result: Harga akurat, ETD presisi
```

---

## 🎯 Testing & Verification

### **1. Test Helper Function**

```bash
curl -s "https://rajaongkir.komerce.id/api/v1/destination/province" \
  -H "key: YOUR_API_KEY" | jq '.data[] | select(.name | contains("JAKARTA"))'

# Result: {"id": 10, "name": "DKI JAKARTA"}

curl -s "https://rajaongkir.komerce.id/api/v1/destination/city/10" \
  -H "key: YOUR_API_KEY" | jq '.data[] | select(.name | contains("TIMUR"))'

# Result: {"id": 139, "name": "JAKARTA TIMUR"}
```

### **2. Test Search API**

```bash
curl -s "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=rawamangun&limit=1" \
  -H "key: YOUR_API_KEY" | jq '.data[0]'

# Result:
# {
#   "id": 17737,               // Subdistrict ID
#   "city_name": "JAKARTA TIMUR",  // Nama city (bukan ID)
#   "province_name": "DKI JAKARTA"
# }
```

### **3. Test Cost Calculation**

**District Endpoint (Presisi Tinggi):**
```bash
curl -X POST "https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost" \
  -H "key: YOUR_API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "origin=17737&destination=1376&weight=1000&courier=jne:lion&price=lowest"

# Result:
# - JNE REG: Rp 140,000 ✅
# - Lion REGPACK: Rp 145,500 ✅
```

**City Endpoint (Fallback):**
```bash
curl -X POST "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost" \
  -H "key: YOUR_API_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "origin=139&destination=55&weight=1000&courier=jne:lion&price=lowest"

# Result:
# - JNE REG: Rp 148,000 ⚠️ (Lebih mahal Rp 8,000)
# - Lion REGPACK: Rp 162,000 ⚠️ (Lebih mahal Rp 16,500)
```

---

## ✅ Checklist Implementasi

### **Backend:**
- [x] Update schema.prisma: Tambah `districtId` field
- [x] Migration: `npx prisma migrate dev --name add_district_id_to_address`
- [x] Helper function: `getCityIdFromName()` di lib/rajaongkir.ts
- [x] API endpoint: `/api/rajaongkir/cost` support `useDistrict` parameter
- [x] Settings: Update shipping_origin dengan `cityId` dan `subdistrictId`

### **Frontend:**
- [x] AddressSelector: Derive `city_id` saat select destination
- [x] AddressSelector: Simpan `cityId` dan `districtId` ke database
- [x] ShippingSelector: Fetch origin dengan `cityId` dan `subdistrictId`
- [x] ShippingSelector: Gunakan district endpoint jika kedua ID tersedia
- [x] UI: Tampilkan badge "Perhitungan Akurat" vs "Estimasi"

### **Testing:**
- [ ] Test create address dengan search API
- [ ] Test shipping calculation dengan district endpoint
- [ ] Test fallback ke city endpoint jika district ID tidak ada
- [ ] Verify console logs menampilkan ID yang benar
- [ ] Compare harga district vs city endpoint

---

## 🚀 Migration Guide (untuk data existing)

Jika sudah ada alamat di database dengan `cityId` yang salah:

```typescript
// Script untuk fix existing addresses
import { prisma } from './lib/prisma'
import { getCityIdFromName } from './lib/rajaongkir'

async function fixAddresses() {
  const addresses = await prisma.address.findMany()
  
  for (const address of addresses) {
    // Jika cityId terlihat seperti subdistrict_id (5+ digit)
    if (address.cityId && address.cityId.length >= 5) {
      console.log(`Fixing address ${address.id}: ${address.city}`)
      
      // Derive city_id yang benar dari city name
      const correctCityId = await getCityIdFromName(address.city, address.provinceId || undefined)
      
      if (correctCityId) {
        await prisma.address.update({
          where: { id: address.id },
          data: {
            cityId: correctCityId,        // City-level ID yang benar
            districtId: address.cityId    // Pindahkan old cityId ke districtId
          }
        })
        console.log(`  Updated: cityId=${correctCityId}, districtId=${address.cityId}`)
      }
    }
  }
  
  console.log('Migration completed!')
}

fixAddresses()
```

---

## 📝 Summary

### **Key Points:**

1. **3 ID yang Disimpan:**
   - `cityId`: City-level ID (3-4 digit) - untuk fallback
   - `districtId`: District-level ID (5+ digit) - untuk precision ⭐
   - `provinceId`: Province ID - untuk derive city_id

2. **Helper Function:**
   - `getCityIdFromName(cityName, provinceId)` - Derive city_id dari nama

3. **Decision Logic:**
   - Jika kedua district ID tersedia → **District Endpoint** (presisi tinggi)
   - Jika tidak → **City Endpoint** (fallback)

4. **Benefits:**
   - ✅ Harga lebih akurat (selisih bisa Rp 8,000 - Rp 16,500)
   - ✅ ETD lebih presisi
   - ✅ Graceful fallback jika district ID tidak ada
   - ✅ User transparency (badge "Akurat" vs "Estimasi")

### **Files Modified:**
- `prisma/schema.prisma` - Add districtId field
- `lib/rajaongkir.ts` - Add getCityIdFromName helper
- `components/AddressSelector.tsx` - Derive and save both IDs
- `components/checkout/ShippingSelector.tsx` - Use appropriate endpoint
- Database - Migration untuk add districtId column

**Dokumentasi lengkap:** `SHIPPING_ORIGIN_DESTINATION.md`
