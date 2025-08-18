'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { Button } from '../../../components/ui/Button'
import ReviewSystem from '../../../components/ReviewSystem'
import { ArrowLeft, MapPin, Award, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Therapist {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  photo_url?: string;
  specialties: string[];
  service_area: string;
  license_number?: string;
  years_experience?: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  major_change_pending: boolean;
  base_commission_rate: number;
  commission_override?: number;
  created_at: string;
  updated_at: string;
}

export default function TherapistProfilePage() {
  const params = useParams()
  const therapistId = params.id as string
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const { data, error } = await supabase
          .from('therapists')
          .select('*')
          .eq('id', therapistId)
          .eq('status', 'approved')
          .single()
        
        if (error) throw error
        setTherapist(data)
      } catch (error) {
        console.error('Error fetching therapist:', error)
      } finally {
        setLoading(false)
      }
    }

    if (therapistId) {
      fetchTherapist()
    }
  }, [therapistId])

  const handleBookNow = () => {
    const squareUrl = process.env.NEXT_PUBLIC_SQUARE_APPOINTMENTS_BASE_URL || 'https://squareup.com/appointments/book/'
    window.open(`${squareUrl}demo-therapist-${therapistId}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading therapist profile...</p>
        </div>
      </div>
    )
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Therapist Not Found</h2>
          <p className="text-gray-600 mb-6">The therapist you&apos;re looking for doesn&apos;t exist or isn&apos;t approved yet.</p>
          <Link href="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-8">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Worker Bee Wellness" 
                width={75} 
                height={35}
                className="h-9"
              />
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {therapist.display_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{therapist.display_name}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Licensed Massage Therapist</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="text-sm text-gray-600">Verified Professional</span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <Button 
                      onClick={handleBookNow}
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full md:w-auto"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      $0.00
                    </div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      Tier 1
                    </div>
                    <div className="text-sm text-gray-600">Commission Level</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {therapist.created_at ? new Date(therapist.created_at).getFullYear() : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Member Since</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <ReviewSystem therapistId={therapistId} showAddReview={true} />
        </div>
      </main>
    </div>
  )
}
