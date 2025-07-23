import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Therapist {
  id: string
  user_id: string
  name: string
  bio: string
  profile_photo_url?: string
  license_document_url?: string
  insurance_document_url?: string
  government_id_url?: string
  specialties: string[]
  status: 'pending' | 'approved' | 'rejected' | 'needs_edits'
  admin_notes?: string
  commission_tier: number
  total_earnings: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  therapist_id: string
  client_name: string
  rating: number
  comment: string
  is_flagged: boolean
  is_approved: boolean
  created_at: string
}

export interface Earning {
  id: string
  therapist_id: string
  amount: number
  commission_rate: number
  status: 'pending' | 'completed'
  payout_date?: string
  created_at: string
}

export interface EventRequest {
  id: string
  client_name: string
  client_email: string
  location_city: string
  location_state: string
  preferred_date: string
  preferred_time: string
  notes?: string
  status: 'pending' | 'responded' | 'accepted'
  created_at: string
  responded_by: string[]
  accepted_by?: string
}
