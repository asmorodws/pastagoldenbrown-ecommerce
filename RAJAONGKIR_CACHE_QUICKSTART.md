#  RajaOngkir Cache Implementation - Quick Reference

##  What's Been Done

### 1. Enhanced Cache Library (`lib/cache.ts`)
-  **Stale-While-Revalidate**: Serve cached data instantly while updating in background
-  **Stale-On-Error**: Fallback to old cache if API fails
-  **Cache Warming**: Pre-load popular data before user requests
-  **Batch Operations**: Warm multiple cache entries efficiently
-  **Clear Old Cache**: Utility to cleanup stale entries

### 2. Optimized RajaOngkir Integration (`lib/rajaongkir.ts`)
| Endpoint | Old TTL | New TTL | Strategy |
|----------|---------|---------|----------|
| Provinces | 24h | **30 days** | Stale-on-error |
| Cities | 24h | **30 days** | Stale-on-error |
| Districts | 24h | **30 days** | Stale-on-error |
| Subdistricts | 24h | **30 days** | Stale-on-error |
| Search | 24h | **7 days** | Stale-on-error + Prefix caching |
| Shipping Cost | 60s | **1 hour** | Stale-while-revalidate |

### 3. Cache Warming Utility (`lib/rajaongkir-cache-warmer.ts`)
-  `warmProvinces()` - Warm all provinces
-  `warmPopularCities()` - Warm top 10 provinces' cities
-  `warmPopularSearches()` - Warm 15 popular city searches
-  `warmOriginCache()` - Warm origin city districts
-  `warmEssentialCache()` - One-click warm all important data

### 4. Admin UI (`components/admin/CacheManagerCard.tsx`)
-  Visual cache warming buttons
-  Real-time cache statistics
-  Endpoint breakdown
-  Recent activity log
-  One-click clear old cache

### 5. API Endpoints
-  `POST /api/admin/cache/warm` - Trigger cache warming
-  `GET /api/admin/cache/warm` - Get cache statistics
-  `POST /api/admin/cache/clear` - Clear old cache entries

### 6. NPM Scripts
```json
{
  "cache:warm": "tsx lib/rajaongkir-cache-warmer.ts",
  "cache:warm:watch": "tsx watch lib/rajaongkir-cache-warmer.ts"
}
```

---

##  How to Use

### Option 1: Admin Panel (Easiest)
1. Login as admin
2. Go to **Admin → Settings**
3. Scroll to **RajaOngkir Cache Manager**
4. Click **🔥 Warm All Essential Cache**
5. Done! Check statistics

### Option 2: Command Line
```bash
npm run cache:warm
```

### Option 3: Cron Job (Automated)
```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 6 AM)
0 6 * * * cd /path/to/project && npm run cache:warm >> /var/log/cache-warm.log 2>&1
```

### Option 4: Programmatically
```typescript
import { warmEssentialCache } from '@/lib/rajaongkir-cache-warmer'

// In API route or server component
await warmEssentialCache()
```

---

##  Expected Results

### API Call Reduction
- **Before**: ~100+ calls per user session
- **After**: ~1-5 calls per user session
- **Savings**: **80-95% reduction**

### Response Time Improvement
- **Provinces**: 200-500ms → **5-20ms** (10-100x faster)
- **Cities**: 200-500ms → **5-20ms** (10-100x faster)
- **Search**: 300-800ms → **5-30ms** (10-100x faster)
- **Shipping Cost**: 500-1500ms → **10-50ms** (30-100x faster)

### Quota Extension
If you have **1000 calls/day** quota:
- Before: ~10 active users
- After: **100-200 active users** (10-20x more capacity)

---

##  Key Features

### 1. Stale-While-Revalidate
```typescript
// User gets instant response from cache
// Update happens in background
getShippingCost({...}, { staleWhileRevalidate: true })
```

### 2. Stale-On-Error
```typescript
// If RajaOngkir API is down, use old cache
// App keeps working!
getProvinces({ allowStaleOnError: true })
```

### 3. Prefix Caching (Autocomplete)
```typescript
// User types: "jak" → cached
// User types: "jaka" → filters from "jak" cache (no API call!)
// User types: "jakar" → filters locally (no API call!)
searchDomesticDestination("jakarta")
```

### 4. Smart TTL
- Static data (provinces, cities): **30 days**
- Search results: **7 days** (searches repeat often)
- Dynamic data (shipping cost): **1 hour**

---

##  Files Changed/Created

### Modified
- ✏️ `lib/cache.ts` - Enhanced with new features
- ✏️ `lib/rajaongkir.ts` - Optimized TTL and strategies
- ✏️ `package.json` - Added cache scripts
- ✏️ `app/admin/settings/page.tsx` - Added cache manager UI

### Created
-  `lib/rajaongkir-cache-warmer.ts` - Cache warming utility
-  `components/admin/CacheManagerCard.tsx` - Admin UI component
-  `app/api/admin/cache/warm/route.ts` - API endpoint
-  `app/api/admin/cache/clear/route.ts` - API endpoint
-  `RAJAONGKIR_CACHE_OPTIMIZATION.md` - Full documentation
-  `RAJAONGKIR_CACHE_QUICKSTART.md` - This file

---

## 🔥 Quick Start Checklist

- [ ] Run `npm run cache:warm` untuk warm cache pertama kali
- [ ] Login ke admin panel, cek **Settings** → **Cache Manager**
- [ ] Click **🔥 Warm All Essential Cache**
- [ ] Verify cache statistics show entries
- [ ] Test: Search for cities, check response time
- [ ] Setup cron job untuk daily cache warming (optional)

---

##  Pro Tips

1. **First-time setup**: Run cache warming before launching to production
2. **Daily maintenance**: Setup cron job to warm cache every morning
3. **After updates**: Clear cache if shipping settings change
4. **Monitoring**: Check admin panel regularly for cache health
5. **Origin city**: Warm origin cache after setting up shipping origin

---

##  Need Help?

Check full documentation: `RAJAONGKIR_CACHE_OPTIMIZATION.md`

Common issues:
- Cache not working? → Check database connection
- No statistics? → Run cache warming first
- Still slow? → Check API key configuration
- High API usage? → Verify cache is enabled and warmed

---

**Happy Caching! **
