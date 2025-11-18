# PANDUAN SETUP E-COMMERCE

## Langkah-langkah Setup

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Setup Database MySQL

Pastikan MySQL sudah terinstall dan running. Buat database baru:

```sql
CREATE DATABASE ecommerce_db;
```

### 3. Konfigurasi Environment Variables

Edit file `.env` dan sesuaikan dengan konfigurasi Anda:

```env
# Database - Ganti dengan kredensial MySQL Anda
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"

# NextAuth - Generate secret dengan: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-dengan-secret-yang-aman-minimal-32-karakter"

# Email Configuration (Optional - untuk verifikasi email)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-gmail-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

**PENTING**: 
- Ganti `root:password` dengan username dan password MySQL Anda
- Generate NEXTAUTH_SECRET dengan command: `openssl rand -base64 32`
- Untuk email, gunakan Gmail App Password (bukan password biasa)

### 4. Generate Prisma Client & Migrate Database

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migration untuk membuat tabel di database
npx prisma migrate dev --name init
```

### 5. Seed Database (Opsional - untuk data awal)

```bash
npm run prisma:seed
```

Ini akan membuat:
- Admin user: `admin@example.com` / `admin123`
- 3 Kategori produk
- 8 Produk sample

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: http://localhost:3000

## Akun Default

Setelah seeding, gunakan akun ini untuk login sebagai admin:

**Email**: admin@example.com  
**Password**: admin123

## Cara Menggunakan

### Sebagai User:
1. Daftar akun baru di `/auth/register`
2. Verifikasi email (jika email dikonfigurasi)
3. Login di `/auth/login`
4. Browse produk di `/products`
5. Tambah produk ke keranjang
6. Checkout di `/checkout`
7. Lihat pesanan di `/orders`

### Sebagai Admin:
1. Login dengan akun admin
2. Akses dashboard admin di `/admin`
3. Kelola produk di `/admin/products`
4. Kelola pesanan di `/admin/orders`
5. Update status pesanan

## Fitur-fitur Utama

 **Authentication**
- Login & Register
- Email verification
- Session management dengan NextAuth
- Role-based access (User & Admin)

 **Product Management**
- Browse produk dengan filter kategori
- Detail produk dengan gambar
- Search produk
- Admin CRUD produk

 **Shopping Cart**
- Add/remove items
- Update quantity
- Persistent cart (menggunakan Zustand)

 **Checkout & Orders**
- Form checkout dengan validasi
- Create order
- Order history
- Admin order management

 **Admin Dashboard**
- Statistik (total products, orders, users, revenue)
- Manage products (Create, Read, Update, Delete)
- Manage orders (Update status)
- View all orders & users

## Struktur Database

### User
- Login credentials
- Profile information
- Role (USER/ADMIN)
- Email verification

### Product
- Product details
- Category relation
- Stock management
- Featured flag

### Category
- Category info
- Products relation

### Order
- User relation
- Order items
- Shipping information
- Status tracking

### Cart
- User-product relation
- Quantity management

## Troubleshooting

### Database Connection Error
```
Error: P1001: Can't reach database server at localhost:3306
```
**Solusi**: 
- Pastikan MySQL server sedang running
- Check username, password, dan port di DATABASE_URL
- Pastikan database `ecommerce_db` sudah dibuat

### Migration Error
```
Error: Schema engine error
```
**Solusi**:
```bash
# Reset database (WARNING: akan menghapus semua data)
npx prisma migrate reset

# Atau drop dan create ulang database di MySQL
DROP DATABASE ecommerce_db;
CREATE DATABASE ecommerce_db;

# Lalu migrate ulang
npx prisma migrate dev --name init
```

### Module Not Found Error
**Solusi**:
```bash
npm install --legacy-peer-deps
```

### Email Tidak Terkirim
**Solusi**:
- Gunakan Gmail App Password, bukan password biasa
- Enable 2FA di Google Account
- Generate App Password di Google Account Settings
- Check spam folder

### Port 3000 Already in Use
**Solusi**:
```bash
# Jalankan di port lain
PORT=3001 npm run dev
```

## Commands Berguna

```bash
# Development
npm run dev

# Build production
npm run build
npm start

# Prisma commands
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio (database GUI)

# Database reset (hapus semua data)
npx prisma migrate reset
```

## Next Steps

1. **Tambah Gambar Produk**: Upload gambar produk ke `/public/products/`
2. **Setup Email**: Konfigurasi SMTP untuk verifikasi email
3. **Payment Gateway**: Integrasi dengan Midtrans/Xendit untuk pembayaran
4. **Image Upload**: Implementasi upload gambar untuk produk
5. **Advanced Features**: 
   - Review & Rating produk
   - Wishlist
   - Product variants (size, color)
   - Discount & Coupon system
   - Advanced search & filter

## Support

Jika ada pertanyaan atau masalah, silakan check:
- README.md untuk dokumentasi lengkap
- Prisma schema di `prisma/schema.prisma`
- API routes di `app/api/`

Happy coding! 
