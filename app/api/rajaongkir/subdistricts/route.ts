import { NextResponse } from "next/server"
import { getSubdistricts } from "@/lib/rajaongkir"

// GET /api/rajaongkir/subdistricts?district=1362
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const districtId = searchParams.get("district")

    const subdistricts = await getSubdistricts(districtId || undefined)
    return NextResponse.json(subdistricts)
  } catch (error: any) {
    console.error('Error in subdistricts route:', error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch subdistricts" },
      { status: 500 }
    )
  }
}
