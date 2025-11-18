import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Helper function to generate unique order code
async function generateOrderCode(): Promise<string> {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`

  // Find the last order of today
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderCode: {
        startsWith: `TRX-${dateStr}`
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  let sequence = 1
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderCode.split('-')[2])
    sequence = lastSequence + 1
  }

  const sequenceStr = String(sequence).padStart(5, '0')
  return `TRX-${dateStr}-${sequenceStr}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { items, shipping, addressId, notes } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang kosong" },
        { status: 400 }
      )
    }

    // Calculate subtotal (product prices only)
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )

    // Get shipping cost (default to 0 if not provided)
    const shippingCost = shipping.shippingCost || 0

    // Calculate total (subtotal + shipping)
    const total = subtotal + shippingCost

    // Generate unique order code
    const orderCode = await generateOrderCode()

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderCode,
        addressId: addressId || null,
        subtotal,
        shippingCost,
        total,
        status: "PENDING",
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingPhone: shipping.phone || null,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingZip: shipping.zip,
        shippingCountry: shipping.country,
        shippingProvince: shipping.province || null,
        courier: shipping.courier || null,
        courierService: shipping.service || null,
        paymentMethod: shipping.paymentMethod || "bank_transfer",
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productVariantId: item.productVariantId || null,
            variantName: item.variant || null, // Store variant name for historical record
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update variant stock for each item
    for (const item of items) {
      // If item has productVariantId, update that variant's stock
      if (item.productVariantId) {
        await prisma.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat pesanan" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data pesanan" },
      { status: 500 }
    )
  }
}
