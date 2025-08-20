'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { Header } from '../../../components/common/Header'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { AuthGuard } from '../../../components/auth/AuthGuard'
import { useAuth } from '../../../hooks/useAuth'
import Link from 'next/link'
import { format } from 'date-fns'

interface TherapistProfile {
  id: string
  display_name: string
  bio: string | null
  photo_url: string | null
  specialties: string[]
  service_area: string
  license_number: string | null
  years_experience: number | null
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  major_change_pending: boolean
  base_commission_rate: number
  commission_override: number | null
}

interface EventRequest {
  id: string
  client_id: string
  location_text: string
  service_area: string
  desired_date: string | null
  desired_time: string | null
  duration_minutes: number
  service_type: string
  notes: string | null
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  created_at: string
}

export default function TherapistDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<TherapistProfile | null>(null)
  const [requests, setRequests] = useState<EventRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchRequests()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchRequests = async () => {
    try {
      if (!profile) return
      
      const { data, error } = await supabase
        .from('event_requests')
        .select('*')
        .eq('service_area', profile.service_area)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'warning' as const,
      approved: 'success' as const,
      rejected: 'error' as const,
      suspended: 'error' as const
    }
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
  }

  const getCurrentTier = () => {
    const rate = profile?.commission_override || profile?.base_commission_rate || 60
    if (rate >= 80) return { name: 'Gold', color: 'text-yellow-600' }
    if (rate >= 70) return { name: 'Silver', color: 'text-gray-600' }
    return { name: 'Bronze', color: 'text-orange-600' }
  }

  if (!profile) {
    return (
      <AuthGuard requiredRole="therapist">
        <div className="min-h-screen bg-gray-50">
          <Header user={user} />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="text-center">
              <h1 className="text-2xl font-bold text-wbw-charcoal mb-4">
                Complete Your Therapist Profile
              </h1>
              <p className="text-gray-600 mb-6">
                To start receiving booking requests, you need to complete your therapist onboarding.
              </p>
              <Link href="/dashboard/therapist/onboarding">
                <Button size="lg">
                  Start Onboarding
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const tier = getCurrentTier()

  return (
    <AuthGuard requiredRole="therapist">
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-wbw-charcoal">
              Welcome back, {profile.display_name}!
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600">Status: {getStatusBadge(profile.status)}</p>
              <p className="text-gray-600">
                Commission Tier: <span className={`font-semibold ${tier.color}`}>{tier.name}</span>
              </p>
            </div>
          </div>

          {profile.status === 'pending' && (
            <div className="mb-6">
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="flex items-center">
                  <div className="text-yellow-600 mr-3">⏳</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Profile Under Review</h3>
                    <p className="text-yellow-700 text-sm">
                      Your therapist profile is being reviewed by our admin team. You&apos;ll be notified once approved.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {profile.status === 'rejected' && (
            <div className="mb-6">
              <Card className="bg-red-50 border-red-200">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3">❌</div>
                  <div>
                    <h3 className="font-semibold text-red-800">Profile Rejected</h3>
                    <p className="text-red-700 text-sm">
                      Your profile needs updates. Please contact support for details.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-xl font-semibold text-wbw-charcoal mb-4">Profile Summary</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Service Area</span>
                    <p className="font-medium">{profile.service_area}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Experience</span>
                    <p className="font-medium">{profile.years_experience || 'Not specified'} years</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Commission Rate</span>
                    <p className="font-medium">
                      {profile.commission_override || profile.base_commission_rate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Specialties</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(profile.specialties || []).map((specialty, index) => (
                        <Badge key={index} size="sm">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Link href="/dashboard/therapist/profile">
                    <Button variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard/therapist/earnings">
                    <Button variant="ghost" className="w-full">
                      View Earnings
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Available Requests */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-wbw-charcoal">
                    Available Requests in {profile.service_area}
                  </h2>
                  <Button 
                    onClick={fetchRequests}
                    variant="outline" 
                    size="sm"
                  >
                    Refresh
                  </Button>
                </div>

                {profile.status !== 'approved' ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      You&apos;ll see booking requests here once your profile is approved.
                    </p>
                  </div>
                ) : loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wbw-blue mx-auto"></div>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No new requests in your area</p>
                    <p className="text-sm text-gray-400">
                      Check back later or expand your service area in your profile.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.service_type}</h3>
                            <p className="text-sm text-gray-600">{request.location_text}</p>
                          </div>
                          <Badge variant="warning">New Request</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Duration:</span> {request.duration_minutes} minutes
                          </div>
                          <div>
                            <span className="font-medium">Requested:</span>{' '}
                            {format(new Date(request.created_at), 'MMM d, yyyy')}
                          </div>
                          {request.desired_date && (
                            <div>
                              <span className="font-medium">Preferred Date:</span>{' '}
                              {format(new Date(request.desired_date), 'MMM d, yyyy')}
                            </div>
                          )}
                          {request.desired_time && (
                            <div>
                              <span className="font-medium">Preferred Time:</span> {request.desired_time}
                            </div>
                          )}
                        </div>

                        {request.notes && (
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Notes:</span> {request.notes}
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Accept Request
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
