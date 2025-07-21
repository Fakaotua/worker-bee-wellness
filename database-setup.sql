
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    bio TEXT NOT NULL CHECK (length(bio) >= 150),
    profile_photo_url TEXT,
    license_document_url TEXT,
    insurance_document_url TEXT,
    government_id_url TEXT,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_edits')),
    admin_notes TEXT,
    commission_tier INTEGER NOT NULL DEFAULT 1 CHECK (commission_tier BETWEEN 1 AND 4),
    total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    payout_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapists_user_id ON therapists(user_id);
CREATE INDEX IF NOT EXISTS idx_therapists_status ON therapists(status);
CREATE INDEX IF NOT EXISTS idx_reviews_therapist_id ON reviews(therapist_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_is_flagged ON reviews(is_flagged);
CREATE INDEX IF NOT EXISTS idx_earnings_therapist_id ON earnings(therapist_id);
CREATE INDEX IF NOT EXISTS idx_earnings_status ON earnings(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_therapists_updated_at 
    BEFORE UPDATE ON therapists 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can view own profile" ON therapists
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Therapists can update own profile" ON therapists
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Therapists can insert own profile" ON therapists
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Public can view approved therapists" ON therapists
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Therapists can view own earnings" ON earnings
    FOR SELECT USING (
        therapist_id IN (
            SELECT id FROM therapists WHERE user_id = auth.uid()::text
        )
    );

INSERT INTO therapists (user_id, name, bio, specialties, status, commission_tier, total_earnings) VALUES
('sample-user-1', 'Sarah Johnson', 'Licensed massage therapist with over 8 years of experience specializing in deep tissue and Swedish massage. I am passionate about helping clients achieve relaxation and pain relief through therapeutic touch. My approach combines traditional techniques with modern wellness practices.', ARRAY['Deep Tissue', 'Swedish', 'Sports Massage'], 'approved', 2, 2500.00),
('sample-user-2', 'Michael Chen', 'Certified therapeutic massage specialist focusing on injury recovery and chronic pain management. With a background in physical therapy, I provide targeted treatments that help clients return to their active lifestyles. I believe in personalized care for each individual.', ARRAY['Therapeutic', 'Injury Recovery', 'Trigger Point'], 'approved', 3, 4200.00),
('sample-user-3', 'Emma Rodriguez', 'Holistic wellness practitioner offering relaxation and prenatal massage services. I create a calming environment where clients can unwind and reconnect with their bodies. My gentle approach is perfect for stress relief and overall wellness maintenance.', ARRAY['Relaxation', 'Prenatal', 'Hot Stone'], 'pending', 1, 800.00);

INSERT INTO reviews (therapist_id, client_name, rating, comment) VALUES
((SELECT id FROM therapists WHERE name = 'Sarah Johnson'), 'Jennifer M.', 5, 'Amazing deep tissue massage! Sarah really knew how to work out all the knots in my shoulders. Highly recommend!'),
((SELECT id FROM therapists WHERE name = 'Sarah Johnson'), 'David K.', 4, 'Great experience overall. Very professional and the massage was exactly what I needed after my workout.'),
((SELECT id FROM therapists WHERE name = 'Michael Chen'), 'Lisa P.', 5, 'Michael helped me so much with my back pain. His therapeutic approach is exactly what I was looking for.'),
((SELECT id FROM therapists WHERE name = 'Michael Chen'), 'Robert T.', 5, 'Excellent service! Very knowledgeable about injury recovery. I felt so much better after the session.');
