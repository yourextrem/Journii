import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  wallet_address?: string
  username?: string
  email?: string
  password_hash?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  bio?: string
  is_verified: boolean
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface WalletConnection {
  id: string
  user_id: string
  wallet_address: string
  wallet_type: 'phantom' | 'solflare' | 'backpack' | 'other'
  is_primary: boolean
  connected_at: string
  last_used: string
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  created_at: string
  last_accessed: string
}

export interface UserPreferences {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'auto'
  notifications_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  language: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  signature: string
  amount: number
  transaction_type: 'increment' | 'decrement' | 'initialize'
  created_at: string
}

export interface Counter {
  id: string
  user_id: string
  current_count: number
  last_updated: string
}

// User management functions
export const createUser = async (
  walletAddress: string, 
  username?: string, 
  email?: string, 
  passwordHash?: string,
  firstName?: string,
  lastName?: string
) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          wallet_address: walletAddress,
          username,
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const createUserWithWallet = async (
  walletAddress: string,
  username?: string,
  email?: string,
  passwordHash?: string,
  firstName?: string,
  lastName?: string
) => {
  try {
    const { data, error } = await supabase.rpc('create_user_with_wallet', {
      p_wallet_address: walletAddress,
      p_username: username,
      p_email: email,
      p_password_hash: passwordHash,
      p_first_name: firstName,
      p_last_name: lastName
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating user with wallet:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getUserByWallet = async (walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Transaction management functions
export const createTransaction = async (
  userId: string,
  signature: string,
  amount: number,
  transactionType: 'increment' | 'decrement' | 'initialize'
) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          signature,
          amount,
          transaction_type: transactionType,
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getTransactionsByUser = async (userId: string, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Counter management functions
export const updateCounter = async (userId: string, count: number) => {
  try {
    const { data, error } = await supabase
      .from('counters')
      .upsert([
        {
          user_id: userId,
          current_count: count,
          last_updated: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getCounterByUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('counters')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Analytics functions
export const getTotalUsers = async () => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return { success: true, count }
  } catch (error) {
    console.error('Error fetching total users:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getTotalTransactions = async () => {
  try {
    const { count, error } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return { success: true, count }
  } catch (error) {
    console.error('Error fetching total transactions:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}