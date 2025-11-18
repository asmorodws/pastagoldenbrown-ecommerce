#  QUICK START GUIDE

## Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm atau yarn

## Installation (5 Menit Setup)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Setup MySQL Database
```sql
-- Login ke MySQL
mysql -u root -p

-- Buat database
CREATE DATABASE ecommerce_db;

-- Keluar dari MySQL
exit;
```

### 3. Configure Environment
```bash
# Copy file example
cp .env.example .env

# Edit .env dengan text editor favorit Anda
# Minimal yang harus diubah:
# - DATABASE_URL (sesuaikan user & password MySQL)
# - NEXTAUTH_SECRET (generate dengan: openssl rand -base64 32)
```

**Contoh .env:**
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/ecommerce_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="abc123xyz789secretkey32characters"
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (buat tabel)
npx prisma migrate dev --name init

# Seed database dengan data sample (OPTIONAL)
npm run prisma:seed
```

### 5. Run Project
```bash
npm run dev
```

Buka browser: **http://localhost:3000**

##  Selesai!

### Login sebagai Admin:
- URL: http://localhost:3000/auth/login
- Email: `admin@example.com`
- Password: `admin123`

### Test sebagai User:
1. Register di: http://localhost:3000/auth/register
2. Login dengan email yang didaftarkan
3. Browse products, add to cart, checkout!

##  Cheat Sheet Commands

```bash
# Development
npm run dev                    # Run dev server

# Prisma
npx prisma studio             # Open database GUI
npx prisma migrate dev        # Create migration
npm run prisma:seed           # Seed data
npx prisma generate           # Generate client

# Build
npm run build                 # Build for production
npm start                     # Start production server
```

##  Troubleshooting

### Error: Can't connect to MySQL
```bash
# Check MySQL is running
sudo systemctl status mysql    # Linux
brew services list             # Mac

# Start MySQL
sudo systemctl start mysql     # Linux
brew services start mysql      # Mac
```

### Error: Prisma migrate failed
```bash
# Reset database
npx prisma migrate reset

# Migrate again
npx prisma migrate dev --name init
```

### Error: Module not found
```bash
npm install --legacy-peer-deps
```

##  Documentation

- `README.md` - Overview & tech stack
- `SETUP.md` - Detailed setup instructions
- `FEATURES.md` - Complete feature list

##  What's Next?

 Your e-commerce is ready!

**Try these:**
1. Login as admin → Add new products
2. Register as user → Make an order
3. Check admin dashboard → Manage orders

**Enhance it:**
- Add product images
- Setup email verification
- Integrate payment gateway
- Deploy to production

Happy coding! 
