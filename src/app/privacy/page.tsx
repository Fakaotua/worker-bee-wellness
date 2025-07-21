'use client'

import React from 'react'
import { Shield, Eye, Lock, UserCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Worker Bee Wellness" 
                width={40} 
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-gray-900">Worker Bee Wellness</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/clients" className="text-gray-600 hover:text-blue-600">For Clients</Link>
              <Link href="/therapist" className="text-gray-600 hover:text-blue-600">For Therapists</Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy <span className="text-blue-600">Policy</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Data Protection</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Secure Storage</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Transparency</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">User Control</h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                <p>When you create an account or book services, we collect information such as your name, email address, phone number, and location to provide our services.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Professional Information (Therapists)</h4>
                <p>For massage therapists, we collect professional credentials including licenses, insurance documentation, and government-issued identification for verification purposes.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
                <p>We automatically collect information about how you use our platform, including pages visited, features used, and interaction patterns to improve our services.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h3>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc list-inside space-y-2">
                <li>Provide and maintain our massage therapy booking platform</li>
                <li>Process bookings and facilitate connections between clients and therapists</li>
                <li>Verify therapist credentials and maintain platform safety</li>
                <li>Send important updates about your bookings and account</li>
                <li>Improve our services based on usage patterns and feedback</li>
                <li>Comply with legal obligations and prevent fraudulent activity</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h3>
            <div className="space-y-4 text-gray-700">
              <p>We do not sell your personal information. We may share your information only in these limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>With Therapists:</strong> When you book a session, we share necessary contact information with your chosen therapist</li>
                <li><strong>Service Providers:</strong> We work with trusted third-party services like Firebase (authentication) and Supabase (data storage)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect the safety of our users</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, with appropriate notice</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h3>
            <div className="space-y-4 text-gray-700">
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure cloud infrastructure with reputable providers</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h3>
            <div className="space-y-4 text-gray-700">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information in your account</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us at <a href="mailto:privacy@workerbeewellness.com" className="text-blue-600 hover:text-blue-700">privacy@workerbeewellness.com</a>.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h3>
            <div className="space-y-4 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Remember your preferences and login status</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h3>
            <div className="space-y-4 text-gray-700">
              <p>Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h3>
            <div className="space-y-4 text-gray-700">
              <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions about this privacy policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><strong>Email:</strong> <a href="mailto:privacy@workerbeewellness.com" className="text-blue-600 hover:text-blue-700">privacy@workerbeewellness.com</a></p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Wellness Street, Suite 100, New York, NY 10001</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
