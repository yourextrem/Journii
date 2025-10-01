'use client'

import { ReactNode } from 'react'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
}

export const ResponsiveContainer = ({ children, className = '' }: ResponsiveContainerProps) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export const MobileContainer = ({ children, className = '' }: ResponsiveContainerProps) => {
  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export const Card = ({ children, className = '' }: ResponsiveContainerProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  )
}

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false 
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  }
  
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}
