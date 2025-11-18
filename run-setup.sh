#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   E-COMMERCE SETUP SCRIPT                                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env is configured
echo " Checking configuration..."
if grep -q "DATABASE_URL=\"mysql://root:password@localhost:3306/ecommerce_db\"" .env; then
    echo -e "${YELLOW}  .env masih menggunakan password default!${NC}"
    echo ""
    echo "Apakah password MySQL root Anda adalah 'password'? (y/n)"
    read -r use_default
    
    if [[ ! "$use_default" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo ""
        echo "Masukkan password MySQL root Anda (atau tekan Enter jika tidak ada password):"
        read -s mysql_pass
        
        if [ -z "$mysql_pass" ]; then
            sed -i 's|DATABASE_URL="mysql://root:.*@localhost:3306/ecommerce_db"|DATABASE_URL="mysql://root@localhost:3306/ecommerce_db"|' .env
        else
            sed -i "s|DATABASE_URL=\"mysql://root:.*@localhost:3306/ecommerce_db\"|DATABASE_URL=\"mysql://root:${mysql_pass}@localhost:3306/ecommerce_db\"|" .env
        fi
        echo -e "${GREEN} .env updated!${NC}"
    fi
fi
echo ""

# Step 1: Generate Prisma
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " STEP 1/4: Generating Prisma Client..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED} Failed to generate Prisma Client${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Pastikan DATABASE_URL di .env sudah benar"
    echo "2. Pastikan MySQL sedang running"
    exit 1
fi
echo -e "${GREEN} Prisma Client generated!${NC}"
echo ""

# Step 2: Migrate
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " STEP 2/4: Running database migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo -e "${RED} Migration failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Pastikan database 'ecommerce_db' sudah dibuat"
    echo "2. Coba buat manual: mysql -u root -p"
    echo "   CREATE DATABASE ecommerce_db;"
    exit 1
fi
echo -e "${GREEN} Database migrated!${NC}"
echo ""

# Step 3: Seed
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " STEP 3/4: Seeding database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Seed database dengan data sample? (Y/n)"
read -r do_seed

if [[ "$do_seed" =~ ^([yY][eE][sS]|[yY])$ ]] || [ -z "$do_seed" ]; then
    npm run prisma:seed
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN} Database seeded!${NC}"
        echo ""
        echo "Default Admin:"
        echo "  Email: admin@example.com"
        echo "  Password: admin123"
    else
        echo -e "${YELLOW}  Seed failed, but you can continue${NC}"
    fi
else
    echo "Skipped seeding"
fi
echo ""

# Step 4: Build (optional check)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " STEP 4/4: Checking build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test build? (Y/n) - This will take 1-2 minutes"
read -r do_build

if [[ "$do_build" =~ ^([yY][eE][sS]|[yY])$ ]] || [ -z "$do_build" ]; then
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN} Build successful!${NC}"
    else
        echo -e "${RED} Build failed${NC}"
        echo "But you can still run development server"
    fi
else
    echo "Skipped build check"
fi
echo ""

# Done
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   SETUP COMPLETE!                                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "To start development server:"
echo -e "${GREEN}  npm run dev${NC}"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Admin Dashboard: http://localhost:3000/admin"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "Other useful commands:"
echo "  npx prisma studio  - Open database GUI"
echo "  npm run build      - Build for production"
echo ""
echo "Happy coding! "
