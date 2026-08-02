export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          experience_type: string
          preferred_date: string
          group_size: number
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['bookings']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          read: boolean
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['contact_submissions']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
      }
      email_logs: {
        Row: {
          id: string
          booking_id: string | null
          type: string
          recipient: string
          status: string
          error: string | null
          sent_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_logs']['Row'], 'id' | 'sent_at'>
        Update: Partial<Database['public']['Tables']['email_logs']['Insert']>
      }
    }
  }
}
