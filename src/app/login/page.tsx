'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg) setMessage(msg)
  }, [searchParams])

  const getLocalUsers = () => {
    const stored = localStorage.getItem('users')
    return stored ? JSON.parse(stored) : []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let loggedIn = false
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (res.ok) {
          const data = await res.json()
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          loggedIn = true
        }
      } catch {
        // Fall through to local auth
      }

      if (!loggedIn) {
        const users = getLocalUsers()
        const user = users.find((u: any) => u.email === email && u.password === password)
        if (!user) {
          setError('Invalid email or password')
          return
        }
        localStorage.setItem('token', `demo-${Date.now()}`)
        localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email: user.email }))
      }

      router.push('/')
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
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/80">Welcome back</p>
          <h1 className="text-5xl font-semibold mt-4">Sign in to continue shopping.</h1>
          <p className="text-slate-300 mt-4 max-w-lg">
            Access your orders, saved items, and a faster checkout experience.
          </p>
        </div>
        <div className="bg-white text-slate-900 rounded-3xl p-10 shadow-xl">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="text-sm text-slate-600 mt-2">Use your email and password.</p>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              required
              className="input-field rounded-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-full font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-slate-900">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
