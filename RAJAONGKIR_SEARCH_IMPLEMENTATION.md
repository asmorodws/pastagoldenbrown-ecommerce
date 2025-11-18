# RajaOngkir V2 - Search-Based Implementation

## Overview

RajaOngkir V2 API tidak lagi menyediakan endpoint untuk listing semua provinsi dan kota. Sebagai gantinya, kami menggunakan **Search Domestic Destination API** yang lebih efisien dan akurat.

## Perubahan dari V1 ke V2

### V1 (Deprecated)
-  GET `/province` - List semua provinsi
-  GET `/city?province=xxx` - List kota berdasarkan provinsi
-  POST `/cost` - Hitung ongkir

### V2 (Current)
-  GET `/destination/domestic-destination?search=xxx` - Cari lokasi
-  POST `/calculate/domestic-cost` - Hitung ongkir dengan courier colon-separated

## Cara Kerja Search Implementation

### 1. User Interface
Saat user menambah/edit alamat, mereka akan melihat:
- **Search input** untuk mencari lokasi (kota/kecamatan/kelurahan)
- **Auto-complete dropdown** menampilkan hasil pencarian
- **Confirmation box** setelah lokasi dipilih

### 2. Search Flow
```
User ketik "jakarta selatan" (min 3 karakter)
    ↓
Debounce 500ms (kurangi API calls)
    ↓
GET /api/rajaongkir/search?q=jakarta+selatan&limit=10
    ↓
Tampilkan hasil dalam dropdown
    ↓
User pilih "Kebayoran Baru, Jakarta Selatan, DKI Jakarta"
    ↓
Form auto-fill dengan:
  - cityId: "31555" (untuk calculate shipping)
  - city: "Jakarta Selatan"
  - province: "DKI Jakarta"
  - zipCode: "12180"
```

### 3. API Response Format
```json
{
  "data": [
    {
      "id": "31555",
      "name": "Kebayoran Baru",
      "province": "DKI Jakarta",
      "city": "Jakarta Selatan",
      "district": "Kebayoran Baru",
      "subdistrict": null,
      "postal_code": "12180"
    }
  ]
}
```

## Testing Guide

### 1. Test Search Functionality

**Via Browser:**
1. Buka http://localhost:3001
2. Login dan pergi ke Checkout
3. Klik "Tambah Alamat"
4. Di field "Cari Lokasi", ketik nama kota Anda (min 3 karakter)
5. Tunggu dropdown muncul dengan hasil pencarian
6. Pilih lokasi yang sesuai
7. Lihat konfirmasi lokasi terpilih di kotak hijau
8. Lengkapi form lainnya dan simpan

**Via API Direct:**
```bash
# Test search Jakarta
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=jakarta&limit=5"

# Test search Bandung
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=bandung&limit=5"

# Test search specific district
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=kebayoran&limit=5"
```

### 2. Test Shipping Calculation

**Scenario:** User di Jakarta Selatan ingin kirim ke Bandung

```bash
# 1. Cari origin (Jakarta Selatan)
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=jakarta+selatan&limit=1"
# Response: { "id": "31555", ... }

# 2. Cari destination (Bandung)
curl -H "key: YOUR_API_KEY" \
  "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=bandung&limit=1"
# Response: { "id": "22", ... }

# 3. Hitung ongkir
curl -X POST \
  -H "key: YOUR_API_KEY" \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "origin=31555&destination=22&weight=1000&courier=jne:sicepat:tiki" \
  "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost"
```

## Code Structure

### Files Modified

1. **`lib/rajaongkir.ts`**
   - Removed warning logs from `getProvinces()` and `getCities()`
   - These functions now return empty arrays silently
   - Added `searchDomesticDestination()` function

2. **`components/AddressSelector.tsx`**
   - Replaced province/city dropdowns with search input
   - Added debounced search with 500ms delay
   - Added auto-complete dropdown for search results
   - Added location confirmation display
   - Fallback to manual input if RajaOngkir unavailable

3. **`app/api/rajaongkir/search/route.ts`**
   - New endpoint for destination search
   - Proxies requests to RajaOngkir V2 API

### Key Functions

**`searchDomesticDestination(search, limit, offset)`**
```typescript
// Search for destinations matching query
const results = await searchDomesticDestination("jakarta", 10, 0)
// Returns array of destination objects with id, name, province, city, etc.
```

**`handleSelectDestination(destination)`**
```typescript
// Auto-fill form when user selects from search results
setFormData({
  ...formData,
  cityId: destination.id,          // For shipping calculation
  city: destination.city,           // For display
  province: destination.province,   // For display
  zipCode: destination.postal_code  // For display
})
```

## Search Best Practices

### 1. Minimum Characters
Require at least 3 characters before searching to:
- Reduce unnecessary API calls
- Improve search accuracy
- Better user experience

### 2. Debouncing
Wait 500ms after user stops typing to:
- Avoid searching on every keystroke
- Reduce API quota usage
- Prevent rate limiting

### 3. Limit Results
Request max 10-20 results to:
- Keep dropdown manageable
- Reduce response size
- Faster rendering

### 4. Error Handling
- If search fails → show manual input fields
- If no results → show "tidak ditemukan" message
- If API key invalid → fallback to manual mode

## Migration Checklist

- [x] Remove `getProvinces()` warning logs
- [x] Remove `getCities()` warning logs
- [x] Add search input in AddressSelector
- [x] Implement debounced search
- [x] Add auto-complete dropdown
- [x] Add location confirmation display
- [x] Test search with real API key
- [x] Test shipping calculation with search results
- [x] Update documentation

## Benefits of Search-Based Approach

### 1. Performance
- No need to load thousands of cities upfront
- Faster page load time
- Reduced memory usage

### 2. Accuracy
- Direct search from RajaOngkir's latest database
- Auto-updated when RajaOngkir adds new locations
- No manual province/city list maintenance

### 3. User Experience
- Faster location selection
- No need to click multiple dropdowns
- Type and select in one step
- Works like Google Maps autocomplete

### 4. API Efficiency
- Only call API when needed
- Debouncing reduces redundant calls
- Smaller response payloads

## Troubleshooting

### "Ketik minimal 3 karakter untuk mencari"
**Normal behavior.** Search requires minimum 3 characters for better accuracy.

### Search tidak menampilkan hasil
1. Check browser console for errors
2. Verify API key is configured in `.env`
3. Test API directly with curl (see examples above)
4. Check RajaOngkir quota/subscription status

### "RajaOngkir tidak tersedia"
Falls back to manual input. Possible causes:
- API key not configured
- API key invalid/expired
- RajaOngkir service down
- Network issues

### Shipping calculation fails
1. Ensure `cityId` is saved (check database)
2. Verify origin city ID in `.env`
3. Check courier codes are correct
4. Test cost API directly with curl

## Next Steps

1. **Configure Origin City**
   ```bash
   # Search for your store location
   curl -H "key: YOUR_API_KEY" \
     "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=YOUR_CITY&limit=5"
   
   # Copy the ID and update .env
   NEXT_PUBLIC_ORIGIN_CITY_ID="CITY_ID_HERE"
   ```

2. **Test Complete Flow**
   - Add address with search
   - Proceed to checkout
   - Select shipping method
   - Verify cost calculation

3. **Monitor Usage**
   - Check RajaOngkir dashboard for API usage
   - Monitor quota consumption
   - Upgrade plan if needed

## Support

- **RajaOngkir Dashboard:** https://collaborator.komerce.id
- **API Documentation:** Contact RajaOngkir support
- **Implementation Guide:** See `RAJAONGKIR_V2_MIGRATION.md`
