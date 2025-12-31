-- Add missing columns to grants table
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS eligibility_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS age_restrictions TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS newcomer_eligible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS experience_required TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS side_hustle_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS application_complexity INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS approval_time_weeks INTEGER DEFAULT NULL;

-- Add indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_grants_newcomer_eligible ON public.grants(newcomer_eligible);
CREATE INDEX IF NOT EXISTS idx_grants_side_hustle_eligible ON public.grants(side_hustle_eligible);