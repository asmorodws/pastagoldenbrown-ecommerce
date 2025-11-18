import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedAdminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('Admin user created:', admin.email)

  // Create regular user
  const hashedUserPassword = await bcrypt.hash('user123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'User',
      password: hashedUserPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  })

  console.log('Regular user created:', user.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'pasta-halal' },
      update: {},
      create: {
        name: 'Pasta Halal',
        slug: 'pasta-halal',
        description: 'Produk pasta perisa dan pewarna bersertifikat Halal MUI',
        halal: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pasta-non-halal' },
      update: {},
      create: {
        name: 'Pasta Non-Halal',
        slug: 'pasta-non-halal',
        description: 'Produk pasta perisa dan pewarna (belum bersertifikat halal)',
        halal: false,
      },
    }),
  ])

  console.log('Categories created:', categories.length)

  const halalCategory = categories.find(c => c.slug === 'pasta-halal')!
  const nonHalalCategory = categories.find(c => c.slug === 'pasta-non-halal')!

  // Helper functions
  const buildImages = (productName: string, sizes: string[]) => {
    return JSON.stringify(sizes.map(size => `/assets/products/${size}/${productName}.png`))
  }

  const getPriceForSize = (size: string): number => {
    const priceMap: Record<string, number> = {
      '30g': 38000,
      '100g': 85000,
      '1kg': 650000
    }
    return priceMap[size] || 38000
  }

  // Product definitions with size availability
  const productDefinitions = [
    // ==================== PRODUK HALAL - 3 Ukuran (23 produk) ====================
    // ==================== 🏆 TOP 10 BEST SELLER PRODUCTS ====================
    { name: 'Pandan', slug: 'pasta-pandan', desc: 'Pasta perisa pandan dengan aroma khas dan pewarna hijau natural. #1 Best seller! Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Vanilla Crown', slug: 'pasta-vanilla-crown', desc: 'Pasta perisa vanilla premium grade dengan aroma vanilla yang kuat. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Red Velvet', slug: 'pasta-red-velvet', desc: 'Pasta perisa red velvet dengan pewarna merah pekat untuk cake mewah. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Moka', slug: 'pasta-moka', desc: 'Pasta perisa moka dengan rasa kopi yang nikmat untuk cake dan bakery. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Mangga', slug: 'pasta-mangga', desc: 'Pasta perisa mangga dengan pewarna kuning cerah untuk kreasi tropical. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Moka Hopyes', slug: 'pasta-moka-hopyes', desc: 'Pasta perisa moka hopyes premium dengan kombinasi kopi dan cokelat. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Susu', slug: 'pasta-susu', desc: 'Pasta perisa susu murni untuk kreasi cake dan bakery yang lembut. Halal MUI.', sizes: ['30g'], featured: true, halal: true },
    { name: 'Cokelat', slug: 'pasta-cokelat', desc: 'Pasta perisa cokelat standar yang cocok untuk berbagai jenis kue. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: true, halal: true },
    { name: 'Vanila', slug: 'pasta-vanila', desc: 'Pasta perisa vanila standar untuk berbagai kreasi cake dan bakery. Belum bersertifikat halal.', sizes: ['30g', '100g'], featured: true, halal: false },
    { name: 'Cokelat Blackforest', slug: 'pasta-cokelat-blackforest', desc: 'Pasta perisa cokelat blackforest dengan rasa yang kaya dan pewarna cokelat pekat. Halal MUI.', sizes: ['30g', '100g'], featured: true, halal: true },

    // ==================== OTHER POPULAR PRODUCTS ====================
    { name: 'Alpukat', slug: 'pasta-alpukat', desc: 'Pasta perisa alpukat dengan pewarna alami, cocok untuk kue, roti, dan berbagai kreasi kuliner. Bersertifikat Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Buttermilk Oil', slug: 'pasta-buttermilk-oil', desc: 'Pasta perisa buttermilk oil untuk cake lembut dan moist. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Caramel', slug: 'pasta-karamel', desc: 'Pasta perisa karamel yang memberikan aroma dan rasa manis yang khas. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Durian', slug: 'pasta-durian', desc: 'Pasta perisa durian asli untuk kue dan dessert. Aroma dan rasa durian yang khas. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Frambozen', slug: 'pasta-frambozen', desc: 'Pasta perisa raspberry (frambozen) dengan warna merah menarik. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Melon', slug: 'pasta-melon', desc: 'Pasta perisa melon dengan warna hijau segar untuk kue dan dessert. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Nanas', slug: 'pasta-nanas', desc: 'Pasta perisa nanas dengan rasa tropical yang segar dan pewarna kuning. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Nangka', slug: 'pasta-nangka', desc: 'Pasta perisa nangka dengan aroma khas buah nangka matang. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Pisang Ambon', slug: 'pasta-pisang-ambon', desc: 'Pasta perisa pisang ambon dengan aroma pisang yang khas dan manis. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Stroberi', slug: 'pasta-stroberi', desc: 'Pasta perisa strawberry dengan pewarna pink/merah untuk kreasi manis. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Talas', slug: 'pasta-talas', desc: 'Pasta perisa talas dengan pewarna ungu natural untuk kreasi kue unik. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Teh Hijau', slug: 'pasta-green-tea', desc: 'Pasta perisa green tea (matcha) dengan pewarna hijau natural. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'Tiramisu', slug: 'pasta-tiramisu', desc: 'Pasta perisa tiramisu dengan kombinasi kopi dan cream yang sempurna. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'N-Blackforest', slug: 'pewarna-blackforest', desc: 'Pewarna khusus untuk cake blackforest dengan warna cokelat pekat. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'N-Buttercream', slug: 'pewarna-buttercream', desc: 'Pewarna untuk buttercream dengan hasil warna yang stabil. Halal MUI dan BPOM.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },
    { name: 'N-Semprot', slug: 'pewarna-semprot', desc: 'Pewarna khusus untuk spray gun dengan hasil warna merata. Halal MUI.', sizes: ['30g', '100g', '1kg'], featured: false, halal: true },

    // ==================== PRODUK HALAL - 2 Ukuran (7 produk) ====================
    { name: 'Gula Aren', slug: 'pasta-gula-aren', desc: 'Pasta perisa gula aren dengan aroma khas gula merah asli. Halal MUI.', sizes: ['30g', '1kg'], featured: false, halal: true },
    { name: 'N-Bakar', slug: 'pewarna-bakar', desc: 'Pewarna khusus untuk cake bakar dengan hasil warna cokelat alami. Halal MUI dan BPOM.', sizes: ['30g', '1kg'], featured: false, halal: true },
    { name: 'Anggur', slug: 'pasta-anggur', desc: 'Pasta perisa anggur dengan pewarna ungu cerah untuk kreasi kue menarik. Halal MUI.', sizes: ['100g', '1kg'], featured: false, halal: true },
    { name: 'Coffee Boy', slug: 'pasta-coffee-boy', desc: 'Pasta perisa kopi premium Coffee Boy untuk berbagai kreasi cake dan bakery. Halal MUI dan BPOM.', sizes: ['100g', '1kg'], featured: false, halal: true },
    { name: 'Cokelat Flavocol', slug: 'pasta-cokelat-flavocol', desc: 'Pasta perisa cokelat premium dengan kombinasi pewarna sempurna. Halal MUI dan BPOM.', sizes: ['100g', '1kg'], featured: false, halal: true },
    { name: 'Jeruk', slug: 'pasta-jeruk', desc: 'Pasta perisa jeruk dengan rasa citrus yang segar dan pewarna orange. Halal MUI dan BPOM.', sizes: ['100g', '1kg'], featured: false, halal: true },
    { name: 'Kopi Moka Plus', slug: 'pasta-kopi-moka-plus', desc: 'Pasta perisa kopi moka plus dengan rasa kopi yang lebih kaya. Halal MUI dan BPOM.', sizes: ['100g', '1kg'], featured: false, halal: true },
    { name: 'Lemon', slug: 'pasta-lemon', desc: 'Pasta perisa lemon alami dengan aroma segar jeruk lemon. Halal MUI.', sizes: ['100g', '1kg'], featured: false, halal: true },

    // ==================== PRODUK HALAL - 1 Ukuran (4 produk) ====================
    { name: 'Blueberi', slug: 'pasta-blueberi', desc: 'Pasta perisa blueberi dengan pewarna untuk hasil kue yang menarik. Halal MUI dan terdaftar BPOM.', sizes: ['30g'], featured: false, halal: true },
    { name: 'Leci', slug: 'pasta-leci', desc: 'Pasta perisa leci dengan rasa buah leci yang manis dan segar. Halal MUI dan BPOM.', sizes: ['30g'], featured: false, halal: true },
    { name: 'Tutty Fruity', slug: 'pasta-tutty-fruity', desc: 'Pasta perisa tutty fruity dengan kombinasi berbagai buah tropis. Halal MUI.', sizes: ['30g'], featured: false, halal: true },

    // ==================== PRODUK NON-HALAL - 2 Ukuran (6 produk) ====================
    { name: 'Rum Bakar', slug: 'pasta-rum-bakar', desc: 'Pasta perisa rum untuk cake bakar dengan aroma khas. Belum bersertifikat halal.', sizes: ['100g', '1kg'], featured: false, halal: false },
    { name: 'Rum Blackforest', slug: 'pasta-rum-blackforest', desc: 'Pasta perisa rum blackforest untuk cake premium. Belum bersertifikat halal.', sizes: ['100g', '1kg'], featured: false, halal: false },
    { name: 'Rum Buttercream', slug: 'pasta-rum-buttercream', desc: 'Pasta perisa rum untuk buttercream dengan aroma kuat. Belum bersertifikat halal.', sizes: ['100g', '1kg'], featured: false, halal: false },
    { name: 'Rum Jamaica', slug: 'pasta-rum-jamaica', desc: 'Pasta perisa rum jamaica premium untuk kreasi cake eksklusif. Belum bersertifikat halal.', sizes: ['100g', '1kg'], featured: false, halal: false },
    { name: 'Rum Pasta', slug: 'pasta-rum-pasta', desc: 'Pasta perisa rum standar untuk berbagai kreasi bakery. Belum bersertifikat halal.', sizes: ['100g', '1kg'], featured: false, halal: false },
    { name: 'Rum Semprot', slug: 'pasta-rum-semprot', desc: 'Pasta perisa rum untuk spray application. Belum bersertifikat halal.', sizes: ['100g', '1kg'], featured: false, halal: false },
  ]

  const products = productDefinitions.map(def => {
    const basePrice = getPriceForSize(def.sizes[0])
    const discount = 5
    const discountPrice = basePrice - (basePrice * discount / 100)
    
    // Determine product name based on type
    let productName = def.name
    if (def.slug.startsWith('pewarna-')) {
      productName = `Pewarna ${def.name.replace('N-', '')}`
    } else {
      productName = `Perisa ${def.name} dan Pewarna`
    }
    
    return {
      name: productName,
      slug: def.slug,
      description: def.desc,
      price: basePrice,
      featured: def.featured,
      brand: 'Golden Brown',
      sku: `GB-${def.slug.toUpperCase()}-BASE`,
      weight: def.sizes[0] === '30g' ? 0.03 : def.sizes[0] === '100g' ? 0.1 : 1,
      image: `/assets/products/${def.sizes[0]}/${def.name}.png`,
      images: buildImages(def.name, def.sizes),
      categoryId: def.halal ? halalCategory.id : nonHalalCategory.id,
      discount: discount,
      discountPrice: discountPrice,
    }
  })

  let halalCount = 0
  let nonHalalCount = 0
  let variantCount = 0

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const productDef = productDefinitions[i]
    
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        featured: product.featured,
        image: product.image,
        images: product.images,
        brand: product.brand,
        sku: product.sku,
        weight: product.weight,
        categoryId: product.categoryId,
        discount: product.discount,
        discountPrice: product.discountPrice,
      },
      create: product,
    })

    // Create variants for this product
    for (let j = 0; j < productDef.sizes.length; j++) {
      const size = productDef.sizes[j]
      const variantPrice = getPriceForSize(size)
      const variantStock = size === '30g' ? 50 : size === '100g' ? 100 : 20
      const variantImage = `/assets/products/${size}/${productDef.name}.png`
      
      await prisma.productVariant.upsert({
        where: {
          productId_name: {
            productId: createdProduct.id,
            name: size,
          },
        },
        update: {
          label: `Ukuran: ${size}`,
          price: variantPrice,
          stock: variantStock,
          image: variantImage,
          sortOrder: j,
        },
        create: {
          productId: createdProduct.id,
          name: size,
          label: `Ukuran: ${size}`,
          sku: `GB-${product.slug.toUpperCase()}-${size.toUpperCase()}`,
          price: variantPrice,
          stock: variantStock,
          image: variantImage,
          sortOrder: j,
        },
      })
      variantCount++
    }

    if (product.categoryId === halalCategory.id) {
      halalCount++
    } else {
      nonHalalCount++
    }
  }

  console.log('Products created:', products.length)
  console.log('  - Halal products:', halalCount)
  console.log('  - Non-halal products:', nonHalalCount)
  console.log('Product variants created:', variantCount)
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
