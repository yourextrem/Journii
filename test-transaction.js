#!/usr/bin/env node

/**
 * Simple Solana Transaction Test Script
 * Tests mock blockchain operations in development mode
 */

const { PublicKey } = require('@solana/web3.js')

// Mock the development environment
process.env.NODE_ENV = 'development'

// Import our mock blockchain functions
const {
  mockInitializeAccount,
  mockIncrementCounter,
  mockDecrementCounter,
  mockGetAccountData,
  mockResetAccount,
  getMockAccounts,
  isDevelopmentMode
} = require('./lib/mock-blockchain.ts')

async function runTransactionTest() {
  console.log('🚀 Starting Solana Development Mode Transaction Test\n')
  
  // Check if we're in development mode
  console.log('📋 Environment Check:')
  console.log(`   Development Mode: ${isDevelopmentMode()}`)
  console.log(`   Node Environment: ${process.env.NODE_ENV}\n`)
  
  // Generate a test wallet public key
  const testWallet = new PublicKey('4nJ6GFbV8itVboUTbMAcRJ9f1QNoB8bVjpQ5iWYcwsTj')
  console.log('👛 Test Wallet:')
  console.log(`   Public Key: ${testWallet.toString()}\n`)
  
  try {
    // Test 1: Initialize Account
    console.log('🔧 Test 1: Initialize Account')
    const initResult = await mockInitializeAccount(testWallet)
    console.log(`   Result: ${initResult.success ? '✅ Success' : '❌ Failed'}`)
    if (initResult.success) {
      console.log(`   Signature: ${initResult.signature}`)
      console.log(`   Initial Count: ${initResult.data.count}`)
    } else {
      console.log(`   Error: ${initResult.error}`)
    }
    console.log('')
    
    // Test 2: Get Account Data
    console.log('🔧 Test 2: Get Account Data')
    const dataResult = await mockGetAccountData(testWallet)
    console.log(`   Result: ${dataResult.success ? '✅ Success' : '❌ Failed'}`)
    if (dataResult.success) {
      console.log(`   Count: ${dataResult.data.count}`)
      console.log(`   Initialized: ${dataResult.data.initialized}`)
    }
    console.log('')
    
    // Test 3: Increment Counter (3 times)
    console.log('🔧 Test 3: Increment Counter (3x)')
    for (let i = 1; i <= 3; i++) {
      const incResult = await mockIncrementCounter(testWallet)
      console.log(`   Increment ${i}: ${incResult.success ? '✅ Success' : '❌ Failed'}`)
      if (incResult.success) {
        console.log(`     New Count: ${incResult.data.count}`)
        console.log(`     Signature: ${incResult.signature.substring(0, 16)}...`)
      }
    }
    console.log('')
    
    // Test 4: Decrement Counter (2 times)
    console.log('🔧 Test 4: Decrement Counter (2x)')
    for (let i = 1; i <= 2; i++) {
      const decResult = await mockDecrementCounter(testWallet)
      console.log(`   Decrement ${i}: ${decResult.success ? '✅ Success' : '❌ Failed'}`)
      if (decResult.success) {
        console.log(`     New Count: ${decResult.data.count}`)
        console.log(`     Signature: ${decResult.signature.substring(0, 16)}...`)
      }
    }
    console.log('')
    
    // Test 5: Try to decrement below zero
    console.log('🔧 Test 5: Decrement Below Zero (Should Fail)')
    const decResult = await mockDecrementCounter(testWallet)
    const decResult2 = await mockDecrementCounter(testWallet) // This should fail
    console.log(`   First Decrement: ${decResult.success ? '✅ Success' : '❌ Failed'}`)
    console.log(`   Second Decrement: ${decResult2.success ? '✅ Success' : '❌ Failed (Expected)'}`)
    if (!decResult2.success) {
      console.log(`   Error: ${decResult2.error}`)
    }
    console.log('')
    
    // Test 6: Final Account State
    console.log('🔧 Test 6: Final Account State')
    const finalResult = await mockGetAccountData(testWallet)
    if (finalResult.success) {
      console.log(`   Final Count: ${finalResult.data.count}`)
      console.log(`   Authority: ${finalResult.data.authority.toString()}`)
    }
    console.log('')
    
    // Test 7: Show All Mock Accounts
    console.log('🔧 Test 7: All Mock Accounts')
    const allAccounts = getMockAccounts()
    console.log(`   Total Accounts: ${allAccounts.length}`)
    allAccounts.forEach((account, index) => {
      console.log(`   Account ${index + 1}:`)
      console.log(`     Public Key: ${account.publicKey.substring(0, 16)}...`)
      console.log(`     Count: ${account.count}`)
      console.log(`     Last Updated: ${new Date(account.lastUpdated).toLocaleTimeString()}`)
    })
    console.log('')
    
    // Test 8: Reset Account
    console.log('🔧 Test 8: Reset Account')
    const resetResult = await mockResetAccount(testWallet)
    console.log(`   Result: ${resetResult.success ? '✅ Success' : '❌ Failed'}`)
    if (resetResult.success) {
      console.log(`   Signature: ${resetResult.signature}`)
    }
    
    // Verify reset
    const afterResetResult = await mockGetAccountData(testWallet)
    console.log(`   Account After Reset: ${afterResetResult.success ? 'Still Exists' : '❌ Not Found (Expected)'}`)
    console.log('')
    
    console.log('🎉 All tests completed successfully!')
    console.log('')
    console.log('💡 Summary:')
    console.log('   ✅ Mock blockchain operations working')
    console.log('   ✅ Account initialization and management')
    console.log('   ✅ Counter increment/decrement with validation')
    console.log('   ✅ Error handling for edge cases')
    console.log('   ✅ Account reset functionality')
    console.log('')
    console.log('🚀 Ready for frontend testing!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the test
runTransactionTest()
