-- Create the product_dimensions table
CREATE TABLE product_dimensions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    length NUMERIC NOT NULL CHECK (length >= 1 AND length <= 50),
    width NUMERIC NOT NULL CHECK (width >= 1 AND width <= 50),
    height NUMERIC NOT NULL CHECK (height >= 1 AND height <= 30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE product_dimensions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view only their own dimensions
CREATE POLICY "Users can view their own dimensions"
    ON product_dimensions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own dimensions
CREATE POLICY "Users can insert their own dimensions"
    ON product_dimensions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own dimensions
CREATE POLICY "Users can update their own dimensions"
    ON product_dimensions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own dimensions
CREATE POLICY "Users can delete their own dimensions"
    ON product_dimensions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON product_dimensions TO authenticated;

-- Add comment to table
COMMENT ON TABLE product_dimensions IS 'Stores product dimensions for auction items';

-- Add indexes
CREATE INDEX idx_product_dimensions_user_id ON product_dimensions(user_id);
CREATE INDEX idx_product_dimensions_created_at ON product_dimensions(created_at); 