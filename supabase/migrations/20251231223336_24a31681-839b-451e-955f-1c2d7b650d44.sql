-- Add verification tracking column to grants table
ALTER TABLE grants ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ DEFAULT now();