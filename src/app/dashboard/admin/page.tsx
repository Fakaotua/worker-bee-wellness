'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { Header } from '../../../components/common/Header'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { AuthGuard } from '../../../components/auth/AuthGuard'
import { useAuth } from '../../../hooks/useAuth'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface TherapistProfile {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  service_area: string
  license_number: string | null
  years_experience: number | null
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  major_change_pending: boolean
  created_at: string
  users: {
    email: string
    first_name: string | null
    last_name: string | null
  }
}

interface Review {
  id: string
  rating: number
  review_text: string | null
  flagged: boolean
  flag_reason: string | null
  admin_decision: 'keep' | 'remove' | null
  created_at: string
  event_requests: {
    service_type: string
  }
  users: {
    first_name: string | null
    last_name: string | null
  }
  therapists: {
    display_name: string
  }
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [pendingTherapists, setPendingTherapists] = useState<TherapistProfile[]>([])
  const [flaggedReviews, setFlaggedReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'therapists' | 'reviews'>('therapists')
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchPendingTherapists()
      fetchFlaggedReviews()
    }
  }, [user])

  const fetchPendingTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select(`
          *,
          users (email, first_name, last_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error
      setPendingTherapists(data || [])
    } catch (error) {
      console.error('Error fetching pending therapists:', error)
    }
  }

  const fetchFlaggedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          event_requests (service_type),
          users (first_name, last_name),
          therapists (display_name)
        `)
        .eq('flagged', true)
        .is('admin_decision', null)
        .order('flagged_at', { ascending: true })

      if (error) throw error
      setFlaggedReviews(data || [])
    } catch (error) {
      console.error('Error fetching flagged reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTherapistDecision = async (therapistId: string, decision: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('therapists')
        .update({ status: decision })
        .eq('id', therapistId)

      if (error) throw error

      toast.success(`Therapist ${decision} successfully`)
      fetchPendingTherapists()
    } catch (error: any) {
      toast.error(error.message || `Failed to ${decision} therapist`)
    }
  }

  const handleReviewDecision = async (reviewId: string, decision: 'keep' | 'remove', reason?: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          admin_decision: decision,
          admin_decision_by: user?.id,
          admin_decision_at: new Date().toISOString(),
          admin_decision_reason: reason || null
        })
        .eq('id', reviewId)

      if (error) throw error

      toast.success(`Review ${decision === 'keep' ? 'kept' : 'removed'} successfully`)
      fetchFlaggedReviews()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review')
    }
  }

  const stats = {
    pendingTherapists: pendingTherapists.length,
    flaggedReviews: flaggedReviews.length,
    totalActions: pendingTherapists.length + flaggedReviews.length
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-wbw-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage therapist approvals and moderate content
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-wbw-blue">{stats.pendingTherapists}</div>
                <div className="text-sm text-gray-600">Pending Therapists</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-wbw-yellow">{stats.flaggedReviews}</div>
                <div className="text-sm text-gray-600">Flagged Reviews</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-wbw-charcoal">{stats.totalActions}</div>
                <div className="text-sm text-gray-600">Total Actions Needed</div>
              </div>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('therapists')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'therapists'
                      ? 'border-wbw-blue text-wbw-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Therapist Approvals ({stats.pendingTherapists})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-wbw-blue text-wbw-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Review Moderation ({stats.flaggedReviews})
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wbw-blue mx-auto"></div>
            </div>
          ) : (
            <Card>
              {activeTab === 'therapists' && (
                <div>
                  <h2 className="text-xl font-semibold text-wbw-charcoal mb-6">
                    Pending Therapist Approvals
                  </h2>
                  
                  {pendingTherapists.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending therapist approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingTherapists.map((therapist) => (
                        <div key={therapist.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {therapist.display_name}
                              </h3>
                              <p className="text-gray-600">
                                {therapist.users.first_name} {therapist.users.last_name} • {therapist.users.email}
                              </p>
                            </div>
                            <Badge variant="warning">Pending Review</Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Service Area:</span>
                              <p className="text-gray-900">{therapist.service_area}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Experience:</span>
                              <p className="text-gray-900">{therapist.years_experience || 'Not specified'} years</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">License Number:</span>
                              <p className="text-gray-900">{therapist.license_number || 'Not provided'}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Applied:</span>
                              <p className="text-gray-900">{format(new Date(therapist.created_at), 'MMM d, yyyy')}</p>
                            </div>
                          </div>

                          {therapist.bio && (
                            <div className="mb-4">
                              <span className="text-sm font-medium text-gray-700">Bio:</span>
                              <p className="text-gray-900 mt-1">{therapist.bio}</p>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleTherapistDecision(therapist.id, 'approved')}
                              className="flex-1"
                            >
                              Approve Therapist
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleTherapistDecision(therapist.id, 'rejected')}
                              className="flex-1"
                            >
                              Reject Application
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-xl font-semibold text-wbw-charcoal mb-6">
                    Flagged Reviews
                  </h2>
                  
                  {flaggedReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No flagged reviews to moderate</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {flaggedReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-lg ${
                                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  for {review.event_requests.service_type}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">
                                By {review.users.first_name} {review.users.last_name} • 
                                For {review.therapists.display_name}
                              </p>
                            </div>
                            <Badge variant="error">Flagged</Badge>
                          </div>

                          {review.review_text && (
                            <div className="mb-4">
                              <p className="text-gray-900 italic">"{review.review_text}"</p>
                            </div>
                          )}

                          <div className="mb-4">
                            <span className="text-sm font-medium text-red-700">Flag Reason:</span>
                            <p className="text-red-600">{review.flag_reason}</p>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleReviewDecision(review.id, 'keep')}
                              variant="outline"
                              className="flex-1"
                            >
                              Keep Review
                            </Button>
                            <Button
                              onClick={() => handleReviewDecision(review.id, 'remove', 'Inappropriate content')}
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              Remove Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
