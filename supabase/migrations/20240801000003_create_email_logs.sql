-- ============================================================
-- EMAIL LOGS TABLE
-- Audit trail for every outbound email sent by the system
-- ============================================================

-- Email type enum
CREATE TYPE email_type AS ENUM (
  'booking_admin_notification',
  'booking_user_confirmation',
  'booking_status_update',
  'contact_admin_notification',
  'contact_user_confirmation'
);

-- Email delivery status enum
CREATE TYPE email_status AS ENUM (
  'sent',
  'failed',
  'bounced'
);

CREATE TABLE IF NOT EXISTS public.email_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Links to related records
  booking_id  UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  contact_id  UUID REFERENCES public.contact_submissions(id) ON DELETE SET NULL,

  -- Email details
  type        email_type NOT NULL,
  recipient   TEXT NOT NULL,
  subject     TEXT,

  -- Delivery status
  status      email_status NOT NULL DEFAULT 'sent',
  resend_id   TEXT, -- ID returned by Resend API for tracking
  error       TEXT, -- Error message if delivery failed

  -- Timestamp
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INDEXES ──
CREATE INDEX idx_email_logs_booking_id
  ON public.email_logs(booking_id);

CREATE INDEX idx_email_logs_contact_id
  ON public.email_logs(contact_id);

CREATE INDEX idx_email_logs_status
  ON public.email_logs(status);

CREATE INDEX idx_email_logs_sent_at
  ON public.email_logs(sent_at DESC);

CREATE INDEX idx_email_logs_recipient
  ON public.email_logs(recipient);

-- ── ROW LEVEL SECURITY ──
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- No public access
CREATE POLICY "email_logs_no_public_access"
  ON public.email_logs
  FOR ALL
  TO anon
  USING (false);

-- Authenticated admin full access
CREATE POLICY "email_logs_admin_full_access"
  ON public.email_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── COMMENTS ──
COMMENT ON TABLE public.email_logs IS 'Audit trail for all outbound emails sent by the system';
COMMENT ON COLUMN public.email_logs.booking_id IS 'Links log to a booking — null for contact emails';
COMMENT ON COLUMN public.email_logs.contact_id IS 'Links log to a contact submission — null for booking emails';
COMMENT ON COLUMN public.email_logs.resend_id IS 'ID returned by Resend API for delivery tracking';
COMMENT ON COLUMN public.email_logs.error IS 'Populated only when status is failed or bounced';