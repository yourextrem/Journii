'use client'

import { FC, ReactNode, useMemo, useEffect, useState } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import dynamic from 'next/dynamic'

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css')

interface WalletContextProviderProps {
  children: ReactNode
}

// Create a component that only renders on client side
const ClientWalletProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

// Dynamically import the wallet provider to prevent SSR issues
const DynamicWalletProvider = dynamic(
  () => Promise.resolve(ClientWalletProvider),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading wallet...</p>
        </div>
      </div>
    )
  }
)

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  return <DynamicWalletProvider>{children}</DynamicWalletProvider>
}
