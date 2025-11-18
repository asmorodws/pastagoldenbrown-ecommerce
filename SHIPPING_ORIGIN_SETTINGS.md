# 📍 Panduan Pengaturan Lokasi Asal Pengiriman (Shipping Origin)

##  Overview

Fitur ini memungkinkan **Super Admin** untuk mengubah lokasi asal pengiriman (origin city) yang digunakan untuk kalkulasi ongkir RajaOngkir. Lokasi ini menentukan titik awal pengiriman untuk semua pesanan.

##  Fungsi Utama

### 1. **Lihat Lokasi Toko Saat Ini**
- Menampilkan kota/kabupaten yang saat ini diset sebagai origin
- Menampilkan City ID yang digunakan untuk API RajaOngkir
- Real-time display dari konfigurasi `.env`

### 2. **Ubah Lokasi Toko**
- Search kota/kabupaten dengan autocomplete
- Integrasi langsung dengan RajaOngkir API
- Auto-save ke file `.env`

### 3. **Notifikasi & Instruksi**
- Warning untuk restart server setelah perubahan
- Toast notification sukses/gagal
- Instruksi lengkap untuk development dan production

##  Cara Menggunakan

### Akses Fitur
1. Login sebagai **Super Admin**
2. Navigasi ke **Dashboard Admin** → **Pengaturan**
3. Scroll ke section **"Pengaturan Pengiriman"**

### Mengubah Lokasi
1. Lihat lokasi toko saat ini (ditampilkan dengan badge hijau)
2. Di field "Ubah Lokasi Toko", ketik minimal **3 karakter**
3. Pilih kota/kabupaten dari hasil pencarian
4. Sistem akan otomatis menyimpan ke `.env`
5. Toast notification muncul dengan instruksi restart

### Setelah Perubahan

#### Development Mode:
```bash
# Stop server (tekan Ctrl+C)
# Lalu jalankan kembali:
npm run dev
```

#### Production Mode:
```bash
# Rebuild aplikasi
npm run build

# Restart server/container
pm2 restart app
# atau
docker restart container-name
```

## 🏗️ Technical Implementation

### API Endpoint

**Path**: `/api/admin/settings/shipping-origin`

#### GET - Ambil Origin Saat Ini
```typescript
GET /api/admin/settings/shipping-origin

Response:
{
  "originCityId": "501",
  "originCityName": ""
}
```

#### PUT - Update Origin
```typescript
PUT /api/admin/settings/shipping-origin

Body:
{
  "originCityId": "152",
  "originCityName": "Jakarta Pusat, DKI Jakarta"
}

Response:
{
  "success": true,
  "message": "Shipping origin updated successfully",
  "originCityId": "152",
  "originCityName": "Jakarta Pusat, DKI Jakarta"
}
```

### Security
-  Hanya user dengan role `ADMIN` yang bisa akses
-  Autentikasi dengan NextAuth session
-  Write permission ke file `.env` di-handle server-side

### File Modified

**`.env`**:
```bash
# Before
NEXT_PUBLIC_ORIGIN_CITY_ID=501

# After (example: changed to Jakarta Pusat)
NEXT_PUBLIC_ORIGIN_CITY_ID=152
```

### Backend Logic

```typescript
// Read .env file
const envPath = path.join(process.cwd(), ".env")
let envContent = fs.readFileSync(envPath, "utf-8")

// Update or add NEXT_PUBLIC_ORIGIN_CITY_ID
if (envContent.includes("NEXT_PUBLIC_ORIGIN_CITY_ID=")) {
  envContent = envContent.replace(
    /NEXT_PUBLIC_ORIGIN_CITY_ID=.+/m,
    `NEXT_PUBLIC_ORIGIN_CITY_ID=${originCityId}`
  )
} else {
  envContent += `\nNEXT_PUBLIC_ORIGIN_CITY_ID=${originCityId}\n`
}

// Write back
fs.writeFileSync(envPath, envContent)
```

### Frontend UI Components

#### Current Location Display
```tsx
<div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
  <div className="flex items-center gap-3">
    <MapPin className="w-6 h-6 text-green-600" />
    <div>
      <p className="font-bold text-green-900">
        Jakarta Timur, DKI Jakarta
      </p>
      <p className="text-sm text-green-700">
        City ID: 501
      </p>
    </div>
  </div>
</div>
```

