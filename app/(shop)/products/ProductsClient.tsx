"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, SlidersHorizontal, Grid3x3, LayoutGrid, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "@/components/ProductCard"

interface Product {
  id: string
  name: string
  price: number
  discount?: number
  discountPrice?: number
  image: string | null
  slug: string
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductsClientProps {
  initialProducts: any[]
  categories: Category[]
  searchParams: { category?: string; search?: string; sort?: string; minPrice?: string; maxPrice?: string }
}

export default function ProductsClient({ initialProducts, categories, searchParams }: ProductsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "")
  const [sortBy, setSortBy] = useState(searchParams.sort || "newest")
  const [priceRange, setPriceRange] = useState({ min: searchParams.minPrice || "", max: searchParams.maxPrice || "" })
  const [gridView, setGridView] = useState<3 | 4>(3)
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const products = initialProducts as Product[]

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = products.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const priceRanges = [
    { label: "Semua Harga", min: "", max: "" },
    { label: "Di bawah Rp 100.000", min: "", max: "100000" },
    { label: "Rp 100.000 - Rp 500.000", min: "100000", max: "500000" },
    { label: "Rp 500.000 - Rp 1.000.000", min: "500000", max: "1000000" },
    { label: "Di atas Rp 1.000.000", min: "1000000", max: "" },
  ]

  const handleSearch = () => {
    setCurrentPage(1) // Reset to first page on search
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedCategory) params.set("category", selectedCategory)
    if (sortBy !== "newest") params.set("sort", sortBy)
    if (priceRange.min) params.set("minPrice", priceRange.min)
    if (priceRange.max) params.set("maxPrice", priceRange.max)
    
    router.push(`/products?${params.toString()}`)
  }

  const handlePriceRangeChange = (min: string, max: string) => {
    setCurrentPage(1) // Reset to first page on filter change
    setPriceRange({ min, max })
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedCategory) params.set("category", selectedCategory)
    if (sortBy !== "newest") params.set("sort", sortBy)
    if (min) params.set("minPrice", min)
    if (max) params.set("maxPrice", max)
    
    router.push(`/products?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    setCurrentPage(1) // Reset to first page on sort change
    setSortBy(value)
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedCategory) params.set("category", selectedCategory)
    if (value !== "newest") params.set("sort", value)
    if (priceRange.min) params.set("minPrice", priceRange.min)
    if (priceRange.max) params.set("maxPrice", priceRange.max)
    
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#05347e] mb-2">Jelajahi Produk</h1>
          <p className="text-gray-600">Temukan produk berkualitas sesuai kebutuhan Anda</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          <div className="grid lg:grid-cols-12 gap-4">
            {/* Search */}
            <div className="lg:col-span-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05347e] focus:border-transparent text-gray-800"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:col-span-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05347e] appearance-none text-gray-800 font-medium cursor-pointer"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                  <option value="name">Nama A-Z</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* View Toggle */}
            <div className="lg:col-span-2 flex gap-2">
              <button
                onClick={() => setGridView(3)}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  gridView === 3
                    ? "bg-[#05347e] border-[#05347e] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#05347e]"
                }`}
              >
                <Grid3x3 className="mx-auto" size={20} />
              </button>
              <button
                onClick={() => setGridView(4)}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  gridView === 4
                    ? "bg-[#05347e] border-[#05347e] text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#05347e]"
                }`}
              >
                <LayoutGrid className="mx-auto" size={20} />
              </button>
            </div>

            {/* Filter Toggle */}
            <div className="lg:col-span-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-4 py-3 bg-[#05347e] text-white rounded-xl hover:bg-[#032252] transition-all font-medium flex items-center justify-center gap-2"
              >
                <SlidersHorizontal size={20} />
                {showFilters ? "Sembunyikan" : "Tampilkan"} Filter
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:col-span-3 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="font-bold text-lg text-[#05347e] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#c49c0f] to-[#f0c514] rounded-full"></div>
                  Kategori
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/products"
                      className={`block py-2.5 px-4 rounded-lg transition-all font-medium ${
                        !selectedCategory
                          ? "bg-[#05347e] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Semua Produk
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/products?category=${category.slug}`}
                        className={`block py-2.5 px-4 rounded-lg transition-all font-medium ${
                          selectedCategory === category.slug
                            ? "bg-[#05347e] text-white"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="font-bold text-lg text-[#05347e] mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#c49c0f] to-[#f0c514] rounded-full"></div>
                  Rentang Harga
                </h3>
                <ul className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handlePriceRangeChange(range.min, range.max)}
                        className={`w-full text-left py-2.5 px-4 rounded-lg transition-all font-medium ${
                          priceRange.min === range.min && priceRange.max === range.max
                            ? "bg-[#05347e] text-white"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-[#05347e] to-[#032252] rounded-2xl shadow-md p-6 text-white">
                <h3 className="font-bold text-lg mb-4 text-[#c49c0f]">Statistik</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Produk</span>
                    <span className="font-bold text-xl text-[#c49c0f]">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Kategori</span>
                    <span className="font-bold text-xl text-[#c49c0f]">{categories.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={showFilters ? "lg:col-span-9" : "lg:col-span-12"}>
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Menampilkan <span className="font-bold text-[#05347e]">{startIndex + 1}-{Math.min(endIndex, products.length)}</span> dari <span className="font-bold text-[#05347e]">{products.length}</span> produk
                {selectedCategory && (
                  <span className="ml-2 px-3 py-1 bg-[#05347e] text-white rounded-full text-sm font-medium">
                    {categories.find(c => c.slug === selectedCategory)?.name}
                  </span>
                )}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-gray-400" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#05347e] mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-gray-600 mb-6">Coba kata kunci atau filter lain</p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-[#05347e] text-white rounded-xl hover:bg-[#032252] transition-all font-medium"
                >
                  Reset Filter
                </Link>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 md:grid-cols-3 ${gridView === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 lg:gap-8`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={parseFloat(product.price.toString())}
                      discount={product.discount ? parseFloat(product.discount.toString()) : undefined}
                      discountPrice={product.discountPrice ? parseFloat(product.discountPrice.toString()) : undefined}
                      image={product.image || ""}
                      slug={product.slug}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-2 border-[#05347e] text-[#05347e] hover:bg-[#05347e] hover:text-white'
                      }`}
                    >
                      <ChevronLeft size={18} />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                currentPage === page
                                  ? 'bg-[#05347e] text-white shadow-lg'
                                  : 'bg-white border-2 border-gray-200 text-[#05347e] hover:border-[#05347e] hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                        }
                        return null
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-2 border-[#05347e] text-[#05347e] hover:bg-[#05347e] hover:text-white'
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
