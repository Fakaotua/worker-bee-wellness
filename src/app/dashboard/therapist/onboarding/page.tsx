'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { Header } from '../../../../components/common/Header'
import { AuthGuard } from '../../../../components/auth/AuthGuard'
import { useAuth } from '../../../../hooks/useAuth'
import { SERVICE_AREAS, MASSAGE_SPECIALTIES } from '../../../../lib/utils/constants'
import toast from 'react-hot-toast'

export default function TherapistOnboarding() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    serviceArea: '',
    licenseNumber: '',
    yearsExperience: '',
    specialties: [] as string[],
    photoUrl: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('therapists')
        .insert({
          user_id: user.id,
          display_name: formData.displayName,
          bio: formData.bio || null,
          service_area: formData.serviceArea,
          license_number: formData.licenseNumber || null,
          years_experience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
          specialties: formData.specialties,
          photo_url: formData.photoUrl || null,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Profile submitted for review!')
      router.push('/dashboard/therapist')
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit profile')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.displayName && formData.serviceArea
      case 2:
        return formData.specialties.length > 0
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  return (
    <AuthGuard requiredRole="therapist">
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-wbw-charcoal mb-4">
              Therapist Onboarding
            </h1>
            <p className="text-lg text-gray-600">
              Complete your profile to start receiving booking requests
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 3</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-wbw-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-wbw-charcoal">Basic Information</h2>
                  <p className="text-gray-600">Tell us about yourself and your practice</p>
                </div>

                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="How you'd like to be shown to clients"
                  />
                </div>

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
                    <option value="">Select your service area</option>
                    {SERVICE_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    id="yearsExperience"
                    name="yearsExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Years practicing massage therapy"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Tell clients about your background, training, and approach to massage therapy..."
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-wbw-charcoal">Specialties</h2>
                  <p className="text-gray-600">Select your massage therapy specialties</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Your Specialties * (Choose at least one)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MASSAGE_SPECIALTIES.map(specialty => (
                      <label
                        key={specialty}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.specialties.includes(specialty)
                            ? 'border-wbw-blue bg-blue-50 text-wbw-blue'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {formData.specialties.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {formData.specialties.length} specialties
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-wbw-charcoal">Professional Details</h2>
                  <p className="text-gray-600">Add your credentials and licensing information</p>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Your massage therapy license number"
                  />
                </div>

                <div>
                  <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Add a professional headshot to build trust with clients
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-wbw-blue mb-2">Next Steps</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your profile will be reviewed by our admin team</li>
                    <li>• You&apos;ll be notified once approved (usually within 24-48 hours)</li>
                    <li>• After approval, you can start receiving booking requests</li>
                    <li>• Upload required documents in your dashboard</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={!isStepValid()}
                >
                  Submit for Review
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
