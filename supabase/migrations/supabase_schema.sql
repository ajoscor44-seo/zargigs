-- ==============================================================================
-- DOCSZAR SUPABASE POSTGRESQL SCHEMA & STORAGE MIGRATION
-- Project URL: https://itzqsxmjyjfgtbolfhmq.supabase.co
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_member BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    is_nin_verified BOOLEAN DEFAULT FALSE,
    referred_by VARCHAR(100) DEFAULT 'admin',
    referrals JSONB DEFAULT '[]'::jsonb,
    balance NUMERIC(15, 2) DEFAULT 0.00,
    pending_balance NUMERIC(15, 2) DEFAULT 0.00,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USER DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.user_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    gender VARCHAR(20),
    state VARCHAR(100),
    lga VARCHAR(100),
    bank_name VARCHAR(150),
    account_number VARCHAR(50),
    account_name VARCHAR(150),
    bvn VARCHAR(50),
    nin VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TOKENS TABLE (Verification & OTP)
CREATE TABLE IF NOT EXISTS public.tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ACCESS TOKENS TABLE
CREATE TABLE IF NOT EXISTS public.access_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PASSWORD RESET IDS TABLE
CREATE TABLE IF NOT EXISTS public.reset_ids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    reset_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ADVERTISEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    link TEXT NOT NULL,
    description TEXT NOT NULL,
    banner TEXT NOT NULL,
    duration INTEGER NOT NULL,
    posted_by VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ADVERT TASKS TABLE
CREATE TABLE IF NOT EXISTS public.advert_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    media_url TEXT,
    platform VARCHAR(100) NOT NULL,
    task_type VARCHAR(100) DEFAULT 'advert',
    gender VARCHAR(50),
    location VARCHAR(100),
    religion VARCHAR(100),
    number_of_tasks INTEGER NOT NULL,
    tasks_done INTEGER DEFAULT 0,
    amount_paid NUMERIC(15, 2) NOT NULL,
    earner_fee NUMERIC(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ENGAGEMENT TASKS TABLE
CREATE TABLE IF NOT EXISTS public.engagement_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    task_type VARCHAR(100) DEFAULT 'engagement',
    action_link TEXT NOT NULL,
    gender VARCHAR(50),
    location VARCHAR(100),
    religion VARCHAR(100),
    number_of_tasks INTEGER NOT NULL,
    tasks_done INTEGER DEFAULT 0,
    amount_paid NUMERIC(15, 2) NOT NULL,
    earner_fee NUMERIC(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. CREATE ADVERT CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.create_advert_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    path_to_page VARCHAR(255) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    description TEXT,
    fee NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CREATE ENGAGEMENT CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.create_engagement_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    path_to_page VARCHAR(255) NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    description TEXT,
    fee NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. EARN ADVERT CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.earn_advert_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    path_to_page VARCHAR(255) NOT NULL,
    reward NUMERIC(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. EARN ENGAGEMENT CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.earn_engagement_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    path_to_page VARCHAR(255) NOT NULL,
    reward NUMERIC(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. ALLOCATED TASKS TABLE
CREATE TABLE IF NOT EXISTS public.allocated_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'allocated',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. IN REVIEW TASKS TABLE
CREATE TABLE IF NOT EXISTS public.in_review_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    proof_id UUID,
    status VARCHAR(50) DEFAULT 'in-review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. COMPLETED TASKS TABLE
CREATE TABLE IF NOT EXISTS public.completed_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    reward NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. PENDING TASKS TABLE
CREATE TABLE IF NOT EXISTS public.pending_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    proof_image TEXT,
    username_proof VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. FAILED TASKS TABLE
CREATE TABLE IF NOT EXISTS public.failed_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. CANCELLED TASKS TABLE
CREATE TABLE IF NOT EXISTS public.cancelled_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 19. PROOF OF WORK TABLE
CREATE TABLE IF NOT EXISTS public.proof_of_work (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    image_proof TEXT NOT NULL,
    username_proof VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. FUNDING TABLE
CREATE TABLE IF NOT EXISTS public.funding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    reference VARCHAR(255) UNIQUE NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 21. TRANSFERS TABLE
CREATE TABLE IF NOT EXISTS public.transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    narration TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 22. WITHDRAWAL REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 23. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 24. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 25. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 26. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 27. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_name VARCHAR(150) DEFAULT 'DocsZar',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    min_withdrawal NUMERIC(15, 2) DEFAULT 1000.00,
    membership_fee NUMERIC(15, 2) DEFAULT 1000.00,
    referral_bonus NUMERIC(15, 2) DEFAULT 500.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
-- Create the public storage buckets for DocsZar assets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('profile_pics', 'profile_pics', true),
    ('advertisements', 'advertisements', true),
    ('proof_of_works', 'proof_of_works', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access policies for buckets
CREATE POLICY "Public Access Profile Pics" ON storage.objects FOR SELECT USING (bucket_id = 'profile_pics');
CREATE POLICY "Public Access Advertisements" ON storage.objects FOR SELECT USING (bucket_id = 'advertisements');
CREATE POLICY "Public Access Proof Of Works" ON storage.objects FOR SELECT USING (bucket_id = 'proof_of_works');

-- Allow uploads to public buckets
CREATE POLICY "Allow Uploads Profile Pics" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile_pics');
CREATE POLICY "Allow Uploads Advertisements" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'advertisements');
CREATE POLICY "Allow Uploads Proof Of Works" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'proof_of_works');

-- Allow deletes on public buckets
CREATE POLICY "Allow Deletes Advertisements" ON storage.objects FOR DELETE USING (bucket_id = 'advertisements');
CREATE POLICY "Allow Deletes Profile Pics" ON storage.objects FOR DELETE USING (bucket_id = 'profile_pics');
CREATE POLICY "Allow Deletes Proof Of Works" ON storage.objects FOR DELETE USING (bucket_id = 'proof_of_works');

-- ==============================================================================
-- 28. ENABLE ROW LEVEL SECURITY (RLS) FOR DATA PROTECTION
-- ==============================================================================
ALTER TABLE IF EXISTS public.users DROP COLUMN IF EXISTS password;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reset_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advert_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.engagement_tasks ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Base RLS policies
CREATE POLICY "users_select_policy" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON public.users FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
CREATE POLICY "users_update_policy" ON public.users FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "user_details_user_policy" ON public.user_details FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "tokens_user_policy" ON public.tokens FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "withdrawals_user_policy" ON public.withdrawal_requests FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "funding_user_policy" ON public.funding FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "transfers_user_policy" ON public.transfers FOR ALL USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin());
CREATE POLICY "notifications_user_policy" ON public.notifications FOR ALL USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "advertisements_select_all" ON public.advertisements FOR SELECT USING (true);
CREATE POLICY "advert_tasks_select_all" ON public.advert_tasks FOR SELECT USING (true);
CREATE POLICY "engagement_tasks_select_all" ON public.engagement_tasks FOR SELECT USING (true);

CREATE POLICY "config_advert_select" ON public.create_advert_config FOR SELECT USING (true);
CREATE POLICY "config_engagement_select" ON public.create_engagement_config FOR SELECT USING (true);
CREATE POLICY "config_earn_advert_select" ON public.earn_advert_config FOR SELECT USING (true);
CREATE POLICY "config_earn_engagement_select" ON public.earn_engagement_config FOR SELECT USING (true);
CREATE POLICY "admin_settings_select" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT USING (true);

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
