'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'
import { Header } from '../../../../components/common/Header'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'

type EventRequest = {
  id: string
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  square_booking_url: string | null
  created_at: string
  updated_at: string
}

export default function BookingStatusPage() {
  const params = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let active = true

    const fetchOnce = async () => {
      const { data, error } = await supabase
        .from('event_requests')
        .select('id,status,square_booking_url,created_at,updated_at')
        .eq('id', params.id)
        .single()

      if (!active) return
      if (!error) setEvent(data as EventRequest)
      setLoading(false)
    }

    fetchOnce()
    const interval = setInterval(fetchOnce, 5000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [params.id, supabase])

  const statusBadge = (status?: string) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-sm">Accepted</span>
      case 'declined':
        return <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-sm">Declined</span>
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">Completed</span>
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-1 rounded bg-gray-200 text-gray-700 text-sm">Cancelled</span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">Pending</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-wbw-charcoal">Request Status</h1>
          <p className="text-gray-600 mt-2">Track your booking request as therapists respond.</p>
        </div>

        <Card>
          {loading && (
            <div className="py-12 text-center text-gray-600">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wbw-blue mx-auto mb-4" />
              Loading status...
            </div>
          )}

          {!loading && !event && (
            <div className="py-12 text-center text-gray-600">
              Request not found.
              <div className="mt-6">
                <Link href="/book">
                  <Button>Create a new request</Button>
                </Link>
              </div>
            </div>
          )}

          {event && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Request ID</div>
                  <div className="font-mono text-sm">{event.id}</div>
                </div>
                <div>{statusBadge(event.status)}</div>
              </div>

              {event.status === 'accepted' && event.square_booking_url && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <div className="font-medium text-green-800 mb-2">Therapist accepted your request</div>
                  <p className="text-sm text-green-700 mb-4">
                    Proceed to complete your booking and payment via Square.
                  </p>
                  <a
                    href={event.square_booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-wbw-blue hover:bg-blue-700">Open Square Booking</Button>
                  </a>
                </div>
              )}

              {event.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <div className="font-medium text-yellow-800 mb-2">Awaiting therapist responses</div>
                  <p className="text-sm text-yellow-700">
                    We’ll notify you once a therapist accepts your request.
                  </p>
                </div>
              )}

              {event.status === 'declined' && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <div className="font-medium text-red-800 mb-2">No therapists accepted</div>
                  <p className="text-sm text-red-700">
                    You can try adjusting your request details and submit again.
                  </p>
                  <div className="mt-4">
                    <Link href="/book">
                      <Button variant="secondary">New Request</Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Link href="/dashboard/client">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
