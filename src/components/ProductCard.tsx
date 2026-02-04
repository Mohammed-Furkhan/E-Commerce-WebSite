import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  rating?: number | null
  brand?: string | null
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white border border-slate-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          {product.title}
        </h3>
        <p className="text-slate-500 text-xs mb-3">
          {product.description.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">
              ${product.price}
            </span>
            {product.rating ? (
              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                {product.rating}★
              </span>
            ) : null}
          </div>
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-semibold text-[#2874F0] hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
