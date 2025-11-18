#!/bin/bash

echo "=========================================="
echo "  SETUP DATABASE E-COMMERCE"
echo "=========================================="
echo ""
echo "Masukkan password MySQL root Anda:"
read -s MYSQL_PASSWORD

echo ""
echo "Membuat database ecommerce_db..."

mysql -u root -p"$MYSQL_PASSWORD" <<EOF
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE 'ecommerce_db';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo " Database ecommerce_db berhasil dibuat!"
    echo ""
    echo "Sekarang update file .env dengan password MySQL Anda:"
    echo "DATABASE_URL=\"mysql://root:$MYSQL_PASSWORD@localhost:3306/ecommerce_db\""
    echo ""
else
    echo ""
    echo " Gagal membuat database. Pastikan:"
    echo "1. MySQL server sedang running"
    echo "2. Password root MySQL benar"
    echo ""
    echo "Coba jalankan manual:"
    echo "mysql -u root -p"
    echo "CREATE DATABASE ecommerce_db;"
fi
