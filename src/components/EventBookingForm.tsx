'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Send, User, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface EventBookingFormProps {
  onSuccess?: () => void
}

export default function EventBookingForm({ onSuccess }: EventBookingFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    locationCity: '',
    locationState: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('Demo mode environment variable:', process.env.NEXT_PUBLIC_DEMO_MODE)
    console.log('Demo mode check result:', process.env.NEXT_PUBLIC_DEMO_MODE === 'true')

    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      setTimeout(() => {
        setSubmitted(true)
        setFormData({
          clientName: '',
          clientEmail: '',
          locationCity: '',
          locationState: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        })
        setIsSubmitting(false)
        if (onSuccess) onSuccess()
      }, 1000)
      return
    }

    try {
      const { error } = await supabase
        .from('event_requests')
        .insert({
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          location_city: formData.locationCity,
          location_state: formData.locationState,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          notes: formData.notes,
          status: 'pending'
        })

      if (error) throw error

      setSubmitted(true)
      setFormData({
        clientName: '',
        clientEmail: '',
        locationCity: '',
        locationState: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error submitting event request:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to submit event request: ${errorMessage}. Please ensure the database is properly configured.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Request Submitted!</h3>
        <p className="text-gray-600">
          {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' 
            ? 'Demo: Thank you for your request! (This is a demo - no data was actually saved)'
            : 'Thank you for your request. Therapists in your area will be notified and may contact you soon.'
          }
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {/* Client Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            City
          </label>
          <input
            type="text"
            id="locationCity"
            name="locationCity"
            value={formData.locationCity}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="locationState" className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            id="locationState"
            name="locationState"
            value={formData.locationState}
            onChange={handleChange}
            required
            placeholder="e.g., AZ"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Date & Time (no longer required temporarily) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            /* required */
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Preferred Time
          </label>
          <input
            type="time"
            id="preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            /* required */
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes (no longer required temporarily) */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          /* required */
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any specific requirements, preferences, or details about your event..."
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-8 rounded-full text-lg disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
            Submitting Request...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Event Request
          </>
        )}
      </Button>
    </form>
  )
}
