#  CARA SETUP E-COMMERCE (5 MENIT!)

##  OPSI 1: AUTO SETUP (RECOMMENDED)

Jalankan script otomatis yang sudah saya buatkan:

```bash
./setup.sh
```

Script ini akan otomatis:
1.  Check MySQL installation
2.  Membuat database `ecommerce_db`
3.  Generate `.env` dengan secret yang aman
4.  Generate Prisma Client
5.  Migrate database (buat tabel)
6.  Seed database dengan data sample

**Anda hanya perlu:**
- Masukkan password MySQL root
- Konfirmasi untuk seed data (Y/n)

Selesai! Langsung bisa jalankan:
```bash
npm run dev
```

---

##  OPSI 2: MANUAL SETUP

Jika ingin setup manual, ikuti langkah berikut:

### STEP 1: Setup MySQL Database

```bash
# Login ke MySQL
mysql -u root -p

# Di MySQL console:
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### STEP 2: Konfigurasi .env

Edit file `.env`:

```env
# Ganti 'password' dengan password MySQL Anda
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"

# Generate secret dengan: openssl rand -base64 32
NEXTAUTH_SECRET="hasil-dari-openssl-rand-base64-32"

NEXTAUTH_URL="http://localhost:3000"

# Email (Optional - bisa skip dulu)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### STEP 3: Generate Prisma Client

```bash
npx prisma generate
```

### STEP 4: Run Database Migrations

```bash
npx prisma migrate dev --name init
```

Ini akan membuat semua tabel di database.

### STEP 5: Seed Database (Optional)

```bash
npm run prisma:seed
```

Ini akan membuat:
- Admin user: `admin@example.com` / `admin123`
- 3 Kategori produk
- 8 Produk sample

---

##  VERIFIKASI SETUP

Check apakah semua sudah OK:

```bash
# Check database
npx prisma studio
# Ini akan membuka GUI untuk lihat database

# Check build
npm run build

# Jika build sukses, berarti setup berhasil!
```

---

##  JALANKAN PROJECT

```bash
npm run dev
```

Buka browser: **http://localhost:3000**

---

## 🔑 DEFAULT ACCOUNTS

Setelah seed database:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`
- Dashboard: http://localhost:3000/admin

**User:**
- Daftar baru di: http://localhost:3000/auth/register

---

##  USEFUL COMMANDS

```bash
# Development
npm run dev                    # Run dev server (port 3000)

# Prisma
npx prisma studio             # Database GUI browser
npx prisma migrate dev        # Create new migration
npx prisma migrate reset      # Reset database (hapus semua data!)
npm run prisma:seed           # Seed data sample
npx prisma generate           # Generate Prisma Client

# Build
npm run build                 # Build production
npm start                     # Run production build
```

---

## 🐛 TROUBLESHOOTING

### Error: Can't connect to MySQL
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL jika tidak running
sudo systemctl start mysql

# Atau di Mac:
brew services start mysql
```

### Error: Access denied for user 'root'
Pastikan password di `.env` benar:
```env
DATABASE_URL="mysql://root:PASSWORD_YANG_BENAR@localhost:3306/ecommerce_db"
```

### Error: Database 'ecommerce_db' doesn't exist
```bash
mysql -u root -p
CREATE DATABASE ecommerce_db;
exit;
```

### Error: Prisma Client did not initialize
```bash
npx prisma generate
```

### Error: Migration failed
```bash
# Reset dan migrate ulang
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

---

##  FILE PENTING

- `.env` - Environment variables (DATABASE_URL, secrets, dll)
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Data seeder
- `setup.sh` - Auto setup script

---

##  NEXT STEPS

Setelah setup berhasil:

1. **Login sebagai Admin**
   - Buka http://localhost:3000/auth/login
   - Login dengan admin@example.com / admin123
   - Coba tambah produk baru

2. **Test User Flow**
   - Register akun baru
   - Browse products
   - Add to cart
   - Checkout
   - Check order history

3. **Explore Admin Dashboard**
   - http://localhost:3000/admin
   - Manage products
   - Manage orders
   - Update order status

4. **Customize**
   - Ganti nama toko di components/Header.tsx
   - Tambah produk & kategori
   - Upload gambar produk
   - Setup email verification

---

##  SELESAI!

Jika ada pertanyaan atau error, check:
- `SETUP.md` - Detailed troubleshooting
- `FEATURES.md` - Complete feature list
- `README.md` - Full documentation

**Happy coding! **
