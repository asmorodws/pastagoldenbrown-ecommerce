import { NextResponse } from 'next/server'
import { getProvinces, getCities, getDistricts, getSubdistricts } from '@/lib/rajaongkir'

type Body = {
  throttleMs?: number // delay between requests to avoid rate-limit
  depth?: 1 | 2 | 3 // 1: provinces->cities, 2: +districts, 3: +subdistricts
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function POST(request: Request) {
  try {
    const body: Body = (await request.json().catch(() => ({}))) || {}
    const throttleMs = typeof body.throttleMs === 'number' ? body.throttleMs : 200
    const depth = body.depth || 3

    // Basic validation
    if (throttleMs < 0 || throttleMs > 5000) return NextResponse.json({ error: 'throttleMs must be between 0 and 5000' }, { status: 400 })
    if (![1, 2, 3].includes(depth)) return NextResponse.json({ error: 'depth must be 1,2 or 3' }, { status: 400 })

    const provinces = await getProvinces()
    const summary: Record<string, number> = { provinces: provinces.length, cities: 0, districts: 0, subdistricts: 0 }

    for (const prov of provinces) {
      // getCities will itself cache via cacheFetch
      const cities = await getCities(prov.id as any)
      summary.cities += cities.length
      await wait(throttleMs)

      if (depth >= 2) {
        for (const city of cities) {
          const districts = await getDistricts((city as any).id || (city as any).city_id)
          summary.districts += districts.length
          await wait(throttleMs)

          if (depth >= 3) {
            for (const district of districts) {
              const subs = await getSubdistricts((district as any).id || (district as any).district_id)
              summary.subdistricts += subs.length
              await wait(throttleMs)
            }
          }
        }
      }
    }

    return NextResponse.json({ message: 'Preload complete', summary })
  } catch (err) {
    console.error('Preload cache error:', err)
    return NextResponse.json({ error: 'Preload failed', details: String(err) }, { status: 500 })
  }
}
