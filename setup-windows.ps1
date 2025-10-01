# Journii Web3 Platform Setup Script for Windows
Write-Host "Setting up Journii Web3 Platform on Windows..." -ForegroundColor Green
Write-Host ""

# Step 1: Install Node.js dependencies
Write-Host "Step 1: Installing Node.js dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Node.js dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error installing npm dependencies" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""

# Step 2: Check if Rust is installed
Write-Host "Step 2: Checking Rust installation..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version
    Write-Host "✅ Rust is installed: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Rust is not installed" -ForegroundColor Red
    Write-Host "Please install Rust from: https://rustup.rs/" -ForegroundColor Cyan
    Write-Host "After installation, restart your terminal and run this script again." -ForegroundColor Cyan
}

Write-Host ""

# Step 3: Check if Solana CLI is installed
Write-Host "Step 3: Checking Solana CLI installation..." -ForegroundColor Yellow
try {
    $solanaVersion = solana --version
    Write-Host "✅ Solana CLI is installed: $solanaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Solana CLI is not installed" -ForegroundColor Red
    Write-Host "Please install Solana CLI from: https://docs.solana.com/cli/install-solana-cli-tools" -ForegroundColor Cyan
}

Write-Host ""

# Step 4: Check if Anchor CLI is installed
Write-Host "Step 4: Checking Anchor CLI installation..." -ForegroundColor Yellow
try {
    $anchorVersion = anchor --version
    Write-Host "✅ Anchor CLI is installed: $anchorVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Anchor CLI is not installed" -ForegroundColor Red
    Write-Host "Installing Anchor CLI..." -ForegroundColor Cyan
    try {
        npm install -g @coral-xyz/anchor-cli
        Write-Host "✅ Anchor CLI installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error installing Anchor CLI" -ForegroundColor Red
        Write-Host "Please run: npm install -g @coral-xyz/anchor-cli" -ForegroundColor Cyan
    }
}

Write-Host ""

# Step 5: Configure Solana
Write-Host "Step 5: Configuring Solana..." -ForegroundColor Yellow
try {
    solana config set --url devnet
    Write-Host "✅ Solana configured for devnet" -ForegroundColor Green
    
    # Check if keypair exists
    $keypairPath = "$env:USERPROFILE\.config\solana\id.json"
    if (Test-Path $keypairPath) {
        Write-Host "✅ Solana keypair already exists" -ForegroundColor Green
    } else {
        Write-Host "Creating Solana keypair..." -ForegroundColor Cyan
        solana-keygen new --outfile $keypairPath
        Write-Host "✅ Solana keypair created" -ForegroundColor Green
    }
    
    # Airdrop SOL
    Write-Host "Requesting SOL airdrop..." -ForegroundColor Cyan
    solana airdrop 2
    Write-Host "✅ SOL airdropped successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error configuring Solana" -ForegroundColor Red
    Write-Host "Please run the following commands manually:" -ForegroundColor Cyan
    Write-Host "  solana config set --url devnet" -ForegroundColor Cyan
    Write-Host "  solana-keygen new --outfile %USERPROFILE%\.config\solana\id.json" -ForegroundColor Cyan
    Write-Host "  solana airdrop 2" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy env.example to .env.local and configure your environment variables" -ForegroundColor White
Write-Host "2. Set up your Supabase project and add credentials to .env.local" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
