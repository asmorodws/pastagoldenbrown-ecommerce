import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  productId: string
  name: string
  slug?: string // Product slug for navigation
  price: number
  image: string
  quantity: number
  variant?: string // e.g., "30g", "100g", "1kg"
  variantLabel?: string // e.g., "Ukuran: 30g"
  stock?: number // Available stock for this variant
  allVariants?: string[] // All available variants for this product
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateVariant: (id: string, newVariant: string, newVariantLabel: string) => void
  removeProductAllVariants: (productId: string) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        // Find existing item with same productId AND variant
        const existingItem = items.find((i) => 
          i.productId === item.productId && i.variant === item.variant
        )

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          })
        } else {
          // Generate unique ID combining productId and variant
          const uniqueId = item.variant 
            ? `${item.productId}-${item.variant}` 
            : item.productId
          set({
            items: [...items, { ...item, id: uniqueId, quantity: item.quantity || 1 }],
          })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },

      updateVariant: (id, newVariant, newVariantLabel) => {
        const items = get().items
        const item = items.find((i) => i.id === id)
        if (!item) return

        // Check if the new variant already exists in cart
        const existingWithNewVariant = items.find((i) => 
          i.productId === item.productId && i.variant === newVariant
        )

        if (existingWithNewVariant) {
          // Merge quantities and remove old item
          set({
            items: items
              .filter((i) => i.id !== id)
              .map((i) =>
                i.id === existingWithNewVariant.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
          })
        } else {
          // Update variant and ID
          const newId = `${item.productId}-${newVariant}`
          set({
            items: items.map((i) =>
              i.id === id
                ? { ...i, id: newId, variant: newVariant, variantLabel: newVariantLabel }
                : i
            ),
          })
        }
      },

      removeProductAllVariants: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
