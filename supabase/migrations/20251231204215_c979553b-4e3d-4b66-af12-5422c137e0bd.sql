-- Create success_stories table
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  quote TEXT,
  business_name TEXT NOT NULL,
  industry TEXT,
  province TEXT,
  city TEXT,
  startup_cost INTEGER,
  monthly_revenue INTEGER,
  time_to_first_sale TEXT,
  employees_count INTEGER,
  is_side_hustle BOOLEAN DEFAULT false,
  is_newcomer BOOLEAN DEFAULT false,
  spark_helped BOOLEAN DEFAULT true,
  is_anonymous BOOLEAN DEFAULT false,
  ai_tools_used TEXT[] DEFAULT '{}',
  idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  photo_url TEXT,
  business_photo_url TEXT,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved/featured stories
CREATE POLICY "Anyone can read approved stories"
ON public.success_stories
FOR SELECT
USING (status IN ('approved', 'featured'));

-- Users can view their own stories regardless of status
CREATE POLICY "Users can view their own stories"
ON public.success_stories
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own stories
CREATE POLICY "Users can create their own stories"
ON public.success_stories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own stories
CREATE POLICY "Users can update their own stories"
ON public.success_stories
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own stories
CREATE POLICY "Users can delete their own stories"
ON public.success_stories
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can manage all stories
CREATE POLICY "Admins can manage all stories"
ON public.success_stories
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_success_stories_updated_at
BEFORE UPDATE ON public.success_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing columns to ideas table
ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS action_plan JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS recession_resistance_score INTEGER,
ADD COLUMN IF NOT EXISTS pain_point_severity INTEGER,
ADD COLUMN IF NOT EXISTS ai_leverage_score INTEGER,
ADD COLUMN IF NOT EXISTS side_hustle_compatible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newcomer_friendly BOOLEAN DEFAULT false;