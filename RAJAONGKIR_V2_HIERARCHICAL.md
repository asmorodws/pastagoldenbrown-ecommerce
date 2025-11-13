# RajaOngkir V2 Hierarchical Integration

## 📋 Overview

Implementasi lengkap RajaOngkir V2 API dengan dukungan **cascade dropdown selection** (Province → City → District) dan **district-level shipping calculation** untuk akurasi biaya pengiriman yang lebih baik.

## ✨ Features

### 1. **Dual Input Mode**
- **Dropdown Mode**: Pilih lokasi dengan cascade dropdowns (Province → City → District)
- **Search Mode**: Cari lokasi dengan keyword (backward compatible)
- Toggle mudah antara kedua mode

### 2. **District-Level Accuracy**
- Perhitungan ongkir menggunakan endpoint `/calculate/district/domestic-cost` jika districtId tersedia
- Fallback ke `/calculate/domestic-cost` untuk alamat tanpa districtId
- Visual indicator menunjukkan mode perhitungan

### 3. **Smart Cascade Behavior**
- Province list dimuat otomatis saat form dibuka
- City list dimuat saat province dipilih
- District list dimuat saat city dipilih
- Auto-reset child fields saat parent berubah

### 4. **Backward Compatibility**
- Alamat lama tanpa cityId tetap bisa digunakan (manual mode)
- Alamat dengan cityId tapi tanpa districtId tetap mendapat ongkir otomatis (city-level)
- Search mode tetap tersedia sebagai alternatif

## 🏗️ Architecture

### Backend (lib/rajaongkir.ts)

```typescript
// V2 API Functions
export async function getProvinces(): Promise<RajaOngkirProvince[]>
export async function getCities(provinceId: number): Promise<RajaOngkirCity[]>
export async function getDistricts(cityId: number): Promise<RajaOngkirDistrict[]>
export async function getSubdistricts(districtId: number): Promise<RajaOngkirSubdistrict[]>

// Enhanced shipping cost calculation
export async function getShippingCost({
  origin,
  destination,
  weight,
  courier,
  price,
  subdistrict_id,
  zip_code,
  useDistrict,  // NEW: Enables district-level calculation
}: ShippingCostParams): Promise<RajaOngkirCourier[]>
```

### API Routes

| Endpoint | Method | Purpose | Query Params |
|----------|--------|---------|--------------|
| `/api/rajaongkir/provinces` | GET | List all provinces | - |
| `/api/rajaongkir/cities` | GET | List cities by province | `?province={id}` |
| `/api/rajaongkir/districts` | GET | List districts by city | `?city={id}` |
| `/api/rajaongkir/subdistricts` | GET | List subdistricts by district | `?district={id}` |
| `/api/rajaongkir/cost` | POST | Calculate shipping costs | Body JSON |

### Frontend Components

#### AddressSelector.tsx
- **State Management**:
  - `useDropdowns`: Toggle antara dropdown dan search mode
  - `provinces`, `cities`, `districts`: Data untuk setiap level
  - `loadingProvinces`, `loadingCities`, `loadingDistricts`: Loading states

- **Key Functions**:
  - `loadProvinces()`: Load semua provinsi saat mount
  - `loadCities(provinceId)`: Load kota saat province berubah
  - `loadDistricts(cityId)`: Load kecamatan saat city berubah
  - `handleProvinceChange()`: Reset city & district, load cities
  - `handleCityChange()`: Reset district, load districts, set zip code
  - `handleDistrictChange()`: Set zip code dari district

#### ShippingSelector.tsx
- **Props**: 
  - `destinationCityId`: Required untuk perhitungan
  - `destinationDistrictId`: Optional untuk akurasi lebih tinggi
  
- **Calculation Logic**:
  ```typescript
  const useDistrict = !!destinationDistrictId
  
  body: {
    useDistrict,
    ...(destinationDistrictId && { subdistrict_id: destinationDistrictId })
  }
  ```

- **Visual Indicators**:
  - Badge "✓ Perhitungan Akurat (Kecamatan)" jika districtId tersedia

#### Checkout Page
- **Interface**: `SelectedAddress` sekarang termasuk `districtId?`
- **Pass to ShippingSelector**:
  ```tsx
  <ShippingSelector
    destinationCityId={selectedAddress.cityId}
    destinationDistrictId={selectedAddress.districtId || undefined}
    totalWeight={getTotalWeight()}
  />
  ```

## 📦 Database Schema

