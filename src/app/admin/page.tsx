'use client'

import React, { useState, useEffect } from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { supabase, Therapist, Review } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, X, Eye, Flag, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminPage() {
  const [, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<'therapists' | 'reviews'>('therapists')
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        setIsAuthenticated(true)
        fetchTherapists()
        fetchReviews()
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTherapists(data || [])
    } catch (error) {
      console.error('Error fetching therapists:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_flagged', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please check your credentials.')
    }
  }

  const updateTherapistStatus = async (therapistId: string, status: 'approved' | 'rejected' | 'needs_edits', notes?: string) => {
    try {
      const { error } = await supabase
        .from('therapists')
        .update({ 
          status, 
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', therapistId)
      
      if (error) throw error
      fetchTherapists()
      setSelectedTherapist(null)
    } catch (error) {
      console.error('Error updating therapist status:', error)
    }
  }

  const updateReviewStatus = async (reviewId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          is_approved: isApproved,
          is_flagged: false
        })
        .eq('id', reviewId)
      
      if (error) throw error
      fetchReviews()
    } catch (error) {
      console.error('Error updating review status:', error)
    }
  }

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
      
      if (error) throw error
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 mt-2">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Worker Bee Wellness" 
                  width={60} 
                  height={28}
                  className="h-7"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Dashboard</span>
              <Button 
                variant="outline" 
                onClick={() => auth.signOut()}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage therapist approvals and review moderation</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('therapists')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'therapists'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Therapist Applications ({therapists.filter(t => t.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Flagged Reviews ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'therapists' && (
              <div className="space-y-6">
                {therapists.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications</h3>
                    <p className="text-gray-600">No therapist applications to review at this time.</p>
                  </div>
                ) : (
                  therapists.map((therapist) => (
                    <div key={therapist.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Applied on {new Date(therapist.created_at).toLocaleDateString()}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                            therapist.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            therapist.status === 'approved' ? 'bg-green-100 text-green-800' :
                            therapist.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {therapist.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTherapist(therapist)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Bio</p>
                          <p className="text-sm text-gray-600 mt-1">{therapist.bio.substring(0, 150)}...</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Specialties</p>
                          <p className="text-sm text-gray-600 mt-1">{therapist.specialties.join(', ')}</p>
                        </div>
                      </div>

                      {therapist.status === 'pending' && (
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            onClick={() => updateTherapistStatus(therapist.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTherapistStatus(therapist.id, 'needs_edits', 'Please update your documents')}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Request Edits
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTherapistStatus(therapist.id, 'rejected', 'Application does not meet requirements')}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Flagged Reviews</h3>
                    <p className="text-gray-600">No reviews require moderation at this time.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">by {review.client_name}</span>
                          </div>
                          <p className="text-sm text-gray-600">Posted on {new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          FLAGGED
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-900">{review.comment}</p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          onClick={() => updateReviewStatus(review.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteReview(review.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Review Application</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTherapist(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Name</h4>
                  <p className="text-gray-600">{selectedTherapist.name}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Bio</h4>
                  <p className="text-gray-600">{selectedTherapist.bio}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Specialties</h4>
                  <p className="text-gray-600">{selectedTherapist.specialties.join(', ')}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Documents</h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Massage License</span>
                      <span className="text-xs text-gray-500">
                        {selectedTherapist.license_document_url ? 'Uploaded' : 'Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Insurance Document</span>
                      <span className="text-xs text-gray-500">
                        {selectedTherapist.insurance_document_url ? 'Uploaded' : 'Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Government ID</span>
                      <span className="text-xs text-gray-500">
                        {selectedTherapist.government_id_url ? 'Uploaded' : 'Not uploaded'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTherapist.admin_notes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Admin Notes</h4>
                    <p className="text-gray-600">{selectedTherapist.admin_notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTherapist(null)}
                >
                  Close
                </Button>
                {selectedTherapist.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => updateTherapistStatus(selectedTherapist.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => updateTherapistStatus(selectedTherapist.id, 'rejected')}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
