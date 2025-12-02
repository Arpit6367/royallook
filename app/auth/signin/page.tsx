'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // 🚀 AUTO-REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role

      if (role === 'admin') router.push('/admin')
      else if (role === 'coach') router.push('/coach')
      else router.push('/learn')
    }
  }, [session, status, router])

  // Show nothing while session loads
  if (status === 'loading') return <div>Loading...</div>

  // Show nothing if redirecting
  if (status === 'authenticated') return null

  // 👇 The sign-in form appears ONLY for unauthenticated users
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#769656] to-[#5C1F1C] py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm">
          Don’t have an account? <Link href="/auth/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
