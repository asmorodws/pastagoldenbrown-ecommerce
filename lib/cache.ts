import crypto from 'crypto'
import { prisma } from './prisma'

type JsonValue = any

// In-memory fallback untuk development atau saat database tidak tersedia
const inMemoryFallback = new Map<string, { response: JsonValue; expiresAt: number }>()

// Background revalidation queue untuk stale-while-revalidate pattern
const revalidationQueue = new Set<string>()

function computeKey(endpoint: string, params: any) {
  const hash = crypto.createHash('sha256').update(JSON.stringify(params || {})).digest('hex')
  return `${endpoint}:${hash}`
}

export async function getCached(key: string) {
  try {
    const rec = await prisma.apiCache.findUnique({ where: { key } })
    if (!rec) return null
    // Invalidate if TTL exceeded
    const age = (Date.now() - rec.updatedAt.getTime()) / 1000
    if (age > rec.ttl) {
      return null
    }

    // Also invalidate if the cached item was created/updated on a previous calendar day.
    // Use UTC date to avoid server-local timezone differences causing unexpected behaviour.
    const cachedDay = rec.updatedAt.toISOString().slice(0, 10) // YYYY-MM-DD
    const todayUtc = new Date().toISOString().slice(0, 10)
    if (cachedDay !== todayUtc) {
      // treat as expired so the caller will fetch fresh data
      return null
    }
    return rec.response
  } catch (err) {
    // Prisma/db not available: use in-memory fallback
    const entry = inMemoryFallback.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      inMemoryFallback.delete(key)
      return null
    }
    return entry.response
  }
}

// Return cached entry regardless of TTL/day checks (used as stale fallback)
export async function getAnyCached(key: string) {
  try {
    const rec = await prisma.apiCache.findUnique({ where: { key } })
    if (!rec) return null
    return rec.response
  } catch (err) {
    const entry = inMemoryFallback.get(key)
    if (!entry) return null
    return entry.response
  }
}

export async function setCache(key: string, endpoint: string, params: any, response: JsonValue, ttlSeconds = 3600) {
  try {
    await prisma.apiCache.upsert({
      where: { key },
      update: { response, params: JSON.stringify(params || {}), ttl: ttlSeconds },
      create: { key, endpoint, params: JSON.stringify(params || {}), response, ttl: ttlSeconds }
    })
  } catch (err) {
    // fallback to in-memory cache for dev or when DB unreachable
    inMemoryFallback.set(key, { response, expiresAt: Date.now() + ttlSeconds * 1000 })
  }
}

export async function cacheFetch<T = any>(
  endpoint: string,
  params: any,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600,
  options?: { 
    allowStaleOnError?: boolean
    staleWhileRevalidate?: boolean // Serve stale while fetching fresh in background
  }
): Promise<T> {
  const key = computeKey(endpoint, params)
  const cached = await getCached(key)
  
  // Jika ada cache yang valid, return langsung
  if (cached) return cached as T

  // Stale-while-revalidate: serve stale cache sambil update di background
  if (options?.staleWhileRevalidate) {
    const stale = await getAnyCached(key)
    if (stale && !revalidationQueue.has(key)) {
      // Return stale data immediately
      revalidationQueue.add(key)
      
      // Revalidate in background (don't await)
      ;(async () => {
        try {
          const fresh = await fetcher()
          await setCache(key, endpoint, params, fresh, ttlSeconds)
        } catch (e) {
          console.error('Background revalidation failed for', endpoint, e)
        } finally {
          revalidationQueue.delete(key)
        }
      })()
      
      return stale as T
    }
  }

  try {
    const fresh = await fetcher()
    // store response (ensure serializable)
    try {
      await setCache(key, endpoint, params, fresh, ttlSeconds)
    } catch (e) {
      // ignore cache set errors but log
      console.error('cache set error', e)
    }

    return fresh
  } catch (err) {
    // If fetch failed and caller allows stale-on-error, return stale cache if any
    if (options?.allowStaleOnError !== false) {
      const stale = await getAnyCached(key)
      if (stale) {
        console.warn('cacheFetch: returning stale cache due to fetch error', endpoint, (err as any)?.message || String(err))
        return stale as T
      }
    }

    // Re-throw so callers can handle if they prefer
    throw err
  }
}

// Warm up cache dengan data yang sering diakses
export async function warmCache<T = any>(
  endpoint: string,
  params: any,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600
): Promise<void> {
  const key = computeKey(endpoint, params)
  
  try {
    // Check apakah sudah ada cache yang valid
    const existing = await getCached(key)
    if (existing) {
      // Cache masih valid, skip warming
      return
    }
    
    // Fetch dan cache data
    const data = await fetcher()
    await setCache(key, endpoint, params, data, ttlSeconds)
    console.log(`Cache warmed for ${endpoint}`)
  } catch (error) {
    console.error(`Failed to warm cache for ${endpoint}:`, error)
  }
}

// Batch warm multiple cache entries
export async function batchWarmCache(
  entries: Array<{
    endpoint: string
    params: any
    fetcher: () => Promise<any>
    ttlSeconds?: number
  }>
): Promise<void> {
  await Promise.allSettled(
    entries.map(entry => 
      warmCache(entry.endpoint, entry.params, entry.fetcher, entry.ttlSeconds || 3600)
    )
  )
}

// Clear cache untuk endpoint tertentu (useful saat update data)
export async function clearCacheByEndpoint(endpoint: string): Promise<void> {
  try {
    // Clear dari database
    await prisma.apiCache.deleteMany({
      where: { endpoint }
    })
    
    // Clear dari in-memory fallback
    for (const key of inMemoryFallback.keys()) {
      if (key.startsWith(endpoint)) {
        inMemoryFallback.delete(key)
      }
    }
    
    console.log(`Cache cleared for endpoint: ${endpoint}`)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

export { computeKey }
