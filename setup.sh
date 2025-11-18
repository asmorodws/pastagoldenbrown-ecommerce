#!/bin/bash

echo "=========================================="
echo "   SETUP E-COMMERCE - AUTO INSTALLER"
echo "=========================================="
echo ""

# Step 1: Check MySQL
echo " Step 1/5: Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo " MySQL tidak terinstall!"
    echo "Install MySQL terlebih dahulu:"
    echo "  sudo apt install mysql-server  # Ubuntu/Debian"
    echo "  brew install mysql             # macOS"
    exit 1
fi
echo " MySQL terdeteksi: $(mysql --version)"
echo ""

# Step 2: Get MySQL password
echo " Step 2/5: Setup Database MySQL"
echo "Masukkan password MySQL root Anda (atau tekan Enter jika tidak ada password):"
read -s MYSQL_PASSWORD

echo ""
echo "Membuat database ecommerce_db..."

if [ -z "$MYSQL_PASSWORD" ]; then
    # No password
    mysql -u root <<EOF 2>/dev/null
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
    DB_RESULT=$?
else
    # With password
    mysql -u root -p"$MYSQL_PASSWORD" <<EOF 2>/dev/null
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
    DB_RESULT=$?
fi

if [ $DB_RESULT -eq 0 ]; then
    echo " Database ecommerce_db berhasil dibuat!"
else
    echo " Gagal membuat database!"
    echo "Coba manual: mysql -u root -p"
    echo "Kemudian: CREATE DATABASE ecommerce_db;"
    exit 1
fi
echo ""

# Step 3: Update .env
echo " Step 3/5: Konfigurasi Environment Variables"

# Generate NextAuth Secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create .env file
if [ -z "$MYSQL_PASSWORD" ]; then
    DATABASE_URL="mysql://root@localhost:3306/ecommerce_db"
else
    DATABASE_URL="mysql://root:${MYSQL_PASSWORD}@localhost:3306/ecommerce_db"
fi

cat > .env <<EOF
# Database MySQL
DATABASE_URL="${DATABASE_URL}"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# Email Configuration (Optional - untuk verifikasi email)
# Gunakan Gmail App Password atau SMTP server lainnya
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
EOF

echo " File .env berhasil dibuat!"
echo ""

# Step 4: Generate Prisma & Migrate
echo " Step 4/5: Setup Database Schema"
echo "Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo " Gagal generate Prisma Client"
    exit 1
fi
echo " Prisma Client berhasil di-generate!"
echo ""

echo "Running database migrations..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo " Gagal migrate database"
    exit 1
fi
echo " Database migration berhasil!"
echo ""

# Step 5: Seed Database
echo " Step 5/5: Seed Database (Data Sample)"
echo "Ingin mengisi database dengan data sample? (Y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]] || [ -z "$response" ]; then
    npm run prisma:seed
    
    if [ $? -eq 0 ]; then
        echo " Database berhasil di-seed!"
        echo ""
        echo "=========================================="
        echo "   SETUP SELESAI!"
        echo "=========================================="
        echo ""
        echo "Default Admin Account:"
        echo "  Email: admin@example.com"
        echo "  Password: admin123"
        echo ""
    else
        echo "  Seed gagal, tapi Anda bisa lanjut tanpa data sample"
    fi
fi

echo "=========================================="
echo "   READY TO RUN!"
echo "=========================================="
echo ""
echo "Untuk menjalankan development server:"
echo "  npm run dev"
echo ""
echo "Kemudian buka: http://localhost:3000"
echo ""
echo "Untuk membuka Prisma Studio (Database GUI):"
echo "  npm run prisma:studio"
echo ""
