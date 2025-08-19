
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('client', 'therapist', 'admin')),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    specialties JSONB DEFAULT '[]'::jsonb,
    service_area TEXT NOT NULL,
    license_number TEXT,
    years_experience INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    major_change_pending BOOLEAN DEFAULT FALSE,
    base_commission_rate DECIMAL(5,2) DEFAULT 60.00,
    commission_override DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE therapist_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('license', 'insurance', 'identification')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id)
);

CREATE TABLE event_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_text TEXT NOT NULL,
    service_area TEXT NOT NULL,
    desired_date DATE,
    desired_time TIME,
    duration_minutes INTEGER DEFAULT 60,
    service_type TEXT DEFAULT 'massage',
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    accepted_by UUID REFERENCES therapists(id),
    square_booking_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE event_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_request_id UUID NOT NULL REFERENCES event_requests(id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL DEFAULT 'new_request',
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    response TEXT CHECK (response IN ('accepted', 'declined')),
    UNIQUE(event_request_id, therapist_id)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_request_id UUID NOT NULL REFERENCES event_requests(id),
    client_id UUID NOT NULL REFERENCES users(id),
    therapist_id UUID NOT NULL REFERENCES therapists(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    flagged_by UUID REFERENCES users(id),
    flagged_at TIMESTAMP WITH TIME ZONE,
    admin_decision TEXT CHECK (admin_decision IN ('keep', 'remove')),
    admin_decision_by UUID REFERENCES users(id),
    admin_decision_at TIMESTAMP WITH TIME ZONE,
    admin_decision_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_request_id, client_id)
);

CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL REFERENCES therapists(id),
    event_request_id UUID NOT NULL REFERENCES event_requests(id),
    service_fee_cents INTEGER NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,
    tier_level INTEGER DEFAULT 1,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'cancelled')),
    expected_payout_date DATE,
    actual_payout_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_request_id, therapist_id)
);

CREATE TABLE commission_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_level INTEGER NOT NULL UNIQUE,
    tier_name TEXT NOT NULL,
    min_monthly_bookings INTEGER NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE feature_flags (
    key TEXT PRIMARY KEY,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    rollout_percentage INTEGER DEFAULT 0,
    target_roles JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO commission_tiers (tier_level, tier_name, min_monthly_bookings, commission_rate) VALUES
(1, 'Bronze', 0, 60.00),
(2, 'Silver', 5, 70.00),
(3, 'Gold', 15, 80.00);

INSERT INTO feature_flags (key, enabled, description) VALUES
('corporate_packages', FALSE, 'Enable corporate booking packages'),
('loyalty_program', FALSE, 'Enable client loyalty rewards program'),
('instant_payouts', FALSE, 'Enable instant payout option for therapists'),
('sms_notifications', TRUE, 'Enable SMS notifications'),
('advanced_scheduling', FALSE, 'Enable advanced scheduling features');

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM users
    WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'anonymous');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Therapists can view own profile" ON therapists
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Clients can view approved therapists" ON therapists
    FOR SELECT USING (
        auth.get_user_role() = 'client' 
        AND status = 'approved' 
        AND major_change_pending = FALSE
    );

CREATE POLICY "Therapists can update own profile" ON therapists
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Therapists can create own profile" ON therapists
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Clients can view own requests" ON event_requests
    FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Clients can create requests" ON event_requests
    FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Therapists can view area requests" ON event_requests
    FOR SELECT USING (
        auth.get_user_role() = 'therapist'
        AND service_area IN (
            SELECT service_area 
            FROM therapists 
            WHERE user_id = auth.uid() 
            AND status = 'approved'
        )
    );

CREATE POLICY "Admins can view all" ON users FOR ALL USING (auth.get_user_role() = 'admin');
CREATE POLICY "Admins can manage therapists" ON therapists FOR ALL USING (auth.get_user_role() = 'admin');
CREATE POLICY "Admins can view all requests" ON event_requests FOR ALL USING (auth.get_user_role() = 'admin');
