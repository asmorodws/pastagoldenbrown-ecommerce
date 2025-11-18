# RajaOngkir Cache Optimization Guide

##  Overview

Implementasi caching yang komprehensif untuk menghemat kuota API RajaOngkir dengan best practices:

###  Fitur Cache yang Diimplementasikan

1. **Multi-layer Caching**
   - Database cache (persistent via Prisma)
   - In-memory fallback (untuk development/backup)

2. **Smart TTL Strategy**
   - Provinsi & Kota: **30 hari** (data statis jarang berubah)
   - Kecamatan: **30 hari** (data statis)
   - Search Results: **7 hari** (pencarian yang sama sering diulang)
   - Shipping Cost: **1 jam** (harga bisa berubah, tapi tidak terlalu sering)

3. **Stale-While-Revalidate**
   - User mendapat response instant dari cache
   - Update cache di background tanpa blocking
   - Pengalaman user lebih cepat

4. **Stale-On-Error Fallback**
   - Jika API error/down, gunakan cache lama
   - Aplikasi tetap berfungsi meski API bermasalah
   - Mengurangi error untuk end user

5. **Prefix Caching untuk Autocomplete**
   - Cache prefix search (misal: "jak", "jaka", "jakar")
   - Filter lokal untuk hasil yang lebih spesifik
   - Drastis mengurangi API call saat user mengetik

6. **Cache Warming**
   - Pre-load data populer saat aplikasi start
   - Data sudah tersedia sebelum user request
   - Zero latency untuk query populer

---

##  Penghematan API Quota

### Sebelum Optimasi
- Setiap request provinsi → **1 API call**
- Setiap request kota → **1 API call**
- Autocomplete 5 karakter → **5 API calls**
- Setiap cek ongkir → **1 API call**

**Total**: ~100+ API calls per user session

### Setelah Optimasi
- Request provinsi → **0 API calls** (cached 30 hari)
- Request kota → **0 API calls** (cached 30 hari)
- Autocomplete 5 karakter → **0-1 API calls** (prefix caching)
- Cek ongkir pertama → **1 API call**, berikutnya **0 calls** (cached 1 jam)

**Total**: ~1-5 API calls per user session

###  Estimasi Penghematan
- **80-95%** pengurangan API calls
- Jika quota 1000 calls/hari → bisa handle **10,000-20,000** user actions
- Monthly quota lebih awet **10-20x** lipat

---

##  Cara Menggunakan

### 1. Cache Warming Otomatis (Recommended)

Tambahkan di `app/layout.tsx` atau saat aplikasi startup:

```typescript
import { warmEssentialCache } from '@/lib/rajaongkir-cache-warmer'

// Di server component atau API route yang dipanggil saat startup
export default async function RootLayout() {
  // Warm cache di background, jangan block rendering
  if (process.env.NODE_ENV === 'production') {
    warmEssentialCache().catch(console.error)
  }
  
  return (
    // ... layout code
  )
}
```

### 2. Cache Warming via Script

Jalankan manual atau via cron job:

```bash
# Via node
node -r ts-node/register lib/rajaongkir-cache-warmer.ts

# Via tsx (recommended)
npx tsx lib/rajaongkir-cache-warmer.ts
```

**Setup Cron Job** (Linux/Mac):
```bash
# Edit crontab
crontab -e

# Tambahkan line ini untuk warm cache setiap pagi jam 6
0 6 * * * cd /path/to/project && npx tsx lib/rajaongkir-cache-warmer.ts >> /var/log/rajaongkir-cache.log 2>&1
```

### 3. Warm Origin Cache

Jika ada setting origin city ID (kota asal pengiriman):

```typescript
import { warmOriginCache } from '@/lib/rajaongkir-cache-warmer'

// Panggil setelah user set origin city di settings
await warmOriginCache(originCityId)
```

---

##  API Reference

### Cache Functions

#### `cacheFetch()`
```typescript
cacheFetch<T>(
  endpoint: string,
  params: any,
  fetcher: () => Promise<T>,
  ttlSeconds?: number,
  options?: {
    allowStaleOnError?: boolean      // Default: true
    staleWhileRevalidate?: boolean   // Default: false
  }
): Promise<T>
```

**Example:**
```typescript
const provinces = await cacheFetch(
  '/destination/province',
  {},
  async () => {
    // API call logic
  },
  60 * 60 * 24 * 30,  // TTL: 30 hari
  { 
    allowStaleOnError: true,
    staleWhileRevalidate: true 
  }
)
```

#### `warmCache()`
```typescript
warmCache<T>(
  endpoint: string,
  params: any,
  fetcher: () => Promise<T>,
  ttlSeconds?: number
): Promise<void>
```

#### `batchWarmCache()`
```typescript
batchWarmCache(
  entries: Array<{
    endpoint: string
    params: any
    fetcher: () => Promise<any>
    ttlSeconds?: number
  }>
): Promise<void>
```

#### `clearCacheByEndpoint()`
```typescript
clearCacheByEndpoint(endpoint: string): Promise<void>
```

---

##  Best Practices

