// RajaOngkir API utilities - V2 (New Platform)
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || ''
const RAJAONGKIR_BASE_URL = process.env.RAJAONGKIR_BASE_URL || 'https://rajaongkir.komerce.id/api/v1'

interface RajaOngkirDestination {
  id: string
  label?: string
  name?: string
  province_name?: string
  city_name?: string
  district_name?: string
  subdistrict_name?: string
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

// V2 API: Get Provinces
export async function getProvinces(): Promise<RajaOngkirProvince[]> {
  try {
    if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
      console.error('RajaOngkir API key not configured')
      return []
    }

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/destination/province`, {
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
}

// V2 API: Get Cities by Province ID
export async function getCities(provinceId?: string | number): Promise<RajaOngkirCity[]> {
  try {
    if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
      console.error('RajaOngkir API key not configured')
      return []
    }

    if (!provinceId) {
      return []
    }

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/destination/city/${provinceId}`, {
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
}

// V2 API: Get Districts by City ID
export async function getDistricts(cityId?: string | number): Promise<RajaOngkirDistrict[]> {
  try {
    if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
      console.error('RajaOngkir API key not configured')
      return []
    }

    if (!cityId) {
      return []
    }

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/destination/district/${cityId}`, {
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
}

// V2 API: Get Subdistricts by District ID
export async function getSubdistricts(districtId?: string | number): Promise<RajaOngkirSubdistrict[]> {
  try {
    if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
      console.error('RajaOngkir API key not configured')
      return []
    }

    if (!districtId) {
      return []
    }

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/destination/sub-district/${districtId}`, {
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
}

// V2 API: Search Domestic Destination
export async function searchDomesticDestination(
  search: string,
  limit: number = 10,
  offset: number = 0
): Promise<RajaOngkirDestination[]> {
  try {
    if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === 'your_rajaongkir_api_key_here') {
      console.error('RajaOngkir API key not configured')
      return []
    }

    const url = new URL(`${RAJAONGKIR_BASE_URL}/destination/domestic-destination`)
    url.searchParams.append('search', search)
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
      return data.data.map((item: any) => ({
        id: item.id?.toString() || '',
        label: item.label || '',
        name: item.label || item.name || '',
        province_name: item.province_name || '',
        province_id: item.province_id?.toString() || '',
        city_name: item.city_name || '',
        city_id: item.city_id?.toString() || '',
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

    // Choose endpoint: district/domestic-cost for more accuracy if useDistrict is true
    const endpoint = params.useDistrict 
      ? '/calculate/district/domestic-cost'
      : '/calculate/domestic-cost'

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

    // Map response to RajaOngkirCourier[]
    // Handle two possible shapes:
    // 1) Grouped by courier: [{ code, name, services: [...] }, ...]
    // 2) Flat list per service: [{ name, code, service, description, cost, etd }, ...]

    // If items look like grouped couriers (each item has a `services` or `cost` array), normalize directly
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

    // Otherwise treat as flat list and group by courier code
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

      // push service with cost array (frontend expects svc.cost[0].value)
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
