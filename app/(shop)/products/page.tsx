// app/products/page.tsx
import { prisma } from "@/lib/prisma"
import { Filter, PackageSearch, Search } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import Pagination from "@/components/ui/Pagination"

const ITEMS_PER_PAGE = 12

async function getProducts(searchParams: any) {
  try {
    const params = await searchParams
    const page = parseInt(params.page || "1")
    const where: any = {}

    if (params.category) {
      where.category = { slug: params.category }
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
      ]
    }

    if (params.minPrice || params.maxPrice) {
      where.price = {}
      if (params.minPrice) where.price.gte = parseFloat(params.minPrice)
      if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice)
    }

    let orderBy: any = { createdAt: "desc" }
    if (params.sort === "price-asc") orderBy = { price: "asc" }
    else if (params.sort === "price-desc") orderBy = { price: "desc" }
    else if (params.sort === "name") orderBy = { name: "asc" }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })

    const products = await prisma.product.findMany({
      where,
      include: { 
        category: true,
        variants: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })

    return {
      products: products.map((product: any) => ({
        ...product,
        price: parseFloat(product.price.toString()),
        discount: product.discount ? parseFloat(product.discount.toString()) : undefined,
        discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : undefined,
        weight: product.weight ? parseFloat(product.weight.toString()) : null,
        variants: product.variants.map((v: any) => ({
          ...v,
          price: v.price ? parseFloat(v.price.toString()) : null,
        })),
      })),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    }
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    search?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const [productsData, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ])

  const { products, totalCount, currentPage, totalPages } = productsData

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
                Katalog Produk
              </h1>
              <p className="text-slate-600 mt-2 text-sm md:text-base">
                Temukan pasta perisa dan pewarna terbaik untuk kreasi kue Anda
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <Filter size={18} className="text-blue-800" />
              <span className="text-slate-700 font-medium">
                {totalCount} produk ditemukan
              </span>
            </div>
          </div>
        </div>

        {/* Filter Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <aside className="lg:w-1/4 space-y-5">
            {/* Search Box */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search size={16} className="text-blue-800" />
                Cari Produk
              </h3>
              <form method="get" className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={params.search || ""}
                  placeholder="Cari pasta, perisa..."
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-800 hover:text-blue-900"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Kategori</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/products"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !params.category
                        ? "bg-blue-800 text-white shadow-sm"
                        : "hover:bg-slate-50 text-gray-700"
                    }`}
                  >
                    Semua Produk
                  </a>
                </li>
                {categories.map((cat: any) => (
                  <li key={cat.id}>
                    <a
                      href={`?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        params.category === cat.slug
                          ? "bg-blue-800 text-white shadow-sm"
                          : "hover:bg-slate-50 text-gray-700"
                      }`}
                    >
                      {cat.name}
                      {cat.halal && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Halal
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort Options */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Urutkan</h3>
              <ul className="space-y-2">
                {[
                  { label: "Terbaru", value: "newest" },
                  { label: "Harga Terendah", value: "price-asc" },
                  { label: "Harga Tertinggi", value: "price-desc" },
                  { label: "Nama (A-Z)", value: "name" },
                ].map((sort) => (
                  <li key={sort.value}>
                    <a
                      href={`?sort=${sort.value}${params.category ? `&category=${params.category}` : ""}`}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        params.sort === sort.value
                          ? "bg-amber-100 text-amber-800"
                          : "hover:bg-slate-50 text-gray-700"
                      }`}
                    >
                      {sort.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>


          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <PackageSearch size={64} className="mb-4 text-gray-300" />
                <p className="text-xl font-semibold text-gray-800 mb-2">Tidak ada produk ditemukan</p>
                <p className="text-sm text-gray-500 mb-6">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                <a
                  href="/products"
                  className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
                >
                  Reset Filter
                </a>
              </div>
            ) : (
              <>
                {/* Active Filters */}
                {(params.category || params.search || params.minPrice || params.maxPrice) && (
                  <div className="mb-6 flex flex-wrap items-center gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Filter aktif:</span>
                    {params.category && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {categories.find((c: any) => c.slug === params.category)?.name}
                        <a href={`?${new URLSearchParams({ ...params, category: undefined } as any).toString()}`} className="hover:text-blue-900">×</a>
                      </span>
                    )}
                    {params.search && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                        "{params.search}"
                        <a href={`?${new URLSearchParams({ ...params, search: undefined } as any).toString()}`} className="hover:text-amber-900">×</a>
                      </span>
                    )}
                    <a
                      href="/products"
                      className="ml-auto text-xs text-blue-800 hover:text-blue-900 font-medium"
                    >
                      Reset semua
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                  {products.map((product: any) => (
                    <div key={product.id} className="h-full">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        discount={product.discount}
                        discountPrice={product.discountPrice}
                        image={product.image || "/placeholder-product.jpg"}
                        slug={product.slug}
                        stock={product.variants?.[0]?.stock || 0}
                        variants={product.variants || []}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination for Desktop */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
