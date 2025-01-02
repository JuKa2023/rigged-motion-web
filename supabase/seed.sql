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
    'Sichere dir einen Platz für dein Produkt in unserer nächsten galaktischen Marketingkampagne. Dein Produkt wird in einer 3D-Animation vorgestellt, die im ganzen Universum für Aufmerksamkeit sorgen wird.',
    200.00,
    100.00,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    true,
    'Galaxy Marketing-Paket',
    'https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&q=80',
    'Dieses Premium-Werbepaket umfasst:
    - 30-Sekunden 3D animierter Werbespot
    - Erstklassige Platzierung in der nächsten Kampagne
    - Werbung in den sozialen Medien
    - Behind-the-scenes content
    - Professional product photography
    - Marketing analytics report'
); 