-- ==============================================================================
-- DOCSZAR SUPABASE RLS FIX
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/itzqsxmjyjfgtbolfhmq/sql
-- ==============================================================================

-- 1. Disable RLS on all DocsZar application tables
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.access_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reset_ids DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advert_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.engagement_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.create_advert_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.create_engagement_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.earn_advert_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.earn_engagement_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.allocated_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.in_review_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.completed_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pending_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.failed_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cancelled_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.proof_of_work DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.funding DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transfers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.withdrawal_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_disputes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.worker_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Grant table and sequence permissions to anon, authenticated, and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
