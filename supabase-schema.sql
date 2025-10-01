-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    signature TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('increment', 'decrement', 'initialize')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counters table
CREATE TABLE IF NOT EXISTS counters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    current_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_counters_user_id ON counters(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Transactions are readable by the user who created them
CREATE POLICY "Users can read own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Transactions can be inserted by authenticated users
CREATE POLICY "Authenticated users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Counters are readable by the user who owns them
CREATE POLICY "Users can read own counters" ON counters
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Counters can be updated by the user who owns them
CREATE POLICY "Users can update own counters" ON counters
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Counters can be inserted by authenticated users
CREATE POLICY "Authenticated users can insert counters" ON counters
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_wallet_address TEXT)
RETURNS JSON AS $$
DECLARE
    user_record users%ROWTYPE;
    transaction_count INTEGER;
    current_counter INTEGER;
    result JSON;
BEGIN
    -- Get user record
    SELECT * INTO user_record FROM users WHERE wallet_address = user_wallet_address;
    
    -- Get transaction count
    SELECT COUNT(*) INTO transaction_count FROM transactions WHERE user_id = user_record.id;
    
    -- Get current counter
    SELECT current_count INTO current_counter FROM counters WHERE user_id = user_record.id;
    
    -- Build result
    result := json_build_object(
        'user', row_to_json(user_record),
        'transaction_count', transaction_count,
        'current_count', COALESCE(current_counter, 0)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(TEXT) TO anon, authenticated;
