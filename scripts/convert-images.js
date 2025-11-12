const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

const IMAGE_DIR = path.join(__dirname, '..', 'public', 'assets', 'products', '30g');

async function convertImages() {
  console.log('🔄 Memulai konversi gambar...\n');

  try {
    // Baca semua file di direktori
    const files = fs.readdirSync(IMAGE_DIR);
    
    const heicFiles = files.filter(file => 
      file.toLowerCase().endsWith('.heic')
    );

    if (heicFiles.length === 0) {
      console.log('✅ Tidak ada file HEIC yang perlu dikonversi');
      return;
    }

    console.log(`📁 Ditemukan ${heicFiles.length} file HEIC\n`);

    let converted = 0;
    let failed = 0;

    // Cek apakah sharp tersedia (lebih cepat dan tidak perlu external tool)
    try {
      const sharp = require('sharp');
      console.log('✓ Menggunakan Sharp untuk konversi (optimal)\n');

      for (const file of heicFiles) {
        const inputPath = path.join(IMAGE_DIR, file);
        const outputPath = path.join(IMAGE_DIR, file.replace(/\.heic$/i, '.jpg'));

        try {
          console.log(`  Converting: ${file}`);
          
          await sharp(inputPath)
            .jpeg({ quality: 90 })
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .toFile(outputPath);
          
          converted++;
          console.log(`  ✓ Berhasil: ${path.basename(outputPath)}\n`);
        } catch (error) {
          failed++;
          console.log(`  ✗ Gagal: ${file} - ${error.message}\n`);
        }
      }

    } catch (sharpError) {
      console.log('⚠ Sharp tidak tersedia, mencoba ImageMagick...\n');

      // Fallback ke ImageMagick
      for (const file of heicFiles) {
        const inputPath = path.join(IMAGE_DIR, file);
        const outputPath = path.join(IMAGE_DIR, file.replace(/\.heic$/i, '.jpg'));

        try {
          console.log(`  Converting: ${file}`);
          
          await execAsync(`magick "${inputPath}" -quality 90 -resize 800x800\\> "${outputPath}"`);
          
          converted++;
          console.log(`  ✓ Berhasil: ${path.basename(outputPath)}\n`);
        } catch (error) {
          failed++;
          console.log(`  ✗ Gagal: ${file}\n`);
        }
      }
    }

    // Optimasi file PNG yang besar
    console.log('\n📦 Memeriksa file PNG...\n');
    const pngFiles = files.filter(file => 
      file.toLowerCase().endsWith('.png')
    );

    let optimized = 0;

    for (const file of pngFiles) {
      const filePath = path.join(IMAGE_DIR, file);
      const stats = fs.statSync(filePath);
      
      // Jika lebih dari 500KB, convert ke JPG
      if (stats.size > 512000) {
        const outputPath = path.join(IMAGE_DIR, file.replace(/\.png$/i, '.jpg'));
        
        try {
          const sharp = require('sharp');
          console.log(`  Optimizing: ${file} (${Math.round(stats.size / 1024)}KB)`);
          
          await sharp(filePath)
            .jpeg({ quality: 90 })
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .toFile(outputPath);
          
          optimized++;
          console.log(`  ✓ Dioptimalkan: ${path.basename(outputPath)}\n`);
        } catch (error) {
          console.log(`  ✗ Gagal mengoptimalkan: ${file}\n`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Konversi selesai!');
    console.log(`   HEIC → JPG: ${converted} berhasil, ${failed} gagal`);
    console.log(`   PNG dioptimalkan: ${optimized}`);
    console.log('='.repeat(50) + '\n');

    if (converted > 0 || optimized > 0) {
      console.log('📝 Langkah selanjutnya:');
      console.log('   1. Periksa folder: public/assets/products/30g/');
      console.log('   2. Update seed.ts: ganti .heic dengan .jpg');
      console.log('   3. Jalankan: npx prisma db seed\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Jalankan konversi
convertImages().catch(console.error);
