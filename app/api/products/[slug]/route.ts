import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        variants: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      )
    }

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        variants: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      take: 4,
    })

    // Convert Decimal to number for JSON serialization
    const serializedProduct = {
      ...product,
      price: parseFloat(product.price.toString()),
      discount: product.discount ? parseFloat(product.discount.toString()) : null,
      discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : null,
      weight: product.weight ? parseFloat(product.weight.toString()) : null,
      variants: product.variants.map(v => ({
        ...v,
        price: v.price ? parseFloat(v.price.toString()) : null,
      })),
    }

    const serializedRelatedProducts = relatedProducts.map(p => ({
      ...p,
      price: parseFloat(p.price.toString()),
      discount: p.discount ? parseFloat(p.discount.toString()) : null,
      discountPrice: p.discountPrice ? parseFloat(p.discountPrice.toString()) : null,
      weight: p.weight ? parseFloat(p.weight.toString()) : null,
      variants: p.variants.map(v => ({
        ...v,
        price: v.price ? parseFloat(v.price.toString()) : null,
      })),
    }))

    return NextResponse.json({
      product: serializedProduct,
      relatedProducts: serializedRelatedProducts,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data produk" },
      { status: 500 }
    )
  }
}
