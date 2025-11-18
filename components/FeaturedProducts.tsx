"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import ProductCard from "./ProductCard"

interface FeaturedProductsProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    discount: number
    discountPrice?: number
    image: string
    variants?: Array<{
      id: string
      name: string
      stock: number
      price?: number
    }>
  }>
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900">Produk Unggulan</h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            {products.length} varian best-seller yang sudah dipercaya ribuan pelanggan.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-12 auto-rows-fr"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {products.map((p, index) => (
            <motion.div
              key={p.id}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductCard 
                id={p.id}
                name={p.name}
                price={p.price}
                discount={p.discount}
                discountPrice={p.discountPrice}
                image={p.image}
                slug={p.slug}
                variants={p.variants}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/products" className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg">
            Lihat Semua Produk <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