### 1. **Gunakan TTL yang Tepat**
```typescript
// Data master (jarang berubah) → Long TTL
getProvinces()  // 30 hari
getCities()     // 30 hari
getDistricts()  // 30 hari

// Data dinamis (sering berubah) → Short TTL
getShippingCost()  // 1 jam
```

### 2. **Enable Stale-While-Revalidate untuk UX**
```typescript
// Untuk shipping cost - user dapat response cepat
getShippingCost({
  // ... params
}, {
  staleWhileRevalidate: true  //  Response instant
})
```

### 3. **Always Enable Stale-On-Error**
```typescript
// Jika RajaOngkir down, app tetap jalan
getProvinces({
  allowStaleOnError: true  //  Fallback ke cache lama
})
```

### 4. **Warm Cache untuk Data Populer**
```typescript
// Saat aplikasi start atau via cron
await warmEssentialCache()

// Untuk origin setting baru
await warmOriginCache(newOriginCityId)
```

### 5. **Clear Cache Saat Update Data**
```typescript
// Jika admin update shipping settings
await clearCacheByEndpoint('/calculate/domestic-cost')
```

---

##  Monitoring & Debugging

### Check Cache Status

Lihat di database:
```sql
-- Total cache entries
SELECT COUNT(*) FROM api_cache;

-- Cache by endpoint
SELECT endpoint, COUNT(*) as total, AVG(ttl) as avg_ttl
FROM api_cache
GROUP BY endpoint;

-- Recent cache activity
SELECT * FROM api_cache 
ORDER BY updated_at DESC 
LIMIT 10;
```

### Enable Debug Logging

Set environment variable:
```bash
DEBUG=cache:* npm run dev
```

Atau tambahkan di code:
```typescript
// Di lib/cache.ts
console.log('Cache hit:', key)
console.log('Cache miss, fetching:', key)
```

---

##  Performance Metrics

### Expected Response Times

| Operation | Without Cache | With Cache | Improvement |
|-----------|--------------|------------|-------------|
| Get Provinces | 200-500ms | 5-20ms | **10-100x** |
| Get Cities | 200-500ms | 5-20ms | **10-100x** |
| Search City | 300-800ms | 5-30ms | **10-100x** |
| Shipping Cost (cached) | 500-1500ms | 10-50ms | **30-100x** |
| Shipping Cost (stale-revalidate) | 500-1500ms | 10-50ms* | **Instant** |

*Background update tidak block user

---

## 🐛 Troubleshooting

### Cache Tidak Bekerja?

1. **Check Database Connection**
   ```typescript
   // Test di console
   import { prisma } from './lib/prisma'
   await prisma.apiCache.count()
   ```

2. **Check API Key**
   ```bash
   echo $RAJAONGKIR_API_KEY
   ```

3. **Check Cache Table**
   ```sql
   SELECT * FROM api_cache WHERE endpoint LIKE '/destination/province%';
   ```

### Cache Terlalu Lama?

Update TTL di `lib/rajaongkir.ts`:
```typescript
// Kurangi TTL jika perlu
cacheFetch(endpoint, params, fetcher, 
  60 * 60 * 12,  // 12 jam instead of 30 hari
  options
)
```

### Memory Issues?

Clear old cache periodically:
```typescript
// Di cron job atau background task
import { prisma } from './lib/prisma'

// Delete cache older than 60 days
await prisma.apiCache.deleteMany({
  where: {
    updated_at: {
      lt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    }
  }
})
```

---

##  Scaling Tips

### For High Traffic (1000+ users/day)

1. **Add Redis Cache Layer**
   ```typescript
   // lib/redis-cache.ts
   import Redis from 'ioredis'
   const redis = new Redis(process.env.REDIS_URL)
   
   // Check Redis first, then DB, then API
   ```

2. **Enable HTTP Caching**
   ```typescript
   // In API routes
   export const revalidate = 3600 // Next.js cache 1 hour
   ```

3. **Use CDN for Static Data**
   - Cache provinces/cities di CDN
   - Serve dari edge locations

### For Low Traffic (< 100 users/day)

Current implementation sudah cukup optimal! 

---

##  TODO / Future Improvements

- [ ] Add Redis support untuk distributed caching
- [ ] Implement cache warming via API endpoint (untuk trigger manual)
- [ ] Add metrics dashboard untuk monitoring cache hit rate
- [ ] Implement intelligent cache invalidation
- [ ] Add support untuk bulk pre-warming based on analytics

---

##  Summary

Dengan implementasi ini, Anda akan mendapat:

 **80-95% pengurangan API calls** ke RajaOngkir  
 **10-100x response time lebih cepat**  
 **Aplikasi tetap jalan** meski API down  
 **User experience lebih baik** dengan instant response  
 **Kuota API lebih awet** 10-20x lipat  

**Cost Saving**: Jika paket RajaOngkir Rp 100k/bulan untuk 1000 calls, dengan optimasi ini bisa handle beban yang sama dengan paket lebih murah atau handle 10-20x lebih banyak traffic dengan paket yang sama!
