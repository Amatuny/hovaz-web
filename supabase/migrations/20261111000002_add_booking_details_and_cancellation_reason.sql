-- ============================================================
-- STRUCTURED BOOKING DETAILS + CANCELLATION REASON
-- Shown to the guest on step 2 of /booking/cancel. Until now these only
-- lived in notes as free text ("Experience: …", "deposit 14,500 AMD").
-- ============================================================

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS estate              TEXT,
  ADD COLUMN IF NOT EXISTS experience_name     TEXT,
  -- [{ "name": "Dinner — Classic", "quantity": 1 }]
  ADD COLUMN IF NOT EXISTS add_ons             JSONB,
  ADD COLUMN IF NOT EXISTS deposit_amd         INTEGER CHECK (deposit_amd IS NULL OR deposit_amd >= 0),
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- ── BACKFILL FROM NOTES ──
UPDATE public.bookings
  SET experience_name = trim(substring(notes FROM 'Experience: ([^\n]+)'))
  WHERE experience_name IS NULL
    AND notes ~ 'Experience: [^\n]+';

UPDATE public.bookings
  SET deposit_amd = replace(substring(notes FROM 'deposit ([0-9,]+) AMD'), ',', '')::INTEGER
  WHERE deposit_amd IS NULL
    AND notes ~ 'deposit [0-9,]+ AMD';

-- ── COMMENTS ──
COMMENT ON COLUMN public.bookings.estate IS 'Estate the booking is at, e.g. "Dilijan Estate"';
COMMENT ON COLUMN public.bookings.experience_name IS 'Tour/event title the guest booked';
COMMENT ON COLUMN public.bookings.add_ons IS 'Extras such as food: [{ name, quantity }]';
COMMENT ON COLUMN public.bookings.deposit_amd IS 'Deposit paid, in AMD';
COMMENT ON COLUMN public.bookings.cancellation_reason IS 'Reason the guest gave when cancelling online, if any';
