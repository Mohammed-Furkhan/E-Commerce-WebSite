'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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

const LIMIT = 48

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const categoryParam = searchParams.get('category') || ''
    const queryParam = searchParams.get('q') || ''
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
      setPage(1)
    }
    if (queryParam && queryParam !== query) {
      setQuery(queryParam)
      setPage(1)
    }
  }, [searchParams, selectedCategory, query])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, query, page])

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / LIMIT))
  }, [total])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('limit', LIMIT.toString())
      params.set('skip', ((page - 1) * LIMIT).toString())
      if (selectedCategory) params.set('category', selectedCategory)
      if (query.trim()) params.set('q', query.trim())

      const res = await fetch(`/api/products?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
        setTotal(data.total || 0)
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setPage(1)
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-slate-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
                All Products
              </h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                {total.toLocaleString()} items available. Showing 48 per page.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full sm:w-72 px-4 py-3 border border-slate-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full sm:w-56 px-4 py-3 border border-slate-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-slate-900"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-sm text-sm border ${
                  selectedCategory === category.slug
                    ? 'bg-[#2874F0] text-white border-[#2874F0]'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange('')}
                className="px-4 py-2 rounded-sm text-sm border border-slate-300 text-slate-700"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">
              No products found. Try a different search or category.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-12">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-5 py-2 rounded-sm border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-5 py-2 rounded-sm border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  )
}
