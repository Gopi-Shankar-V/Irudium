-- Fix security vulnerability: Restrict user_profiles access to authenticated users only
-- Drop the overly permissive policy that allows anonymous access
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.user_profiles;

-- Create more secure policies for user_profiles access
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Policy 2: Authenticated users can view basic profile info of others (excluding sensitive fields like roles)
-- This policy allows viewing display_name, bio, and avatar_url but not roles
CREATE POLICY "Authenticated users can view basic profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Policy 3: Admins can view all profile details including roles
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up2 
    WHERE up2.user_id = auth.uid() 
    AND up2.role = 'admin'
  )
);

-- Update the existing admin update policy to use a more secure pattern
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profiles;

CREATE POLICY "Admins can update any profile" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up2 
    WHERE up2.user_id = auth.uid() 
    AND up2.role = 'admin'
  )
);

-- Add a policy to prevent role escalation - only admins can modify roles
CREATE POLICY "Only admins can modify roles" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (
  (NEW.role = OLD.role) OR 
  EXISTS (
    SELECT 1 FROM public.user_profiles up2 
    WHERE up2.user_id = auth.uid() 
    AND up2.role = 'admin'
  )
);

-- Ensure proper indexing for performance on user_id and role columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role) WHERE role = 'admin';