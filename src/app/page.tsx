import Link from 'next/link'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Header } from '../components/common/Header'
import { getUser } from '../lib/auth/session'

export default async function Home() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wbw-blue to-wbw-light-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🐝 Worker Bee Wellness
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with licensed massage therapists in your area. 
              Professional wellness services at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Book a Session
                </Button>
              </Link>
              <Link href="/become-therapist">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-wbw-blue">
                  Become a Therapist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-wbw-charcoal mb-4">
              Why Choose Worker Bee Wellness?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect you with verified, licensed massage therapists who bring professional wellness services directly to you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-wbw-charcoal mb-2">
                Licensed &amp; Verified
              </h3>
              <p className="text-gray-600">
                All our therapists are licensed professionals with verified credentials and insurance.
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-wbw-charcoal mb-2">
                Local Matches
              </h3>
              <p className="text-gray-600">
                Find qualified therapists in your area who can provide services at your location.
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-wbw-charcoal mb-2">
                Transparent Reviews
              </h3>
              <p className="text-gray-600">
                Read authentic reviews from verified clients to make informed decisions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-wbw-charcoal mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-wbw-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-wbw-charcoal mb-2">Choose Location</h3>
              <p className="text-gray-600 text-sm">Select your city and preferred service area</p>
            </div>

            <div className="text-center">
              <div className="bg-wbw-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-wbw-charcoal mb-2">Submit Request</h3>
              <p className="text-gray-600 text-sm">Tell us your preferences and schedule</p>
            </div>

            <div className="text-center">
              <div className="bg-wbw-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-wbw-charcoal mb-2">Get Matched</h3>
              <p className="text-gray-600 text-sm">Qualified therapists respond to your request</p>
            </div>

            <div className="text-center">
              <div className="bg-wbw-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-wbw-charcoal mb-2">Book &amp; Relax</h3>
              <p className="text-gray-600 text-sm">Complete booking and enjoy your session</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-wbw-yellow py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Professional Wellness?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of satisfied clients who trust Worker Bee Wellness for their massage therapy needs.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-wbw-yellow hover:bg-gray-100">
              Book Your First Session
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wbw-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">🐝 Worker Bee Wellness</h3>
              <p className="text-gray-300 text-sm">
                Connecting you with licensed massage therapists for professional wellness services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/book" className="hover:text-white">Book a Session</Link></li>
                <li><Link href="/therapists" className="hover:text-white">Find Therapists</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Therapists</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/become-therapist" className="hover:text-white">Join Our Network</Link></li>
                <li><Link href="/therapist-benefits" className="hover:text-white">Benefits</Link></li>
                <li><Link href="/commission-tiers" className="hover:text-white">Commission Tiers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Worker Bee Wellness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
