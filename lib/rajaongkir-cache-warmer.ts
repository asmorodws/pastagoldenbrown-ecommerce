/**
 * RajaOngkir Cache Warmer
 * 
 * Utility untuk pre-warming cache dengan data yang sering diakses
 * Jalankan script ini secara periodik (misal via cron job) untuk:
 * - Mengurangi hit ke RajaOngkir API saat user mengakses
 * - Memastikan data selalu tersedia dan fresh
 * - Menghemat kuota API
 */

import { warmCache, batchWarmCache } from './cache'
import { 
  getProvinces, 
  getCities, 
  getDistricts,
  searchDomesticDestination 
} from './rajaongkir'

/**
 * Warm cache untuk semua provinsi
 */
export async function warmProvinces() {
  console.log('Warming cache: Provinces...')
  try {
    await getProvinces()
    console.log('✓ Provinces cache warmed')
  } catch (error) {
    console.error('✗ Failed to warm provinces cache:', error)
  }
}

/**
 * Warm cache untuk kota-kota di provinsi tertentu
 */
export async function warmCitiesForProvinces(provinceIds: number[]) {
  console.log(`Warming cache: Cities for ${provinceIds.length} provinces...`)
  
  const entries = provinceIds.map(id => ({
    endpoint: `/destination/city/${id}`,
    params: { provinceId: id },
    fetcher: () => getCities(id),
    ttlSeconds: 60 * 60 * 24 * 30 // 30 hari
  }))
  
  await batchWarmCache(entries)
  console.log('✓ Cities cache warmed')
}

/**
 * Warm cache untuk kota-kota populer (top provinces)
 */
export async function warmPopularCities() {
  // ID provinsi untuk area populer di Indonesia
  const popularProvinceIds = [
    6,  // DKI Jakarta
    9,  // Jawa Barat
    10, // Jawa Tengah
    11, // DI Yogyakarta
    12, // Jawa Timur
    1,  // Bali
    21, // Kepulauan Riau
    5,  // Banten
    23, // Sumatera Utara
    26, // Sulawesi Selatan
  ]
  
  await warmCitiesForProvinces(popularProvinceIds)
}

/**
 * Warm cache untuk pencarian kota-kota populer
 */
export async function warmPopularSearches() {
  console.log('Warming cache: Popular city searches...')
  
  const popularCities = [
    'Jakarta',
    'Surabaya',
    'Bandung',
    'Medan',
    'Semarang',
    'Makassar',
    'Palembang',
    'Tangerang',
    'Depok',
    'Bekasi',
    'Bogor',
    'Yogyakarta',
    'Malang',
    'Denpasar',
    'Batam',
  ]
  
  const entries = popularCities.map(city => ({
    endpoint: '/destination/domestic-destination',
    params: { search: city.toLowerCase(), limit: 10, offset: 0 },
    fetcher: () => searchDomesticDestination(city, 10, 0),
    ttlSeconds: 60 * 60 * 24 * 7 // 7 hari
  }))
  
  await batchWarmCache(entries)
  console.log('✓ Popular searches cache warmed')
}

/**
 * Warm all essential cache data
 * Fungsi utama untuk dipanggil saat aplikasi start atau via cron
 */
export async function warmEssentialCache() {
  console.log('=== Starting RajaOngkir Cache Warming ===')
  const startTime = Date.now()
  
  try {
    // 1. Warm provinces (data paling basic)
    await warmProvinces()
    
    // 2. Warm cities untuk provinsi populer
    await warmPopularCities()
    
    // 3. Warm popular city searches
    await warmPopularSearches()
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`=== Cache warming completed in ${duration}s ===`)
  } catch (error) {
    console.error('Error during cache warming:', error)
  }
}

/**
 * Warm cache untuk origin setting (kota asal pengiriman)
 * Biasanya ini fixed ke satu kota, jadi kita warm semua data terkait
 */
export async function warmOriginCache(originCityId?: number) {
  if (!originCityId) {
    console.log('No origin city ID provided, skipping origin cache warming')
    return
  }
  
  console.log(`Warming cache for origin city ID: ${originCityId}`)
  
  try {
    // Warm districts untuk origin city
    await getDistricts(originCityId)
    console.log('✓ Origin districts cache warmed')
  } catch (error) {
    console.error('✗ Failed to warm origin cache:', error)
  }
}

// Untuk menjalankan via script CLI
if (require.main === module) {
  warmEssentialCache().then(() => {
    console.log('Cache warming script completed')
    process.exit(0)
  }).catch(error => {
    console.error('Cache warming script failed:', error)
    process.exit(1)
  })
}
