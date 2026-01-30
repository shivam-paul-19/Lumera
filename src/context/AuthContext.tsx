'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

const USER_DATA_STORAGE_KEY = 'lumera-user-data'
const PASSWORD_STORAGE_KEY = 'lumera-user-passwords'

type PasswordMap = Record<string, { password: string }>

function loadPasswordMap(): PasswordMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PASSWORD_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PasswordMap
  } catch {
    return {}
  }
}

function savePasswordMap(map: PasswordMap) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  addresses?: Address[]
  createdAt: string
}

export interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalView: 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password'
  setIsAuthModalOpen: (open: boolean) => void
  setAuthModalView: (view: 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password') => void
  login: (email: string, password: string) => Promise<AuthResult>
  signup: (name: string, email: string, password: string) => Promise<AuthResult>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<AuthResult>
  deleteAccount: () => Promise<void>
  sendOTP: (email: string) => Promise<AuthResult>
  verifyOTP: (email: string, otp: string) => Promise<AuthResult>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<AuthResult>

}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState<'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'reset-password'>('login')


  // Sync session with user state
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      // Load additional user data from localStorage (addresses, etc.)
      const savedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY)
      let additionalData: Partial<User> = {}

      if (savedUserData) {
        try {
          additionalData = JSON.parse(savedUserData)
        } catch {
          localStorage.removeItem(USER_DATA_STORAGE_KEY)
        }
      }

      setUser({
        id: (session.user as { id?: string }).id || session.user.email || '1',
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || undefined,
        createdAt: additionalData.createdAt || new Date().toISOString(),
        addresses: additionalData.addresses || [],
        phone: additionalData.phone,
      })
      setIsAuthModalOpen(false)
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, status])

  // Save additional user data to localStorage
  useEffect(() => {
    if (user) {
      const dataToSave = {
        addresses: user.addresses,
        phone: user.phone,
        createdAt: user.createdAt,
      }
      localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(dataToSave))
    }
  }, [user])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const emailKey = email.toLowerCase()
      const map = loadPasswordMap()
      const entry = map[emailKey]

      // Check if account exists
      if (!entry) {
        setIsLoading(false)
        return { success: false, error: 'no_account' }
      }

      // Check if password matches
      if (entry.password !== password) {
        setIsLoading(false)
        return { success: false, error: 'wrong_password' }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      setIsLoading(false)

      if (result?.ok) {
        setIsAuthModalOpen(false)
        return { success: true }
      }
      return { success: false, error: 'auth_failed' }
    } catch {
      setIsLoading(false)
      return { success: false, error: 'auth_failed' }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const emailKey = email.toLowerCase()
      const map = loadPasswordMap()

      // Check if account already exists
      if (map[emailKey]) {
        setIsLoading(false)
        return { success: false, error: 'account_exists' }
      }

      const result = await signIn('credentials', {
        email,
        password,
        name,
        redirect: false,
        isSignup: 'true',
      })

      if (result?.ok) {
        // Store password for this email locally so we can support change-password
        map[emailKey] = { password }
        savePasswordMap(map)

        // Store the name in localStorage since credentials provider doesn't have it
        const savedData = localStorage.getItem(USER_DATA_STORAGE_KEY)
        const data = savedData ? JSON.parse(savedData) : {}
        data.name = name
        localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(data))

        setIsLoading(false)
        setIsAuthModalOpen(false)
        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: 'signup_failed' }
    } catch {
      setIsLoading(false)
      return { success: false, error: 'signup_failed' }
    }
  }

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch {
      setIsLoading(false)
    }
  }

  const logout = () => {
    signOut({ callbackUrl: '/' })
    localStorage.removeItem(USER_DATA_STORAGE_KEY)
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: Date.now().toString(),
      }
      const addresses = user.addresses || []
      // If this is the first address or marked as default, set it as default
      if (addresses.length === 0 || address.isDefault) {
        addresses.forEach(a => a.isDefault = false)
        newAddress.isDefault = true
      }
      setUser({ ...user, addresses: [...addresses, newAddress] })
    }
  }

  const updateAddress = (id: string, data: Partial<Address>) => {
    if (user && user.addresses) {
      const addresses = user.addresses.map(addr =>
        addr.id === id ? { ...addr, ...data } : addr
      )
      setUser({ ...user, addresses })
    }
  }

  const deleteAddress = (id: string) => {
    if (user && user.addresses) {
      const addresses = user.addresses.filter(addr => addr.id !== id)
      // If we deleted the default address, make the first one default
      if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
        addresses[0].isDefault = true
      }
      setUser({ ...user, addresses })
    }
  }

  const setDefaultAddress = (id: string) => {
    if (user && user.addresses) {
      const addresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
      setUser({ ...user, addresses })
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.email) {
      return { success: false, error: 'You must be logged in to change your password.' }
    }

    const emailKey = user.email.toLowerCase()
    const map = loadPasswordMap()
    const entry = map[emailKey]

    // Require an existing password entry for this email
    if (!entry) {
      return {
        success: false,
        error: 'Password change is only available for email/password accounts.',
      }
    }

    if (entry.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' }
    }

    map[emailKey] = { password: newPassword }
    savePasswordMap(map)

    return { success: true }
  }

  const deleteAccount = async (): Promise<void> => {
    if (!user?.email) {
      return
    }

    try {
      // Call the backend to delete the user record from the database
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('Failed to delete account on backend:', data.error)
        // We might want to show an alert or return an error here, 
        // but keeping it simple for now as per current structure.
        return
      }

      // Success - local cleanup
      const emailKey = user.email.toLowerCase()
      const map = loadPasswordMap()
      if (map[emailKey]) {
        delete map[emailKey]
        savePasswordMap(map)
      }

      // Clear stored user data and sign out
      localStorage.removeItem(USER_DATA_STORAGE_KEY)
      await signOut({ callbackUrl: '/' })
      setUser(null)
    } catch (error) {
      console.error('Error during account deletion:', error)
    }
  }

  const sendOTP = async (email: string): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setIsLoading(false)
      if (response.ok) return { success: true }
      return { success: false, error: data.error }
    } catch (error: any) {
      setIsLoading(false)
      return { success: false, error: error.message || 'Failed to send OTP.' }
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await response.json()
      setIsLoading(false)
      if (response.ok) return { success: true }
      return { success: false, error: data.error }
    } catch {
      setIsLoading(false)
      return { success: false, error: 'Failed to verify OTP.' }
    }
  }

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await response.json()
      setIsLoading(false)
      if (response.ok) {
        // Update local password map so login pre-check passes
        const emailKey = email.toLowerCase()
        const map = loadPasswordMap()
        map[emailKey] = { password: newPassword }
        savePasswordMap(map)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      setIsLoading(false)
      return { success: false, error: 'Failed to reset password.' }
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalView,
        setIsAuthModalOpen,
        setAuthModalView,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        changePassword,
        deleteAccount,
        sendOTP,
        verifyOTP,
        resetPassword,
      }}
    >

      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}