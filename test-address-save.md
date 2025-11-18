# 🧪 Testing Guide: Penyimpanan ID Alamat untuk RajaOngkir

## ✅ Yang Sudah Diperbaiki

### **1. Database Schema**
- ✅ Added `districtId` field to Address table
- ✅ Migration created: `20251118143425_add_district_id_to_address`

### **2. API Endpoints**
- ✅ `POST /api/addresses` - Accept `districtId` parameter
- ✅ `PUT /api/addresses/[id]` - Update `districtId` parameter
- ✅ Added console logging for debugging

### **3. Frontend Components**
- ✅ `AddressSelector.tsx`:
  - Derive `cityId` from `city_name` using helper function
  - Save `districtId` from `destination.id` (subdistrict-level)
  - Enhanced logging untuk debugging
  - Visual indicator: Badge "🎯 Akurat" vs "📍 City ID"

---

## 🧪 Test Cases

### **Test 1: Create Address via Search (Recommended)**

**Steps:**
1. Login sebagai user
2. Buka halaman Profile → Addresses
3. Click "Tambah Alamat"
4. Pilih mode "Cari lokasi" (default)
5. Ketik "rawamangun jakarta" di search box
6. Pilih hasil: "RAWAMANGUN, PULO GADUNG, JAKARTA TIMUR, DKI JAKARTA"
7. Isi form lainnya (nama, telepon, alamat lengkap)
8. Click "Simpan"

**Expected Console Log:**
```
=== Selected Destination from Search ===
Raw destination data: {
  id: 17737,
  label: "RAWAMANGUN, PULO GADUNG, JAKARTA TIMUR, DKI JAKARTA, 13220",
  city_name: "JAKARTA TIMUR",
  province_name: "DKI JAKARTA",
  ...
}
Deriving city_id from city_name: JAKARTA TIMUR
Derived city_id: 139
=== Final IDs to be saved ===
City ID (for fallback): 139
District ID (for precision): 17737
Province ID: (province_id dari API)

Creating address with IDs: {
  cityId: "139",
  provinceId: "...",
  districtId: "17737"
}
```

**Expected UI:**
- ✅ Badge "🎯 Akurat (District ID)" muncul
- ✅ Address tersimpan dengan lengkap

**Database Verification:**
```sql
SELECT id, city, cityId, districtId FROM Address ORDER BY createdAt DESC LIMIT 1;

Expected:
city = "JAKARTA TIMUR"
cityId = "139"         -- City-level ID ✅
districtId = "17737"   -- District-level ID ✅
```

---

### **Test 2: Create Address via Dropdown**

**Steps:**
1. Login sebagai user
2. Buka halaman Profile → Addresses
3. Click "Tambah Alamat"
4. Toggle ke mode "Pilih dari dropdown"
5. Pilih Provinsi: "DKI JAKARTA"
6. Pilih Kota: "JAKARTA TIMUR"
7. Pilih Kecamatan: "PULO GADUNG" (opsional)
8. Isi form lainnya
9. Click "Simpan"

**Expected UI:**
- ✅ Jika kecamatan dipilih → Badge "🎯 Akurat (District ID)"
- ✅ Jika kecamatan tidak dipilih → Badge "📍 City ID"

**Database Verification:**
```sql
SELECT id, city, cityId, districtId FROM Address ORDER BY createdAt DESC LIMIT 1;

With District:
cityId = "139"
districtId = "[district_id]"  -- Dari dropdown ✅

Without District:
cityId = "139"
districtId = NULL  -- Tidak ada precision ⚠️
```

---

### **Test 3: Edit Existing Address**

**Steps:**
1. Pilih address yang sudah ada
2. Click icon Edit (✏️)
3. Form muncul dengan data existing
4. Ubah search location ke lokasi baru
5. Click "Simpan"

**Expected Console Log:**
```
=== Selected Destination from Search ===
(new destination data)
=== Final IDs to be saved ===
City ID (for fallback): [new city_id]
District ID (for precision): [new district_id]

Updating address with IDs: {
  cityId: "[new]",
  provinceId: "[new]",
  districtId: "[new]"
}
```

**Database Verification:**
- IDs harus updated sesuai lokasi baru

---

### **Test 4: Shipping Calculation (Integration Test)**

**Steps:**
1. Buat alamat dengan search (dapat district ID)
2. Buka halaman Checkout
3. Pilih alamat tersebut
4. Lihat shipping options yang muncul

