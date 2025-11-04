import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Percent } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  discount?: number
  discountPrice?: number
  image: string
  slug: string
}

export default function ProductCard({ id, name, price, discount, discountPrice, image, slug }: ProductCardProps) {
  const hasDiscount = discount && discount > 0
  const displayPrice = hasDiscount ? discountPrice : price

  return (
    <Link href={`/products/${slug}`} className="block">
      <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#05347e] hover:-translate-y-2 cursor-pointer">
        <div className="relative h-56 overflow-hidden bg-gray-50">
          <Image
            src={image || "/placeholder-product.jpg"}
            alt={name}
            fill
            className="object-contain p-4 group-hover:scale-110 transition duration-500"
          />
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-[#db0705] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Percent size={12} />
              -{discount}%
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-[#05347e] group-hover:text-[#db0705] min-h-[2rem] transition-colors">
            {name}
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-600 mb-1">Harga</div>
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-[#db0705]">
                      Rp {displayPrice?.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 line-through">
                    Rp {price.toLocaleString("id-ID")}
                  </div>
                </>
              ) : (
                <span className="text-lg font-bold text-[#05347e]">
                  Rp {price.toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <div className="bg-[#05347e] group-hover:bg-[#db0705] text-white p-2.5 rounded-lg transition-all">
              <ShoppingCart size={18} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
