import { NextResponse } from "next/server"
import { getCities } from "@/lib/rajaongkir"

// GET /api/rajaongkir/cities?province=123
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get("province")

    const cities = await getCities(provinceId || undefined)
    return NextResponse.json(cities)
  } catch (error: any) {
    console.error('Error in cities route:', error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch cities" },
      { status: 500 }
    )
  }
}