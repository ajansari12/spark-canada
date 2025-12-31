-- Add 2026 Enhanced Scoring Fields to ideas table
-- These fields support recession-proof analysis, pain point severity, AI leverage,
-- side hustle compatibility, and newcomer friendliness

-- Add recession resistance score (0-100)
-- Higher scores indicate better performance during economic downturns
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS recession_resistance_score INTEGER
CHECK (recession_resistance_score >= 0 AND recession_resistance_score <= 100);

-- Add pain point severity (1-10)
-- Higher scores indicate more urgent problems (1-3 = nice to have, 9-10 = hair on fire)
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS pain_point_severity INTEGER
CHECK (pain_point_severity >= 1 AND pain_point_severity <= 10);

-- Add AI leverage score (0-100)
-- Higher scores indicate more potential for AI to reduce costs/increase efficiency
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS ai_leverage_score INTEGER
CHECK (ai_leverage_score >= 0 AND ai_leverage_score <= 100);

-- Add side hustle compatible flag
-- True if business can be run with 10-20 hours/week while keeping a day job
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS side_hustle_compatible BOOLEAN DEFAULT false;

-- Add newcomer friendly flag
-- True if business doesn't require Canadian credentials/certifications
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS newcomer_friendly BOOLEAN DEFAULT false;

-- Add structured action plan (30-60-90 day milestones)
-- JSONB structure with day30, day60, day90 arrays of action items
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS action_plan JSONB DEFAULT NULL;

-- Add indexes for frequently filtered columns
CREATE INDEX IF NOT EXISTS idx_ideas_recession_resistance
ON public.ideas (recession_resistance_score)
WHERE recession_resistance_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ideas_pain_point_severity
ON public.ideas (pain_point_severity)
WHERE pain_point_severity IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ideas_side_hustle
ON public.ideas (side_hustle_compatible)
WHERE side_hustle_compatible = true;

CREATE INDEX IF NOT EXISTS idx_ideas_newcomer_friendly
ON public.ideas (newcomer_friendly)
WHERE newcomer_friendly = true;

-- Add comment for documentation
COMMENT ON COLUMN public.ideas.recession_resistance_score IS '0-100 score indicating how well the business survives economic downturns';
COMMENT ON COLUMN public.ideas.pain_point_severity IS '1-10 scale: 1-3 nice to have, 4-6 moderate, 7-8 high pain, 9-10 hair on fire';
COMMENT ON COLUMN public.ideas.ai_leverage_score IS '0-100 score for AI/automation potential to reduce costs';
COMMENT ON COLUMN public.ideas.side_hustle_compatible IS 'True if can run with 10-20 hrs/week while employed';
COMMENT ON COLUMN public.ideas.newcomer_friendly IS 'True if no Canadian credentials required';
COMMENT ON COLUMN public.ideas.action_plan IS 'JSONB with day30, day60, day90 milestone arrays';
