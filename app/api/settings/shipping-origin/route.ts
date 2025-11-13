import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Public GET - Get current shipping origin (for frontend use)
export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "shipping_origin" }
    })

    if (!setting) {
      // Return default
      return NextResponse.json({
        cityId: "152", // Default Jakarta Timur
        cityName: "Jakarta Timur, DKI Jakarta",
      })
    }

    const data = JSON.parse(setting.value)
    
    return NextResponse.json({
      cityId: data.cityId,
      subdistrictId: data.subdistrictId || "",
      cityName: data.cityName || "",
    })
  } catch (error: any) {
    console.error("Error getting shipping origin:", error)
    // Return default on error
    return NextResponse.json({
      cityId: "152",
      cityName: "Jakarta Timur, DKI Jakarta",
    })
  }
}
