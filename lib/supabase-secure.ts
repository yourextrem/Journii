import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client for public operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Simple database types
export interface User {
  id: string
  wallet_address: string
  username?: string
  password_hash?: string
  created_at: string
  updated_at: string
}

export interface Counter {
  id: string
  user_id: string
  current_count: number
  last_updated: string
}

// Secure user functions using admin client
export const createUser = async (
  walletAddress: string,
  username: string,
  passwordHash: string
) => {
  try {
    // Validate input
    if (!walletAddress || !username || !passwordHash) {
      throw new Error('Missing required fields')
    }

    // Check if username already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      throw new Error('Username already taken')
    }

    // Check if wallet already exists
    const { data: existingWallet } = await supabaseAdmin
      .from('users')
      .select('wallet_address')
      .eq('wallet_address', walletAddress)
      .single()

    if (existingWallet) {
      throw new Error('Wallet already registered')
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          wallet_address: walletAddress,
          username,
          password_hash: passwordHash,
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

export const getUserByWallet = async (walletAddress: string) => {
  try {
    if (!walletAddress) {
      throw new Error('Wallet address is required')
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle()

    if (error) throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error getting user by wallet address:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'created_at' | 'wallet_address'>>) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabaseAdmin
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

// Counter functions
export const createCounter = async (userId: string, initialCount: number = 0) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabaseAdmin
      .from('counters')
      .insert([
        {
          user_id: userId,
          current_count: initialCount,
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getCounterByUser = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabaseAdmin
      .from('counters')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error getting counter by user ID:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const updateCounter = async (userId: string, count: number) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabaseAdmin
      .from('counters')
      .upsert([
        {
          user_id: userId,
          current_count: count,
          last_updated: new Date().toISOString()
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
