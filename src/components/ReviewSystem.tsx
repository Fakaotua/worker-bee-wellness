'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase, Review } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Star, Flag, MessageSquare } from 'lucide-react'

interface ReviewSystemProps {
  therapistId: string
  showAddReview?: boolean
}

export default function ReviewSystem({ therapistId, showAddReview = true }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    clientName: ''
  })

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [therapistId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newReview.clientName.trim() || !newReview.comment.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          therapist_id: therapistId,
          client_name: newReview.clientName,
          rating: newReview.rating,
          comment: newReview.comment,
          is_flagged: false,
          is_approved: true,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      setNewReview({ rating: 5, comment: '', clientName: '' })
      setShowReviewForm(false)
      fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  const flagReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_flagged: true })
        .eq('id', reviewId)
      
      if (error) throw error
      fetchReviews()
      alert('Review has been flagged for moderation')
    } catch (error) {
      console.error('Error flagging review:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center mt-1">
              {renderStars(Math.round(averageRating))}
              <span className="ml-2 text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        
        {showAddReview && (
          <Button
            onClick={() => setShowReviewForm(true)}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            Write Review
          </Button>
        )}
      </div>

      {showReviewForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h4>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={newReview.clientName}
                onChange={(e) => setNewReview({ ...newReview, clientName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview({ ...newReview, rating })
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
            <p className="text-gray-600">Be the first to leave a review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center mb-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-medium text-gray-900">{review.client_name}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => flagReview(review.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
