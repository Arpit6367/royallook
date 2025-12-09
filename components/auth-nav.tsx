'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, User, BookOpen, Shield } from 'lucide-react'

export function AuthNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/learn">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Learn</span>
          </Button>
        </Link>
        
        {session.user.role === 'ADMIN' && (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        )}

        {session.user.role === 'COACH' && (
          <Link href="/coach">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">COACH</span>
            </Button>
          </Link>
        )}
        
        <div className="flex items-center gap-2 px-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700 hidden md:inline">
            {session.user.name || session.user.email}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/learn">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Learn</span>
        </Button>
      </Link>
      
      <Link href="/auth/signin">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      
      <Link href="/auth/signup">
        <Button size="sm" className="bg-[#769656] hover:bg-[#5C1F1C]">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}
