// RajaOngkir API utilities - V2 (New Platform)
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || ''
const RAJAONGKIR_BASE_URL = process.env.RAJAONGKIR_BASE_URL || 'https://rajaongkir.komerce.id/api/v1'

interface RajaOngkirDestination {
  id: string
  label?: string
  name?: string
  province_name?: string
  province_id?: string
  city_name?: string
  city_id?: string
  district_name?: string
  district_id?: string
  subdistrict_name?: string
  subdistrict_id?: string
  zip_code?: string
  // Legacy fields
  province?: string
  city?: string
  district?: string
  subdistrict?: string
  postal_code?: string
}

interface RajaOngkirProvince {
  id: number
  name: string
  // Legacy
  province_id?: string
  province?: string
}

interface RajaOngkirCity {
  id: number
  name: string
  zip_code: string
  // Legacy
  city_id?: string
  province_id?: string
  province?: string
  type?: string
  city_name?: string
  postal_code?: string
}

interface RajaOngkirDistrict {
  id: number
  name: string
  zip_code: string
}

interface RajaOngkirSubdistrict {
  id: number
  name: string
  zip_code: string
}

interface RajaOngkirCost {
  service: string
  description: string
  cost: Array<{
    value: number
    etd: string
    note: string
  }>
}

interface RajaOngkirCourier {
  code: string
  name: string
  costs: RajaOngkirCost[]
}

// V2 API: Get Provinces (cached)
import { cacheFetch, computeKey, getAnyCached, warmCache, batchWarmCache } from './cache'

export async function getProvinces(): Promise<RajaOngkirProvince[]> {
  const endpoint = '/destination/province'
  return cacheFetch(endpoint, {}, async () => {
    try {
      if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
        console.error('RajaOngkir API key not configured')
        return []
      }

      const response = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'key': RAJAONGKIR_API_KEY,
          'Authorization': `Bearer ${RAJAONGKIR_API_KEY}`,
        },
      })

      if (!response.ok) {
        console.error('RajaOngkir API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      
      if (data && data.meta && data.meta.status === 'success' && Array.isArray(data.data)) {
        return data.data
      }
      
      console.error('Invalid RajaOngkir v2 provinces response:', data)
      return []
    } catch (error) {
      console.error('Error fetching provinces:', error)
      return []
    }
  }, 60 * 60 * 24 * 30, { allowStaleOnError: true }) // cache 30 hari, gunakan stale cache jika error
}

// V2 API: Get Cities by Province ID
export async function getCities(provinceId?: string | number): Promise<RajaOngkirCity[]> {
  if (!provinceId) return []

  const endpoint = `/destination/city/${provinceId}`
  return cacheFetch(endpoint, { provinceId }, async () => {
    try {
      if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
        console.error('RajaOngkir API key not configured')
        return []
      }

      const response = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'key': RAJAONGKIR_API_KEY,
          'Authorization': `Bearer ${RAJAONGKIR_API_KEY}`,
        },
      })

      if (!response.ok) {
        console.error('RajaOngkir API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      
      if (data && data.meta && data.meta.status === 'success' && Array.isArray(data.data)) {
        return data.data
      }
      
      console.error('Invalid RajaOngkir v2 cities response:', data)
      return []
    } catch (error) {
      console.error('Error fetching cities:', error)
      return []
    }
  }, 60 * 60 * 24 * 30, { allowStaleOnError: true }) // cache 30 hari, gunakan stale cache jika error
}

