-- ==============================================================================
-- DOCSZAR NIGERIAN MICROTASK & SURVEY MARKETPLACE SCHEMA
-- ==============================================================================

-- 1. MARKETPLACE TASKS TABLE
CREATE TABLE IF NOT EXISTS public.marketplace_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- survey, app_testing, website_testing, data_collection, data_entry, transcription, voice_recording, ugc_media, research, mystery_shopping, custom
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    guidelines JSONB DEFAULT '[]'::jsonb,
    
    -- Survey Builder Data (if category == 'survey' or task has questionnaire)
    has_survey BOOLEAN DEFAULT FALSE,
    survey_questions JSONB DEFAULT '[]'::jsonb,
    
    -- Evidence & Proof Requirements
    proof_types JSONB DEFAULT '["screenshot"]'::jsonb, -- screenshot, photo, video, text, url, file, survey, location, unique_code
    proof_instructions TEXT,
    
    -- Audience Targeting Filters
    targeting JSONB DEFAULT '{
        "target_all": true,
        "states": [],
        "cities": [],
        "min_age": 18,
        "max_age": 65,
        "gender": "all",
        "device_types": ["all"],
        "student_only": false,
        "min_quality_score": 0,
        "verification_tier": "basic"
    }'::jsonb,
    
    -- Budget & Slot Configuration
    total_slots INTEGER NOT NULL DEFAULT 10,
    slots_remaining INTEGER NOT NULL DEFAULT 10,
    slots_reserved INTEGER NOT NULL DEFAULT 0,
    slots_completed INTEGER NOT NULL DEFAULT 0,
    reward_per_worker NUMERIC(15, 2) NOT NULL,
    platform_fee_percent NUMERIC(5, 2) DEFAULT 15.00,
    total_escrow_budget NUMERIC(15, 2) NOT NULL,
    escrow_status VARCHAR(50) DEFAULT 'funded', -- funded, depleted, refunded
    
    -- Timing & SLAs
    estimated_minutes INTEGER DEFAULT 10,
    reservation_time_limit_mins INTEGER DEFAULT 30,
    review_window_hours INTEGER DEFAULT 48,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status & Moderation
    status VARCHAR(50) DEFAULT 'active', -- draft, escrow_pending, active, paused, completed, cancelled, under_review
    moderation_status VARCHAR(50) DEFAULT 'approved', -- approved, flagged, rejected
    moderation_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TASK RESERVATIONS TABLE (Prevents slot over-allocation)
CREATE TABLE IF NOT EXISTS public.task_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.marketplace_tasks(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, submitted, expired, released
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TASK SUBMISSIONS & PROOF TABLE
CREATE TABLE IF NOT EXISTS public.task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.marketplace_tasks(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES public.task_reservations(id) ON DELETE SET NULL,
    
    -- Evidence Payload
    proof_text TEXT,
    proof_urls JSONB DEFAULT '[]'::jsonb, -- array of uploaded screenshot / media URLs
    survey_answers JSONB DEFAULT '{}'::jsonb, -- survey question key -> answer object
    location_data JSONB, -- optional GPS / city coordinates
    
    -- Review Workflow
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, disputed, auto_approved
    reward_amount NUMERIC(15, 2) NOT NULL,
    rejection_reason TEXT,
    creator_feedback TEXT,
    creator_rating INTEGER, -- 1-5 rating given to worker
    reviewed_at TIMESTAMP WITH TIME ZONE,
    auto_approve_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TASK DISPUTES TABLE
CREATE TABLE IF NOT EXISTS public.task_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES public.task_submissions(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.marketplace_tasks(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    worker_reason TEXT NOT NULL,
    worker_evidence_urls JSONB DEFAULT '[]'::jsonb,
    creator_response TEXT,
    
    status VARCHAR(50) DEFAULT 'open', -- open, under_review, resolved_approved_worker, resolved_rejected_refund, dismissed
    admin_resolution_notes TEXT,
    resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WORKER REPUTATION & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.worker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    quality_score NUMERIC(5, 2) DEFAULT 100.00, -- 0 to 100%
    total_submissions INTEGER DEFAULT 0,
    approved_submissions INTEGER DEFAULT 0,
    rejected_submissions INTEGER DEFAULT 0,
    disputes_count INTEGER DEFAULT 0,
    verification_tier VARCHAR(50) DEFAULT 'basic', -- basic, phone_verified, id_verified, trusted
    device_fingerprint TEXT,
    last_device_type VARCHAR(50) DEFAULT 'android',
    birth_year INTEGER,
    gender VARCHAR(20),
    state VARCHAR(100),
    city VARCHAR(100),
    occupation VARCHAR(150),
    is_student BOOLEAN DEFAULT FALSE,
    skills JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. DISABLE RLS ON MARKETPLACE TABLES
ALTER TABLE IF EXISTS public.marketplace_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.task_disputes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.worker_profiles DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
