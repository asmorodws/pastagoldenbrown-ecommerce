"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Search, Package, Percent } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import Modal from "@/components/admin/Modal"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Badge from "@/components/ui/Badge"
import MultipleImageUpload from "@/components/admin/MultipleImageUpload"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount?: number
  discountPrice?: number
  stock: number
  image: string
  images?: string
  categoryId: string
  brand?: string
  sku?: string
  featured: boolean
  category: { name: string }
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: string
  discount: string
  stock: string
  categoryId: string
  images: string[]
  brand: string
  sku: string
  featured: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    price: "",
    discount: "0",
    stock: "",
    categoryId: "",
    images: [],
    brand: "",
    sku: "",
    featured: false,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (response.ok) setCategories(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      discount: "0",
      stock: "",
      categoryId: "",
      images: [],
      brand: "",
      sku: "",
      featured: false,
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    const parsedImages = product.images ? JSON.parse(product.images) : []
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price.toString(),
      discount: product.discount?.toString() || "0",
      stock: product.stock.toString(),
      categoryId: product.categoryId,
      images: Array.isArray(parsedImages) ? parsedImages : [product.image].filter(Boolean),
      brand: product.brand || "",
      sku: product.sku || "",
      featured: product.featured,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const price = parseFloat(formData.price)
    const discount = parseFloat(formData.discount)
    const discountPrice = discount > 0 ? price - (price * discount / 100) : price

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount),
      discountPrice,
      stock: parseInt(formData.stock),
      image: formData.images[0] || "",
      images: JSON.stringify(formData.images),
    }

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products"
      
      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingProduct ? "Produk diupdate" : "Produk ditambahkan")
        setShowModal(false)
        fetchProducts()
      } else {
        const data = await response.json()
        toast.error(data.error || "Terjadi kesalahan")
      }
    } catch (error) {
      toast.error("Gagal menyimpan produk")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Produk dihapus")
        fetchProducts()
      } else {
        toast.error("Gagal menghapus produk")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData({ ...formData, name, slug })
  }

  const calculateDiscountPrice = () => {
    const price = parseFloat(formData.price) || 0
    const discount = parseFloat(formData.discount) || 0
    return price - (price * discount / 100)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kelola Produk</h1>
          <p className="text-slate-600 mt-1">Manage produk toko Anda</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus size={20} className="mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-slate-100">
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Percent size={12} />
                    -{product.discount}%
                  </div>
                )}
                {product.featured && (
                  <Badge variant="warning" className="absolute top-2 left-2">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2">{product.category.name}</p>
                
                <div className="mb-3">
                  {product.discount && product.discount > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-slate-900">
                          Rp {product.discountPrice?.toLocaleString("id-ID")}
                        </p>
                        <Badge variant="danger" className="text-xs">
                          -{product.discount}%
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 line-through">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-slate-900">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-600">Stok:</span>
                  <span className={product.stock < 10 ? "text-red-600 font-semibold" : "text-slate-900"}>
                    {product.stock}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(product)}
                    className="flex-1"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? "Edit Produk" : "Tambah Produk"}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Simpan
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Nama Produk"
              value={formData.name}
              onChange={(e) => generateSlug(e.target.value)}
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              helperText="URL-friendly name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Input
              label="Harga Normal"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Diskon (%)"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              helperText="0 = tanpa diskon"
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Harga Setelah Diskon
              </label>
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-bold">
                Rp {calculateDiscountPrice().toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Input
              label="Stok"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500"
                />
                <span className="text-sm font-semibold text-slate-700">Produk Featured</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Gambar Produk
            </label>
            <MultipleImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              maxImages={5}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
