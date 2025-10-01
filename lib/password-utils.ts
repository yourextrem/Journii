// Simple password hashing utility
// In production, use bcrypt or similar

export const hashPassword = async (password: string): Promise<string> => {
  // For development, we'll use a simple hash
  // In production, use: import bcrypt from 'bcrypt'
  // return await bcrypt.hash(password, 10)
  
  // Simple hash for development (NOT secure for production)
  // This is just to demonstrate the concept - use proper hashing in production
  const salt = 'dev_salt_2024'
  const combined = password + salt
  let hash = 0
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return `dev_${Math.abs(hash).toString(16)}`
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  // For development, we'll use a simple comparison
  // In production, use: import bcrypt from 'bcrypt'
  // return await bcrypt.compare(password, hashedPassword)
  
  const hashed = await hashPassword(password)
  return hashed === hashedPassword
}
