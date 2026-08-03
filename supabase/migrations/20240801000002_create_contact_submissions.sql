-- ============================================================
-- CONTACT SUBMISSIONS TABLE
-- Stores all contact form submissions from the website
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Sender information
  name        TEXT NOT NULL CHECK (char_length(name) >= 2),
  email       TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone       TEXT,

  -- Message
  subject     TEXT,
  message     TEXT NOT NULL CHECK (char_length(message) >= 10),

  -- Admin fields
  read        BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT,

  -- Timestamp
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INDEXES ──
CREATE INDEX idx_contact_submissions_read
  ON public.contact_submissions(read);

CREATE INDEX idx_contact_submissions_created_at
  ON public.contact_submissions(created_at DESC);

CREATE INDEX idx_contact_submissions_email
  ON public.contact_submissions(email);

-- ── ROW LEVEL SECURITY ──
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- No public access from browser
CREATE POLICY "contact_no_public_access"
  ON public.contact_submissions
  FOR ALL
  TO anon
  USING (false);

-- Authenticated admin users can do everything
CREATE POLICY "contact_admin_full_access"
  ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── COMMENTS ──
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions from the HOVAZ website';
COMMENT ON COLUMN public.contact_submissions.read IS 'Whether admin has read this submission';
COMMENT ON COLUMN public.contact_submissions.admin_notes IS 'Internal notes visible only to admin';