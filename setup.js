const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Journii Web3 Platform...\n');

// Check if required tools are installed
function checkTool(tool, installCommand, installUrl) {
  try {
    execSync(`${tool} --version`, { stdio: 'pipe' });
    console.log(`✅ ${tool} is installed`);
    return true;
  } catch (error) {
    console.log(`❌ ${tool} is not installed`);
    console.log(`   Install with: ${installCommand}`);
    console.log(`   Or download from: ${installUrl}\n`);
    return false;
  }
}

// Check tools
const tools = [
  {
    name: 'Rust',
    command: 'rustc',
    installCommand: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh',
    installUrl: 'https://rustup.rs/'
  },
  {
    name: 'Solana CLI',
    command: 'solana',
    installCommand: 'sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"',
    installUrl: 'https://docs.solana.com/cli/install-solana-cli-tools'
  },
  {
    name: 'Anchor CLI',
    command: 'anchor',
    installCommand: 'npm install -g @coral-xyz/anchor-cli',
    installUrl: 'https://www.anchor-lang.com/docs/installation'
  }
];

let allToolsInstalled = true;

console.log('Checking required tools...\n');
tools.forEach(tool => {
  if (!checkTool(tool.command, tool.installCommand, tool.installUrl)) {
    allToolsInstalled = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allToolsInstalled) {
  console.log('🎉 All tools are installed! You can now run:');
  console.log('   npm run dev');
  console.log('   npm run anchor:build');
  console.log('   npm run anchor:deploy');
} else {
  console.log('⚠️  Some tools are missing. Please install them first.');
  console.log('\nAfter installing the missing tools, run this script again.');
}

console.log('\n📚 For detailed setup instructions, see:');
console.log('   - README.md');
console.log('   - DEPLOYMENT.md');
console.log('\n🚀 For Windows users, you can also run:');
console.log('   - setup-windows.bat (Command Prompt)');
console.log('   - setup-windows.ps1 (PowerShell)');
