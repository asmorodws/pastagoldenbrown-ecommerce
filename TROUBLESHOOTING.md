# Troubleshooting Guide

## ✅ Masalah Umum dan Solusinya

### 1. Error: "Cannot read properties of undefined (reading 'status')"

**Penyebab:**
- RajaOngkir API key belum dikonfigurasi
- RajaOngkir endpoint sudah tidak aktif (migrasi ke platform baru)
- API response tidak sesuai format yang diharapkan

**Solusi:**
✅ Aplikasi sudah diupdate dengan **graceful fallback**. Jika RajaOngkir tidak tersedia:
- Form alamat akan otomatis switch ke **input manual** (text input)
- User bisa tetap checkout **tanpa perhitungan ongkir otomatis**
- Ongkir akan dikonfirmasi manual setelah pesanan dibuat

**Untuk Mengaktifkan RajaOngkir:**
1. Kunjungi https://collaborator.komerce.id
2. Daftar/Login dan renewal package
3. Dapatkan API key baru
4. Update `.env`:
   ```env
   RAJAONGKIR_API_KEY="your_new_api_key"
   RAJAONGKIR_BASE_URL="https://api.komerce.id/rajaongkir/starter"
   # atau URL sesuai dokumentasi terbaru
   ```
5. Restart server: `npm run dev`

---

### 2. Tombol "Lanjut ke Pembayaran" Tidak Bisa Diklik

**Penyebab:**
- Sebelumnya memerlukan shipping selection bahkan ketika RajaOngkir tidak tersedia

**Solusi:**
✅ **SUDAH DIPERBAIKI!** Sekarang:
- Jika RajaOngkir **tersedia** → user HARUS pilih metode pengiriman
- Jika RajaOngkir **tidak tersedia** → user bisa langsung lanjut (ongkir manual)
- Validasi otomatis disesuaikan dengan ketersediaan RajaOngkir

---

### 3. TypeScript Error: "params is not assignable"

**Penyebab:**
- Next.js 15 mengubah `params` dari object menjadi Promise

**Solusi:**
✅ **SUDAH DIPERBAIKI!** Semua route handler sudah diupdate:
```typescript
// BEFORE (Error)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id // ❌ Error
}

// AFTER (Fixed)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // ✅ Correct
}
```

---

## 🔄 Mode Operasi Aplikasi

### Mode 1: RajaOngkir AKTIF ✅
**Kondisi:**
- API key valid dan dikonfigurasi
- Endpoint API berfungsi
- Response data valid

**Fitur:**
- ✅ Dropdown provinsi dari RajaOngkir
- ✅ Dropdown kota ter-filter by provinsi
- ✅ Kode pos auto-fill
- ✅ Perhitungan ongkir otomatis (JNE, POS, TIKI)
- ✅ Multiple service options per kurir
- ✅ Estimasi pengiriman real-time

### Mode 2: RajaOngkir TIDAK AKTIF ⚠️
**Kondisi:**
- API key tidak dikonfigurasi
- Endpoint API error/tidak tersedia
- Response data kosong

**Fitur:**
- ✅ Input manual provinsi (text input)
- ✅ Input manual kota (text input)
- ✅ Input manual kode pos
- ⚠️ Ongkir tidak dihitung otomatis
- ℹ️ Notifikasi: "Ongkir akan dikonfirmasi setelah order"
- ✅ Checkout tetap bisa dilanjutkan

---

## 🚀 Quick Start - Tanpa RajaOngkir

Jika Anda ingin **menggunakan aplikasi sekarang tanpa setup RajaOngkir**:

1. ✅ Biarkan `.env` seperti ini:
   ```env
   RAJAONGKIR_API_KEY="your_rajaongkir_api_key_here"
   ```

2. ✅ Jalankan aplikasi:
   ```bash
   npm run dev
   ```

3. ✅ Aplikasi akan berjalan dalam **Mode Manual**:
   - Form alamat menggunakan text input
   - User isi provinsi, kota, kode pos manual
   - Checkout bisa dilakukan tanpa ongkir otomatis
   - Admin konfirmasi ongkir setelah order masuk

4. ✅ Untuk aktivasi RajaOngkir nanti:
   - Follow instruksi di `RAJAONGKIR_INTEGRATION.md`
   - Update API key di `.env`
   - Restart server
   - Aplikasi otomatis switch ke **Mode RajaOngkir**

---

## 📊 Status Check

### Cek Mode Operasi Saat Ini:

1. **Jalankan aplikasi** dan buka halaman checkout
2. **Tambah alamat baru**:
   - Jika melihat **dropdown** provinsi/kota → RajaOngkir AKTIF ✅
   - Jika melihat **text input** provinsi/kota → Mode Manual ⚠️
3. Jika Mode Manual, akan ada notifikasi:
   ```
   ⚠️ RajaOngkir tidak tersedia
   Silakan isi provinsi dan kota secara manual.
   Perhitungan ongkir otomatis tidak dapat dilakukan.
   ```

### Cek Console Logs:

```bash
# Jika RajaOngkir tidak aktif, akan ada log:
Error fetching provinces: ...
# Ini NORMAL dan tidak akan crash aplikasi
```

---

## 🛠 Development Mode

### Testing Without RajaOngkir
```bash
# 1. Clear .next directory
rm -rf .next

# 2. Build application
npm run build

# 3. Run development
npm run dev

# 4. Test checkout flow:
#    - Add to cart
#    - Checkout
#    - Add address (manual input)
#    - Proceed to payment
#    - Complete order
```

### Testing With RajaOngkir
```bash
# 1. Configure .env with valid API key
# 2. Restart server
npm run dev

# 3. Test checkout flow:
#    - Add to cart
#    - Checkout
#    - Add address (dropdown selection)
#    - Select shipping method
#    - Proceed to payment
#    - Complete order
```

---

## 📝 Log Monitoring

### Normal Logs (Mode Manual):
```
Error fetching provinces: TypeError: Cannot read properties of undefined
↳ Ini NORMAL jika RajaOngkir belum dikonfigurasi
↳ Aplikasi otomatis fallback ke input manual
↳ User tetap bisa checkout
```

### Success Logs (Mode RajaOngkir):
```
✓ Fetched 34 provinces from RajaOngkir
✓ Fetched 501 cities from RajaOngkir
✓ Calculated shipping cost for 3 couriers
```

---

## ✨ Kesimpulan

**Aplikasi sekarang:**
- ✅ **Tidak akan crash** jika RajaOngkir tidak aktif
- ✅ **Graceful degradation** ke input manual
- ✅ **User tetap bisa checkout** dalam mode apapun
- ✅ **Auto-detect** ketersediaan RajaOngkir
- ✅ **Seamless switch** antara mode manual dan RajaOngkir

**Anda bisa:**
- 🚀 Deploy aplikasi **SEKARANG** tanpa RajaOngkir
- 🔧 Setup RajaOngkir **NANTI** kapan saja
- 💰 Tidak perlu beli package RajaOngkir untuk testing
- 📦 Order tetap bisa diproses dengan ongkir manual

**Upgrade ke RajaOngkir kapan saja** dengan:
1. Renewal package di https://collaborator.komerce.id
2. Update API key di `.env`
3. Restart server
4. **DONE!** ✨