// V2 API: Get Districts by City ID
export async function getDistricts(cityId?: string | number): Promise<RajaOngkirDistrict[]> {
  if (!cityId) return []

  const endpoint = `/destination/district/${cityId}`
  return cacheFetch(endpoint, { cityId }, async () => {
    try {
      if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
        console.error('RajaOngkir API key not configured')
        return []
      }

      const response = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'key': RAJAONGKIR_API_KEY,
          'Authorization': `Bearer ${RAJAONGKIR_API_KEY}`,
        },
      })

      if (!response.ok) {
        console.error('RajaOngkir API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      
      if (data && data.meta && data.meta.status === 'success' && Array.isArray(data.data)) {
        return data.data
      }
      
      console.error('Invalid RajaOngkir v2 districts response:', data)
      return []
    } catch (error) {
      console.error('Error fetching districts:', error)
      return []
    }
  }, 60 * 60 * 24 * 30, { allowStaleOnError: true }) // cache 30 hari, gunakan stale cache jika error
}

// V2 API: Get Subdistricts by District ID
export async function getSubdistricts(districtId?: string | number): Promise<RajaOngkirSubdistrict[]> {
  if (!districtId) return []

  const endpoint = `/destination/sub-district/${districtId}`
  return cacheFetch(endpoint, { districtId }, async () => {
    try {
      if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
        console.error('RajaOngkir API key not configured')
        return []
      }

      const response = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'key': RAJAONGKIR_API_KEY,
          'Authorization': `Bearer ${RAJAONGKIR_API_KEY}`,
        },
      })

      if (!response.ok) {
        console.error('RajaOngkir API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      
      if (data && data.meta && data.meta.status === 'success' && Array.isArray(data.data)) {
        return data.data
      }
      
      console.error('Invalid RajaOngkir v2 subdistricts response:', data)
      return []
    } catch (error) {
      console.error('Error fetching subdistricts:', error)
      return []
    }
  }, 60 * 60 * 24 * 30, { allowStaleOnError: true }) // cache 30 hari, gunakan stale cache jika error
}

// V2 API: Search Domestic Destination
export async function searchDomesticDestination(
  search: string,
  limit: number = 10,
  offset: number = 0
): Promise<RajaOngkirDestination[]> {
  const endpoint = '/destination/domestic-destination'

  // Normalize search to reduce cache fragmentation
  const normalized = (search || '').trim().toLowerCase()
  if (!normalized) return []

  // Attempt prefix reuse: check cached results for shorter prefixes and filter locally
  // This helps reduce external calls while the user types (autocomplete)
  // We'll try prefixes down to length 3
  try {
    for (let min = Math.max(3, Math.min(normalized.length - 1, normalized.length)); min >= 3; min--) {
      const prefix = normalized.slice(0, min)
      const prefixKey = computeKey(endpoint, { search: prefix, limit, offset })
      const cachedPrefix = await getAnyCached(prefixKey)
      if (Array.isArray(cachedPrefix) && cachedPrefix.length > 0) {
        // Filter cachedPrefix locally for items that include the full normalized query
        const filtered = (cachedPrefix as any[]).filter((item: any) => {
          const name = (item.name || item.label || item.city_name || '').toString().toLowerCase()
          return name.includes(normalized)
        })
        if (filtered.length > 0) {
          return filtered.slice(0, limit)
        }
      }
    }
  } catch (e) {
    // ignore prefix-caching errors and proceed to fetch
    console.warn('prefix cache lookup failed', e)
  }

  // Fallback to normal cached fetch with normalized query
  return cacheFetch(endpoint, { search: normalized, limit, offset }, async () => {
    try {
      if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
        console.error('RajaOngkir API key not configured')
        return []
      }

      const url = new URL(`${RAJAONGKIR_BASE_URL}${endpoint}`)
      url.searchParams.append('search', normalized)
      url.searchParams.append('limit', limit.toString())
      url.searchParams.append('offset', offset.toString())

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'key': RAJAONGKIR_API_KEY,
          'Authorization': `Bearer ${RAJAONGKIR_API_KEY}`,
        },
      })

      if (!response.ok) {
        console.error('RajaOngkir API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      
      // Check response structure for v2 API
      if (data && data.meta && data.meta.status === 'success' && Array.isArray(data.data)) {
        // Normalize response to include both old and new field names
        // Note: API returns subdistrict-level ID in 'id', not city_id
        // We need to derive city_id from city_name for proper shipping calculation
        return data.data.map((item: any) => ({
          id: item.id?.toString() || '', // This is subdistrict ID
          label: item.label || '',
          name: item.label || item.name || '',
          province_name: item.province_name || '',
          province_id: item.province_id?.toString() || '',
          city_name: item.city_name || '',
          city_id: item.city_id?.toString() || '', // Usually empty from API, needs to be derived
          district_name: item.district_name || '',
          district_id: item.district_id?.toString() || '',
          subdistrict_name: item.subdistrict_name || '',
          subdistrict_id: item.id?.toString() || '', // The full ID is subdistrict level
          zip_code: item.zip_code || '',
          // Legacy compatibility
          province: item.province_name || item.province || '',
          city: item.city_name || item.city || '',
          district: item.district_name || item.district || '',
          subdistrict: item.subdistrict_name || item.subdistrict || '',
          postal_code: item.zip_code || item.postal_code || '',
        }))
      }
      
      console.error('Invalid RajaOngkir v2 response:', data)
      return []
    } catch (error) {
      console.error('Error searching domestic destination:', error)
      return []
    }
  }, 60 * 60 * 24 * 7, { allowStaleOnError: true }) // cache 7 hari untuk search results
}

