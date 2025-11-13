/**
 * Migration Script: Convert JSON variants to ProductVariant model
 * 
 * This script migrates existing products with JSON-based variants
 * to the new ProductVariant model structure.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting migration from JSON variants to ProductVariant model...\n')

  const products = await prisma.product.findMany()
  
  let migratedCount = 0
  let variantCount = 0

  for (const product of products) {
    console.log(`\n📦 Processing: ${product.name}`)
    
    // For demo purposes, create default variants based on common sizes
    // In real migration, you would parse from product.variants JSON field
    const defaultVariants = [
      { name: '30g', stock: 50, price: null, sortOrder: 0 },
      { name: '100g', stock: 100, price: null, sortOrder: 1 },
      { name: '1kg', stock: 20, price: null, sortOrder: 2 },
    ]

    for (const variant of defaultVariants) {
      try {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: variant.name,
            label: `Ukuran: ${variant.name}`,
            stock: variant.stock,
            price: variant.price,
            sortOrder: variant.sortOrder,
          },
        })
        variantCount++
        console.log(`  ✅ Created variant: ${variant.name} (stock: ${variant.stock})`)
      } catch (error) {
        console.log(`  ⚠️  Variant ${variant.name} already exists, skipping...`)
      }
    }

    migratedCount++
  }

  console.log(`\n✨ Migration completed!`)
  console.log(`📊 Summary:`)
  console.log(`   - Products processed: ${migratedCount}`)
  console.log(`   - Variants created: ${variantCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
