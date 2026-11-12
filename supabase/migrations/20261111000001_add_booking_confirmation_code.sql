-- ============================================================
-- BOOKING CONFIRMATION CODES + SELF-SERVICE CANCELLATION
-- Guests cancel on /booking/cancel with their confirmation code
-- (HVZ-12345) and booking email — no account needed.
-- ============================================================

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS confirmation_code TEXT,
  -- Slot start time (Asia/Yerevan). Older rows keep it in notes as
  -- "Preferred time: HH:mm"; the app falls back to that.
  ADD COLUMN IF NOT EXISTS preferred_time    TIME,
  ADD COLUMN IF NOT EXISTS cancelled_at      TIMESTAMPTZ;

-- ── CODE GENERATOR ──
-- "HVZ-" + 5 random digits, retried until unused.
CREATE OR REPLACE FUNCTION public.generate_booking_confirmation_code()
RETURNS TEXT AS $$
DECLARE
  candidate TEXT;
BEGIN
  LOOP
    candidate := 'HVZ-' || (10000 + floor(random() * 90000))::INT::TEXT;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.bookings WHERE confirmation_code = candidate
    );
  END LOOP;
  RETURN candidate;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Every new booking gets a code, whichever code path inserts it.
CREATE OR REPLACE FUNCTION public.set_booking_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := public.generate_booking_confirmation_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_bookings_confirmation_code ON public.bookings;
CREATE TRIGGER set_bookings_confirmation_code
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_confirmation_code();

-- ── BACKFILL ──
UPDATE public.bookings
  SET confirmation_code = public.generate_booking_confirmation_code()
  WHERE confirmation_code IS NULL;

UPDATE public.bookings
  SET preferred_time = (substring(notes FROM 'Preferred time: ([0-2][0-9]:[0-5][0-9])'))::TIME
  WHERE preferred_time IS NULL
    AND notes ~ 'Preferred time: [0-2][0-9]:[0-5][0-9]';

ALTER TABLE public.bookings
  ALTER COLUMN confirmation_code SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_confirmation_code
  ON public.bookings(confirmation_code);

-- ── COMMENTS ──
COMMENT ON COLUMN public.bookings.confirmation_code IS 'Guest-facing booking reference (HVZ-12345), used for self-service cancellation';
COMMENT ON COLUMN public.bookings.preferred_time IS 'Slot start time, Asia/Yerevan';
COMMENT ON COLUMN public.bookings.cancelled_at IS 'When the booking was cancelled (by the guest or an admin)';
