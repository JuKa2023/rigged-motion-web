-- Add foreign key constraint to bids table
ALTER TABLE bids
    ADD CONSTRAINT bids_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Add an index to improve join performance
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);

-- Add comment to explain the relationship
COMMENT ON CONSTRAINT bids_user_id_fkey ON bids IS 'Links bids to authenticated users'; 