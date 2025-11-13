import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Get current shipping origin
export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get from database
    const setting = await prisma.settings.findUnique({
      where: { key: "shipping_origin" }
    })

    if (!setting) {
      // Return default
      return NextResponse.json({
        originCityId: "152", // Default Jakarta Timur
        originCityName: "Jakarta Timur, DKI Jakarta",
      })
    }

    const data = JSON.parse(setting.value)
    
    return NextResponse.json({
      originCityId: data.cityId,
      originCityName: data.cityName,
    })
  } catch (error: any) {
    console.error("Error getting shipping origin:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get shipping origin" },
      { status: 500 }
    )
  }
}

// PUT - Update shipping origin
export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { originCityId, originSubdistrictId, originCityName } = await request.json()

    if (!originCityId) {
      return NextResponse.json(
        { error: "Origin city ID is required" },
        { status: 400 }
      )
    }

    // Save to database
    const data = {
      cityId: originCityId,
      subdistrictId: originSubdistrictId || "",
      cityName: originCityName || "",
    }

    await prisma.settings.upsert({
      where: { key: "shipping_origin" },
      update: {
        value: JSON.stringify(data),
        updatedAt: new Date(),
      },
      create: {
        key: "shipping_origin",
        value: JSON.stringify(data),
      },
    })

    console.log(`Shipping origin updated to: ${originCityName} (ID: ${originCityId})`)

    return NextResponse.json({
      success: true,
      message: "Shipping origin updated successfully. Perubahan langsung aktif tanpa restart server.",
      originCityId,
      originCityName,
    })
  } catch (error: any) {
    console.error("Error updating shipping origin:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update shipping origin" },
      { status: 500 }
    )
  }
}
