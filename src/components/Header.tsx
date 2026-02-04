'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }

    // Get cart count
    const cart = localStorage.getItem('cart')
    if (cart) {
      const cartItems = JSON.parse(cart)
      const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(count)
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        const cartItems = JSON.parse(cart)
        const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
        setCartCount(count)
      } else {
        setCartCount(0)
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <header className="bg-[#2874F0] text-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            E-Shop
            <span className="text-yellow-300">+</span>
          </Link>

          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <input
                className="w-full rounded-sm px-4 py-2 text-slate-900 placeholder-slate-600 focus:outline-none"
                placeholder="Search for products, brands and more"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                ⌕
              </span>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative px-3 py-2 rounded-sm bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-sm font-semibold">Cart</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-sm bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:block">{user.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg py-1 z-10 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link href="/login" className="px-4 py-2 bg-white text-[#2874F0] rounded-sm font-semibold">
                  Login
                </Link>
                <Link href="/register" className="hidden lg:inline text-white/90 hover:text-white transition-colors">
                  Become a Seller
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-white/90 transition-colors">
                Home
              </Link>
              <Link href="/products" className="hover:text-white/90 transition-colors">
                Products
              </Link>
              <Link href="/about" className="hover:text-white/90 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-white/90 transition-colors">
                Contact
              </Link>
              {!user && (
                <>
                  <Link href="/login" className="bg-white text-[#2874F0] px-4 py-2 rounded-sm font-semibold">
                    Login
                  </Link>
                  <Link href="/register" className="text-white/90 hover:text-white transition-colors">
                    Become a Seller
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
