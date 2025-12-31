-- Create success_stories table for community social proof
-- Users can submit their success stories after starting a business

-- Create the success_stories table
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Story content
    title TEXT NOT NULL,
    story TEXT NOT NULL,
    quote TEXT, -- Featured quote for display

    -- Business details
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT,

    -- Metrics (optional, for credibility)
    startup_cost INTEGER, -- How much they invested
    monthly_revenue INTEGER, -- Current monthly revenue
    time_to_first_sale TEXT, -- e.g., "2 weeks", "3 months"
    employees_count INTEGER DEFAULT 1,

    -- Classification
    is_side_hustle BOOLEAN DEFAULT false,
    is_newcomer BOOLEAN DEFAULT false,
    ai_tools_used TEXT[], -- Which AI tools helped them

    -- SPARK connection
    idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL, -- Link to original SPARK idea
    spark_helped BOOLEAN DEFAULT true,

    -- Media
    photo_url TEXT, -- Founder photo
    business_photo_url TEXT, -- Business/product photo
    website_url TEXT,

    -- Moderation
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
    admin_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,

    -- Display preferences
    display_name TEXT, -- Name to show (can be anonymous)
    is_anonymous BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view approved/featured stories
CREATE POLICY "Anyone can view approved stories"
ON public.success_stories
FOR SELECT
USING (status IN ('approved', 'featured'));

-- Policy: Users can view their own stories (any status)
CREATE POLICY "Users can view own stories"
ON public.success_stories
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert their own stories
CREATE POLICY "Authenticated users can insert own stories"
ON public.success_stories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending stories
CREATE POLICY "Users can update own pending stories"
ON public.success_stories
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Policy: Users can delete their own pending stories
CREATE POLICY "Users can delete own pending stories"
ON public.success_stories
FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_success_stories_status
ON public.success_stories (status);

CREATE INDEX IF NOT EXISTS idx_success_stories_industry
ON public.success_stories (industry);

CREATE INDEX IF NOT EXISTS idx_success_stories_province
ON public.success_stories (province);

CREATE INDEX IF NOT EXISTS idx_success_stories_is_side_hustle
ON public.success_stories (is_side_hustle)
WHERE is_side_hustle = true;

CREATE INDEX IF NOT EXISTS idx_success_stories_is_newcomer
ON public.success_stories (is_newcomer)
WHERE is_newcomer = true;

CREATE INDEX IF NOT EXISTS idx_success_stories_featured
ON public.success_stories (status)
WHERE status = 'featured';

CREATE INDEX IF NOT EXISTS idx_success_stories_user_id
ON public.success_stories (user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_success_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_success_stories_updated_at
    BEFORE UPDATE ON public.success_stories
    FOR EACH ROW
    EXECUTE FUNCTION update_success_stories_updated_at();

-- Add comments
COMMENT ON TABLE public.success_stories IS 'User-submitted success stories for social proof and community building';
COMMENT ON COLUMN public.success_stories.status IS 'Moderation status: pending, approved, rejected, or featured';
COMMENT ON COLUMN public.success_stories.quote IS 'Featured quote for display on landing page';
COMMENT ON COLUMN public.success_stories.spark_helped IS 'Whether SPARK helped them find/validate this idea';
COMMENT ON COLUMN public.success_stories.time_to_first_sale IS 'How long until their first sale/customer';
