import ProductCard from "@/components/ProductCard"
import { prisma } from "@/lib/prisma"
import ProductsClient from "./ProductsClient"

async function getProducts(searchParams: any) {
  try {
    const params = await searchParams
    const where: any = {}

    if (params.category) {
      where.category = {
        slug: params.category,
      }
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
      ]
    }

    if (params.minPrice || params.maxPrice) {
      where.price = {}
      if (params.minPrice) {
        where.price.gte = parseFloat(params.minPrice)
      }
      if (params.maxPrice) {
        where.price.lte = parseFloat(params.maxPrice)
      }
    }

    let orderBy: any = { createdAt: "desc" }
    
    if (params.sort === "price-asc") {
      orderBy = { price: "asc" }
    } else if (params.sort === "price-desc") {
      orderBy = { price: "desc" }
    } else if (params.sort === "name") {
      orderBy = { name: "asc" }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    })

    // Convert Decimal to number
    return products.map((product) => ({
      ...product,
      price: parseFloat(product.price.toString()),
      discount: product.discount ? parseFloat(product.discount.toString()) : undefined,
      discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : undefined,
      weight: product.weight ? parseFloat(product.weight.toString()) : null,
    }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany()
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; minPrice?: string; maxPrice?: string }>
}) {
  const params = await searchParams
  const products = await getProducts(searchParams)
  const categories = await getCategories()

  return (
    <ProductsClient 
      initialProducts={products} 
      categories={categories}
      searchParams={params}
    />
  )
}
