#!/bin/bash

# Script untuk memverifikasi data produk dan variant images
# Pastikan gambar variant sesuai dengan images array di product

echo " Verifying Product and Variant Image Data..."
echo ""

# Cek apakah MySQL client tersedia
if ! command -v mysql &> /dev/null; then
    echo " MySQL client not found. Please install it first."
    exit 1
fi

# Database credentials
DB_USER="root"
DB_PASS="root"
DB_NAME="ecommerce_db"

echo " Checking Products with Variants..."
echo "======================================"

# Query untuk mengecek konsistensi data
mysql -u $DB_USER -p$DB_PASS $DB_NAME <<EOF
-- Cek produk dengan variant images yang tidak ada di product images
SELECT 
    p.name AS product_name,
    p.slug,
    pv.name AS variant_name,
    pv.image AS variant_image,
    p.images AS product_images,
    CASE 
        WHEN JSON_CONTAINS(p.images, JSON_QUOTE(pv.image)) THEN ' MATCH'
        WHEN pv.image IS NULL THEN '  NO IMAGE'
        ELSE ' NOT FOUND IN PRODUCT IMAGES'
    END AS status
FROM Product p
JOIN ProductVariant pv ON p.id = pv.productId
WHERE p.slug LIKE 'pasta%'
ORDER BY p.name, pv.sortOrder
LIMIT 20;

EOF

echo ""
echo "======================================"
echo ""

# Cek sample produk untuk testing
echo " Sample Products for Testing:"
echo "======================================"

mysql -u $DB_USER -p$DB_PASS $DB_NAME <<EOF
SELECT 
    p.name,
    p.slug,
    COUNT(pv.id) as variant_count,
    GROUP_CONCAT(pv.name ORDER BY pv.sortOrder) as variants
FROM Product p
LEFT JOIN ProductVariant pv ON p.id = pv.productId
WHERE p.slug IN ('pasta-cokelat-blackforest', 'pasta-pandan', 'pasta-susu')
GROUP BY p.id, p.name, p.slug;
EOF

echo ""
echo "======================================"
echo ""
echo " Verification complete!"
echo ""
echo " Manual Test URLs:"
echo "  - http://localhost:3000/products/pasta-cokelat-blackforest"
echo "  - http://localhost:3000/products/pasta-pandan"
echo "  - http://localhost:3000/products/pasta-susu"
echo ""
echo " Open browser console to see debug logs:"
echo "  -  Variant clicked: [variant] Image: [path]"
echo "  -  Switching to variant image: [variant] [path]"
echo "  -  Variant image not found in images array: [path]"
