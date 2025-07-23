'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Star, Clock, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase, Therapist } from '@/lib/supabase'
import EventBookingForm from '@/components/EventBookingForm'
import Link from 'next/link'
import Image from 'next/image'

export default function ClientsPage() {
  const [location, setLocation] = useState<string>('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTherapists()
  }, [])

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .eq('status', 'approved')
        .order('total_earnings', { ascending: false })
      
      if (error) throw error
      setTherapists(data || [])
    } catch (error) {
      console.error('Error fetching therapists:', error)
    } finally {
      setLoading(false)
    }
  }

  const detectLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            )
            const data = await response.json()
            setLocation(`${data.city}, ${data.principalSubdivision}`)
          } catch (error) {
            console.error('Error getting location:', error)
            setLocation('Location detected')
          } finally {
            setIsLoadingLocation(false)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          setIsLoadingLocation(false)
        }
      )
    } else {
      setIsLoadingLocation(false)
    }
  }

  const handleBookNow = (therapistId?: string) => {
    const squareBaseUrl = process.env.NEXT_PUBLIC_SQUARE_APPOINTMENTS_BASE_URL || 'https://squareup.com/appointments/book/'
    const locationParam = location ? `?location=${encodeURIComponent(location)}` : ''
    const therapistParam = therapistId ? `therapist-${therapistId}` : ''
    window.open(`${squareBaseUrl}${therapistParam}${locationParam}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Worker Bee Wellness" 
                width={75} 
                height={35}
                className="h-9"
              />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/clients" className="text-blue-600 font-semibold">For Clients</Link>
              <Link href="/therapist" className="text-gray-600 hover:text-blue-600">For Therapists</Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Find Your Perfect <span className="text-gray-900">Massage Therapist</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Browse our network of licensed, verified massage therapists and book your session today.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-lg font-semibold">Your Location</span>
          </div>
          
          {location ? (
            <div className="mb-4">
              <p className="text-gray-600">Searching near:</p>
              <p className="font-semibold text-gray-900">{location}</p>
            </div>
          ) : (
            <div className="mb-4">
              <Button 
                onClick={detectLocation} 
                disabled={isLoadingLocation}
                variant="outline"
                className="w-full"
              >
                {isLoadingLocation ? 'Detecting...' : 'Detect My Location'}
              </Button>
            </div>
          )}

          <Button 
            onClick={() => handleBookNow()}
            size="lg"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full px-12 py-6 text-lg"
          >
            <Search className="w-4 h-4 mr-2" />
            Find Therapists
          </Button>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Featured Therapists</h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : therapists.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <div key={therapist.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">
                        {therapist.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{therapist.name}</h4>
                    <div className="flex items-center justify-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">Verified Professional</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{therapist.bio}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                      {therapist.specialties.length > 2 && (
                        <span className="text-xs text-gray-500">+{therapist.specialties.length - 2} more</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link href={`/therapist/${therapist.id}`}>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => handleBookNow(therapist.id)}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full px-8 py-3"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Therapists Available</h4>
              <p className="text-gray-600">Check back soon as we add more licensed professionals to our network.</p>
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Request an Event</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Book Massage Therapy for Your Event</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Planning a corporate wellness event, spa party, or group session? Submit your request and licensed therapists in your area will be notified.
              </p>
            </div>
            <EventBookingForm />
          </div>
        </div>
      </main>
    </div>
  )
}
