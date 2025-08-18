'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Header } from '../../components/common/Header'
import { useAuth } from '../../hooks/useAuth'
import { SERVICE_AREAS, MASSAGE_SPECIALTIES } from '../../lib/utils/constants'
import toast from 'react-hot-toast'

export default function BookPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    locationText: '',
    serviceArea: '',
    desiredDate: '',
    desiredTime: '',
    durationMinutes: 60,
    serviceType: 'Swedish Massage',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'client') {
      toast.error('Only clients can book sessions')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('event_requests')
        .insert({
          client_id: user.id,
          location_text: formData.locationText,
          service_area: formData.serviceArea,
          desired_date: formData.desiredDate || null,
          desired_time: formData.desiredTime || null,
          duration_minutes: formData.durationMinutes,
          service_type: formData.serviceType,
          notes: formData.notes || null,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Booking request submitted successfully!')
      router.push(`/book/status/${data.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit booking request')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wbw-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-wbw-charcoal mb-4">
            Book a Massage Session
          </h1>
          <p className="text-lg text-gray-600">
            Tell us your preferences and we'll connect you with qualified therapists in your area.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="serviceArea" className="block text-sm font-medium text-gray-700 mb-2">
                Service Area *
              </label>
              <select
                id="serviceArea"
                name="serviceArea"
                required
                value={formData.serviceArea}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="">Select your city</option>
                {SERVICE_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="locationText" className="block text-sm font-medium text-gray-700 mb-2">
                Specific Location *
              </label>
              <input
                id="locationText"
                name="locationText"
                type="text"
                required
                value={formData.locationText}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., My home, hotel, office address"
              />
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                Massage Type *
              </label>
              <select
                id="serviceType"
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleInputChange}
                className="select-field"
              >
                {MASSAGE_SPECIALTIES.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <select
                id="durationMinutes"
                name="durationMinutes"
                required
                value={formData.durationMinutes}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="desiredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  id="desiredDate"
                  name="desiredDate"
                  type="date"
                  value={formData.desiredDate}
                  onChange={handleInputChange}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label htmlFor="desiredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <input
                  id="desiredTime"
                  name="desiredTime"
                  type="time"
                  value={formData.desiredTime}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Any specific requests, health considerations, or preferences..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-wbw-blue mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Qualified therapists in your area will be notified</li>
                <li>• You'll receive responses within 24 hours</li>
                <li>• Choose your preferred therapist and complete booking</li>
                <li>• Enjoy your professional massage session</li>
              </ul>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Submit Booking Request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
