import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET all addresses for current user
export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new address
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { label, recipientName, phone, address, city, province, zipCode, country, isDefault, cityId, provinceId } = body

    // Use transaction for atomic operations
    const newAddress = await prisma.$transaction(async (tx) => {
      // If this address is set as default, unset all other default addresses
      if (isDefault) {
        await tx.address.updateMany({
          where: {
            userId: session.user.id,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        })
      }

      // Create new address
      return await tx.address.create({
        data: {
          userId: session.user.id,
          label,
          recipientName,
          phone,
          address,
          city,
          province,
          zipCode,
          country: country || "Indonesia",
          isDefault: isDefault || false,
          cityId: cityId || null,
          provinceId: provinceId || null,
        },
      })
    })

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
