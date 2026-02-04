'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CartItem {
  product: {
    id: string
    title: string
    price: number
    thumbnail: string
  }
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId)
    updateCart(newCart)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const newCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    )
    updateCart(newCart)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const products = cart.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ products, totalAmount: getTotalPrice() }),
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`
      } else {
        alert(data.error || 'Checkout failed')
      }
    } catch (error) {
      alert('An error occurred during checkout')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Your Cart
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
            Your cart is empty.
          </p>
          <a
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <div className="relative w-20 h-20 mr-4">
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.product.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ${item.product.price}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded-l"
                >
                  -
                </button>
                <span className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-1">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded-r"
                >
                  +
                </button>
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-600 hover:text-red-800 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
            <span className="text-gray-800 dark:text-white">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Shipping</span>
            <span className="text-gray-800 dark:text-white">Free</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">Total</span>
              <span className="text-lg font-semibold text-gray-800 dark:text-white">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  )
}
