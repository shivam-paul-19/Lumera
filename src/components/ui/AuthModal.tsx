'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context'

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalView,
    setAuthModalView,
    login,
    signup,
    loginWithGoogle,
    isLoading,
  } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getErrorMessage = (errorCode: string, isLogin: boolean): string => {
    switch (errorCode) {
      case 'no_account':
        return 'No account found with this email. Please sign up first.'
      case 'wrong_password':
        return 'Incorrect password. Please try again.'
      case 'account_exists':
        return 'An account with this email already exists. Please sign in instead.'
      case 'auth_failed':
        return isLogin ? 'Login failed. Please try again.' : 'Failed to create account.'
      case 'signup_failed':
        return 'Failed to create account. Please try again.'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (authModalView !== 'forgot-password' && !formData.password.trim()) {
      setError('Please enter your password')
      return
    }

    if (authModalView !== 'forgot-password' && formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      if (authModalView === 'login') {
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(getErrorMessage(result.error || 'auth_failed', true))
        } else {
          handleClose()
        }
      } else if (authModalView === 'signup') {
        if (!formData.name.trim()) {
          setError('Please enter your name')
          return
        }
        const result = await signup(formData.name, formData.email, formData.password)
        if (!result.success) {
          setError(getErrorMessage(result.error || 'signup_failed', false))
        } else {
          setSuccess('Account created successfully! Welcome to Lumera.')
          setTimeout(() => {
            handleClose()
          }, 1500)
        }
      } else if (authModalView === 'forgot-password') {
        // Simulate password reset
        setSuccess('Password reset link sent to your email!')
        setTimeout(() => {
          switchView('login')
        }, 2000)
      }
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  const handleClose = () => {
    setIsAuthModalOpen(false)
    setFormData({ name: '', email: '', password: '' })
    setError('')
    setSuccess('')
  }

  const switchView = (view: 'login' | 'signup' | 'forgot-password') => {
    setAuthModalView(view)
    setError('')
    setSuccess('')
    setFormData({ name: '', email: '', password: '' })
  }

  if (!isAuthModalOpen) return null

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop - Darker for better contrast */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.4, 1] }}
            className="relative w-full max-w-md"
          >
            {/* Modal Content - Solid white background with border */}
            <div 
              className="rounded-lg shadow-2xl flex flex-col max-h-[min(90vh,800px)] overflow-y-auto"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(128, 0, 32, 0.1)'
              }}
            >
              {/* Header with gradient accent */}
              <div 
                className="px-8 pt-8 pb-6"
                style={{ 
                  background: 'linear-gradient(180deg, rgba(246, 241, 235, 0.5) 0%, #FFFFFF 100%)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 
                      className="font-serif text-3xl mb-2"
                      style={{ color: '#800020' }}
                    >
                      {authModalView === 'login' && 'Welcome Back'}
                      {authModalView === 'signup' && 'Create Account'}
                      {authModalView === 'forgot-password' && 'Reset Password'}
                    </h2>
                    <p 
                      className="text-sm font-sans"
                      style={{ color: '#1C1C1C', opacity: 0.6 }}
                    >
                      {authModalView === 'login' && 'Sign in to your Lumera account'}
                      {authModalView === 'signup' && 'Join the Lumera experience'}
                      {authModalView === 'forgot-password' && 'Enter your email to reset'}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full transition-colors hover:bg-gray-100"
                    style={{ color: '#1C1C1C', opacity: 0.5 }}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-8 pb-8">
                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-lg text-sm font-sans"
                    style={{ 
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      color: '#DC2626'
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-lg text-sm font-sans"
                    style={{ 
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      border: '1px solid rgba(22, 163, 74, 0.2)',
                      color: '#16A34A'
                    }}
                  >
                    {success}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name - Only for signup */}
                  {authModalView === 'signup' && (
                    <div>
                      <label 
                        className="block text-sm font-sans mb-2"
                        style={{ color: '#1C1C1C', opacity: 0.7 }}
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                          style={{ color: '#800020', opacity: 0.4 }}
                        />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full pl-12 pr-4 py-3.5 rounded-lg font-sans text-sm transition-all focus:outline-none"
                          style={{ 
                            backgroundColor: '#F6F1EB',
                            border: '1px solid rgba(128, 0, 32, 0.15)',
                            color: '#1C1C1C'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#800020'
                            e.target.style.boxShadow = '0 0 0 3px rgba(128, 0, 32, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(128, 0, 32, 0.15)'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label 
                      className="block text-sm font-sans mb-2"
                      style={{ color: '#1C1C1C', opacity: 0.7 }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                        style={{ color: '#800020', opacity: 0.4 }}
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg font-sans text-sm transition-all focus:outline-none"
                        style={{ 
                          backgroundColor: '#F6F1EB',
                          border: '1px solid rgba(128, 0, 32, 0.15)',
                          color: '#1C1C1C'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#800020'
                          e.target.style.boxShadow = '0 0 0 3px rgba(128, 0, 32, 0.1)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(128, 0, 32, 0.15)'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Password - Not for forgot password */}
                  {authModalView !== 'forgot-password' && (
                    <div>
                      <label 
                        className="block text-sm font-sans mb-2"
                        style={{ color: '#1C1C1C', opacity: 0.7 }}
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                          style={{ color: '#800020', opacity: 0.4 }}
                        />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3.5 rounded-lg font-sans text-sm transition-all focus:outline-none"
                          style={{ 
                            backgroundColor: '#F6F1EB',
                            border: '1px solid rgba(128, 0, 32, 0.15)',
                            color: '#1C1C1C'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#800020'
                            e.target.style.boxShadow = '0 0 0 3px rgba(128, 0, 32, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(128, 0, 32, 0.15)'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-100"
                          style={{ color: '#800020', opacity: 0.4 }}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Forgot Password Link */}
                  {authModalView === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => switchView('forgot-password')}
                        className="text-sm font-sans transition-colors hover:underline"
                        style={{ color: '#800020' }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-lg font-sans text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#800020',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#5c0017'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#800020'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      <>
                        {authModalView === 'login' && 'Sign In'}
                        {authModalView === 'signup' && 'Create Account'}
                        {authModalView === 'forgot-password' && 'Send Reset Link'}
                      </>
                    )}
                  </button>
                </form>

                {/* Switch View Links */}
                <div className="mt-6 text-center">
                  {authModalView === 'login' && (
                    <p 
                      className="text-sm font-sans"
                      style={{ color: '#1C1C1C', opacity: 0.6 }}
                    >
                      Don&apos;t have an account?{' '}
                      <button
                        onClick={() => switchView('signup')}
                        className="font-medium transition-colors hover:underline"
                        style={{ color: '#800020' }}
                      >
                        Sign up
                      </button>
                    </p>
                  )}
                  {authModalView === 'signup' && (
                    <p 
                      className="text-sm font-sans"
                      style={{ color: '#1C1C1C', opacity: 0.6 }}
                    >
                      Already have an account?{' '}
                      <button
                        onClick={() => switchView('login')}
                        className="font-medium transition-colors hover:underline"
                        style={{ color: '#800020' }}
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                  {authModalView === 'forgot-password' && (
                    <button
                      onClick={() => switchView('login')}
                      className="text-sm font-sans transition-colors hover:underline"
                      style={{ color: '#800020' }}
                    >
                      ← Back to sign in
                    </button>
                  )}
                </div>

                {/* Divider */}
                {authModalView !== 'forgot-password' && (
                  <div className="relative my-6">
                    <div 
                      className="absolute inset-0 flex items-center"
                    >
                      <div 
                        className="w-full"
                        style={{ 
                          height: '1px',
                          backgroundColor: 'rgba(128, 0, 32, 0.1)'
                        }}
                      />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span 
                        className="px-4 font-sans"
                        style={{ 
                          backgroundColor: '#FFFFFF',
                          color: '#1C1C1C',
                          opacity: 0.5
                        }}
                      >
                        or continue with
                      </span>
                    </div>
                  </div>
                )}

                {/* Social Login */}
                {authModalView !== 'forgot-password' && (
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg font-sans text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(128, 0, 32, 0.15)',
                      color: '#1C1C1C'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#F6F1EB'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF'
                    }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
