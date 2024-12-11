-- Insert sample auction with product information
INSERT INTO auctions (
    title,
    description,
    current_price,
    min_bid_increment,
    end_time,
    is_active,
    product_name,
    product_image_url,
    product_details
) VALUES (
    'Premium Advertising Spot',
    'Secure your product''s place in our next galactic marketing campaign. Your product will be featured in a stunning 3D animation that will capture attention across the universe.',
    1000.00,
    100.00,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    true,
    'Galaxy Marketing Package',
    'https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&q=80',
    'This premium advertising package includes:
    - 30-second 3D animated commercial
    - Prime placement in our next campaign
    - Social media promotion
    - Behind-the-scenes content
    - Professional product photography
    - Marketing analytics report'
); 