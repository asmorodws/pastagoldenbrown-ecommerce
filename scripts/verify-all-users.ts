import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Verifying all users...')
  
  const result = await prisma.user.updateMany({
    where: {
      emailVerified: null
    },
    data: {
      emailVerified: new Date()
    }
  })
  
  console.log(`✓ ${result.count} user(s) verified`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
