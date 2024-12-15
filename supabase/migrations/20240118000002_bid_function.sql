-- Function to place a bid and update auction price atomically
CREATE OR REPLACE FUNCTION place_bid(
    p_auction_id UUID,
    p_user_id UUID,
    p_amount DECIMAL
)
RETURNS JSON AS $$
DECLARE
    v_current_price DECIMAL;
    v_min_increment DECIMAL;
    v_is_active BOOLEAN;
BEGIN
    -- Get current auction state
    SELECT current_price, min_bid_increment, is_active
    INTO v_current_price, v_min_increment, v_is_active
    FROM auctions
    WHERE id = p_auction_id
    FOR UPDATE;  -- Lock the row to prevent concurrent updates

    -- Validate auction is active
    IF NOT v_is_active THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Auction is not active'
        );
    END IF;

    -- Validate bid amount
    IF p_amount <= v_current_price THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Bid must be higher than current price'
        );
    END IF;

    IF p_amount < (v_current_price + v_min_increment) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Bid must meet minimum increment requirement'
        );
    END IF;

    -- Insert bid
    INSERT INTO bids (auction_id, user_id, amount)
    VALUES (p_auction_id, p_user_id, p_amount);

    -- Update auction price
    UPDATE auctions
    SET current_price = p_amount
    WHERE id = p_auction_id
    AND current_price < p_amount;  -- Extra safety check

    RETURN json_build_object(
        'success', true,
        'message', 'Bid placed successfully'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 