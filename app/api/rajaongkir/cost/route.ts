import { NextResponse } from "next/server"
import { getShippingCost } from "@/lib/rajaongkir"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { origin, destination, weight, courier, price, subdistrict_id, zip_code, useDistrict } = body

    if (!origin || !destination || !weight || !courier) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const costs = await getShippingCost({
      origin,
      destination,
      weight,
      courier,
      price,
      subdistrict_id,
      zip_code,
      useDistrict,
    })

    return NextResponse.json(costs)
  } catch (error: any) {
    console.error('Error in cost route:', error)
    return NextResponse.json(
      { error: error.message || "Failed to calculate shipping cost" },
      { status: 500 }
    )
  }
}
