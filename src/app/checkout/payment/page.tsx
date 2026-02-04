'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface CheckoutItem {
  product: {
    id: string
    title: string
    price: number
    thumbnail: string
  }
  quantity: number
}

export default function PaymentPage() {
  const [checkout, setCheckout] = useState<CheckoutItem | null>(null)
  const [address, setAddress] = useState<any>(null)
  const [method, setMethod] = useState('card')
  const router = useRouter()

  useEffect(() => {
    const storedCheckout = localStorage.getItem('checkout')
    const storedAddress = localStorage.getItem('checkout_address')
    if (storedCheckout) {
      setCheckout(JSON.parse(storedCheckout))
    }
    if (storedAddress) {
      setAddress(JSON.parse(storedAddress))
    }
  }, [])

  const handlePlaceOrder = () => {
    localStorage.setItem('checkout_payment', JSON.stringify({ method }))
    router.push('/success?session_id=manual')
  }

  if (!checkout || !address) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Missing checkout info. Please complete address first.
        </p>
        <Link
          href="/checkout/address"
          className="inline-flex items-center px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
        >
          Go to address
        </Link>
      </div>
    )
  }

  const total = checkout.product.price * checkout.quantity

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Step 2 of 2</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">
              Choose payment
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Select your preferred payment method.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'card', label: 'Credit / Debit Card' },
              { id: 'upi', label: 'UPI / Instant Transfer' },
              { id: 'cod', label: 'Cash on Delivery' },
            ].map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setMethod(option.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl border ${
                  method === option.id
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-400/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-semibold"
          >
            Place order
          </button>
        </div>

        <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-fit space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Shipping to
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {address.name}<br />
              {address.address}<br />
              {address.city}, {address.state} {address.zip}<br />
              {address.country}<br />
              {address.phone}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Order summary
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <Image src={checkout.product.thumbnail} alt={checkout.product.title} fill className="object-cover" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Qty {checkout.quantity}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{checkout.product.title}</div>
                <div className="text-slate-600 dark:text-slate-300">${checkout.product.price}</div>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-4 flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Total</span>
              <span className="font-semibold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
