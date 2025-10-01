'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { useConnection, initializeAccount, incrementCounter, decrementCounter, getAccountData } from '@/lib/solana-dev'
import { createUserWithWallet, getUserByWallet, createCounter, updateCounter, getCounterByUser, createTransaction } from '@/lib/supabase'
import { ResponsiveContainer, Card, Button } from '@/components/ResponsiveContainer'
import { UserRegistration } from '@/components/UserRegistration'

const Home = () => {
  const { publicKey, connected } = useWallet()
  const { program } = useConnection()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Load account data when wallet connects
  useEffect(() => {
    if (connected && program && publicKey) {
      loadAccountData()
      setupUserInDatabase()
    }
  }, [connected, program, publicKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const setupUserInDatabase = async () => {
    if (!publicKey) return

    try {
      const walletAddress = publicKey.toBase58()
      
      // Check if user exists
      const userResult = await getUserByWallet(walletAddress)
      
      if (userResult.success && userResult.data) {
        console.log('User already exists:', userResult.data)
        setUserProfile(userResult.data)
        
        // Check if user has completed profile (has username/email)
        if (!userResult.data.username || !userResult.data.email) {
          setShowRegistration(true)
        } else {
          // Load existing counter
          const counterResult = await getCounterByUser(userResult.data.id)
          if (counterResult.success && counterResult.data) {
            setCount(counterResult.data.current_count)
            setIsInitialized(true)
          }
        }
      } else {
        // User doesn't exist, show registration form
        console.log('User not found, showing registration form...')
        setShowRegistration(true)
      }
    } catch (error) {
      console.error('Error setting up user in database:', error)
      // Show registration form on error
      setShowRegistration(true)
    }
  }

  const saveCounterToDatabase = async (newCount: number, action: 'increment' | 'decrement') => {
    if (!publicKey) return

    try {
      const walletAddress = publicKey.toBase58()
      
      // Get user
      const userResult = await getUserByWallet(walletAddress)
      if (!userResult.success || !userResult.data) {
        console.error('User not found for counter update')
        return
      }

      // Update counter in database
      const counterResult = await updateCounter(userResult.data.id, newCount)
      if (counterResult.success) {
        console.log('Counter updated in database:', counterResult.data)
      }

      // Record transaction
      const transactionResult = await createTransaction(
        userResult.data.id,
        `mock_signature_${action}_${Date.now()}`,
        1,
        action
      )
      if (transactionResult.success) {
        console.log('Transaction recorded:', transactionResult.data)
      }
    } catch (error) {
      console.error('Error saving counter to database:', error)
    }
  }

  const handleRegistrationComplete = async () => {
    setShowRegistration(false)
    // Reload user data
    if (publicKey) {
      await setupUserInDatabase()
    }
  }

  const loadAccountData = async () => {
    if (!program || !publicKey) return
    
    setLoading(true)
    const result = await getAccountData(program, publicKey)
    
    if (result.success && result.data) {
      setCount(result.data.count.toNumber())
      setIsInitialized(true)
      setMessage('Account loaded successfully!')
    } else {
      setIsInitialized(false)
      setMessage('Account not initialized yet.')
    }
    setLoading(false)
  }

  const handleInitialize = async () => {
    if (!program || !publicKey) return
    
    setLoading(true)
    const result = await initializeAccount(program, publicKey)
    
    if (result.success) {
      setMessage('Account initialized successfully!')
      setIsInitialized(true)
      setCount(0)
    } else {
      setMessage(`Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleIncrement = async () => {
    if (!program || !publicKey) return
    
    setLoading(true)
    const result = await incrementCounter(program, publicKey)
    
    if (result.success) {
      const newCount = count + 1
      setCount(newCount)
      setMessage('Counter incremented!')
      
      // Save to Supabase
      await saveCounterToDatabase(newCount, 'increment')
    } else {
      setMessage(`Error: ${result.error}`)
    }
    setLoading(false)
  }

  const handleDecrement = async () => {
    if (!program || !publicKey) return
    
    setLoading(true)
    const result = await decrementCounter(program, publicKey)
    
    if (result.success) {
      const newCount = count - 1
      setCount(newCount)
      setMessage('Counter decremented!')
      
      // Save to Supabase
      await saveCounterToDatabase(newCount, 'decrement')
    } else {
      setMessage(`Error: ${result.error}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <ResponsiveContainer>
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Journii
            </h1>
            <WalletMultiButton />
          </div>
        </ResponsiveContainer>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <ResponsiveContainer>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Web3
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                A responsive Web3 platform built with Solana, Next.js, and Supabase. 
                Connect your wallet to interact with the blockchain.
              </p>
            </div>

            {/* Connection Status */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Connection Status
              </h3>
              {connected ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Wallet Connected
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Public Key:</strong>
                    </p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                      {publicKey?.toString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={`font-medium ${isInitialized ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {isInitialized ? 'Account Initialized' : 'Account Not Initialized'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Wallet Not Connected
                  </span>
                </div>
              )}
            </Card>

            {/* User Registration */}
            {connected && showRegistration && (
              <Card>
                <UserRegistration 
                  walletAddress={publicKey?.toBase58() || ''} 
                  onComplete={handleRegistrationComplete}
                />
              </Card>
            )}

            {/* User Profile */}
            {connected && !showRegistration && userProfile && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Welcome, {userProfile.username || userProfile.first_name || 'User'}!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Email: {userProfile.email}
                </p>
              </Card>
            )}

            {/* Blockchain Counter */}
            {connected && !showRegistration && (
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Blockchain Counter
                </h3>
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                    {count}
                  </div>
                  
                  {!isInitialized ? (
                    <Button
                      onClick={handleInitialize}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? 'Initializing...' : 'Initialize Account'}
                    </Button>
                  ) : (
                    <div className="space-x-4 space-y-2 sm:space-y-0">
                      <Button
                        onClick={handleIncrement}
                        disabled={loading}
                        variant="primary"
                      >
                        {loading ? 'Processing...' : 'Increment'}
                      </Button>
                      <Button
                        onClick={handleDecrement}
                        disabled={loading || count <= 0}
                        variant="secondary"
                      >
                        {loading ? 'Processing...' : 'Decrement'}
                      </Button>
                      <Button
                        onClick={loadAccountData}
                        disabled={loading}
                        variant="secondary"
                      >
                        {loading ? 'Loading...' : 'Refresh'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Message Display */}
            {message && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-center">
                  {message}
                </p>
              </Card>
            )}

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Solana Integration
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Built with Anchor framework for secure smart contracts
                </p>
              </Card>
              
              <Card className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Mobile Responsive
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Optimized for all devices with Tailwind CSS
                </p>
              </Card>
              
              <Card className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Fast & Secure
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Deployed on Vercel with Supabase backend
                </p>
              </Card>
            </div>
          </div>
        </ResponsiveContainer>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <ResponsiveContainer>
          <div className="py-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Journii. Built with Solana, Next.js, and Supabase.</p>
          </div>
        </ResponsiveContainer>
      </footer>
    </div>
  )
}

export default Home