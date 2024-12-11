-- First, add the new column
ALTER TABLE auctions 
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT false;

-- Set the first auction (by created date) to active
UPDATE auctions 
SET is_active = (
    CASE 
        WHEN id = (
            SELECT id 
            FROM auctions 
            ORDER BY created_at DESC 
            LIMIT 1
        ) 
        THEN true 
        ELSE false 
    END
);

-- Now drop the old status column
ALTER TABLE auctions 
    DROP COLUMN status;

-- Add constraint to ensure only one active auction
CREATE UNIQUE INDEX single_active_auction ON auctions ((is_active IS TRUE)) WHERE is_active IS TRUE;

-- Enable Row Level Security
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms_acceptance ENABLE ROW LEVEL SECURITY;

-- Create policies for auctions
CREATE POLICY "Allow read access for all users" ON auctions
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow write access for authenticated admins only" ON auctions
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT unnest(string_to_array(current_setting('app.admin_emails', true), ','))));

-- Create policies for bids
CREATE POLICY "Allow read access for all users" ON bids
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to create bids" ON bids
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to manage their own bids" ON bids
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for terms_acceptance
CREATE POLICY "Allow read access for all users" ON terms_acceptance
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow users to manage their own terms acceptance" ON terms_acceptance
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Create admin configuration
CREATE OR REPLACE FUNCTION set_admin_emails(emails text[])
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.admin_emails', array_to_string(emails, ','), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 