### Address Model
```prisma
model Address {
  id            String   @id @default(cuid())
  userId        String
  label         String
  recipientName String
  phone         String
  address       String
  city          String
  province      String
  zipCode       String
  country       String   @default("Indonesia")
  isDefault     Boolean  @default(false)
  
  // RajaOngkir Integration
  cityId        String?  // For city-level calculation
  provinceId    String?  // For future use
  districtId    String?  // For district-level calculation (more accurate)
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Notes**:
- `cityId`: Required untuk ongkir otomatis
- `districtId`: Optional, meningkatkan akurasi hingga tingkat kecamatan
- Alamat tanpa kedua field ini tetap bisa digunakan (manual mode)

## 🎨 User Experience

### Creating New Address

#### Dropdown Mode (Default)
1. User membuka form tambah alamat
2. Province list sudah tersedia (loaded on mount)
3. User pilih province → City dropdown aktif & diisi
4. User pilih city → District dropdown aktif & diisi, zip code auto-fill
5. User pilih district (opsional) → Zip code auto-fill
6. Simpan → Address dengan cityId & districtId (jika dipilih)

#### Search Mode
1. User klik "Gunakan Pencarian"
2. Ketik minimal 3 karakter (nama kota/kecamatan)
3. Pilih dari hasil → Auto-fill city, province, cityId, zip code
4. Simpan → Address dengan cityId

### Checkout Flow

#### Address dengan District (Most Accurate)
```
✓ Ongkir Otomatis badge
→ ShippingSelector muncul
→ Badge "✓ Perhitungan Akurat (Kecamatan)"
→ Endpoint: /calculate/district/domestic-cost
→ Harga lebih akurat hingga tingkat kecamatan
```

#### Address dengan City (Accurate)
```
✓ Ongkir Otomatis badge
→ ShippingSelector muncul
→ Endpoint: /calculate/domestic-cost
→ Harga akurat tingkat kota
```

#### Address Manual (No RajaOngkir)
```
⚠ Manual badge
→ ShippingSelector tidak muncul
→ Warning message dengan instruksi upgrade
→ Checkout tetap bisa dilanjutkan
```

## 🔄 API Request Examples

### Get Provinces
```bash
curl http://localhost:3000/api/rajaongkir/provinces
```
Response:
```json
[
  { "id": 1, "name": "Bali" },
  { "id": 2, "name": "Bangka Belitung" },
  ...
]
```

### Get Cities
```bash
curl "http://localhost:3000/api/rajaongkir/cities?province=6"
```
Response:
```json
[
  { "id": 151, "name": "Jakarta Barat", "zip_code": "11220" },
  { "id": 152, "name": "Jakarta Pusat", "zip_code": "10540" },
  ...
]
```

### Get Districts
```bash
curl "http://localhost:3000/api/rajaongkir/districts?city=151"
```
Response:
```json
[
  { "id": 1789, "name": "Cengkareng", "zip_code": "11730" },
  { "id": 1790, "name": "Grogol Petamburan", "zip_code": "11450" },
  ...
]
```

### Calculate Shipping (District-Level)
```bash
curl -X POST http://localhost:3000/api/rajaongkir/cost \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "501",
    "destination": "151",
    "weight": 1000,
    "courier": "jne:sicepat:jnt",
    "useDistrict": true,
    "subdistrict_id": "1789"
  }'
```

## 🎯 Visual Indicators

### Address List
| Indicator | Meaning | Shipping Calculation |
|-----------|---------|---------------------|
| ✓ Ongkir Otomatis (hijau) | cityId tersedia | Ya (city atau district-level) |
| ⚠ Manual (kuning) | Tanpa cityId | Tidak tersedia |

### Shipping Selector
| Badge | Condition | Endpoint Used |
|-------|-----------|---------------|
| ✓ Perhitungan Akurat (Kecamatan) | districtId ada | `/calculate/district/domestic-cost` |
| (no badge) | Hanya cityId | `/calculate/domestic-cost` |

### Form Mode Toggle
| Button Text | Current Mode | Switch To |
|-------------|--------------|-----------|
| "Gunakan Pencarian" | Dropdown | Search |
| "Gunakan Dropdown" | Search | Dropdown |

## ⚙️ Configuration

### Environment Variables
```env
# Required
RAJAONGKIR_API_KEY=your_api_key_here

