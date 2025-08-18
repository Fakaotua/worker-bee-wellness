import { createClient } from '../../../lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const serviceArea = searchParams.get('serviceArea')
  
  try {
    let query = supabase
      .from('therapists')
      .select(`
        *,
        users (first_name, last_name, email)
      `)
      .eq('status', 'approved')
      .eq('major_change_pending', false)

    if (serviceArea) {
      query = query.eq('service_area', serviceArea)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('therapists')
      .insert({
        user_id: user.id,
        ...body
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
