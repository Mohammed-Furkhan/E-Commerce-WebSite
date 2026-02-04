'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

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

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
    fetchCategories()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=8')
      if (res.ok) {
        const data = await res.json()
        setFeaturedProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="rounded-lg bg-[#E8F0FF] border border-blue-100 px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-semibold text-slate-900">
                Top deals on everyday essentials
              </h1>
              <p className="text-slate-600 mt-3">
                Browse thousands of products with fast delivery and great prices.
              </p>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/products"
                  className="bg-[#2874F0] text-white px-6 py-3 rounded-sm font-semibold hover:bg-[#1f5fc2] transition-colors"
                >
                  Shop now
                </Link>
                <Link
                  href="/products?q=phones"
                  className="border border-[#2874F0] text-[#2874F0] px-6 py-3 rounded-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  Trending
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="bg-white rounded-md p-4 shadow-sm border border-slate-100">
                  <div className="text-xs uppercase text-slate-400 mb-2">
                    {product.category}
                  </div>
                  <div className="font-semibold text-slate-900">
                    {product.title}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    ${product.price}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
            <Link href="/products" className="text-sm text-[#2874F0] font-semibold">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white border border-slate-100 rounded-md p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {category.description || `Explore ${category.name}.`}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Featured picks
            </h2>
            <Link href="/products" className="text-sm text-[#2874F0] font-semibold">
              View all
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                No products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white border border-slate-100 rounded-md p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Become a member for extra savings
              </h2>
              <p className="text-slate-600 mt-2">
                Faster checkout, saved addresses, and personalized deals.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="bg-[#2874F0] text-white px-6 py-3 rounded-sm font-semibold hover:bg-[#1f5fc2] transition-colors"
              >
                Sign up
              </Link>
              <Link
                href="/products"
                className="border border-slate-300 text-slate-700 px-6 py-3 rounded-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Keep shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
