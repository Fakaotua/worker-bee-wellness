'use client'

import { useState } from 'react'
import { MapPin, Star, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const [location, setLocation] = useState<string>('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

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

  const handleBookNow = () => {
    const squareBaseUrl = process.env.NEXT_PUBLIC_SQUARE_APPOINTMENTS_BASE_URL || 'https://squareup.com/appointments/book/'
    const locationParam = location ? `?location=${encodeURIComponent(location)}` : ''
    window.open(`${squareBaseUrl}${locationParam}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐝</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Bee Wellness</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">For Clients</a>
              <Link href="/therapist" className="text-gray-600 hover:text-gray-900">For Therapists</Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Massage Therapy
            <span className="block text-amber-600">At Your Fingertips</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed massage therapists in your area. Quality wellness services 
            delivered by verified professionals who care about your well-being.
          </p>

          {/* Location Detection */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-8">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-amber-600 mr-2" />
              <span className="text-lg font-semibold">Find Therapists Near You</span>
            </div>
            
            {location ? (
              <div className="mb-4">
                <p className="text-gray-600">Your location:</p>
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
              onClick={handleBookNow}
              size="lg"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Book Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensed Professionals</h3>
              <p className="text-gray-600">All therapists are verified, licensed, and insured for your safety and peace of mind.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Read reviews from real clients and choose therapists with proven track records.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple, secure booking process with flexible scheduling to fit your lifestyle.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🐝</span>
                </div>
                <h3 className="text-xl font-bold">Worker Bee Wellness</h3>
              </div>
              <p className="text-gray-400">Connecting you with licensed massage therapists for quality wellness services.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Book a Session</a></li>
                <li><a href="#" className="hover:text-white">Find Therapists</a></li>
                <li><a href="#" className="hover:text-white">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Therapists</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/therapist" className="hover:text-white">Join Our Platform</Link></li>
                <li><Link href="/therapist" className="hover:text-white">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white">Earnings</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Worker Bee Wellness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
