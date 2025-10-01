# Development Guide - Journii Web3 Platform

This guide will help you get started with development on the Journii Web3 platform.

## Quick Start (Development Mode)

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Setup Check

```bash
npm run setup
```

This will check if you have all required tools installed.

### 3. Start Development Server

```bash
npm run dev
```

The application will run in development mode with mock blockchain functionality, so you can develop the frontend without needing the full Solana setup.

## Development Mode Features

When running in development mode (`NODE_ENV=development`), the application will:

- ✅ Work without Anchor CLI installed
- ✅ Mock blockchain interactions
- ✅ Show console logs for mock operations
- ✅ Allow full frontend development
- ✅ Test wallet connection (Phantom)
- ✅ Test responsive design

## Full Setup (Production Ready)

To enable full blockchain functionality, you need to install:

### 1. Rust
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri "https://win.rustup.rs/" -OutFile "rustup-init.exe"
.\rustup-init.exe

# Or download from: https://rustup.rs/
```

### 2. Solana CLI
```bash
# Windows
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Or download from: https://docs.solana.com/cli/install-solana-cli-tools
```

### 3. Anchor CLI
```bash
npm install -g @coral-xyz/anchor-cli
```

### 4. Configure Solana
```bash
solana config set --url devnet
solana-keygen new --outfile ~/.config/solana/id.json
solana airdrop 2
```

### 5. Build and Deploy Program
```bash
npm run anchor:build
npm run anchor:deploy
```

## Environment Variables

Create `.env.local` file:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here

# Supabase Configuration (Optional for development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Development Workflow

### Frontend Development
1. Run `npm run dev`
2. Open http://localhost:3000
3. Connect Phantom wallet
4. Test responsive design
5. Develop UI components

### Blockchain Development
1. Install required tools (Rust, Solana, Anchor)
2. Modify `programs/journii/src/lib.rs`
3. Run `npm run anchor:build`
4. Run `npm run anchor:test`
5. Deploy with `npm run anchor:deploy`

### Database Development
1. Set up Supabase project
2. Run SQL from `supabase-schema.sql`
3. Add credentials to `.env.local`
4. Test API endpoints

## Troubleshooting

### Common Issues

#### "anchor command not found"
- Install Anchor CLI: `npm install -g @coral-xyz/anchor-cli`
- Or use development mode for frontend-only development

#### "solana command not found"
- Install Solana CLI from official website
- Add to PATH environment variable

#### "rustc command not found"
- Install Rust from https://rustup.rs/
- Restart terminal after installation

#### Wallet connection issues
- Ensure Phantom wallet is installed
- Check network is set to devnet
- Clear browser cache if needed

### Development Mode Benefits

- **No blockchain setup required** for frontend development
- **Mock responses** for all blockchain operations
- **Console logging** to see what would happen
- **Full UI testing** without deployment
- **Responsive design testing** on all devices

### Switching to Production Mode

1. Install all required tools
2. Deploy Solana program
3. Update environment variables
4. The app will automatically use real blockchain interactions

## File Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page (uses solana-dev.ts)
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── solana-dev.ts     # Development-friendly Solana integration
│   ├── solana.ts         # Production Solana integration
│   └── supabase.ts       # Database integration
├── programs/              # Solana program (Rust)
└── setup.js              # Setup checker script
```

## Next Steps

1. **Start with development mode** to build your UI
2. **Install blockchain tools** when ready for full functionality
3. **Set up Supabase** for database features
4. **Deploy to Vercel** when ready for production

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Run `npm run setup` to check tool installation
3. Use development mode for frontend-only work
4. Check console logs for error details
