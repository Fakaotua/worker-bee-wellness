export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'client' | 'therapist' | 'admin'
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'client' | 'therapist' | 'admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'client' | 'therapist' | 'admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      therapists: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string | null
          photo_url: string | null
          specialties: Json
          service_area: string
          license_number: string | null
          years_experience: number | null
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          major_change_pending: boolean
          base_commission_rate: number
          commission_override: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio?: string | null
          photo_url?: string | null
          specialties?: Json
          service_area: string
          license_number?: string | null
          years_experience?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          major_change_pending?: boolean
          base_commission_rate?: number
          commission_override?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string | null
          photo_url?: string | null
          specialties?: Json
          service_area?: string
          license_number?: string | null
          years_experience?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          major_change_pending?: boolean
          base_commission_rate?: number
          commission_override?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      event_requests: {
        Row: {
          id: string
          client_id: string
          location_text: string
          service_area: string
          desired_date: string | null
          desired_time: string | null
          duration_minutes: number
          service_type: string
          notes: string | null
          status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          accepted_by: string | null
          square_booking_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          location_text: string
          service_area: string
          desired_date?: string | null
          desired_time?: string | null
          duration_minutes?: number
          service_type?: string
          notes?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          accepted_by?: string | null
          square_booking_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          location_text?: string
          service_area?: string
          desired_date?: string | null
          desired_time?: string | null
          duration_minutes?: number
          service_type?: string
          notes?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
          accepted_by?: string | null
          square_booking_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          event_request_id: string
          client_id: string
          therapist_id: string
          rating: number
          review_text: string | null
          flagged: boolean
          flag_reason: string | null
          flagged_by: string | null
          flagged_at: string | null
          admin_decision: 'keep' | 'remove' | null
          admin_decision_by: string | null
          admin_decision_at: string | null
          admin_decision_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_request_id: string
          client_id: string
          therapist_id: string
          rating: number
          review_text?: string | null
          flagged?: boolean
          flag_reason?: string | null
          flagged_by?: string | null
          flagged_at?: string | null
          admin_decision?: 'keep' | 'remove' | null
          admin_decision_by?: string | null
          admin_decision_at?: string | null
          admin_decision_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_request_id?: string
          client_id?: string
          therapist_id?: string
          rating?: number
          review_text?: string | null
          flagged?: boolean
          flag_reason?: string | null
          flagged_by?: string | null
          flagged_at?: string | null
          admin_decision?: 'keep' | 'remove' | null
          admin_decision_by?: string | null
          admin_decision_at?: string | null
          admin_decision_reason?: string | null
          created_at?: string
        }
      }
      commission_tiers: {
        Row: {
          id: string
          tier_level: number
          tier_name: string
          min_monthly_bookings: number
          commission_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          tier_level: number
          tier_name: string
          min_monthly_bookings: number
          commission_rate: number
          created_at?: string
        }
        Update: {
          id?: string
          tier_level?: number
          tier_name?: string
          min_monthly_bookings?: number
          commission_rate?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
