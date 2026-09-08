-- ============================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- Stores email signups from the "Letters From The Forest" form
-- ============================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  email            TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  source           TEXT NOT NULL DEFAULT 'homepage',

  subscribed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at  TIMESTAMPTZ
);

-- ── INDEXES ──
CREATE INDEX idx_newsletter_subscribers_email
  ON public.newsletter_subscribers(email);

CREATE INDEX idx_newsletter_subscribers_subscribed_at
  ON public.newsletter_subscribers(subscribed_at DESC);

-- ── ROW LEVEL SECURITY ──
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- No public access from browser
CREATE POLICY "newsletter_subscribers_no_public_access"
  ON public.newsletter_subscribers
  FOR ALL
  TO anon
  USING (false);

-- Authenticated admin users can do everything
CREATE POLICY "newsletter_subscribers_admin_full_access"
  ON public.newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── COMMENTS ──
COMMENT ON TABLE public.newsletter_subscribers IS 'Email signups from newsletter forms across the HOVAZ website';
COMMENT ON COLUMN public.newsletter_subscribers.source IS 'Which form the signup came from, e.g. homepage';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribed_at IS 'Set when a subscriber opts out — row is kept, not deleted';

-- ── EMAIL LOG TYPE ──
-- New email_type value for the newsletter welcome email.
ALTER TYPE email_type ADD VALUE IF NOT EXISTS 'newsletter_welcome';
