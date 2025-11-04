import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('Admin user created:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'elektronik' },
      update: {},
      create: {
        name: 'Elektronik',
        slug: 'elektronik',
        description: 'Produk elektronik dan gadget',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Pakaian dan aksesoris',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'rumah-tangga' },
      update: {},
      create: {
        name: 'Rumah Tangga',
        slug: 'rumah-tangga',
        description: 'Perlengkapan rumah tangga',
      },
    }),
  ])

  console.log('Categories created:', categories.length)

  // Create sample products
  const products = [
    {
      name: 'Laptop Gaming ROG Strix G16',
      slug: 'laptop-gaming-rog',
      description: 'Laptop gaming performa tinggi dengan layar 165Hz, prosesor Intel Core i9 Gen 13, NVIDIA GeForce RTX 4070 8GB, RAM 32GB DDR5, SSD 1TB NVMe. Dilengkapi dengan sistem pendingin ROG Intelligent Cooling untuk performa maksimal. Keyboard RGB per-key dengan response time cepat untuk gaming kompetitif. Desain futuristik dengan build quality premium.',
      price: 25000000,
      stock: 5,
      featured: true,
      brand: 'ASUS ROG',
      sku: 'ROG-G16-2024',
      weight: 2.5,
      dimensions: '35.4 x 25.2 x 2.8 cm',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'RAM', options: ['16GB', '32GB', '64GB'] },
        { name: 'Storage', options: ['512GB SSD', '1TB SSD', '2TB SSD'] }
      ]),
      categoryId: categories[0].id,
    },
    {
      name: 'Smartphone Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24',
      description: 'Flagship smartphone terbaru dengan teknologi AI canggih, kamera 200MP dengan zoom 100x, layar Dynamic AMOLED 2X 6.8 inch, prosesor Snapdragon 8 Gen 3, baterai 5000mAh dengan fast charging 45W. S Pen terintegrasi untuk produktivitas maksimal. Tahan air IP68 dan Gorilla Glass Victus 2.',
      price: 15000000,
      stock: 10,
      featured: true,
      brand: 'Samsung',
      sku: 'SM-S928B',
      weight: 0.233,
      dimensions: '16.2 x 7.9 x 0.86 cm',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
        { name: 'Color', options: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'] }
      ]),
      categoryId: categories[0].id,
    },
    {
      name: 'Headphone Sony WH-1000XM5',
      slug: 'sony-wh1000xm5',
      description: 'Headphone wireless premium dengan noise cancelling terbaik di kelasnya. Menggunakan teknologi AI untuk adaptasi suara otomatis, driver 30mm dengan kualitas audio Hi-Res, baterai hingga 30 jam, multipoint connection untuk 2 device sekaligus. Desain ergonomis dengan busa memory foam yang nyaman sepanjang hari.',
      price: 5000000,
      stock: 15,
      featured: true,
      brand: 'Sony',
      sku: 'WH-1000XM5',
      weight: 0.250,
      dimensions: '20 x 18 x 8 cm',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['Black', 'Silver'] }
      ]),
      categoryId: categories[0].id,
    },
    {
      name: 'Kemeja Batik Premium Tulis',
      slug: 'kemeja-batik-premium',
      description: 'Kemeja batik tulis eksklusif dengan motif tradisional kontemporer. Dibuat dari bahan katun premium yang lembut dan adem, cocok untuk acara formal maupun casual. Proses pewarnaan alami dengan detail halus yang dikerjakan oleh pengrajin berpengalaman. Tersedia dalam berbagai ukuran dengan cutting slim fit modern.',
      price: 350000,
      stock: 20,
      featured: false,
      brand: 'Batik Nusantara',
      sku: 'BTK-PRM-001',
      weight: 0.3,
      dimensions: '40 x 30 x 2 cm',
      image: 'https://images.unsplash.com/photo-1602810318660-d2c46b06eceb?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602810318660-d2c46b06eceb?w=800',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
        'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { name: 'Pattern', options: ['Parang', 'Kawung', 'Mega Mendung'] }
      ]),
      categoryId: categories[1].id,
    },
    {
      name: 'Sepatu Sneakers Urban Runner',
      slug: 'sepatu-sneakers-original',
      description: 'Sneakers premium dengan teknologi cushioning terbaru untuk kenyamanan maksimal. Upper berbahan breathable mesh, midsole EVA foam, outsole rubber anti-slip. Desain minimalis yang cocok untuk berbagai outfit, dari casual hingga semi-formal. Tersedia dalam berbagai warna dan ukuran.',
      price: 750000,
      stock: 25,
      featured: true,
      brand: 'Urban Style',
      sku: 'URB-SNK-2024',
      weight: 0.8,
      dimensions: '32 x 20 x 12 cm',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Size', options: ['39', '40', '41', '42', '43', '44'] },
        { name: 'Color', options: ['White', 'Black', 'Navy', 'Gray'] }
      ]),
      categoryId: categories[1].id,
    },
    {
      name: 'Rice Cooker Digital Fuzzy Logic',
      slug: 'rice-cooker-digital',
      description: 'Rice cooker canggih dengan teknologi fuzzy logic untuk hasil nasi sempurna setiap kali memasak. Kapasitas 1.8L (10 cup), 8 program memasak otomatis, inner pot coating anti-lengket berlapis 5, fungsi keep warm hingga 24 jam, timer delay cooking. Panel kontrol LED dengan tombol sentuh modern.',
      price: 1200000,
      stock: 30,
      featured: false,
      brand: 'Midea',
      sku: 'MD-RC18FL',
      weight: 3.5,
      dimensions: '28 x 28 x 26 cm',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Capacity', options: ['1.8L (10 cups)', '2.2L (12 cups)'] },
        { name: 'Color', options: ['White', 'Red'] }
      ]),
      categoryId: categories[2].id,
    },
    {
      name: 'Robot Vacuum Cleaner Smart AI',
      slug: 'vacuum-cleaner-robot',
      description: 'Vacuum cleaner robot pintar dengan AI mapping dan navigasi laser LiDAR. Daya hisap 4000Pa, mopping function 2-in-1, obstacle avoidance sensor, auto charging, app control dengan voice assistant compatibility. Baterai 5200mAh untuk area cleaning hingga 250m2. Dual brush system untuk pembersihan maksimal.',
      price: 3500000,
      stock: 8,
      featured: true,
      brand: 'Roborock',
      sku: 'RBR-S8PRO',
      weight: 3.8,
      dimensions: '35 x 35 x 9.6 cm',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
        'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800',
        'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['White', 'Black'] },
        { name: 'Accessories', options: ['Standard', 'With Extra Mop Pads', 'With Auto-Empty Dock'] }
      ]),
      categoryId: categories[2].id,
    },
    {
      name: 'Air Fryer Digital 5.5L XXL',
      slug: 'air-fryer-5l',
      description: 'Air fryer berkapasitas besar 5.5L dengan teknologi Rapid Air 360° untuk hasil masakan crispy tanpa minyak. 8 preset cooking programs, digital touchscreen, suhu 80-200°C, timer hingga 60 menit, dishwasher-safe basket. Hemat energi 70% dibanding deep fryer konvensional. Cocok untuk keluarga 4-6 orang.',
      price: 1500000,
      stock: 12,
      featured: false,
      brand: 'Philips',
      sku: 'PHI-AF55',
      weight: 4.5,
      dimensions: '31.5 x 31.5 x 31.2 cm',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
        'https://images.unsplash.com/photo-1603049025897-c3c8c58e4e4e?w=800',
        'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800'
      ]),
      variants: JSON.stringify([
        { name: 'Capacity', options: ['3.5L', '5.5L', '7L'] },
        { name: 'Color', options: ['Black', 'White'] }
      ]),
      categoryId: categories[2].id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        featured: product.featured,
        image: product.image,
        images: product.images,
        brand: product.brand,
        sku: product.sku,
        weight: product.weight,
        dimensions: product.dimensions,
        variants: product.variants,
        categoryId: product.categoryId,
      },
      create: product,
    })
  }

  console.log('Products created:', products.length)
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
