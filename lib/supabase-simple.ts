import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple database types
export interface User {
  id: string
  wallet_address: string
  username?: string
  email?: string
  password_hash?: string
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

export interface Counter {
  id: string
  user_id: string
  current_count: number
  last_updated: string
}

// Simple user functions
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

export const getUserByWallet = async (walletAddress: string) => {
  try {
    const { data, error } = await supabase
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

// Simple counter functions
export const createCounter = async (userId: string, initialCount: number = 0) => {
  try {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