# Optional - Default origin city
NEXT_PUBLIC_ORIGIN_CITY_ID=501  # Jakarta Timur
```

### Courier List
Default couriers (can be customized in `ShippingSelector.tsx`):
```typescript
const courierList = "jne:pos:tiki:sicepat:jnt:ninja:anteraja"
```

Available couriers:
- jne, pos, tiki, sicepat, jnt, ninja, anteraja, lion, rpx, pandu, wahana, pcp, jet, dse, first, indah, cahaya, star, idl, 21, mgp, sap, rex, ncs

## 🧪 Testing Checklist

### Dropdown Mode
- [ ] Province list loads on form open
- [ ] Cities load when province selected
- [ ] Districts load when city selected
- [ ] ZIP code auto-fills from district
- [ ] Child fields reset when parent changes
- [ ] Form validation works
- [ ] Save successful with districtId

### Search Mode
- [ ] Search activates after 3 characters
- [ ] Results show correctly
- [ ] Selection auto-fills fields
- [ ] cityId saved correctly
- [ ] Save successful

### Shipping Calculation
- [ ] District-level: Uses `/calculate/district/domestic-cost`
- [ ] City-level: Uses `/calculate/domestic-cost`
- [ ] Badge shows correct accuracy level
- [ ] Costs display correctly
- [ ] Selection works

### Backward Compatibility
- [ ] Old addresses without cityId show "Manual" badge
- [ ] Warning message displays for manual addresses
- [ ] Checkout works without shipping selection for manual
- [ ] Edit address can upgrade to RajaOngkir mode

## 🚀 Performance Optimization

### Implemented
1. **Lazy Loading**: Province list hanya dimuat saat form dibuka
2. **Cascade Loading**: Cities/districts hanya dimuat saat parent dipilih
3. **Debounced Search**: 500ms delay untuk search mode
4. **Conditional Rendering**: Dropdown/search components tidak di-render bersamaan

### Future Improvements
1. **Cache Province List**: Provinces jarang berubah, bisa di-cache di localStorage
2. **Prefetch Cities**: Untuk provinsi populer (Jakarta, Jawa Barat)
3. **Virtual Scrolling**: Untuk dropdown dengan banyak items (1000+ cities)

## 📝 Migration Guide

### Upgrading Existing Addresses

Users dengan alamat lama akan melihat badge "⚠ Manual". Untuk upgrade:

1. Klik edit alamat
2. Gunakan dropdown atau search untuk pilih lokasi
3. Simpan → Address sekarang punya cityId (dan districtId jika dipilih via dropdown)

### Data Migration Script (Optional)

Jika ingin batch update alamat lama:

```typescript
// scripts/migrate-addresses.ts
import { prisma } from '@/lib/prisma'
import { searchDomesticDestination } from '@/lib/rajaongkir'

async function migrateAddresses() {
  const addresses = await prisma.address.findMany({
    where: { cityId: null }
  })
  
  for (const addr of addresses) {
    try {
      const results = await searchDomesticDestination(addr.city, 1)
      if (results.length > 0) {
        await prisma.address.update({
          where: { id: addr.id },
          data: {
            cityId: results[0].id,
            provinceId: results[0].id, // V2 uses same ID
          }
        })
        console.log(`✓ Updated: ${addr.label}`)
      }
    } catch (error) {
      console.error(`✗ Failed: ${addr.label}`, error)
    }
  }
}
```

## 🔧 Troubleshooting

### Province List Empty
- Check `RAJAONGKIR_API_KEY` in `.env`
- Verify API endpoint: `https://rajaongkir.komerce.id/api/v1/destination/province`
- Check console for error messages

### Cities Not Loading
- Ensure province is selected (`provinceId` not empty)
- Check network tab for API call to `/api/rajaongkir/cities?province={id}`
- Verify province ID is valid

### District-Level Not Working
- Ensure `districtId` is saved in database
- Check `ShippingSelector` receives `destinationDistrictId` prop
- Verify `useDistrict: true` in POST body to `/api/rajaongkir/cost`

### Shipping Costs Different Than Expected
- District-level gives more accurate prices (may differ from city-level)
- Check weight calculation (should be in grams)
- Verify origin city ID matches your store location

## 📚 Related Documentation

- [RajaOngkir V2 API Documentation](https://docs.google.com/document/d/1kYv2x3i_4qW8rHB3FYdN5hZz8gUzzHqb/edit)
- [RAJAONGKIR_V2_MIGRATION.md](./RAJAONGKIR_V2_MIGRATION.md) - Initial V2 migration
- [SHIPPING_CHECKOUT_GUIDE.md](./SHIPPING_CHECKOUT_GUIDE.md) - General shipping guide

## 🎉 Summary

Integrasi ini memberikan:
- ✅ **Better UX**: Cascade dropdowns lebih mudah daripada search untuk struktur data hierarkis
- ✅ **Better Accuracy**: District-level calculation memberikan harga lebih akurat
- ✅ **Flexibility**: User bisa pilih dropdown atau search sesuai preferensi
- ✅ **Backward Compatible**: Alamat lama tetap berfungsi
- ✅ **Progressive Enhancement**: User bisa upgrade alamat lama ke mode RajaOngkir
- ✅ **Visual Feedback**: Badge jelas menunjukkan status dan akurasi perhitungan

---

**Version**: 2.0 (Hierarchical)  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
