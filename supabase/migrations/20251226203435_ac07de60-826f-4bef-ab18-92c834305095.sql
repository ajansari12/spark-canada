-- Add usage tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS idea_generation_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS generation_reset_date timestamp with time zone DEFAULT now();

-- Create function to check and reset monthly usage
CREATE OR REPLACE FUNCTION public.check_and_reset_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset count if more than 30 days have passed
  IF NEW.generation_reset_date IS NULL OR 
     NEW.generation_reset_date < (now() - interval '30 days') THEN
    NEW.idea_generation_count := 0;
    NEW.generation_reset_date := now();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-reset usage on profile access/update
DROP TRIGGER IF EXISTS reset_usage_trigger ON public.profiles;
CREATE TRIGGER reset_usage_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_and_reset_usage();