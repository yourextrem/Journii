-- Fix RLS policies to allow operations
-- Run this in your Supabase SQL Editor

-- Disable RLS temporarily for counters table
ALTER TABLE counters DISABLE ROW LEVEL SECURITY;

-- Disable RLS temporarily for transactions table  
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- Allow all operations on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

CREATE POLICY "Users: Allow all operations" ON users
    FOR ALL USING (true);

-- Allow all operations on wallet_connections table
DROP POLICY IF EXISTS "Wallet connections: Users can read own connections" ON wallet_connections;
DROP POLICY IF EXISTS "Wallet connections: Users can insert own connections" ON wallet_connections;
DROP POLICY IF EXISTS "Wallet connections: Users can update own connections" ON wallet_connections;
DROP POLICY IF EXISTS "Wallet connections: Users can delete own connections" ON wallet_connections;

CREATE POLICY "Wallet connections: Allow all operations" ON wallet_connections
    FOR ALL USING (true);
