'use client'

import React, { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: ReactNode
  requiredRole?: 'client' | 'therapist' | 'admin'
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = '/login' }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }
      
      if (requiredRole && user.role !== requiredRole) {
        switch (user.role) {
          case 'client':
            router.push('/dashboard/client')
            break
          case 'therapist':
            router.push('/dashboard/therapist')
            break
          case 'admin':
            router.push('/dashboard/admin')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [user, loading, requiredRole, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
