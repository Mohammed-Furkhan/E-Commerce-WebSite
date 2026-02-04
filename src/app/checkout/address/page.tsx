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

export default function AddressPage() {
  const [checkout, setCheckout] = useState<CheckoutItem | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('United States')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('checkout')
    if (stored) {
      setCheckout(JSON.parse(stored))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const addressData = { name, phone, address, city, state, zip, country }
    localStorage.setItem('checkout_address', JSON.stringify(addressData))
    router.push('/checkout/payment')
  }

  if (!checkout) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Your checkout is empty. Choose a product to continue.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
        >
          Browse products
        </Link>
      </div>
    )
  }

  const total = checkout.product.price * checkout.quantity

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Step 1 of 2</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">
              Add delivery address
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              We will use this to deliver your order.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="input-field rounded-full" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone number" className="input-field rounded-full" />
          </div>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Street address" className="input-field rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City" className="input-field rounded-full" />
            <input value={state} onChange={(e) => setState(e.target.value)} required placeholder="State" className="input-field rounded-full" />
            <input value={zip} onChange={(e) => setZip(e.target.value)} required placeholder="ZIP code" className="input-field rounded-full" />
          </div>
          <input value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="Country" className="input-field rounded-full" />

          <button
            type="submit"
            className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-full font-semibold"
          >
            Continue to payment
          </button>
        </form>

        <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
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
          <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-4 flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">Total</span>
            <span className="font-semibold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
