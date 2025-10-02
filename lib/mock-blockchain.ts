// Mock blockchain operations for free development testing
import { PublicKey } from '@solana/web3.js'

// Mock transaction results
interface MockTransactionResult {
  success: boolean
  signature: string
  error?: string
  data?: any
}

// Mock account data storage (simulates on-chain state)
const mockAccounts = new Map<string, {
  count: number
  authority: string
  initialized: boolean
  lastUpdated: number
}>()

// Generate mock transaction signature
const generateMockSignature = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Simulate network delay
const simulateNetworkDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock initialize account
export const mockInitializeAccount = async (userPublicKey: PublicKey): Promise<MockTransactionResult> => {
  console.log('🔧 [DEV MODE] Simulating account initialization...')
  
  await simulateNetworkDelay(1500) // Simulate blockchain delay
  
  const accountKey = userPublicKey.toString()
  
  // Check if already initialized
  if (mockAccounts.has(accountKey)) {
    return {
      success: false,
      signature: '',
      error: 'Account already initialized'
    }
  }
  
  // Initialize mock account
  mockAccounts.set(accountKey, {
    count: 0,
    authority: accountKey,
    initialized: true,
    lastUpdated: Date.now()
  })
  
  const signature = generateMockSignature()
  console.log('✅ [DEV MODE] Account initialized successfully:', signature)
  
  return {
    success: true,
    signature,
    data: {
      count: 0,
      authority: userPublicKey,
      initialized: true
    }
  }
}

// Mock increment counter
export const mockIncrementCounter = async (userPublicKey: PublicKey): Promise<MockTransactionResult> => {
  console.log('🔧 [DEV MODE] Simulating counter increment...')
  
  await simulateNetworkDelay(800)
  
  const accountKey = userPublicKey.toString()
  const account = mockAccounts.get(accountKey)
  
  if (!account) {
    return {
      success: false,
      signature: '',
      error: 'Account not initialized'
    }
  }
  
  // Increment counter
  account.count += 1
  account.lastUpdated = Date.now()
  
  const signature = generateMockSignature()
  console.log('✅ [DEV MODE] Counter incremented to:', account.count, 'Signature:', signature)
  
  return {
    success: true,
    signature,
    data: {
      count: account.count,
      authority: userPublicKey
    }
  }
}

// Mock decrement counter
export const mockDecrementCounter = async (userPublicKey: PublicKey): Promise<MockTransactionResult> => {
  console.log('🔧 [DEV MODE] Simulating counter decrement...')
  
  await simulateNetworkDelay(800)
  
  const accountKey = userPublicKey.toString()
  const account = mockAccounts.get(accountKey)
  
  if (!account) {
    return {
      success: false,
      signature: '',
      error: 'Account not initialized'
    }
  }
  
  if (account.count <= 0) {
    return {
      success: false,
      signature: '',
      error: 'Cannot decrement below zero'
    }
  }
  
  // Decrement counter
  account.count -= 1
  account.lastUpdated = Date.now()
  
  const signature = generateMockSignature()
  console.log('✅ [DEV MODE] Counter decremented to:', account.count, 'Signature:', signature)
  
  return {
    success: true,
    signature,
    data: {
      count: account.count,
      authority: userPublicKey
    }
  }
}

// Mock get account data
export const mockGetAccountData = async (userPublicKey: PublicKey): Promise<MockTransactionResult> => {
  console.log('🔧 [DEV MODE] Fetching mock account data...')
  
  await simulateNetworkDelay(300)
  
  const accountKey = userPublicKey.toString()
  const account = mockAccounts.get(accountKey)
  
  if (!account) {
    return {
      success: false,
      signature: '',
      error: 'Account not found'
    }
  }
  
  console.log('✅ [DEV MODE] Account data retrieved:', { count: account.count, initialized: account.initialized })
  
  return {
    success: true,
    signature: '',
    data: {
      count: account.count,
      authority: userPublicKey,
      initialized: account.initialized
    }
  }
}

// Mock reset account (for testing)
export const mockResetAccount = async (userPublicKey: PublicKey): Promise<MockTransactionResult> => {
  console.log('🔧 [DEV MODE] Resetting mock account...')
  
  const accountKey = userPublicKey.toString()
  mockAccounts.delete(accountKey)
  
  console.log('✅ [DEV MODE] Account reset successfully')
  
  return {
    success: true,
    signature: generateMockSignature()
  }
}

// Get all mock accounts (for debugging)
export const getMockAccounts = () => {
  return Array.from(mockAccounts.entries()).map(([key, value]) => ({
    publicKey: key,
    ...value
  }))
}

// Check if development mode
export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development'
}