export async function getShippingCost(params: {
  origin: string // destination ID dari Search API atau district ID
  destination: string // destination ID dari Search API atau district ID
  weight: number // berat dalam gram
  courier: string // jne:sicepat:tiki:pos (colon separated)
  // optional granularity
  subdistrict_id?: string
  zip_code?: string
  // price: 'lowest' | 'highest' (optional)
  price?: 'lowest' | 'highest'
  // use district endpoint for more accurate pricing
  useDistrict?: boolean
}): Promise<RajaOngkirCourier[]> {
  // Shipping cost responses may change quickly; default to short TTL but allow callers to pass longer TTL via params
  const endpoint = params.useDistrict ? '/calculate/district/domestic-cost' : '/calculate/domestic-cost'

  const payloadParams = {
    origin: params.origin,
    destination: params.destination,
    weight: params.weight,
    courier: params.courier,
    price: params.price || null,
    subdistrict_id: params.subdistrict_id || null,
    zip_code: params.zip_code || null,
    useDistrict: params.useDistrict || false,
  }

  // TTL untuk shipping cost: 1 jam (cukup fresh, tapi tidak terlalu sering hit API)
  // Gunakan stale-while-revalidate agar user tidak perlu tunggu saat refresh
  const ttl = 60 * 60 // 1 jam

  return cacheFetch(endpoint, payloadParams, async () => {
    try {
      if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
        console.error('RajaOngkir API key not configured')
        return []
      }
      
      const form = new URLSearchParams()
      form.append('origin', params.origin)
      form.append('destination', params.destination)
      form.append('weight', params.weight.toString())
      form.append('courier', params.courier)
      if (params.price) form.append('price', params.price)
      if (params.subdistrict_id) form.append('subdistrict_id', params.subdistrict_id)
      if (params.zip_code) form.append('zip_code', params.zip_code)

      const response = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          // Komerce may accept either header; send both for compatibility
          'key': RAJAONGKIR_API_KEY,
          'Authorization': `Bearer ${RAJAONGKIR_API_KEY}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: form,
      })

      if (!response.ok) {
        // Try to parse body for meta info
        let errText = `${response.status} ${response.statusText}`
        try {
          const errJson = await response.json()
          if (errJson?.meta?.message) errText = `${errJson.meta.message} (${errJson.meta.code || response.status})`
        } catch (e) {
          // ignore
        }
        console.error('RajaOngkir API error:', errText)
        return []
      }

      const data = await response.json()

      // Validate v2 response: meta.status and data array
      if (!data || !data.meta || (data.meta.status !== 'success' && data.meta.status !== true)) {
        console.error('Invalid RajaOngkir v2 cost response meta:', data?.meta)
        return []
      }

      if (!Array.isArray(data.data)) {
        // No services available
        return []
      }

      // Map response to RajaOngkirCourier[] (same mapping logic as before)
      const firstItem = data.data[0]
      if (firstItem && (Array.isArray(firstItem.services) || Array.isArray(firstItem.costs) || Array.isArray(firstItem.cost))) {
        return data.data.map((c: any) => ({
          code: c.code || c.courier_code || c.courier || '',
          name: c.name || c.courier_name || '',
          costs: (c.services || c.costs || c.cost || []).map((svc: any) => ({
            service: svc.service || svc.name || svc.service_name || '',
            description: svc.description || svc.desc || '',
            cost: Array.isArray(svc.cost) ? svc.cost.map((ci: any) => ({ value: ci.value || ci.price || 0, etd: ci.etd || ci.etd_info || '', note: ci.note || '' })) : [],
          }))
        }))
      }

      const courierMap: Record<string, RajaOngkirCourier> = {}
      for (const item of data.data) {
        const code = item.code || item.courier || item.courier_code || ''
        const name = item.name || item.courier_name || ''
        const serviceName = item.service || item.service_name || item.name || ''
        const description = item.description || item.desc || ''
        const costValue = typeof item.cost === 'number' ? item.cost : (item.cost?.value || 0)
        const etd = item.etd || item.etd_info || ''

        if (!courierMap[code]) {
          courierMap[code] = { code, name, costs: [] }
        }

        courierMap[code].costs.push({
          service: serviceName,
          description,
          cost: [{ value: costValue, etd, note: '' }]
        })
      }

      return Object.values(courierMap)
    } catch (error) {
      console.error('Error fetching shipping cost:', error)
      return []
    }
  }, ttl, { 
    allowStaleOnError: true,
    staleWhileRevalidate: true // Serve cached cost sambil update di background
  })
}

// Helper: Cari destination berdasarkan nama kota/area
export async function findDestinationByName(locationName: string): Promise<RajaOngkirDestination | null> {
  try {
    const results = await searchDomesticDestination(locationName, 5, 0)
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error('Error finding destination:', error)
    return null
  }
}

// Helper: Get city_id from city name
// Search API returns subdistrict-level ID, but we need city-level ID for shipping calculation
export async function getCityIdFromName(cityName: string, provinceId?: string): Promise<string | null> {
  try {
    if (!cityName) return null
    
    // Normalize city name (remove "KOTA" prefix if exists)
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
    
    // Otherwise, search all provinces (less efficient)
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

// Available couriers for RajaOngkir V2 (based on your package)
// Note: Courier availability depends on your subscription package
export const AVAILABLE_COURIERS = [
  { code: 'jne', name: 'JNE' },
  { code: 'pos', name: 'POS Indonesia' },
  { code: 'tiki', name: 'TIKI' },
  { code: 'sicepat', name: 'SiCepat' },
  { code: 'jnt', name: 'J&T Express' },
  { code: 'ninja', name: 'Ninja Xpress' },
  { code: 'anteraja', name: 'AnterAja' },
  { code: 'lion', name: 'Lion Parcel' },
  { code: 'ide', name: 'ID Express' },
  { code: 'sap', name: 'SAP Express' },
  { code: 'rex', name: 'REX' },
  { code: 'rpx', name: 'RPX' },
  { code: 'sentral', name: 'Sentral Cargo' },
  { code: 'star', name: 'Star Cargo' },
  { code: 'wahana', name: 'Wahana' },
  { code: 'dse', name: 'DSE' },
  { code: 'ncs', name: 'NCS' },
]

// Export types for use in components
export type { 
  RajaOngkirDestination, 
  RajaOngkirCourier, 
  RajaOngkirCost,
  RajaOngkirProvince,
  RajaOngkirCity,
  RajaOngkirDistrict,
  RajaOngkirSubdistrict
}
