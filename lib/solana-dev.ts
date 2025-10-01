import { Connection, PublicKey, clusterApiUrl, SystemProgram } from '@solana/web3.js'
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

// Program ID - this should match your deployed program
export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')

// Simplified IDL for development (without requiring Anchor build)
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
    return new Program(IDL, PROGRAM_ID, provider)
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

// Mock functions for development (when program is not deployed)
export const initializeAccount = async (program: Program, userPublicKey: PublicKey) => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && !program) {
      console.log('Development mode: Mocking account initialization')
      return { success: true, signature: 'mock-signature', account: userPublicKey }
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

export const incrementCounter = async (program: Program, userPublicKey: PublicKey) => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && !program) {
      console.log('Development mode: Mocking counter increment')
      return { success: true, signature: 'mock-increment-signature' }
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

export const decrementCounter = async (program: Program, userPublicKey: PublicKey) => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && !program) {
      console.log('Development mode: Mocking counter decrement')
      return { success: true, signature: 'mock-decrement-signature' }
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

export const getAccountData = async (program: Program, userPublicKey: PublicKey) => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && !program) {
      console.log('Development mode: Mocking account data fetch')
      return { 
        success: true, 
        data: { 
          count: new BN(0), 
          authority: userPublicKey 
        } 
      }
    }

    const [baseAccountPDA] = getBaseAccountPDA(userPublicKey)
    
    const account = await program.account.baseAccount.fetch(baseAccountPDA)
    return { success: true, data: account }
  } catch (error) {
    console.error('Error fetching account data:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
