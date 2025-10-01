@echo off
echo Setting up Journii Web3 Platform on Windows...
echo.

echo Step 1: Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing npm dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Rust...
echo Please download and install Rust from: https://rustup.rs/
echo After installation, restart your terminal and run this script again.
echo.
echo Step 3: Installing Solana CLI...
echo Please download and install Solana CLI from: https://docs.solana.com/cli/install-solana-cli-tools
echo.
echo Step 4: Installing Anchor CLI...
echo Run: npm install -g @coral-xyz/anchor-cli
echo.
echo Step 5: Configuring Solana...
echo Run: solana config set --url devnet
echo Run: solana-keygen new --outfile %USERPROFILE%\.config\solana\id.json
echo Run: solana airdrop 2
echo.
echo Setup instructions completed!
echo Please follow the manual steps above, then run: npm run dev
pause
