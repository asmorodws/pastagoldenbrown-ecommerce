#!/bin/bash

echo "🚀 Menjalankan deployment Next.js + PM2"

# Pulled latest code
echo "📥 Pulling latest code..."
git pull

# Build project
echo "🔨 Building project..."
npm install --omit=dev
npm run build

# Restart PM2
echo "♻️ Restarting PM2 application..."
pm2 restart ecommerce
pm2 save

# Reload nginx (lebih aman daripada restart)
echo "🔄 Reloading NGINX..."
sudo nginx -t && sudo systemctl reload nginx

# Show nginx status
echo "📡 Menampilkan status NGINX..."
sudo systemctl status nginx

echo "✅ Deployment selesai!"
