/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable modern features for better performance
    optimizePackageImports: ['@solana/web3.js', '@coral-xyz/anchor'],
  },
  webpack: (config, { isServer }) => {
    // Polyfills for Node.js modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    // Ignore node-specific modules on client side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        encoding: false,
      };
    }

    return config;
  },
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    NEXT_PUBLIC_PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
  },
  // Vercel-specific optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