#### Search Input
```tsx
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Cari kota/kabupaten... (min 3 karakter)"
/>
```

#### Search Results Dropdown
```tsx
{showSearchResults && searchResults.length > 0 && (
  <div className="absolute z-10 w-full mt-2 bg-white border rounded-xl shadow-lg">
    {searchResults.map((result, idx) => (
      <button onClick={() => handleSelectCity(result)}>
        {result.name}
      </button>
    ))}
  </div>
)}
```

##  Use Cases

### 1. Toko Pindah Lokasi
**Scenario**: Toko fisik pindah dari Jakarta ke Bandung

**Steps**:
1. Admin login → Settings
2. Search "Bandung"
3. Pilih "Bandung, Jawa Barat"
4. Restart server
5. Semua kalkulasi ongkir sekarang dari Bandung

### 2. Multi-Warehouse Setup
**Scenario**: Toko punya gudang di Jakarta dan Surabaya

**Current Limitation**: Sistem hanya support 1 origin
**Workaround**: Set ke lokasi warehouse utama
**Future Enhancement**: Multi-origin dengan warehouse management

### 3. Testing Different Origins
**Scenario**: Admin ingin test biaya pengiriman dari berbagai kota

**Steps**:
1. Ubah origin ke Kota A
2. Restart server
3. Test checkout dengan berbagai destinasi
4. Catat biaya pengiriman
5. Ulangi untuk Kota B, C, dll.

##  Perhatian Penting

### 1. **Server Restart Required**
- Perubahan disimpan ke `.env`
- Environment variables di-load saat server start
- **HARUS restart** agar perubahan diterapkan
- Tidak ada hot-reload untuk env variables

### 2. **Production Deployment**
- Setelah ubah origin di production:
  - Rebuild aplikasi (`npm run build`)
  - Restart container/server
  - Bisa ada downtime singkat
- Pertimbangkan maintenance window

### 3. **Customer Impact**
- Biaya ongkir akan berubah untuk customer
- ETD (estimasi pengiriman) akan berbeda
- Beberapa kurir mungkin tidak tersedia dari origin baru
- Informasikan customer jika ada perubahan signifikan

### 4. **Backup**
- `.env` file di-backup otomatis oleh version control (jika di-ignore dengan baik)
- Catat City ID lama sebelum ubah
- Test di staging dulu sebelum production

##  UI/UX Design

### Visual Indicators

#### Success State (Lokasi Tersimpan)
```
┌────────────────────────────────────────────┐
│ 📍 Lokasi Toko Saat Ini                   │
├────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐ │
│ │ 📍 Jakarta Timur, DKI Jakarta          │ │
│ │    City ID: 501                        │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### Search Active
```
┌────────────────────────────────────────────┐
│  Cari kota/kabupaten...                  │
│ [bandung___________________]            │
│ ┌────────────────────────────────────────┐ │
│ │ Bandung                                │ │
│ │ Bandung, Jawa Barat - 40111            │ │
│ ├────────────────────────────────────────┤ │
│ │ Bandung Barat                          │ │
│ │ Bandung Barat, Jawa Barat - 40721      │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

#### Warning Message
```
┌────────────────────────────────────────────┐
│  PENTING!                                │
├────────────────────────────────────────────┤
│ Setelah mengubah lokasi asal pengiriman,  │
│ Anda perlu RESTART SERVER:                 │
│                                            │
│ Development:                               │
│ • Stop server (Ctrl+C)                     │
│ • npm run dev                              │
│                                            │
│ Production:                                │
│ • Rebuild dan restart aplikasi             │
└────────────────────────────────────────────┘
```

### Color Scheme
- **Current Location**: Green (`bg-green-50`, `border-green-200`)
- **Search Input**: Slate (`bg-slate-50`, `border-slate-200`)
- **Warning**: Amber (`bg-amber-50`, `border-amber-200`)
- **Section Header**: Blue-Cyan gradient

##  Testing Checklist

