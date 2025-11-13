"use client"

import { useCartStore } from "@/store/cart"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react"
import { useState, useEffect } from "react"
import CartItemCard from "@/components/cart/CartItemCard"
import OrderSummary from "@/components/cart/OrderSummary"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, removeProductAllVariants } = useCartStore()
  const [productSlugs, setProductSlugs] = useState<Record<string, string>>({})

  // Fetch slugs for products that don't have them
  useEffect(() => {
    const fetchSlugs = async () => {
      const itemsWithoutSlug = items.filter(item => !item.slug)
      if (itemsWithoutSlug.length === 0) return

      const slugMap: Record<string, string> = {}
      
      for (const item of itemsWithoutSlug) {
        try {
          const response = await fetch(`/api/products/${item.productId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.product?.slug) {
              slugMap[item.productId] = data.product.slug
            }
          }
        } catch (error) {
          console.error(`Error fetching slug for product ${item.productId}:`, error)
        }
      }

      if (Object.keys(slugMap).length > 0) {
        setProductSlugs(prev => ({ ...prev, ...slugMap }))
      }
    }

    fetchSlugs()
  }, [items])

  // Helper function to get product URL
  const getProductUrl = (item: any) => {
    const slug = item.slug || productSlugs[item.productId] || item.productId
    return `/products/${slug}`
  }

  // Group items by productId for better visual organization
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = []
    }
    acc[item.productId].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Calculate savings for bulk sizes
  const calculateSavings = (productItems: typeof items) => {
    if (productItems.length < 2) return null
    
    // Find smallest and largest size
    const sortedBySize = [...productItems].sort((a, b) => {
      const aSize = parseFloat(a.variant || '0')
      const bSize = parseFloat(b.variant || '0')
      return aSize - bSize
    })
    
    const smallest = sortedBySize[0]
    const largest = sortedBySize[sortedBySize.length - 1]
    
    if (!smallest.variant || !largest.variant) return null
    
    const smallSize = parseFloat(smallest.variant)
    const largeSize = parseFloat(largest.variant)
    
    if (smallSize === 0 || largeSize === 0) return null
    
    const pricePerGramSmall = smallest.price / smallSize
    const pricePerGramLarge = largest.price / largeSize
    
    const savingsPercent = ((pricePerGramSmall - pricePerGramLarge) / pricePerGramSmall) * 100
    
    if (savingsPercent > 5) {
      return {
        smallVariant: smallest.variant,
        largeVariant: largest.variant,
        savingsPercent: savingsPercent.toFixed(0)
      }
    }
    
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-blue-300" />
            </div>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Keranjang Belanja Kosong</h1>
            <p className="text-slate-600 text-lg mb-8">
              Belum ada produk di keranjang. Yuk mulai belanja dan temukan produk favoritmu!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Mulai Belanja
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Header - Compact */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">Keranjang Belanja</h1>
          <p className="text-sm text-slate-600">
            {items.length} item di keranjang
            {Object.keys(groupedItems).length < items.length && 
              ` dari ${Object.keys(groupedItems).length} produk`
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(groupedItems).map(([productId, productItems]) => {
              const hasMultipleVariants = productItems.length > 1
              const savings = calculateSavings(productItems)
              
              return (
                <div
                  key={productId}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Product Header - Compact */}
                  {hasMultipleVariants && (
                    <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-2 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-blue-600" />
                          <p className="text-xs font-semibold text-blue-900">
                            {productItems[0].name} - {productItems.length} varian
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus semua varian ${productItems[0].name}?`)) {
                              removeProductAllVariants(productId)
                            }
                          }}
                          className="text-[10px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus Semua
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Variant Items */}
                  <div className={hasMultipleVariants ? "divide-y divide-slate-100" : ""}>
                    {productItems.map((item: any) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        mode="cart"
                        onQuantityChange={updateQuantity}
                        onRemove={removeItem}
                        productUrl={getProductUrl(item)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary - Compact */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={getTotal()}
              itemCount={items.length}
              serviceFee={1000}
              shippingFee={0}
              showCheckoutButton={true}
              checkoutUrl="/checkout"
              showContinueShopping={true}
              continueShoppingUrl="/products"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
