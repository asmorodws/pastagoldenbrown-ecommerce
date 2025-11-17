import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const where: any = {}

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ])

    // Convert Decimal to number for JSON serialization
    const serializedProducts = products.map((product: any) => ({
      ...product,
      price: parseFloat(product.price.toString()),
      discount: product.discount ? parseFloat(product.discount.toString()) : null,
      discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : null,
      weight: product.weight ? parseFloat(product.weight.toString()) : null,
      variants: product.variants.map((v: any) => ({
        ...v,
        price: v.price ? parseFloat(v.price.toString()) : null,
      })),
    }))

    return NextResponse.json({
      products: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data produk" },
      { status: 500 }
    )
  }
}
