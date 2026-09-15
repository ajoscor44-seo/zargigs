-- ==============================================================================
-- DOCSZAR / ZARGIGS SUPABASE SECURITY & ROW-LEVEL SECURITY (RLS) HARDENING
-- Project: ZARGIGS (itzqsxmjyjfgtbolfhmq)
-- Fixes: rls_disabled_in_public & sensitive_columns_exposed
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CREATE MISSING TABLES IF NOT ALREADY CREATED
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reward NUMERIC(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DROP PLAINTEXT SENSITIVE PASSWORDS FROM PUBLIC USER TABLE
-- (Supabase Auth stores encrypted passwords in auth.users)
ALTER TABLE IF EXISTS public.users DROP COLUMN IF EXISTS password;

-- 3. CREATE ADMIN HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ENABLE ROW LEVEL SECURITY (RLS) ON ALL 33 TABLES
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reset_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advert_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.engagement_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.create_advert_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.create_engagement_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.earn_advert_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.earn_engagement_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.allocated_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.in_review_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.completed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pending_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.failed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cancelled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.proof_of_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.funding ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.virtual_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_settings ENABLE ROW LEVEL SECURITY;

-- 5. CLEAN UP ALL OLD POLICIES ON PUBLIC TABLES
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 6. APPLY PRECISE ROW-LEVEL SECURITY POLICIES

-- USERS TABLE
CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "users_delete_policy" ON public.users FOR DELETE USING (public.is_admin());

-- USER DETAILS
CREATE POLICY "user_details_select_policy" ON public.user_details FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_details_insert_policy" ON public.user_details FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_details_update_policy" ON public.user_details FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_details_delete_policy" ON public.user_details FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- TOKENS & RESET IDS
CREATE POLICY "tokens_select_policy" ON public.tokens FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "tokens_insert_policy" ON public.tokens FOR INSERT WITH CHECK (true);
CREATE POLICY "tokens_update_policy" ON public.tokens FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "tokens_delete_policy" ON public.tokens FOR DELETE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "access_tokens_policy" ON public.access_tokens FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "reset_ids_policy" ON public.reset_ids FOR ALL USING (true);

-- FINANCIAL & WALLET
CREATE POLICY "withdrawals_select_policy" ON public.withdrawal_requests FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "withdrawals_insert_policy" ON public.withdrawal_requests FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "withdrawals_update_policy" ON public.withdrawal_requests FOR UPDATE USING (public.is_admin());
CREATE POLICY "withdrawals_delete_policy" ON public.withdrawal_requests FOR DELETE USING (public.is_admin());

CREATE POLICY "funding_select_policy" ON public.funding FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "funding_insert_policy" ON public.funding FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "funding_update_policy" ON public.funding FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "transfers_select_policy" ON public.transfers FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin());
CREATE POLICY "transfers_insert_policy" ON public.transfers FOR INSERT WITH CHECK (sender_id = auth.uid() OR public.is_admin());
CREATE POLICY "transfers_update_policy" ON public.transfers FOR UPDATE USING (public.is_admin());

CREATE POLICY "transactions_select_policy" ON public.transactions FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "transactions_insert_policy" ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "transactions_update_policy" ON public.transactions FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "virtual_accounts_select_policy" ON public.virtual_accounts FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "virtual_accounts_insert_policy" ON public.virtual_accounts FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "virtual_accounts_update_policy" ON public.virtual_accounts FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- ADVERTISEMENTS & TASKS
CREATE POLICY "advertisements_select" ON public.advertisements FOR SELECT USING (true);
CREATE POLICY "advertisements_insert" ON public.advertisements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR public.is_admin());
CREATE POLICY "advertisements_update" ON public.advertisements FOR UPDATE USING (public.is_admin());
CREATE POLICY "advertisements_delete" ON public.advertisements FOR DELETE USING (public.is_admin());

