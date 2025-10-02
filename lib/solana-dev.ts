import { Connection, PublicKey, clusterApiUrl, SystemProgram } from '@solana/web3.js'
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

// Program ID - this should match your deployed program
export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')

// Simplified IDL for development (compatible with Anchor 0.31.1)
export const IDL: Idl = {
  "version": "0.1.0",
  "name": "journii",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "decrement",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "BaseAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Underflow",
      "msg": "Underflow error"
    }
  ]
}

export const useConnection = () => {
  const { wallet } = useWallet()
  
  const connection = useMemo(() => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network as any)
    return new Connection(rpcUrl, 'confirmed')
  }, [])

  const provider = useMemo(() => {
    if (!wallet) return null
    return new AnchorProvider(connection, wallet as any, {})
  }, [connection, wallet])

  const program = useMemo(() => {
    if (!provider) return null
    
    try {
      // In development mode, we might not have a deployed program
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Program creation may fail if not deployed')
      }
      
      // Validate PROGRAM_ID
      if (!PROGRAM_ID) {
        console.warn('PROGRAM_ID not provided')
        return null
      }
      
      // Validate IDL structure
      if (!IDL || !IDL.name || !IDL.instructions) {
        console.warn('Invalid IDL structure')
        return null
      }
      
      // Create program with error handling
      if (!provider) {
        console.warn('Provider not available')
        return null
      }
      
      // Additional validation before creating program
      if (!provider.connection || !provider.wallet) {
        console.warn('Provider connection or wallet not ready')
        return null
      }
      
      const program = new Program(IDL, PROGRAM_ID, provider)
      console.log('Program created successfully:', program.programId.toString())
      return program
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ Solana program not available (deploy program for blockchain features)')
      } else {
        console.warn('Program creation failed:', error)
      }
      // Return null instead of throwing - app can still work without program
      return null
    }
  }, [provider])

  return { connection, provider, program }
}

// Helper function to get the base account PDA
export const getBaseAccountPDA = (userPublicKey: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("base_account"), userPublicKey.toBuffer()],
    PROGRAM_ID
  )
}

// Import mock functions for development
import { 
  mockInitializeAccount, 
  mockIncrementCounter, 
  mockDecrementCounter, 
  mockGetAccountData,
  isDevelopmentMode
} from './mock-blockchain'

// Mock functions for development (when program is not deployed)
export const initializeAccount = async (program: Program | null, userPublicKey: PublicKey) => {
  try {
    // Use mock functions in development mode when program is not available
    if (isDevelopmentMode() && !program) {
      console.log('🔧 [DEV MODE] Using mock blockchain operations')
      return await mockInitializeAccount(userPublicKey)
    }

    const [baseAccountPDA] = getBaseAccountPDA(userPublicKey)
    
    const tx = await program.methods
      .initialize()
      .accounts({
        baseAccount: baseAccountPDA,
        user: userPublicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    return { success: true, signature: tx, account: baseAccountPDA }
  } catch (error) {
    console.error('Error initializing account:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const incrementCounter = async (program: Program | null, userPublicKey: PublicKey) => {
  try {
    // Use mock functions in development mode when program is not available
    if (isDevelopmentMode() && !program) {
      return await mockIncrementCounter(userPublicKey)
    }

    const [baseAccountPDA] = getBaseAccountPDA(userPublicKey)
    
    const tx = await program.methods
      .increment()
      .accounts({
        baseAccount: baseAccountPDA,
      })
      .rpc()

    return { success: true, signature: tx }
  } catch (error) {
    console.error('Error incrementing counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const decrementCounter = async (program: Program | null, userPublicKey: PublicKey) => {
  try {
    // Use mock functions in development mode when program is not available
    if (isDevelopmentMode() && !program) {
      return await mockDecrementCounter(userPublicKey)
    }

    const [baseAccountPDA] = getBaseAccountPDA(userPublicKey)
    
    const tx = await program.methods
      .decrement()
      .accounts({
        baseAccount: baseAccountPDA,
      })
      .rpc()

    return { success: true, signature: tx }
  } catch (error) {
    console.error('Error decrementing counter:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getAccountData = async (program: Program | null, userPublicKey: PublicKey) => {
  try {
    // Use mock functions in development mode when program is not available
    if (isDevelopmentMode() && !program) {
      const result = await mockGetAccountData(userPublicKey)
      if (result.success && result.data) {
        // Convert to BN format for compatibility
        return {
          success: true,
          data: {
            count: new BN(result.data.count),
            authority: userPublicKey
          }
        }
      }
      return result
    }

    const [baseAccountPDA] = getBaseAccountPDA(userPublicKey)
    
    const account = await program.account.baseAccount.fetch(baseAccountPDA)
    return { success: true, data: account }
  } catch (error) {
    console.error('Error fetching account data:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
