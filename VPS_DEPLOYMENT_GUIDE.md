#  VPS Deployment Guide - Golden Brown Pasta E-Commerce

##  Prerequisites

### VPS Requirements:
-  Ubuntu 20.04+ / Debian 11+
-  Min 2GB RAM (4GB recommended)
-  Min 20GB Storage
-  Node.js 18+ installed
-  MySQL/PostgreSQL database
-  PM2 for process management

##  Step-by-Step Deployment

### 1. **Prepare VPS Environment**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v20.x.x
npm --version

# Install PM2
sudo npm install -g pm2

# Install MySQL (if not installed)
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 2. **Setup Database**

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. **Clone & Setup Project**

```bash
# Create project directory
mkdir -p /var/www
cd /var/www

# Clone repository (atau upload via FTP/SFTP)
git clone <your-repo-url> ecommerce
cd ecommerce

# Install dependencies
npm install
#  Prisma Client akan otomatis generate via postinstall script

# Copy environment file
cp .env.example .env
nano .env
```

### 4. **Configure Environment Variables**

Edit `.env` file:

```env
# Database Configuration
DATABASE_URL="mysql://ecommerce_user:YOUR_STRONG_PASSWORD@localhost:3306/ecommerce_db"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="GENERATE_NEW_SECRET_HERE"
AUTH_TRUST_HOST="true"

# Email Configuration (Gmail)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="Your Store <your-email@gmail.com>"

# RajaOngkir API
RAJAONGKIR_API_KEY="your-rajaongkir-api-key"
RAJAONGKIR_BASE_URL="https://rajaongkir.komerce.id/api/v1"

# Store Location (City ID)
NEXT_PUBLIC_ORIGIN_CITY_ID=152
```

**Generate New Secret:**
```bash
openssl rand -base64 32
```

### 5. **Database Migration**

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run prisma:seed

# Verify database
npx prisma studio
```

### 6. **Build Application**

```bash
# Build for production
npm run build

# Test production build locally
npm start
# Should run on http://localhost:3000
```

### 7. **Setup PM2 Process Manager**

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ecommerce',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/ecommerce',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/ecommerce/logs/error.log',
    out_file: '/var/www/ecommerce/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command output to complete setup

# Check status
pm2 status
pm2 logs ecommerce --lines 100
```

### 8. **Setup Nginx Reverse Proxy**

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ecommerce
```

Add configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # For now, proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Image optimization endpoint
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 30d;
    }

    # Max upload size for product images
    client_max_body_size 10M;
}
```

Enable site:

```bash
# Enable configuration
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

### 9. **Setup SSL with Let's Encrypt** (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts to complete setup
# Certbot will automatically update Nginx config

# Test auto-renewal
sudo certbot renew --dry-run
```

### 10. **Setup Firewall**

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

##  Troubleshooting

### Build Errors

#### Error: Prisma Client not initialized
```bash
# Solution: Run prisma generate
npx prisma generate

# Or reinstall with postinstall
npm install
```

#### Error: TypeScript compilation errors
```bash
# Check for implicit 'any' types
npx tsc --noEmit

# All type errors should be fixed in current version
```

#### Error: Out of memory during build
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Runtime Errors

#### Database Connection Failed
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u ecommerce_user -p ecommerce_db

# Check DATABASE_URL in .env
```

#### PM2 App Crashed
```bash
# Check logs
pm2 logs ecommerce --err --lines 100

# Restart app
pm2 restart ecommerce

# Full restart
pm2 delete ecommerce
pm2 start ecosystem.config.js
```

#### Images not loading
```bash
# Check file permissions
sudo chown -R www-data:www-data /var/www/ecommerce/public

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

##  Monitoring & Maintenance

### Check Application Status
```bash
# PM2 status
pm2 status

# View logs
pm2 logs ecommerce

# Monitor resources
pm2 monit

# Nginx status
sudo systemctl status nginx
```

### Database Backup
```bash
# Create backup script
cat > /var/www/ecommerce/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/ecommerce/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u ecommerce_user -p ecommerce_db > $BACKUP_DIR/ecommerce_$DATE.sql
gzip $BACKUP_DIR/ecommerce_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /var/www/ecommerce/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/ecommerce/backup-db.sh") | crontab -
```

### Log Rotation
```bash
# PM2 handles log rotation automatically
# Check PM2 log config
pm2 describe ecommerce
```

##  Deployment Updates

### Pull Latest Changes
```bash
cd /var/www/ecommerce

# Backup database first
./backup-db.sh

# Pull updates
git pull origin main

# Install new dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart PM2
pm2 restart ecommerce

# Clear cache if needed
pm2 flush ecommerce
```

### Zero-Downtime Deployment
```bash
# Build first
npm run build

# Reload PM2 (graceful restart)
pm2 reload ecommerce
```

##  Performance Optimization

### Enable Gzip Compression (Nginx)
```nginx
# Add to /etc/nginx/nginx.conf in http block
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Enable HTTP/2
```nginx
# Edit server block
listen 443 ssl http2;
```

### Database Optimization
```bash
# Add indexes to Prisma schema if needed
# Run migrations after schema changes
npx prisma migrate deploy
```

##  Monitoring Tools

### Install Monitoring (Optional)
```bash
# PM2 Plus (free tier)
pm2 install pm2-server-monit

# Or use custom monitoring
npm install -g pm2-server-monitor
```

##  Emergency Procedures

### Application Won't Start
```bash
# Check logs
pm2 logs ecommerce --err

# Check port availability
sudo netstat -tulpn | grep :3000

# Full restart
pm2 delete ecommerce
cd /var/www/ecommerce
npm run build
pm2 start ecosystem.config.js
```

### Database Corruption
```bash
# Restore from backup
gunzip < /var/www/ecommerce/backups/ecommerce_YYYYMMDD_HHMMSS.sql.gz | mysql -u ecommerce_user -p ecommerce_db

# Run migrations again
npx prisma migrate deploy
```

### High Memory Usage
```bash
# Restart PM2
pm2 restart ecommerce

# Check memory
pm2 monit

# Reduce PM2 instances if needed
pm2 scale ecommerce 2
```

##  Post-Deployment Checklist

- [ ] Database connected and migrations run
- [ ] Environment variables configured correctly
- [ ] PM2 running and auto-start enabled
- [ ] Nginx reverse proxy working
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] Test all critical features:
  - [ ] User registration/login
  - [ ] Product listing
  - [ ] Cart functionality
  - [ ] Checkout process
  - [ ] Admin panel access
  - [ ] Image optimization working
  - [ ] Email sending (if configured)
  - [ ] Shipping cost calculation

##  Support Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- PM2 Docs: https://pm2.keymetrics.io/docs
- Nginx Docs: https://nginx.org/en/docs

---

 **Deployment Complete!**
 **Your e-commerce site is live!**
