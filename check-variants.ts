import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    take: 3,
    select: {
      name: true,
      brand: true,
      variants: true
    }
  })

  console.log('Checking variants in database:\n')
  products.forEach((p: any) => {
    console.log('Product:', p.name)
    console.log('Brand:', p.brand)
    console.log('Variants:', p.variants)
    console.log('---')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
