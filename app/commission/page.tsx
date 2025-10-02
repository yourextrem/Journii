'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ResponsiveContainer, Card } from '@/components/ResponsiveContainer'

const CommissionPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('FULL BODY')

  const pricingData = {
    'FULL BODY': { rendered: 50, lineart: 30 },
    'BUST': { rendered: 30, lineart: 15 },
    'SKETCH': { rendered: 15, lineart: 10 },
    'EMOTES': { rendered: 5, lineart: 3 }
  }

  const portfolioItems = [
    { id: 1, category: 'BUST', title: 'Character Portrait', image: '/images/portfolio/bust1.jpg' },
    { id: 2, category: 'FULL BODY', title: 'Full Character Design', image: '/images/portfolio/fullbody1.jpg' },
    { id: 3, category: 'EMOTES', title: 'Emote Pack', image: '/images/portfolio/emotes1.jpg' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-blue-500">
        <ResponsiveContainer>
          <div className="py-6">
            <div className="text-center">
              <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-2 tracking-wider">
                COMMISSION
              </h1>
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                طلبيات الرســـــــم مفتوحة
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <div className="font-mono text-sm">|||||||||||||||||||||||||||||||||||||||||||||||||||||||</div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      <main className="py-8">
        <ResponsiveContainer>
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Commission Procedure */}
            <Card className="bg-blue-600 text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">COMMISSION PROCEDURE</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">1</div>
                  <p className="text-sm">DM ME WITH DETAILS ABOUT WHAT YOU WANT WITH REFERENCES</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2</div>
                  <p className="text-sm">WE WILL DISCUSS THE SPECIFICS</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">3</div>
                  <p className="text-sm">I WILL SEND YOU AN INITIAL SKETCH</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4</div>
                  <p className="text-sm">WILL START THE FINAL DRAWING WHEN YOU APPROVE OF THE SKETCH</p>
                </div>
              </div>
            </Card>

            {/* Can Do / Can't Do / Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-500 text-white">
                <h3 className="text-xl font-bold mb-4 text-center">CAN DO</h3>
                <ul className="space-y-2 text-sm">
                  <li>• FANART</li>
                  <li>• OCS</li>
                  <li>• FURRY</li>
                  <li>• ANIME STYLE</li>
                  <li>• CHARACTERS</li>
                </ul>
              </Card>

              <Card className="bg-purple-500 text-white">
                <h3 className="text-xl font-bold mb-4 text-center">CAN'T DO</h3>
                <ul className="space-y-2 text-sm">
                  <li>• DETAILED BACKGROUNDS</li>
                  <li>• ANIMALS</li>
                  <li>• MECHA</li>
                  <li>• NSFW</li>
                  <li>• REALISTIC STYLE</li>
                </ul>
              </Card>

              <Card className="bg-green-500 text-white">
                <h3 className="text-xl font-bold mb-4 text-center">TERMS OF SERVICE</h3>
                <ul className="space-y-2 text-sm">
                  <li>• NO COMMERCIAL OR PROMOTIONAL USE</li>
                  <li>• PAYMENT AFTER YOU APPROVE THE INITIAL SKETCH</li>
                  <li>• 2-3 REVISIONS INCLUDED</li>
                </ul>
              </Card>
            </div>

            {/* Pricing Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-3xl font-bold mb-6 text-center">PRICES</h2>
              
              {/* Category Selector */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {Object.keys(pricingData).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      selectedCategory === category
                        ? 'bg-white text-blue-600 shadow-lg scale-105'
                        : 'bg-blue-500 hover:bg-blue-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Pricing Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">RENDERED</h3>
                  <div className="text-6xl font-black text-yellow-300">
                    ${pricingData[selectedCategory as keyof typeof pricingData].rendered}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">LINEART</h3>
                  <div className="text-6xl font-black text-yellow-300">
                    ${pricingData[selectedCategory as keyof typeof pricingData].lineart}
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 text-sm opacity-90">
                *ADDING CHARACTERS, COMPLEX PROPS WILL COST MORE — 10$-5$
              </div>
            </Card>

            {/* Portfolio Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* BUST Example */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-black text-white px-3 py-1 rounded-full font-bold text-sm transform -rotate-12">
                    BUST
                  </div>
                </div>
                <div className="h-64 relative">
                  <Image
                    src="/images/portfolio/placeholder-bust.svg"
                    alt="Character Portrait Example"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </Card>

              {/* FULL BODY Example */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-black text-white px-3 py-1 rounded-full font-bold text-sm transform -rotate-12">
                    FULL BODY
                  </div>
                </div>
                <div className="h-64 relative">
                  <Image
                    src="/images/portfolio/placeholder-fullbody.svg"
                    alt="Full Character Example"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </Card>

              {/* EMOTES Example */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-black text-white px-3 py-1 rounded-full font-bold text-sm transform -rotate-12">
                    EMOTES
                  </div>
                </div>
                <div className="h-64 relative">
                  <Image
                    src="/images/portfolio/placeholder-emotes.svg"
                    alt="Emote Pack Example"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </Card>
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">READY TO COMMISSION?</h2>
              <p className="text-lg mb-6">Contact me to get started on your custom artwork!</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  Send Message
                </button>
                <button className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-colors">
                  View Portfolio
                </button>
              </div>
            </Card>

            {/* Footer Info */}
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <p>MAY 2025 - 2026 © - SAKITTEN -</p>
              <p className="mt-2">Professional digital art commissions • Custom character designs • Fast delivery</p>
            </div>

          </div>
        </ResponsiveContainer>
      </main>
    </div>
  )
}

export default CommissionPage
