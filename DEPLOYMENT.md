# Deployment Guide - Journii Web3 Platform

This guide will walk you through deploying your Web3 platform to Vercel with all components working correctly.

## Prerequisites

Before deploying, ensure you have:

1. **Rust and Solana CLI installed**
2. **Anchor framework installed**
3. **Vercel account and CLI**
4. **Supabase account and project**

## Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust dependencies (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
npm install -g @coral-xyz/anchor-cli
```

### 1.2 Configure Solana

```bash
# Set to devnet
solana config set --url devnet

# Create a new keypair (if you don't have one)
solana-keygen new --outfile ~/.config/solana/id.json

# Get some SOL for testing
solana airdrop 2
```

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2.2 Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase-schema.sql`:

```sql
-- Copy and paste the entire content of supabase-schema.sql
```

### 2.3 Configure Environment Variables

Create `.env.local` file:

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 3: Deploy Solana Program

### 3.1 Build and Deploy Program

```bash
# Build the program
npm run anchor:build

# Deploy to devnet
npm run anchor:deploy
```

### 3.2 Update Program ID

After deployment, update your `.env.local` with the actual program ID:

```env
NEXT_PUBLIC_PROGRAM_ID=your_actual_program_id_from_deployment
```

## Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4.3 Configure Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all variables from your `.env.local`:

```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 5: Testing Deployment

### 5.1 Test Checklist

- [ ] Website loads without errors
- [ ] Phantom wallet connects successfully
- [ ] Account initialization works
- [ ] Counter increment/decrement functions
- [ ] Mobile responsiveness works
- [ ] Database operations work
- [ ] All environment variables are set

### 5.2 Common Issues and Solutions

#### Issue: "Program not found"
**Solution**: Ensure the program ID is correct and the program is deployed

#### Issue: "Wallet connection failed"
**Solution**: Check that Phantom wallet is installed and the network is set to devnet

#### Issue: "Database connection failed"
**Solution**: Verify Supabase credentials and RLS policies

#### Issue: "Build failed on Vercel"
**Solution**: Check that all environment variables are set in Vercel dashboard

## Step 6: Production Considerations

### 6.1 Security

- Use environment variables for all sensitive data
- Enable RLS policies in Supabase
- Use HTTPS in production
- Validate all user inputs

### 6.2 Performance

- Enable Vercel's edge functions if needed
- Optimize images and assets
- Use CDN for static content
- Monitor performance metrics

### 6.3 Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor Solana RPC usage
- Track database performance
- Set up uptime monitoring

## Step 7: Maintenance

### 7.1 Regular Updates

- Keep dependencies updated
- Monitor for security vulnerabilities
- Update Solana program if needed
- Backup database regularly

### 7.2 Scaling

- Monitor resource usage
- Consider upgrading Vercel plan if needed
- Optimize database queries
- Implement caching strategies

## Troubleshooting

### Build Errors

```bash
# Clean and rebuild
npm run anchor:clean
npm run anchor:build
npm run build
```

### Deployment Errors

```bash
# Check Vercel logs
vercel logs

# Redeploy
vercel --prod --force
```

### Runtime Errors

1. Check browser console for errors
2. Verify all environment variables
3. Check Supabase logs
4. Verify Solana program deployment

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review Vercel deployment logs
3. Check Supabase dashboard for errors
4. Verify Solana program status

## Next Steps

After successful deployment:

1. Add your content and features
2. Implement additional Web3 functionality
3. Add more wallet support
4. Enhance mobile experience
5. Add analytics and monitoring
