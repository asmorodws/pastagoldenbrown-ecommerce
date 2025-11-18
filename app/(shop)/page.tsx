// app/(shop)/page.tsx
import { prisma } from "@/lib/prisma"
import { HeroSection, InspirasiSection } from "@/components/home/ClientSections"
import AboutSection from "@/components/home/AboutSection"
import AdvantagesSection from "@/components/home/AdvantagesSection"
import FeaturedProducts from "@/components/FeaturedProducts"
import BrandValuesSection from "@/components/home/BrandValuesSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import VideoSection from "@/components/home/VideoSection"

// Server-side data fetching
async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true
      },
      include: {
        variants: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 featured products
    })

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price.toString()),
      discount: product.discount ? parseFloat(product.discount.toString()) : 0,
      discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : undefined,
      image: product.image || '/placeholder-product.jpg',
      variants: product.variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        stock: v.stock,
        price: v.price ? parseFloat(v.price.toString()) : undefined,
      })),
    }))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  
  return (
    <>
      <HeroSection />
      <AboutSection />
      <AdvantagesSection />
      <FeaturedProducts products={featuredProducts} />
      <BrandValuesSection />
      <TestimonialsSection />
      <InspirasiSection />
      <VideoSection />
    </>
  )
}
