-- Enable real-time for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;

-- Enable real-time for specific columns in auctions
ALTER TABLE auctions REPLICA IDENTITY FULL;

-- Enable real-time for specific columns in bids
ALTER TABLE bids REPLICA IDENTITY FULL; 