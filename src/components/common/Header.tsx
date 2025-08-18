'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'

interface HeaderProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'therapist' | 'admin'
    first_name?: string
    last_name?: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      if (response.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'client': return '/dashboard/client'
      case 'therapist': return '/dashboard/therapist'
      case 'admin': return '/dashboard/admin'
      default: return '/login'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-wbw-blue">
                🐝 Worker Bee Wellness
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/book" className="text-gray-700 hover:text-wbw-blue transition-colors">
              Book a Session
            </Link>
            <Link href="/therapists" className="text-gray-700 hover:text-wbw-blue transition-colors">
              Find Therapists
            </Link>
            <Link href="/become-therapist" className="text-gray-700 hover:text-wbw-blue transition-colors">
              Become a Therapist
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hello, {user.first_name || user.email}
                </span>
                <Link href={getDashboardLink()}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-wbw-blue"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/book" className="text-gray-700 hover:text-wbw-blue">
                Book a Session
              </Link>
              <Link href="/therapists" className="text-gray-700 hover:text-wbw-blue">
                Find Therapists
              </Link>
              <Link href="/become-therapist" className="text-gray-700 hover:text-wbw-blue">
                Become a Therapist
              </Link>
              {!user && (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-wbw-blue">
                    Sign In
                  </Link>
                  <Link href="/signup" className="text-gray-700 hover:text-wbw-blue">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
