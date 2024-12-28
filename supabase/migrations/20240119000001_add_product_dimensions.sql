-- Create the user_auction_preferences table
CREATE TABLE user_auction_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    auction_id UUID REFERENCES auctions NOT NULL,
    length NUMERIC NOT NULL CHECK (length >= 1 AND length <= 50),
    width NUMERIC NOT NULL CHECK (width >= 1 AND width <= 50),
    height NUMERIC NOT NULL CHECK (height >= 1 AND height <= 30),
    product_vision TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, auction_id)
);

-- Enable Row Level Security
ALTER TABLE user_auction_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view only their own preferences
CREATE POLICY "Users can view their own preferences"
    ON user_auction_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own preferences
CREATE POLICY "Users can insert their own preferences"
    ON user_auction_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own preferences
CREATE POLICY "Users can update their own preferences"
    ON user_auction_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own preferences
CREATE POLICY "Users can delete their own preferences"
    ON user_auction_preferences
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON user_auction_preferences TO authenticated;

-- Add comment to table
COMMENT ON TABLE user_auction_preferences IS 'Stores user preferences for auctions including product dimensions and vision';

-- Add indexes
CREATE INDEX idx_user_auction_preferences_user_id ON user_auction_preferences(user_id);
CREATE INDEX idx_user_auction_preferences_auction_id ON user_auction_preferences(auction_id);
CREATE INDEX idx_user_auction_preferences_created_at ON user_auction_preferences(created_at); 