**Expected Console Log:**
```
=== Selected Destination Address ===
City ID: 139
District ID: 17737

=== Shipping Cost Request ===
Origin City ID: 139
Origin District/Subdistrict ID: 17737
Origin ID used: 17737
Destination City ID: 139
Destination District/Subdistrict ID: 17737
Destination ID used: 17737
Endpoint: District (more accurate)
```

**Expected Result:**
- ✅ Badge "🟢 Perhitungan Akurat (District)" muncul
- ✅ Shipping costs calculated dengan district endpoint
- ✅ Harga lebih murah dibanding city endpoint

---

### **Test 5: Fallback to City ID**

**Steps:**
1. Buat alamat TANPA pilih kecamatan (dropdown mode)
2. Checkout dengan alamat tersebut
3. Lihat shipping calculation

**Expected Console Log:**
```
Destination District/Subdistrict ID: (not available)
Destination ID used: 139
Endpoint: City (fallback)
```

**Expected Result:**
- ✅ Badge "🟡 Estimasi (City)" muncul
- ✅ Shipping calculated dengan city endpoint
- ⚠️ Harga mungkin lebih mahal

---

## 🐛 Troubleshooting

### **Problem: cityId = districtId (keduanya sama)**

**Symptom:**
```sql
cityId = "17737"
districtId = "17737"
```

**Cause:** Helper function `getCityIdFromName()` gagal derive city_id

**Fix:**
- Check console log apakah ada error
- Verify province_id ada di destination data
- Test helper function manual

**Test:**
```bash
curl -s "https://rajaongkir.komerce.id/api/v1/destination/city/10" \
  -H "key: YOUR_API_KEY" | jq '.data[] | select(.name == "JAKARTA TIMUR")'

# Should return: {"id": 139, "name": "JAKARTA TIMUR"}
```

---

### **Problem: districtId = NULL**

**Symptom:**
```sql
cityId = "139"
districtId = NULL
```

**Cause:** 
- User tidak pilih kecamatan (dropdown mode)
- Search result tidak punya subdistrict-level ID

**Fix:** 
- ✅ This is OK for fallback!
- System akan gunakan city endpoint
- Encourage user gunakan search mode untuk precision

---

### **Problem: Error "Origin or Destination not found"**

**Symptom:** Shipping calculation gagal

**Cause:** Salah endpoint digunakan
- District endpoint dengan city ID
- City endpoint dengan district ID

**Fix:**
Check `useDistrict` logic di ShippingSelector.tsx:
```typescript
const useDistrictEndpoint = !!(originSubdistrictId && destinationDistrictId)
```

Pastikan kedua district ID ada untuk gunakan district endpoint

---

## ✅ Success Criteria

Address dianggap **berhasil disimpan dengan benar** jika:

1. **Console Log Clean:**
   - ✅ No errors
   - ✅ cityId derived successfully
   - ✅ districtId from destination.id

2. **Database Correct:**
   - ✅ cityId = 3-4 digit (city-level)
   - ✅ districtId = 5+ digit (district-level) or NULL
   - ✅ Both different values (not same)

3. **UI Indicators:**
   - ✅ Badge shows correct type
   - ✅ Location display correct

4. **Shipping Works:**
   - ✅ District endpoint used when possible
   - ✅ City endpoint fallback when needed
   - ✅ No API errors

---

## 📊 Quick Verification Query

```sql
-- Check last 5 addresses
SELECT 
  id,
  city,
  cityId,
  districtId,
  CASE 
    WHEN districtId IS NOT NULL THEN '🎯 District'
    WHEN cityId IS NOT NULL THEN '📍 City'
    ELSE '⚠️ Missing'
  END as IDType,
  createdAt
FROM Address 
ORDER BY createdAt DESC 
LIMIT 5;
```

**Expected Output:**
```
city             | cityId | districtId | IDType       | createdAt
-----------------+--------+------------+--------------+------------
JAKARTA TIMUR    | 139    | 17737      | 🎯 District  | 2025-11-18...
BANDUNG          | 55     | 1376       | 🎯 District  | 2025-11-18...
SURABAYA         | 577    | NULL       | 📍 City      | 2025-11-18...
```

---

## 🚀 Next Steps

After testing:

1. **Monitor Production:**
   - Watch console logs
   - Check database IDs
   - Verify shipping calculations

2. **User Guidance:**
   - Add tooltip: "Gunakan search untuk ongkir lebih akurat"
   - Highlight district selection benefits

3. **Analytics:**
   - Track % addresses with district ID
   - Monitor shipping accuracy improvements
   - Compare district vs city endpoint usage

4. **Documentation:**
   - Update user guide
   - Add FAQ about location selection
   - Document ID structure for support team
