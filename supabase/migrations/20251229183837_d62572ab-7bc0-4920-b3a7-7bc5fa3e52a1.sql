-- Make campaign_id nullable in donations table for general education donations
ALTER TABLE public.donations ALTER COLUMN campaign_id DROP NOT NULL;