CREATE POLICY "advert_tasks_select" ON public.advert_tasks FOR SELECT USING (true);
CREATE POLICY "advert_tasks_insert" ON public.advert_tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR public.is_admin());
CREATE POLICY "advert_tasks_update" ON public.advert_tasks FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "advert_tasks_delete" ON public.advert_tasks FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "engagement_tasks_select" ON public.engagement_tasks FOR SELECT USING (true);
CREATE POLICY "engagement_tasks_insert" ON public.engagement_tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR public.is_admin());
CREATE POLICY "engagement_tasks_update" ON public.engagement_tasks FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "engagement_tasks_delete" ON public.engagement_tasks FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "marketplace_tasks_select" ON public.marketplace_tasks FOR SELECT USING (true);
CREATE POLICY "marketplace_tasks_insert" ON public.marketplace_tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR public.is_admin());
CREATE POLICY "marketplace_tasks_update" ON public.marketplace_tasks FOR UPDATE USING (creator_id = auth.uid() OR public.is_admin());
CREATE POLICY "marketplace_tasks_delete" ON public.marketplace_tasks FOR DELETE USING (creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "tasks_select" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "tasks_admin" ON public.tasks FOR ALL USING (public.is_admin());

CREATE POLICY "task_submissions_select" ON public.task_submissions FOR SELECT USING (worker_id = auth.uid() OR public.is_admin());
CREATE POLICY "task_submissions_insert" ON public.task_submissions FOR INSERT WITH CHECK (worker_id = auth.uid() OR public.is_admin());
CREATE POLICY "task_submissions_update" ON public.task_submissions FOR UPDATE USING (worker_id = auth.uid() OR public.is_admin());

CREATE POLICY "task_reservations_all" ON public.task_reservations FOR ALL USING (worker_id = auth.uid() OR public.is_admin());
CREATE POLICY "task_disputes_all" ON public.task_disputes FOR ALL USING (worker_id = auth.uid() OR creator_id = auth.uid() OR public.is_admin());
CREATE POLICY "worker_profiles_all" ON public.worker_profiles FOR ALL USING (user_id = auth.uid() OR public.is_admin());

-- TASK LIFECYCLE
CREATE POLICY "allocated_tasks_policy" ON public.allocated_tasks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "in_review_tasks_policy" ON public.in_review_tasks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "completed_tasks_policy" ON public.completed_tasks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "pending_tasks_policy" ON public.pending_tasks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "failed_tasks_policy" ON public.failed_tasks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "cancelled_tasks_policy" ON public.cancelled_tasks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "proof_of_work_policy" ON public.proof_of_work FOR ALL USING (user_id = auth.uid() OR public.is_admin());

-- PUBLIC CONFIGS & SETTINGS
CREATE POLICY "create_advert_config_select" ON public.create_advert_config FOR SELECT USING (true);
CREATE POLICY "create_advert_config_admin" ON public.create_advert_config FOR ALL USING (public.is_admin());

CREATE POLICY "create_engagement_config_select" ON public.create_engagement_config FOR SELECT USING (true);
CREATE POLICY "create_engagement_config_admin" ON public.create_engagement_config FOR ALL USING (public.is_admin());

CREATE POLICY "earn_advert_config_select" ON public.earn_advert_config FOR SELECT USING (true);
CREATE POLICY "earn_advert_config_admin" ON public.earn_advert_config FOR ALL USING (public.is_admin());

CREATE POLICY "earn_engagement_config_select" ON public.earn_engagement_config FOR SELECT USING (true);
CREATE POLICY "earn_engagement_config_admin" ON public.earn_engagement_config FOR ALL USING (public.is_admin());

CREATE POLICY "admin_settings_select" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "admin_settings_admin" ON public.admin_settings FOR ALL USING (public.is_admin());

CREATE POLICY "announcements_select" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "announcements_admin" ON public.announcements FOR ALL USING (public.is_admin());

CREATE POLICY "notifications_all" ON public.notifications FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "complaints_all" ON public.complaints FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "subscriptions_all" ON public.subscriptions FOR ALL USING (user_id = auth.uid() OR public.is_admin());
