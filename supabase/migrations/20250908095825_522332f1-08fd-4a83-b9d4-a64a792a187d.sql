-- Add approval status to shops table
ALTER TABLE public.shops 
ADD COLUMN is_approved boolean NOT NULL DEFAULT false,
ADD COLUMN approved_at timestamp with time zone,
ADD COLUMN approved_by uuid;