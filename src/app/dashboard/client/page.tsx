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

interface EventRequest {
  id: string
  location_text: string
  service_area: string
  desired_date: string | null
  desired_time: string | null
  duration_minutes: number
  service_type: string
  notes: string | null
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  square_booking_url: string | null
  created_at: string
  accepted_by: string | null
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<EventRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('event_requests')
        .select('*')
        .eq('client_id', user?.id)
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
      accepted: 'info' as const,
      completed: 'success' as const,
      declined: 'error' as const,
      cancelled: 'default' as const
    }
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
  }

  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-wbw-charcoal">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your massage therapy bookings and find new therapists.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-xl font-semibold text-wbw-charcoal mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/book">
                    <Button className="w-full" size="lg">
                      Book New Session
                    </Button>
                  </Link>
                  <Link href="/therapists">
                    <Button variant="outline" className="w-full">
                      Browse Therapists
                    </Button>
                  </Link>
                  <Link href="/reviews">
                    <Button variant="ghost" className="w-full">
                      My Reviews
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Stats */}
              <Card className="mt-6">
                <h3 className="text-lg font-semibold text-wbw-charcoal mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold">{requests.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed Sessions</span>
                    <span className="font-semibold">
                      {requests.filter(r => r.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Requests</span>
                    <span className="font-semibold">
                      {requests.filter(r => r.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-wbw-charcoal">Your Bookings</h2>
                  <Link href="/book">
                    <Button size="sm">New Booking</Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wbw-blue mx-auto"></div>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No bookings yet</p>
                    <Link href="/book">
                      <Button>Book Your First Session</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.service_type}</h3>
                            <p className="text-sm text-gray-600">{request.service_area}</p>
                          </div>
                          {getStatusBadge(request.status)}
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

                        <div className="flex justify-between items-center">
                          <Link href={`/book/status/${request.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          
                          {request.status === 'accepted' && request.square_booking_url && (
                            <a
                              href={request.square_booking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm">
                                Complete Booking
                              </Button>
                            </a>
                          )}
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
