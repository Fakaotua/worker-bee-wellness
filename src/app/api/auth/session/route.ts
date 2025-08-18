import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    if (!session) {
      return NextResponse.json({ session: null })
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 400 })
    }
    
    return NextResponse.json({ session, user: profile })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
