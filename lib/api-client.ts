// Client-side API helper functions
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

// User API functions
export const createUser = async (
  walletAddress: string,
  username: string,
  password: string
) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        username,
        password,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getUserByWallet = async (walletAddress: string) => {
  try {
    const response = await fetch(`/api/users?wallet_address=${encodeURIComponent(walletAddress)}`, {
      method: 'GET',
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error getting user by wallet address:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'created_at' | 'wallet_address'>> & { password?: string }) => {
  try {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        updates,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Counter API functions
export const createCounter = async (userId: string, initialCount: number = 0) => {
  try {
    const response = await fetch('/api/counters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        initialCount,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getCounterByUser = async (userId: string) => {
  try {
    const response = await fetch(`/api/counters?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error getting counter by user ID:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const updateCounter = async (userId: string, count: number) => {
  try {
    const response = await fetch('/api/counters', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        count,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
