import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_LIMIT = 48

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')
    const parsedLimit = Number(searchParams.get('limit') || DEFAULT_LIMIT)
    const parsedSkip = Number(searchParams.get('skip') || 0)
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_LIMIT
    const skip = Number.isFinite(parsedSkip) && parsedSkip >= 0 ? parsedSkip : 0

    let apiUrl = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`

    if (q) {
      apiUrl = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    } else if (category) {
      apiUrl = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
    }

    const response = await fetch(apiUrl, { next: { revalidate: 60 } })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await response.json()
    const products = data.products || []

    const transformedProducts = products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300',
      category: product.category,
      stock: product.stock ?? 0,
      rating: product.rating ?? null,
      brand: product.brand ?? null,
    }))

    return NextResponse.json({
      products: transformedProducts,
      total: data.total ?? transformedProducts.length,
      limit: data.limit ?? limit,
      skip: data.skip ?? skip,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
