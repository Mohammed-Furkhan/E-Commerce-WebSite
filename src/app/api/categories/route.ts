import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://dummyjson.com/products/categories', {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    const data = await response.json()

    const categories = (Array.isArray(data) ? data : data?.categories || []).map(
      (item: any, index: number) => {
        if (typeof item === 'string') {
          return {
            id: `cat-${index}`,
            name: item.replace(/-/g, ' '),
            slug: item,
            description: `Browse ${item.replace(/-/g, ' ')} products.`,
          }
        }

        return {
          id: item.slug || item.id || `cat-${index}`,
          name: item.name || item.slug || 'Category',
          slug: item.slug || item.name || `category-${index}`,
          description: `Browse ${(item.name || item.slug || 'category').replace(/-/g, ' ')} products.`,
        }
      }
    )

    return NextResponse.json(categories)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
