'use client'

import React from 'react'
import { HelpCircle, Phone, Mail, MessageCircle, Clock, Shield, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I book a massage session?",
      answer: "Simply visit our 'For Clients' page, detect your location or enter it manually, and click 'Book Now'. You'll be redirected to our secure booking platform where you can choose your preferred therapist and schedule."
    },
    {
      question: "Are all therapists licensed and verified?",
      answer: "Yes! All therapists on our platform are licensed massage therapists who have been verified by our admin team. We check their licenses, insurance, and government ID before approval."
    },
    {
      question: "How do payments work?",
      answer: "Payments are processed securely through Square Appointments. You can pay with credit cards, debit cards, or other accepted payment methods during the booking process."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule through the Square Appointments platform. Please check the specific cancellation policy for your chosen therapist."
    },
    {
      question: "How do I become a therapist on the platform?",
      answer: "Visit our &apos;For Therapists&apos; page and click &apos;Get Started&apos;. You&apos;ll need to provide your license, insurance documentation, and complete our verification process."
    },
    {
      question: "What if I'm not satisfied with my session?",
      answer: "We want you to have a great experience! Contact our support team and we&apos;ll work with you to address any concerns. You can also leave a review to help other clients."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Worker Bee Wellness" 
                width={60} 
                height={28}
                className="h-7"
              />
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
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Help <span className="text-gray-900">Center</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Phone Support</h3>
            <p className="text-gray-600 mb-4 text-lg">Speak with our support team</p>
            <p className="text-gray-900 font-semibold text-lg">(555) 123-4567</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Email Support</h3>
            <p className="text-gray-600 mb-4 text-lg">Send us your questions</p>
            <p className="text-gray-900 font-semibold text-lg">support@workerbeewellness.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Support Hours</h3>
            <p className="text-gray-600 mb-4 text-lg">We&apos;re here to help</p>
            <p className="text-gray-900 font-semibold text-lg">Mon-Fri 9AM-6PM EST</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center">
            <HelpCircle className="w-8 h-8 text-yellow-600 mr-3" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0 mb-8 last:mb-0">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h4>
            <p className="text-gray-600 text-lg leading-relaxed">All therapists are background checked, licensed, and insured for your protection.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h4>
            <p className="text-gray-600 text-lg leading-relaxed">All payments are processed securely through Square&apos;s encrypted platform.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h4>
            <p className="text-gray-600 text-lg leading-relaxed">Our support team is available around the clock to assist you with any issues.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
