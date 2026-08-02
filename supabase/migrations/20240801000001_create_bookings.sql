-- ============================================================
-- BOOKINGS TABLE
-- Stores all booking inquiries submitted via the website form
-- ============================================================

-- Create status enum type
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed', 
  'cancelled',
  'completed'
);

-- Create experience type enum
CREATE TYPE experience_type AS ENUM (
  'wine_tasting',
  'vineyard_walk',
  'private_tour',
  'group_tour',
  'winemaking_experience',
  'harvest_experience',
  'wine_dinner',
  'custom'
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Guest information
  name            TEXT NOT NULL CHECK (char_length(name) >= 2),
  email           TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone           TEXT NOT NULL CHECK (char_length(phone) >= 6),
  
  -- Booking details
  experience_type experience_type NOT NULL,
  preferred_date  DATE NOT NULL,
  group_size      INTEGER NOT NULL CHECK (group_size >= 1 AND group_size <= 100),
  notes           TEXT,
  
  -- Admin fields
  status          booking_status NOT NULL DEFAULT 'pending',
  admin_notes     TEXT,
  
  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INDEXES ──
-- Speed up common queries
CREATE INDEX idx_bookings_status 
  ON public.bookings(status);

CREATE INDEX idx_bookings_preferred_date 
  ON public.bookings(preferred_date);

CREATE INDEX idx_bookings_created_at 
  ON public.bookings(created_at DESC);

CREATE INDEX idx_bookings_email 
  ON public.bookings(email);

-- ── AUTO-UPDATE updated_at ──
-- Automatically updates updated_at whenever a row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── ROW LEVEL SECURITY ──
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Nobody can read bookings from the browser (anon key)
-- Only server-side service_role can access
CREATE POLICY "bookings_no_public_access"
  ON public.bookings
  FOR ALL
  TO anon
  USING (false);

-- Authenticated admin users can do everything
CREATE POLICY "bookings_admin_full_access"
  ON public.bookings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── COMMENTS ──
COMMENT ON TABLE public.bookings IS 'Booking inquiries submitted via the HOVAZ website form';
COMMENT ON COLUMN public.bookings.status IS 'pending → confirmed/cancelled → completed';
COMMENT ON COLUMN public.bookings.admin_notes IS 'Internal notes visible only to admin team';