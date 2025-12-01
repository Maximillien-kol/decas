import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Guest {
  id: string
  first_name: string
  last_name: string
  email: string
  telephone: string
  registration_id: string
  timestamp: string
  status: 'pending' | 'accepted' | 'rejected'
  payment_screenshot_url?: string
  created_at?: string
  updated_at?: string
}
