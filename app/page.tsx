'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { createUser, getUserByWallet } from '@/lib/api-client'
import { ResponsiveContainer, Card } from '@/components/ResponsiveContainer'
import { UserRegistration } from '@/components/UserRegistration'

const HomeContent = () => {
  const { publicKey, connected } = useWallet()
  const [showRegistration, setShowRegistration] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [scrollY, setScrollY] = useState(0)

  // Setup user when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      setupUserInDatabase()
    }
  }, [connected, publicKey])

  // Scroll parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [])

  const setupUserInDatabase = async () => {
    if (!publicKey) return

    try {
      const walletAddress = publicKey.toBase58()
      
      // Check if user exists
      const userResult = await getUserByWallet(walletAddress)
      
      if (userResult.success && userResult.data) {
        console.log('User already exists:', userResult.data)
        setUserProfile(userResult.data)
        
        // Check if user has completed profile (has username)
        if (!userResult.data.username) {
          console.log('User profile incomplete, showing registration form')
          setShowRegistration(true)
        }
      } else {
        // User doesn't exist, show registration form
        console.log('User not found, showing registration form...')
        setShowRegistration(true)
      }
    } catch (error) {
      console.error('Error setting up user in database:', error)
      // Show registration form on error
      setShowRegistration(true)
    }
  }

  const handleRegistrationComplete = async () => {
    setShowRegistration(false)
    // Reload user data
    if (publicKey) {
      await setupUserInDatabase()
    }
  }

  return (
    <div 
      className="relative w-full"
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/backgrounds/Web_Design.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: '100vw 100vh',
        backgroundPosition: `center ${50 + scrollY * 0.5}%`,
        backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Header with amir_deskmat design */}
      <header className="relative z-10">
        {/* Header Background with amir_deskmat design */}
        <div 
          className="relative w-full h-40 bg-cover bg-center bg-no-repeat header-glow"
          style={{
            backgroundImage: 'url(/backgrounds/amir_deskmat.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Vibrant gradient overlay */}
          <div className="absolute inset-0 header-gradient" />
          {/* Enhanced overlay for better visibility */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Additional bright overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20" />
          
          {/* Header Content */}
          <div className="relative z-10 h-full">
            <ResponsiveContainer>
              <div className="flex justify-between items-center h-full py-4">
                {/* Left Section - Brand */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    {/* Stylized Logo inspired by the design */}
                    <div className="relative">
                      <h1 className="text-4xl font-bold text-white text-glow">
                        <span className="text-purple-300 drop-shadow-2xl">JOUR</span>
                        <span className="text-red-300 drop-shadow-2xl">NII</span>
                      </h1>
                      {/* Enhanced decorative elements */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse shadow-lg"></div>
                      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full shadow-lg"></div>
                      <div className="absolute top-1 right-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="hidden md:flex space-x-6">
                    <a 
                      href="/" 
                      className="nav-link text-white hover:text-pink-300 transition-colors font-semibold text-base px-3 py-2 rounded-lg bg-white/10 hover:bg-pink-500/20"
                    >
                      Home
                    </a>
                    <a 
                      href="#story" 
                      className="nav-link text-white hover:text-purple-300 transition-colors font-semibold text-base px-3 py-2 rounded-lg bg-white/10 hover:bg-purple-500/20"
                    >
                      Story
                    </a>
                    <a 
                      href="#factions" 
                      className="nav-link text-white hover:text-red-300 transition-colors font-semibold text-base px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500/20"
                    >
                      Factions
                    </a>
                    <a 
                      href="#features" 
                      className="nav-link text-white hover:text-green-300 transition-colors font-semibold text-base px-3 py-2 rounded-lg bg-white/10 hover:bg-green-500/20"
                    >
                      Features
                    </a>
                    <a 
                      href="#team" 
                      className="nav-link text-white hover:text-blue-300 transition-colors font-semibold text-base px-3 py-2 rounded-lg bg-white/10 hover:bg-blue-500/20"
                    >
                      Team
                    </a>
                    <a 
                      href="/commission" 
                      className="nav-link text-white hover:text-yellow-300 transition-colors font-semibold text-base px-3 py-2 rounded-lg bg-white/10 hover:bg-yellow-500/20"
                    >
                      Commission
                    </a>
                  </nav>
                </div>
                
                {/* Right Section - Community & Wallet */}
                <div className="flex items-center space-x-4">
                  {/* Community Links with vibrant styling */}
                  <div className="hidden lg:flex items-center space-x-3">
                    <a 
                      href="https://discord.gg/your-discord-server" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-purple-300 transition-colors text-base font-semibold bg-white/20 px-4 py-2 rounded-full hover:bg-purple-500/30 shadow-lg"
                    >
                      Discord
                    </a>
                    <a 
                      href="https://twitter.com/your-twitter-handle" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-300 transition-colors text-base font-semibold bg-white/20 px-4 py-2 rounded-full hover:bg-blue-500/30 shadow-lg"
                    >
                      Twitter
                    </a>
                    <a 
                      href="https://instagram.com/your-instagram-handle" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-pink-300 transition-colors text-base font-semibold bg-white/20 px-4 py-2 rounded-full hover:bg-pink-500/30 shadow-lg"
                    >
                      Instagram
                    </a>
                    <a 
                      href="https://youtube.com/@your-youtube-channel" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-red-300 transition-colors text-base font-semibold bg-white/20 px-4 py-2 rounded-full hover:bg-red-500/30 shadow-lg"
                    >
                      YouTube
                    </a>
                  </div>
                  
                  {/* Mobile Community Links */}
                  <div className="flex lg:hidden items-center space-x-2">
                    <a 
                      href="https://discord.gg/your-discord-server" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-purple-300 transition-colors text-xs font-medium"
                    >
                      Discord
                    </a>
                    <a 
                      href="https://twitter.com/your-twitter-handle" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-blue-300 transition-colors text-xs font-medium"
                    >
                      Twitter
                    </a>
                    <a 
                      href="https://instagram.com/your-instagram-handle" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-pink-300 transition-colors text-xs font-medium"
                    >
                      Instagram
                    </a>
                    <a 
                      href="https://youtube.com/@your-youtube-channel" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-red-300 transition-colors text-xs font-medium"
                    >
                      YouTube
                    </a>
                  </div>
                  
                  {/* Wallet Button with enhanced styling */}
                  <div className="relative">
                    <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 !text-white !font-bold !px-8 !py-3 !rounded-full !border-0 !shadow-xl hover:!shadow-2xl !transition-all !duration-300 !text-lg !scale-105 hover:!scale-110" />
                  </div>
                </div>
              </div>
            </ResponsiveContainer>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-8 w-full">
        <ResponsiveContainer>
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center py-20">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Journii
                </span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                A Web3 platform built with Solana, Next.js, and Supabase. 
                Connect your wallet to start your Web3 journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                  <span className="text-white font-medium">Ready to begin?</span>
                </div>
                <div className="text-white/80 text-sm">
                  Connect your wallet above to get started
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Connection Status
              </h3>
              {connected ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400 font-medium">
                      Wallet Connected
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-sm text-white/80">
                      <strong>Public Key:</strong>
                    </p>
                    <p className="font-mono text-sm text-white break-all">
                      {publicKey?.toString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 font-medium">
                    Wallet Not Connected
                  </span>
                </div>
              )}
            </Card>

            {/* User Registration */}
            {connected && showRegistration && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <UserRegistration 
                  walletAddress={publicKey?.toBase58() || ''} 
                  onComplete={handleRegistrationComplete}
                />
              </Card>
            )}

            {/* User Profile */}
            {connected && !showRegistration && userProfile && (
              <Card className="bg-green-500/20 backdrop-blur-sm border-green-400/30">
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  Welcome, {userProfile.username || 'User'}!
                </h3>
                <p className="text-green-200 text-sm">
                  Your profile has been created successfully. Enjoy your Web3 experience on our platform.
                </p>
              </Card>
            )}

            {/* Story Section */}
            <section id="story" className="py-16">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                <div className="text-center max-w-4xl mx-auto">
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Your Story Awaits
                  </h3>
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                    Welcome to a world where your choices shape the narrative. 
                    This is your canvas - add your story, your characters, your vision. 
                    The journey begins with a single step into the unknown.
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="text-white/80 italic">
                      "Every great story starts with a dream. What's yours?"
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Factions Section */}
            <section id="factions" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Choose Your Path
                </h3>
                <p className="text-lg text-gray-200">
                  Every journey needs a direction. Which path calls to you?
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 hover:-translate-y-2 group">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🌿</div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    The Guardians
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Protectors of tradition and nature. They believe in the power of ancient wisdom 
                    and the balance between all living things. Their path is one of harmony and preservation.
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 hover:-translate-y-2 group">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    The Innovators
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Champions of technology and progress. They embrace the future, 
                    building tomorrow with cutting-edge innovation and boundless creativity.
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-2xl transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 hover:-translate-y-2 group">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⚖️</div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    The Balance
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Seekers of equilibrium between all forces. They understand that true power 
                    comes from finding the perfect harmony between opposing elements.
                  </p>
                </Card>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Platform Features
                </h3>
                <p className="text-lg text-gray-200">
                  Built for creators, by creators
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="text-4xl mb-4">🎮</div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Interactive
                  </h4>
                  <p className="text-gray-200 text-sm">
                    Engage with your audience through interactive experiences
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="text-4xl mb-4">🎨</div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Customizable
                  </h4>
                  <p className="text-gray-200 text-sm">
                    Personalize every aspect of your digital presence
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="text-4xl mb-4">🔗</div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Web3 Native
                  </h4>
                  <p className="text-gray-200 text-sm">
                    Built on Solana with true ownership and interoperability
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="text-4xl mb-4">🌐</div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Connected
                  </h4>
                  <p className="text-gray-200 text-sm">
                    Seamlessly integrate with the broader Web3 ecosystem
                  </p>
                </Card>
              </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Meet the Visionaries
                </h3>
                <p className="text-lg text-gray-200">
                  The minds behind the magic
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white">👤</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Your Name Here
                  </h4>
                  <p className="text-blue-400 text-sm font-medium mb-2">
                    Founder & Visionary
                  </p>
                  <p className="text-gray-200 text-sm">
                    The creative force driving innovation and pushing boundaries
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white">👤</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Team Member
                  </h4>
                  <p className="text-green-400 text-sm font-medium mb-2">
                    Technical Lead
                  </p>
                  <p className="text-gray-200 text-sm">
                    Building the future with code and creativity
                  </p>
                </Card>
                
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-white">👤</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Community Lead
                  </h4>
                  <p className="text-pink-400 text-sm font-medium mb-2">
                    Community Manager
                  </p>
                  <p className="text-gray-200 text-sm">
                    Connecting people and building lasting relationships
                  </p>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <p className="text-lg text-gray-200">
                  Everything you need to know
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    What is Journii?
                  </h4>
                  <p className="text-gray-200">
                    Journii is a Web3 platform that combines storytelling, community, and blockchain technology. 
                    Create your digital identity, join factions, and shape your own narrative in our interconnected world.
                  </p>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    How do I get started?
                  </h4>
                  <p className="text-gray-200">
                    Simply connect your Solana wallet using the button in the header. Once connected, 
                    you'll be guided through registration and can start exploring the platform.
                  </p>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    What can I do on the platform?
                  </h4>
                  <p className="text-gray-200">
                    Create your story, join factions, customize your profile, interact with the community, 
                    and participate in exclusive events and experiences.
                  </p>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Is it free to use?
                  </h4>
                  <p className="text-gray-200">
                    Basic features are free to use. Premium features and exclusive content may require 
                    platform tokens or NFTs, which will be clearly marked.
                  </p>
                </Card>
              </div>
            </section>

            {/* Getting Started Section */}
            {!connected && (
              <Card className="text-center bg-blue-500/20 backdrop-blur-sm border-blue-400/30">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">
                  Start Your Web3 Journey
                </h3>
                <p className="text-blue-200 mb-4">
                  Connect your Solana wallet to access all platform features
                </p>
                <div className="text-sm text-blue-100">
                  <p>• Easy registration using your wallet</p>
                  <p>• Enjoy a secure Web3 experience</p>
                  <p>• Access exclusive features</p>
                </div>
              </Card>
            )}

            {/* Additional Content Sections for Extended Scrolling */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Explore More
                </h3>
                <p className="text-lg text-gray-200">
                  Discover the endless possibilities
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="text-4xl mb-4">🎯</div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Mission & Vision
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Our mission is to create a decentralized platform where creativity meets technology. 
                    We envision a future where digital ownership and community-driven experiences 
                    redefine how we interact with the web.
                  </p>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="text-4xl mb-4">🚀</div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Innovation Hub
                  </h4>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Cutting-edge technology meets creative expression. Our platform leverages 
                    the latest in blockchain technology to provide seamless, secure, and 
                    innovative experiences for all users.
                  </p>
                </Card>
              </div>
            </section>

            {/* Technology Stack Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Built With Modern Technology
                </h3>
                <p className="text-lg text-gray-200">
                  Powered by the best tools and frameworks
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="text-sm font-semibold text-white">Solana</h4>
                  <p className="text-xs text-gray-200">Fast & Secure</p>
                </Card>
                
                <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-3">⚛️</div>
                  <h4 className="text-sm font-semibold text-white">Next.js</h4>
                  <p className="text-xs text-gray-200">React Framework</p>
                </Card>
                
                <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-3">🗄️</div>
                  <h4 className="text-sm font-semibold text-white">Supabase</h4>
                  <p className="text-xs text-gray-200">Database & Auth</p>
                </Card>
                
                <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-3">🎨</div>
                  <h4 className="text-sm font-semibold text-white">Tailwind</h4>
                  <p className="text-xs text-gray-200">Styling</p>
                </Card>
              </div>
            </section>

            {/* Community Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Join Our Community
                </h3>
                <p className="text-lg text-gray-200">
                  Connect with like-minded creators and innovators
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                    <div>
                      <div className="text-4xl mb-4">💬</div>
                      <h4 className="text-lg font-semibold text-white mb-2">Discord</h4>
                      <p className="text-gray-200 text-sm">Join our active community discussions</p>
                    </div>
                    <div>
                      <div className="text-4xl mb-4">🐦</div>
                      <h4 className="text-lg font-semibold text-white mb-2">Twitter</h4>
                      <p className="text-gray-200 text-sm">Follow for updates and announcements</p>
                    </div>
                    <div>
                      <div className="text-4xl mb-4">📸</div>
                      <h4 className="text-lg font-semibold text-white mb-2">Instagram</h4>
                      <p className="text-gray-200 text-sm">See our latest creations and events</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20">
              <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-blue-400/30 text-center">
                <div className="max-w-3xl mx-auto py-12">
                  <h3 className="text-4xl font-bold text-white mb-6">
                    Ready to Begin Your Journey?
                  </h3>
                  <p className="text-xl text-gray-200 mb-8">
                    Join thousands of creators who are already building the future of Web3
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-8 py-4 border border-white/20">
                      <span className="text-white font-medium text-lg">Connect Your Wallet</span>
                    </div>
                    <div className="text-white/80">
                      Start creating today
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </ResponsiveContainer>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <ResponsiveContainer>
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Journii
                </h4>
                <p className="text-gray-200 text-sm">
                  A Web3 platform where stories come to life. 
                  Connect, create, and shape your digital journey.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Platform
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#story" className="text-gray-200 hover:text-white transition-colors">Story</a></li>
                  <li><a href="#factions" className="text-gray-200 hover:text-white transition-colors">Factions</a></li>
                  <li><a href="#features" className="text-gray-200 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#team" className="text-gray-200 hover:text-white transition-colors">Team</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Community
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Discord</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">YouTube</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#faq" className="text-gray-200 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Support</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-gray-200 text-sm">
                &copy; 2024 Journii. Built with Solana, Next.js, and Supabase.
              </p>
              <p className="text-gray-300 text-xs mt-2">
                All rights reserved. Powered by Web3 technology.
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </footer>
      
      {/* Extra space to ensure background covers full scroll */}
      <div className="h-32"></div>
    </div>
  )
}

const Home = () => {
  return <HomeContent />
}

export default Home