import { Connection, PublicKey, clusterApiUrl, SystemProgram } from '@solana/web3.js'
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

// Program ID - this should match your deployed program
export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS')

// Minimal IDL for development - will use mock functions instead
export const IDL: any = {
  name: "journii",
  instructions: [],
  accounts: [],
  errors: []
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
    return new Program(IDL, provider)
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

// Program interaction functions
export const initializeAccount = async (program: Program, userPublicKey: PublicKey) => {
  try {
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
    // For now, return mock data since we don't have a real program deployed
    return { success: false, error: 'Account not found - program not deployed' }
  } catch (error) {
    console.error('Error fetching account data:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}