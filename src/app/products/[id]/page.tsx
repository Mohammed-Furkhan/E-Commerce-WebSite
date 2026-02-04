'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  description: string
  price: number
  thumbnail: string
  images?: string[]
  category: string
  stock: number
  rating?: number | null
  brand?: string | null
  discountPercentage?: number | null
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  const productImages = useMemo(() => {
    if (!product) return []
    const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail]
    return Array.from(new Set(images))
  }, [product])

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
        setActiveImage(data.images?.[0] || data.thumbnail)
        return
      }

      const fallback = await fetch(`https://dummyjson.com/products/${params.id}`)
      if (!fallback.ok) {
        setError('Product not found.')
        return
      }

      const raw = await fallback.json()
      const mapped: Product = {
        id: raw.id?.toString() ?? '',
        title: raw.title,
        description: raw.description,
        price: raw.price,
        thumbnail: raw.thumbnail || raw.images?.[0],
        images: raw.images || [],
        category: raw.category,
        stock: raw.stock ?? 0,
        rating: raw.rating ?? null,
        brand: raw.brand ?? null,
        discountPercentage: raw.discountPercentage ?? null,
      }

      setProduct(mapped)
      setActiveImage(mapped.images?.[0] || mapped.thumbnail)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Unable to load product details.')
    } finally {
      setLoading(false)
    }
  }

  const buyNow = () => {
    if (!product) return

    const checkout = {
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      },
      quantity,
    }

    localStorage.setItem('checkout', JSON.stringify(checkout))
    router.push('/checkout/address')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {error || 'Product not found'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
          >
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[520px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Image
                src={activeImage || product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(image)}
                  className={`relative h-20 rounded-2xl overflow-hidden border ${
                    activeImage === image
                      ? 'border-amber-400'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Image
                    src={image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              {product.category}
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mt-3">
              {product.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-slate-500 dark:text-slate-400">
              {product.brand ? <span>Brand: {product.brand}</span> : null}
              {product.rating ? <span>Rating: {product.rating}★</span> : null}
              <span>
                Stock: {product.stock > 0 ? product.stock : 'Out of stock'}
              </span>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <span className="text-4xl font-semibold text-slate-900 dark:text-white">
                ${product.price}
              </span>
              {product.discountPercentage ? (
                <span className="text-sm text-amber-600">
                  Save {product.discountPercentage}% today
                </span>
              ) : null}
            </div>

            <div className="mt-8">
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  -
                </button>
                <span className="px-5 py-2 text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={buyNow}
                disabled={product.stock === 0}
                className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-semibold transition-colors hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
              <Link
                href="/products"
                className="w-full sm:w-auto border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-full font-semibold text-center hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
