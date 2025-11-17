import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET single address
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error fetching address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update address
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 })
    }

    // Use transaction for atomic operations
    const address = await prisma.$transaction(async (tx) => {
      // If setting as default, unset others in single operation
      if (body.isDefault && !existingAddress.isDefault) {
        await tx.address.updateMany({
          where: {
            userId: session.user.id,
            isDefault: true,
            NOT: { id }, // Exclude current address
          },
          data: {
            isDefault: false,
          },
        })
      }

      // Update the address
      return await tx.address.update({
        where: { id },
        data: {
          label: body.label,
          recipientName: body.recipientName,
          phone: body.phone,
          address: body.address,
          city: body.city,
          province: body.province,
          zipCode: body.zipCode,
          country: body.country || "Indonesia",
          isDefault: body.isDefault,
          cityId: body.cityId,
          provinceId: body.provinceId,
        },
      })
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json(
      { message: "Failed to update address" },
      { status: 500 }
    )
  }
}

// DELETE address
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    await prisma.address.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
