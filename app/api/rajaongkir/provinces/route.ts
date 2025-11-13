import { NextResponse } from "next/server"
import { getProvinces } from "@/lib/rajaongkir"

// GET /api/rajaongkir/provinces
export async function GET() {
  try {
    const provinces = await getProvinces()
    return NextResponse.json(provinces)
  } catch (error: any) {
    console.error('Error in provinces route:', error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch provinces" },
      { status: 500 }
    )
  }
}
