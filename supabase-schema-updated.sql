-- Updated Supabase Schema for Journii Web3 Platform
-- This schema includes email, username, wallet connection, and password fields

-- Note: JWT secret is automatically managed by Supabase

-- Create users table with enhanced fields
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT UNIQUE,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_connections table for multiple wallet support
CREATE TABLE IF NOT EXISTS wallet_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    wallet_type TEXT NOT NULL CHECK (wallet_type IN ('phantom', 'solflare', 'backpack', 'other')),
    is_primary BOOLEAN DEFAULT FALSE,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table (enhanced)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    signature TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('increment', 'decrement', 'initialize', 'transfer', 'mint', 'burn')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    block_hash TEXT,
    slot BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counters table
CREATE TABLE IF NOT EXISTS counters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    current_count INTEGER NOT NULL DEFAULT 0,
    total_increments INTEGER NOT NULL DEFAULT 0,
    total_decrements INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_wallet_connections_user_id ON wallet_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_connections_address ON wallet_connections(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_signature ON transactions(signature);
CREATE INDEX IF NOT EXISTS idx_counters_user_id ON counters(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create RLS policies for wallet_connections table
CREATE POLICY "Users can read own wallet connections" ON wallet_connections
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own wallet connections" ON wallet_connections
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own wallet connections" ON wallet_connections
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own wallet connections" ON wallet_connections
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for transactions table
CREATE POLICY "Users can read own transactions" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for counters table
CREATE POLICY "Users can read own counters" ON counters
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own counters" ON counters
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can insert counters" ON counters
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for user_sessions table
CREATE POLICY "Users can read own sessions" ON user_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" ON user_sessions
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for user_preferences table
CREATE POLICY "Users can read own preferences" ON user_preferences
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_wallet_address TEXT)
RETURNS JSON AS $$
DECLARE
    user_record users%ROWTYPE;
    transaction_count INTEGER;
    current_counter INTEGER;
    wallet_connections_count INTEGER;
    result JSON;
BEGIN
    -- Get user record
    SELECT * INTO user_record FROM users WHERE wallet_address = user_wallet_address;
    
    -- Get transaction count
    SELECT COUNT(*) INTO transaction_count FROM transactions WHERE user_id = user_record.id;
    
    -- Get current counter
    SELECT current_count INTO current_counter FROM counters WHERE user_id = user_record.id;
    
    -- Get wallet connections count
    SELECT COUNT(*) INTO wallet_connections_count FROM wallet_connections WHERE user_id = user_record.id;
    
    -- Build result
    result := json_build_object(
        'user', row_to_json(user_record),
        'transaction_count', transaction_count,
        'current_count', COALESCE(current_counter, 0),
        'wallet_connections_count', wallet_connections_count
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create user with wallet
CREATE OR REPLACE FUNCTION create_user_with_wallet(
    p_wallet_address TEXT,
    p_username TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_password_hash TEXT DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    result JSON;
BEGIN
    -- Insert user
    INSERT INTO users (wallet_address, username, email, password_hash, first_name, last_name)
    VALUES (p_wallet_address, p_username, p_email, p_password_hash, p_first_name, p_last_name)
    RETURNING id INTO new_user_id;
    
    -- Insert wallet connection
    INSERT INTO wallet_connections (user_id, wallet_address, wallet_type, is_primary)
    VALUES (new_user_id, p_wallet_address, 'phantom', TRUE);
    
    -- Insert counter
    INSERT INTO counters (user_id, current_count)
    VALUES (new_user_id, 0);
    
    -- Insert default preferences
    INSERT INTO user_preferences (user_id)
    VALUES (new_user_id);
    
    -- Get the created user
    SELECT row_to_json(u) INTO result FROM users u WHERE id = new_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_user_with_wallet(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
