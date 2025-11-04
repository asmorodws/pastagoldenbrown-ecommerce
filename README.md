# E-Commerce Website dengan Next.js

Website e-commerce lengkap dengan fitur authentication, checkout, dan admin dashboard.

## Fitur

### User Features
- ✅ Login & Register dengan verifikasi email
- ✅ Browse produk berdasarkan kategori
- ✅ Detail produk dengan gambar dan deskripsi
- ✅ Keranjang belanja (shopping cart)
- ✅ Checkout & pembayaran
- ✅ Riwayat pesanan
- ✅ Profile management

### Admin Features
- ✅ Dashboard dengan statistik
- ✅ Kelola produk (CRUD)
- ✅ Kelola kategori
- ✅ Kelola pesanan & update status
- ✅ Lihat semua pengguna

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Email**: Nodemailer

## Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Konfigurasi Database

Edit file `.env` dan sesuaikan dengan konfigurasi MySQL Anda:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

Contoh:
```env
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"
```

### 3. Setup Email (Optional)

Untuk verifikasi email, edit `.env`:

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

**Cara mendapatkan Gmail App Password:**
1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → App passwords
3. Generate password untuk "Mail"

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Masukkan hasilnya ke `.env`:
```env
NEXTAUTH_SECRET="hasil-dari-command-di-atas"
```

### 5. Migrate Database

```bash
npx prisma migrate dev --name init
```

Ini akan membuat database dan tabel-tabel yang diperlukan.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder

```
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout page
│   ├── orders/             # Order history
│   ├── products/           # Product pages
│   └── page.tsx            # Landing page
├── components/             # Reusable components
├── lib/                    # Utilities
├── prisma/                 # Prisma schema & migrations
├── store/                  # Zustand stores
└── types/                  # TypeScript types
```

## API Endpoints

### Public
- `GET /api/products` - List all products
- `GET /api/products/[slug]` - Get product by slug

### Authenticated
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Admin Only
- `GET /api/admin/products` - List all products (admin)
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/[id]` - Update order status

## Troubleshooting

### Error: P1001 Can't reach database server
- Pastikan MySQL server running
- Check connection string di `.env`

### Error: Module not found
```bash
npm install --legacy-peer-deps
```

### Email tidak terkirim
- Pastikan EMAIL_* environment variables sudah benar
- Gunakan Gmail App Password, bukan password biasa
- Check spam folder

## License

MIT
