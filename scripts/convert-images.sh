#!/bin/bash

# Script untuk mengkonversi gambar HEIC ke JPG
# Membutuhkan ImageMagick atau heif-convert

echo "Mengkonversi gambar HEIC ke JPG..."

# Direktori gambar
IMAGE_DIR="public/assets/products/30g"

# Counter
converted=0
failed=0

# Cek apakah heif-convert tersedia
if command -v heif-convert &> /dev/null; then
    echo "Menggunakan heif-convert..."
    
    for file in "$IMAGE_DIR"/*.heic "$IMAGE_DIR"/*.HEIC; do
        if [ -f "$file" ]; then
            # Dapatkan nama file tanpa ekstensi
            filename=$(basename "$file")
            name="${filename%.*}"
            
            # Convert ke JPG
            output="$IMAGE_DIR/$name.jpg"
            
            echo "Converting: $filename -> $name.jpg"
            
            if heif-convert "$file" "$output" -q 90; then
                converted=$((converted + 1))
                echo "✓ Berhasil: $name.jpg"
            else
                failed=$((failed + 1))
                echo "✗ Gagal: $filename"
            fi
        fi
    done
    
elif command -v magick &> /dev/null; then
    echo "Menggunakan ImageMagick..."
    
    for file in "$IMAGE_DIR"/*.heic "$IMAGE_DIR"/*.HEIC; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            name="${filename%.*}"
            output="$IMAGE_DIR/$name.jpg"
            
            echo "Converting: $filename -> $name.jpg"
            
            if magick "$file" -quality 90 "$output"; then
                converted=$((converted + 1))
                echo "✓ Berhasil: $name.jpg"
            else
                failed=$((failed + 1))
                echo "✗ Gagal: $filename"
            fi
        fi
    done
    
else
    echo " Error: heif-convert atau ImageMagick tidak ditemukan!"
    echo ""
    echo "Instalasi:"
    echo "  Ubuntu/Debian: sudo apt-get install libheif-examples imagemagick"
    echo "  macOS: brew install libheif imagemagick"
    echo "  Arch: sudo pacman -S libheif imagemagick"
    exit 1
fi

echo ""
echo "============================================"
echo "Konversi selesai!"
echo "Berhasil: $converted file"
echo "Gagal: $failed file"
echo "============================================"

# Juga convert PNG besar ke format yang lebih optimal
echo ""
echo "Mengoptimalkan file PNG..."
optimized=0

for file in "$IMAGE_DIR"/*.PNG "$IMAGE_DIR"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        name="${filename%.*}"
        
        # Jika file > 500KB, convert ke JPG
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        
        if [ "$size" -gt 512000 ]; then
            output="$IMAGE_DIR/$name.jpg"
            echo "Optimizing: $filename ($(($size / 1024))KB) -> $name.jpg"
            
            if command -v magick &> /dev/null; then
                magick "$file" -quality 90 -resize '800x800>' "$output"
                optimized=$((optimized + 1))
            fi
        fi
    fi
done

echo "File PNG dioptimalkan: $optimized"
