'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const getLocalUsers = () => {
    const stored = localStorage.getItem('users')
    return stored ? JSON.parse(stored) : []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      let registered = false
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        })

        if (res.ok) {
          registered = true
        }
      } catch {
        // Fall through to local register
      }

      if (!registered) {
        const users = getLocalUsers()
        if (users.some((u: any) => u.email === email)) {
          setError('User already exists')
          return
        }
        users.push({ id: `u-${Date.now()}`, name, email, password })
        localStorage.setItem('users', JSON.stringify(users))
      }

      router.push('/login?message=Registration successful. Please log in.')
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/80">Create account</p>
          <h1 className="text-5xl font-semibold mt-4">Join the new drops.</h1>
          <p className="text-slate-300 mt-4 max-w-lg">
            Save your favorites, track orders, and enjoy a smoother checkout.
          </p>
        </div>
        <div className="bg-white text-slate-900 rounded-3xl p-10 shadow-xl">
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p className="text-sm text-slate-600 mt-2">Create your account in minutes.</p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input-field rounded-full"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field rounded-full"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field rounded-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input-field rounded-full"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-full font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-slate-900">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
