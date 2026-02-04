import mongoose from 'mongoose'
import Product from '@/models/Product'
import Category from '@/models/Category'
import dbConnect from '@/lib/mongodb'

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets'
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel'
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies'
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear'
  }
]

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 30
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 100
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning and support.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Sports & Outdoors',
    stock: 75
  },
  {
    name: 'Garden Hose',
    description: 'Durable garden hose with brass connectors and adjustable spray nozzle.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 40
  },
  {
    name: 'LED Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness and USB charging port.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 60
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for all types of yoga.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    category: 'Sports & Outdoors',
    stock: 80
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 90
  }
]

export async function seedDatabase() {
  try {
    await dbConnect()

    // Clear existing data
    await Product.deleteMany({})
    await Category.deleteMany({})

    // Insert categories
    const insertedCategories = await Category.insertMany(categories)
    console.log('Categories inserted:', insertedCategories.length)

    // Create category map for products
    const categoryMap: { [key: string]: string } = {}
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id.toString()
    })

    // Insert products with category references
    const productsWithCategoryIds = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }))

    const insertedProducts = await Product.insertMany(productsWithCategoryIds)
    console.log('Products inserted:', insertedProducts.length)

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
  }
}
