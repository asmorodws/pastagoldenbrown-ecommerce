# Reusable Components Documentation

## UI Components (`components/ui/`)

### Button
Komponen tombol dengan berbagai varian dan ukuran.

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- `isLoading`: boolean - menampilkan spinner loading

**Usage:**
```tsx
import Button from "@/components/ui/Button"

<Button variant="primary" size="md" onClick={handleClick}>
  Submit
</Button>

<Button variant="danger" isLoading={loading}>
  Delete
</Button>
```

---

### Input
Input field dengan label, error message, dan helper text.

**Props:**
- `label`: string - label untuk input
- `error`: string - pesan error
- `helperText`: string - teks bantuan
- Semua props HTMLInputElement

**Usage:**
```tsx
import Input from "@/components/ui/Input"

<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

---

### Card
Container dengan styling konsisten untuk konten.

**Components:**
- `Card` - komponen utama
- `CardHeader` - header card
- `CardTitle` - judul card
- `CardContent` - konten card

**Props:**
- `padding`: "none" | "sm" | "md" | "lg"
- `hover`: boolean - efek hover

**Usage:**
```tsx
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card"

<Card padding="md" hover>
  <CardHeader>
    <CardTitle>Product Details</CardTitle>
  </CardHeader>
  <CardContent>
    Content here...
  </CardContent>
</Card>
```

---

### Badge
Label kecil untuk status atau kategori.

**Props:**
- `variant`: "default" | "success" | "warning" | "danger" | "info"

**Usage:**
```tsx
import Badge from "@/components/ui/Badge"

<Badge variant="success">Active</Badge>
<Badge variant="danger">Out of Stock</Badge>
```

---

### Loading
Spinner loading dengan ukuran dan opsi fullscreen.

**Props:**
- `size`: "sm" | "md" | "lg"
- `text`: string - teks loading
- `fullScreen`: boolean - overlay penuh layar

**Usage:**
```tsx
import Loading from "@/components/ui/Loading"

<Loading size="md" text="Loading data..." />
<Loading fullScreen />
```

---

## Admin Components (`components/admin/`)

### StatsCard
Card untuk menampilkan statistik dengan icon dan trend.

**Props:**
- `title`: string - judul statistik
- `value`: string | number - nilai statistik
- `icon`: ReactNode - icon untuk card
- `trend`: { value: number, isPositive: boolean } - trend data

**Usage:**
```tsx
import StatsCard from "@/components/admin/StatsCard"
import { ShoppingCart } from "lucide-react"

<StatsCard
  title="Total Orders"
  value="1,234"
  icon={<ShoppingCart size={24} />}
  trend={{ value: 12, isPositive: true }}
/>
```

---

### DataTable
Tabel data dengan pencarian dan kolom custom.

**Props:**
- `data`: T[] - array data
- `columns`: array konfigurasi kolom
- `searchable`: boolean - enable pencarian
- `onSearch`: (query: string) => void

**Usage:**
```tsx
import DataTable from "@/components/admin/DataTable"

<DataTable
  data={products}
  columns={[
    { key: "name", label: "Name" },
    { 
      key: "price", 
      label: "Price",
      render: (item) => formatPrice(item.price)
    },
  ]}
  searchable
  onSearch={handleSearch}
/>
```

---

### Modal
Modal dialog dengan header dan footer.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: ReactNode
- `footer`: ReactNode
- `size`: "sm" | "md" | "lg" | "xl"

**Usage:**
```tsx
import Modal from "@/components/admin/Modal"
import Button from "@/components/ui/Button"

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Product"
  footer={
    <>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Save
      </Button>
    </>
  }
>
  Form content here...
</Modal>
```

---

### EmptyState
Komponen untuk menampilkan state kosong dengan action.

**Props:**
- `icon`: ReactNode
- `title`: string
- `description`: string
- `action`: ReactNode

**Usage:**
```tsx
import EmptyState from "@/components/admin/EmptyState"
import { Package } from "lucide-react"
import Button from "@/components/ui/Button"

<EmptyState
  icon={<Package size={48} />}
  title="No Products"
  description="You haven't added any products yet"
  action={
    <Button onClick={handleAdd}>
      Add Product
    </Button>
  }
/>
```

---

## Utility Functions (`lib/utils.ts`)

### cn()
Menggabungkan className dengan conflict resolution.

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class")} />
```

### formatPrice()
Format angka menjadi format Rupiah.

```tsx
import { formatPrice } from "@/lib/utils"

formatPrice(50000) // "Rp 50.000"
```

### formatDate() & formatDateTime()
Format tanggal ke format Indonesia.

```tsx
import { formatDate, formatDateTime } from "@/lib/utils"

formatDate(new Date()) // "26 Oktober 2025"
formatDateTime(new Date()) // "26 Oktober 2025, 14:30"
```

### slugify()
Membuat URL-friendly slug dari string.

```tsx
import { slugify } from "@/lib/utils"

slugify("Product Name!") // "product-name"
```

---

## Best Practices

1. **Consistency**: Gunakan komponen UI yang sama di seluruh aplikasi
2. **Composition**: Kombinasikan komponen kecil untuk membuat komponen kompleks
3. **Customization**: Gunakan `className` prop untuk custom styling
4. **TypeScript**: Semua komponen fully typed untuk autocomplete
5. **Accessibility**: Komponen sudah include basic accessibility features

## Color Scheme

Theme menggunakan slate palette untuk konsistensi:
- Primary: `slate-700` - tombol utama, aksen
- Secondary: `slate-100` - background secondary  
- Border: `slate-200` - border default
- Text: `slate-900` (heading), `slate-700` (body), `slate-500` (secondary)
- Success: `green-600`
- Danger: `red-600`
- Warning: `yellow-600`
