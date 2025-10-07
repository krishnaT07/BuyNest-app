-- Create enum type for roles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'admin');
  END IF;
END
$$;

-- Ensure user_roles.role column uses the enum type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'role' AND udt_name <> 'app_role'
  ) THEN
    ALTER TABLE public.user_roles
    ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;
  END IF;
END
$$;

-- Add INSERT policy to allow users to insert their own non-admin role (for bootstrap after login)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can insert their own non-admin role'
  ) THEN
    CREATE POLICY "Users can insert their own non-admin role"
    ON public.user_roles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id AND role <> 'admin'::public.app_role);
  END IF;
END
$$;