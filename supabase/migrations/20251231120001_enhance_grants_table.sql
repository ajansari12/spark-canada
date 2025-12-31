-- Enhance grants table for smarter matching
-- Add eligibility criteria and newcomer support fields

-- Add eligibility criteria as JSONB for flexible matching
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS eligibility_criteria JSONB DEFAULT '{}';

-- Add age restrictions (e.g., "18-39" for Futurpreneur)
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS age_restrictions TEXT DEFAULT NULL;

-- Add newcomer eligibility flag
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS newcomer_eligible BOOLEAN DEFAULT false;

-- Add experience level requirement
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS experience_required TEXT DEFAULT NULL
CHECK (experience_required IN ('none', 'beginner', 'intermediate', 'advanced', NULL));

-- Add side hustle eligibility (some grants require full-time commitment)
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS side_hustle_eligible BOOLEAN DEFAULT true;

-- Add application complexity indicator (1-5)
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS application_complexity INTEGER DEFAULT 3
CHECK (application_complexity >= 1 AND application_complexity <= 5);

-- Add estimated approval time in weeks
ALTER TABLE public.grants
ADD COLUMN IF NOT EXISTS approval_time_weeks INTEGER DEFAULT NULL;

-- Update existing grants with newcomer/side hustle eligibility
-- Futurpreneur is newcomer friendly
UPDATE public.grants
SET newcomer_eligible = true,
    age_restrictions = '18-39',
    eligibility_criteria = '{"min_age": 18, "max_age": 39, "citizen_required": false}'::jsonb
WHERE name = 'Futurpreneur Canada';

-- IRAP typically needs established business
UPDATE public.grants
SET experience_required = 'intermediate',
    application_complexity = 4,
    approval_time_weeks = 8
WHERE name = 'Industrial Research Assistance Program (IRAP)';

-- SR&ED is complex
UPDATE public.grants
SET application_complexity = 5,
    side_hustle_eligible = true,
    approval_time_weeks = 12
WHERE name = 'SR&ED Tax Incentive Program';

-- Canada Digital Adoption is newcomer and side hustle friendly
UPDATE public.grants
SET newcomer_eligible = true,
    side_hustle_eligible = true,
    application_complexity = 2,
    approval_time_weeks = 4
WHERE name = 'Canada Digital Adoption Program';

-- Add index for newcomer filtering
CREATE INDEX IF NOT EXISTS idx_grants_newcomer_eligible
ON public.grants (newcomer_eligible)
WHERE newcomer_eligible = true;

-- Add index for side hustle filtering
CREATE INDEX IF NOT EXISTS idx_grants_side_hustle_eligible
ON public.grants (side_hustle_eligible)
WHERE side_hustle_eligible = true;

-- Add comments
COMMENT ON COLUMN public.grants.eligibility_criteria IS 'JSONB with detailed eligibility requirements for matching';
COMMENT ON COLUMN public.grants.age_restrictions IS 'Age range requirement e.g., "18-39"';
COMMENT ON COLUMN public.grants.newcomer_eligible IS 'True if newcomers to Canada are eligible';
COMMENT ON COLUMN public.grants.side_hustle_eligible IS 'True if part-time entrepreneurs are eligible';
COMMENT ON COLUMN public.grants.application_complexity IS '1-5 scale of application difficulty';
COMMENT ON COLUMN public.grants.approval_time_weeks IS 'Estimated weeks for approval';
