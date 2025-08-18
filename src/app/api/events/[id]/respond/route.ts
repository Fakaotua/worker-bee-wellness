import { createClient } from '../../../../../lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { response, squareBookingUrl } = body
    const eventId = params.id

    if (!['accepted', 'declined'].includes(response)) {
      return NextResponse.json({ error: 'Invalid response' }, { status: 400 })
    }

    const { data: therapist, error: therapistError } = await supabase
      .from('therapists')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (therapistError || !therapist) {
      return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 })
    }

    const updateData: any = {
      status: response,
      accepted_by: response === 'accepted' ? therapist.id : null
    }

    if (response === 'accepted' && squareBookingUrl) {
      updateData.square_booking_url = squareBookingUrl
    }

    const { data, error } = await supabase
      .from('event_requests')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single()

    if (error) throw error

    await supabase
      .from('event_notifications')
      .insert({
        event_request_id: eventId,
        therapist_id: therapist.id,
        notification_type: 'response',
        response,
        responded_at: new Date().toISOString()
      })

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
