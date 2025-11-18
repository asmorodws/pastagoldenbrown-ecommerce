# 📧 Gmail SMTP Setup Guide

Panduan lengkap untuk mengkonfigurasi Gmail SMTP dengan App Password untuk fitur email verification.

---

##  Langkah 1: Enable 2-Factor Authentication

Sebelum bisa membuat App Password, Anda harus mengaktifkan 2-Factor Authentication (2FA) di akun Google.

1. Buka: https://myaccount.google.com/security
2. Cari bagian **"2-Step Verification"**
3. Klik **"Get Started"** atau **"Turn On"**
4. Ikuti instruksi untuk setup 2FA (biasanya menggunakan nomor HP)

---

## 🔑 Langkah 2: Generate App Password

Setelah 2FA aktif, Anda bisa membuat App Password:

### Cara Baru (2024+):

1. **Buka**: https://myaccount.google.com/apppasswords
2. **Login** jika diminta
3. **Pilih App**: Pilih "Mail" atau "Other (Custom name)"
4. **Device**: Pilih "Other (Custom name)" dan beri nama, misalnya: "E-Commerce App"
5. **Generate**: Klik "Generate"
6. **Copy Password**: Akan muncul password 16 karakter, contoh: `abcd efgh ijkl mnop`
   - **PENTING**: Copy password ini sekarang, tidak akan ditampilkan lagi!

### Cara Lama (Jika masih tersedia):

1. Buka: https://myaccount.google.com/security
2. Scroll ke **"Signing in to Google"**
3. Klik **"App passwords"**
4. Pilih **App**: "Mail"
5. Pilih **Device**: "Other (Custom name)"
6. Masukkan nama: "E-Commerce App"
7. Klik **"Generate"**
8. Copy password 16 karakter yang muncul

---

##  Langkah 3: Update File .env

Buka file `.env` di root project dan update konfigurasi email:

```env
# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"          # Ganti dengan email Anda
EMAIL_SERVER_PASSWORD="abcd efgh ijkl mnop"       # Ganti dengan App Password (16 karakter)
EMAIL_FROM="noreply@yourdomain.com"               # Email pengirim (bisa sama dengan EMAIL_SERVER_USER)
```

**Tips:**
- Hapus semua spasi dari App Password
- Jangan gunakan password Google biasa, harus App Password!
- `EMAIL_FROM` bisa diisi dengan email yang sama atau custom

---

##  Langkah 4: Test SMTP Configuration

Jalankan script test untuk memverifikasi konfigurasi:

```bash
npm run test:email
```

Script ini akan:
1.  Verifikasi koneksi ke Gmail SMTP
2. 📧 Mengirim test email ke email Anda sendiri
3.  Menampilkan hasil dan troubleshooting jika ada error

### Output yang Diharapkan:

```
 Testing Gmail SMTP Configuration...

📧 Email Configuration:
   Host: smtp.gmail.com
   Port: 587
   User: your-email@gmail.com
   Password: ****mnop

⏳ Step 1: Verifying SMTP connection...
 SMTP connection verified successfully!

⏳ Step 2: Sending test email...
 Test email sent successfully!

📬 Email Details:
   Message ID: <xxx@gmail.com>
   Recipient: your-email@gmail.com
   Response: 250 2.0.0 OK

 All tests passed! Your Gmail SMTP is configured correctly.

📧 Please check your inbox at: your-email@gmail.com
```

---

##  Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Penyebab**: Password yang digunakan salah atau bukan App Password

**Solusi**:
1.  Pastikan menggunakan **App Password** (16 karakter), bukan password Google biasa
2.  Generate App Password baru di https://myaccount.google.com/apppasswords
3.  Hapus semua spasi dari App Password
4.  Copy-paste dengan hati-hati, jangan ada typo

---

### Error: "ECONNREFUSED" atau "Connection refused"

**Penyebab**: Tidak bisa connect ke server SMTP

**Solusi**:
1.  Cek koneksi internet Anda
2.  Pastikan port 587 tidak diblokir firewall
3.  Coba gunakan port 465 dengan `secure: true`
4.  Disable antivirus/firewall sementara untuk testing

---

### Error: "ETIMEDOUT" atau "Connection timeout"

**Penyebab**: ISP atau network Anda memblokir port SMTP

**Solusi**:
1.  Coba gunakan VPN
2.  Coba koneksi internet lain (mobile hotspot)
3.  Hubungi ISP Anda
4.  Gunakan port alternatif 465 atau 2525

---

### Email Tidak Masuk ke Inbox

**Solusi**:
1.  Cek folder **Spam/Junk**
2.  Cek folder **Promotions** (Gmail)
3.  Tunggu beberapa menit (delay server)
4.  Pastikan email recipient benar

---

##  Testing di Development Mode

Jika Anda tidak ingin setup email saat development, aplikasi akan **auto-verify** email:

1. Comment out semua konfigurasi email di `.env`:
```env
# EMAIL_SERVER_HOST="smtp.gmail.com"
# EMAIL_SERVER_PORT="587"
# EMAIL_SERVER_USER="your-email@gmail.com"
# EMAIL_SERVER_PASSWORD="your-app-password"
# EMAIL_FROM="noreply@yourdomain.com"
```

2. User yang register akan otomatis ter-verify
3. Verification URL akan ditampilkan di console untuk testing

---

##  Referensi

- **Gmail App Passwords**: https://support.google.com/accounts/answer/185833
- **Nodemailer Documentation**: https://nodemailer.com/
- **Gmail SMTP Settings**: https://support.google.com/mail/answer/7126229

---

##  Checklist

- [ ] 2-Factor Authentication sudah aktif
- [ ] App Password sudah di-generate (16 karakter)
- [ ] File `.env` sudah di-update dengan App Password
- [ ] Test email berhasil: `npm run test:email`
- [ ] Test email diterima di inbox
- [ ] Register user baru berhasil tanpa error
- [ ] Email verification diterima

---

**Happy Coding! **