### Frontend Testing
- [ ] Admin dapat melihat origin saat ini
- [ ] Search bekerja dengan min 3 karakter
- [ ] Debounce search (500ms)
- [ ] Hasil pencarian tampil dengan benar
- [ ] Klik hasil → auto-select dan save
- [ ] Toast notification muncul
- [ ] Warning message tampil
- [ ] Loading states bekerja

### Backend Testing
- [ ] GET endpoint return origin saat ini
- [ ] PUT endpoint update `.env` file
- [ ] Authorization check (hanya ADMIN)
- [ ] Error handling untuk invalid city ID
- [ ] File write permissions OK
- [ ] Log perubahan ke console

### Integration Testing
- [ ] Perubahan tersimpan di `.env`
- [ ] Server restart membaca value baru
- [ ] ShippingSelector gunakan origin baru
- [ ] Kalkulasi ongkir benar dari origin baru
- [ ] Semua courier support origin baru

### Edge Cases
- [ ] City tidak ditemukan
- [ ] RajaOngkir API down
- [ ] File `.env` tidak writable
- [ ] Session expired saat save
- [ ] Multiple admin ubah bersamaan

##  Analytics & Monitoring

### Metrics to Track
1. **Frequency**: Berapa sering origin diubah
2. **Popular Origins**: Kota mana yang sering digunakan
3. **Impact**: Perubahan rata-rata biaya ongkir
4. **Errors**: Failed updates, API errors

### Logging
```typescript
console.log(`Shipping origin updated to: ${originCityName} (ID: ${originCityId})`)
```

### Monitoring Dashboard (Future)
- History log perubahan origin
- Current vs previous origin comparison
- Impact analysis on shipping costs
- Customer complaints correlation

##  Future Enhancements

### Phase 1: Improvements
- [ ] **Preview Mode**: Preview biaya ongkir sebelum apply
- [ ] **Confirmation Dialog**: Double-confirm sebelum save
- [ ] **Rollback**: Undo last change
- [ ] **History**: Log semua perubahan origin

### Phase 2: Advanced Features
- [ ] **Multi-Origin**: Support multiple warehouses
- [ ] **Auto-Selection**: Pilih origin terdekat otomatis
- [ ] **Zone Management**: Bagi Indonesia ke zones dengan origin berbeda
- [ ] **Smart Routing**: Route order ke warehouse terdekat

### Phase 3: Business Logic
- [ ] **Cost Optimization**: Suggest optimal origin berdasarkan order history
- [ ] **Service Coverage**: Show which couriers available from origin
- [ ] **Distance Calculator**: Show distance from origin to popular destinations
- [ ] **Fulfillment Time**: Predict delivery time based on origin

##  Related Documentation

- [RAJAONGKIR_V2_HIERARCHICAL.md](./RAJAONGKIR_V2_HIERARCHICAL.md) - RajaOngkir integration
- [COURIER_SELECTOR_GUIDE.md](./COURIER_SELECTOR_GUIDE.md) - Courier selection feature
- [ShippingSelector Component](../components/checkout/ShippingSelector.tsx) - Uses origin city

##  Best Practices

### 1. Sebelum Ubah Origin
-  Backup `.env` file
-  Test di staging environment dulu
-  Pastikan courier support origin baru
-  Informasikan team/customer jika perlu

### 2. Saat Ubah Origin
-  Pilih kota yang benar (cek spelling)
-  Verify City ID dari RajaOngkir
-  Schedule di maintenance window (production)
-  Monitor error logs setelah restart

### 3. Setelah Ubah Origin
-  Test checkout flow end-to-end
-  Verify biaya ongkir masuk akal
-  Check semua courier tersedia
-  Monitor customer feedback

##  Summary

Fitur **Shipping Origin Settings** memberikan:

1.  **Flexibility**: Admin bisa ubah origin kapan saja
2.  **User-Friendly**: Search autocomplete yang mudah
3.  **Safe**: Authorization dan validation
4.  **Transparent**: Clear warning dan instruksi
5.  **Persistent**: Simpan ke `.env` file
6.  **Professional**: UI yang clean dan informatif

**Impact**: Admin tidak perlu edit `.env` manual, lebih cepat dan mengurangi human error! 🎊

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**:  Production Ready
