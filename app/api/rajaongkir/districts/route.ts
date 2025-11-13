import { NextResponse } from "next/server"
import { getDistricts } from "@/lib/rajaongkir"

// GET /api/rajaongkir/districts?city=1360
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get("city")

    const districts = await getDistricts(cityId || undefined)
    return NextResponse.json(districts)
  } catch (error: any) {
    console.error('Error in districts route:', error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch districts" },
      { status: 500 }
    )
  }
}
