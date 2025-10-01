'use client'

import { useState } from 'react'
import { createUserWithWallet, updateUser } from '@/lib/supabase'
import { Card, Button } from './ResponsiveContainer'
import { hashPassword } from '@/lib/password-utils'

interface UserRegistrationProps {
  walletAddress: string
  onComplete: () => void
}

export const UserRegistration = ({ walletAddress, onComplete }: UserRegistrationProps) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      setMessage('Please fill in all required fields')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Hash the password for security
      const hashedPassword = await hashPassword(formData.password)
      
      // First check if user already exists
      const { getUserByWallet, updateUser, createCounter, createUser } = await import('@/lib/supabase-simple')
      const existingUser = await getUserByWallet(walletAddress)
      
      if (existingUser.success && existingUser.data) {
        // User exists, update their profile
        console.log('User exists, updating profile...')
        const updateResult = await updateUser(existingUser.data.id, {
          username: formData.username,
          email: formData.email,
          password_hash: hashedPassword, // Now properly hashed
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        
        if (updateResult.success) {
          setMessage('Profile updated successfully!')
          onComplete()
        } else {
          setMessage(`Error updating profile: ${updateResult.error}`)
        }
      } else {
        // Create new user
        console.log('Creating new user...')
        const result = await createUser(
          walletAddress,
          formData.username,
          formData.email,
          hashedPassword, // Now properly hashed
          formData.firstName,
          formData.lastName
        )

        if (result.success) {
          setMessage('Account created successfully!')
          onComplete()
        } else {
          setMessage(`Error: ${result.error}`)
        }
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    setLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Complete Your Profile
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Create a password"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Your first name"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Your last name"
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </Button>
      </form>
    </Card>
  )
}
