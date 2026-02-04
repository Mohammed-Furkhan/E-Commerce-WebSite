'use client'

import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  What would you like to do next?
                </h3>
                <ul className="mt-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Review your cart and try again</li>
                  <li>• Continue browsing our products</li>
                  <li>• Contact support if you need help</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/cart"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition-colors"
            >
              Return to Cart
            </Link>
            <Link
              href="/products"
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-md text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
