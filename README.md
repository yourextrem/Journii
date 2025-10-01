# Journii - Web3 Platform

A responsive Web3 platform built with Solana, Next.js, and Supabase. This project demonstrates a complete Web3 stack with mobile-first responsive design.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Blockchain**: Solana with Anchor framework
- **Wallet**: Phantom Wallet integration
- **Database**: Supabase
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://rustup.rs/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Solana Program Setup

Build and deploy the Solana program:

```bash
# Build the program
npm run anchor:build

# Deploy to devnet
npm run anchor:deploy

# Test the program
npm run anchor:test
```

### 4. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Update your `.env.local` file with the Supabase credentials

### 5. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Prepare for Deployment

1. Ensure all environment variables are set in your Vercel project settings
2. Make sure your Solana program is deployed and the program ID is correct
3. Verify your Supabase configuration

### 2. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── WalletProvider.tsx # Wallet context provider
├── lib/                   # Utility libraries
│   ├── solana.ts         # Solana program integration
│   └── supabase.ts       # Supabase client
├── programs/              # Solana program
│   └── journii/          # Anchor program
├── public/               # Static assets
└── ...config files
```

## Features

- ✅ Responsive design for all devices
- ✅ Phantom wallet integration
- ✅ Solana program interaction
- ✅ Supabase database integration
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Vercel deployment ready

## Mobile Responsiveness

The application is built with mobile-first design principles:

- Responsive grid layouts
- Touch-friendly interface elements
- Optimized for various screen sizes
- Fast loading on mobile networks

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**: Ensure you have Phantom wallet installed
2. **Program Deployment**: Check that your Solana CLI is configured correctly
3. **Environment Variables**: Verify all required environment variables are set
4. **Build Errors**: Ensure all dependencies are installed correctly

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify your environment configuration
3. Ensure all services (Solana, Supabase) are accessible
4. Check the Vercel deployment logs

## License

MIT License - see LICENSE file for details.
