'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ShoppingBag, User, Heart, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { useCart, useWishlist, useSearch, useAuth } from '@/context'

// Social media icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>
)

const announcements = [
  'FREE SHIPPING ON ORDERS ABOVE ₹999',
  'CURATED GIFTING FOR\nCELEBRATIONS & CORPORATE ORDERS',
  'HAND-POURED | CLEAN BURN | PREMIUM WAX',
]

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'Custom Candle', href: '/custom-candle' },
  { label: 'Our Story', href: '/about' },
  { label: 'Rituals', href: '/rituals' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)

  const { totalItems: cartCount, setIsCartOpen } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { setIsSearchOpen } = useSearch()
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth()

  const wishlistCount = wishlistItems.length

  const goToPrevAnnouncement = () => {
    setAnnouncementIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1
    )
  }

  const goToNextAnnouncement = () => {
    setAnnouncementIndex((prev) =>
      prev === announcements.length - 1 ? 0 : prev + 1
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-burgundy-815">
        <div className="flex items-center justify-between h-12 sm:h-10 px-2 sm:px-4">
          <button
            onClick={goToPrevAnnouncement}
            className="w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
            style={{ color: '#C9A24D' }}
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center justify-center px-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={announcementIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center text-[9px] sm:text-xs md:text-sm font-sans tracking-wide sm:tracking-wider leading-4 sm:leading-normal whitespace-pre-line"
                style={{ color: '#C9A24D' }}
              >
                {announcements[announcementIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            onClick={goToNextAnnouncement}
            className="w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
            style={{ color: '#C9A24D' }}
            aria-label="Next announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <header className="fixed top-12 sm:top-10 left-0 right-0 z-50 bg-lumera-ivory shadow-luxury">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 z-10">
              <Image
                src="/images/logo-flame.png"
                alt="Lumera Flame"
                width={32}
                height={40}
                className="h-7 sm:h-8 md:h-10 w-auto object-contain -mr-2"
                priority
              />
              <Image
                src="/images/logo-text.png"
                alt="Lumera"
                width={110}
                height={32}
                className="h-5 sm:h-6 md:h-8 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-sans text-sm tracking-wider uppercase text-lumera-charcoal/80 hover:text-lumera-burgundy transition-colors group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-lumera-burgundy transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions - Touch-friendly sizes */}
            <div className="flex items-center gap-0 sm:gap-1 md:gap-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account - Desktop only */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="hidden md:flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-lumera-burgundy text-sm font-sans font-medium"
                  style={{ color: '#C9A24D' }}
                  aria-label="Account"
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex p-2 min-w-[44px] min-h-[44px] items-center justify-center text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                  aria-label="Sign in"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Wishlist - Desktop only */}
              <Link
                href="/wishlist"
                className="hidden md:flex relative p-2 min-w-[44px] min-h-[44px] items-center justify-center text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-lumera-burgundy text-lumera-ivory text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-lumera-burgundy text-lumera-ivory text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] flex items-center justify-center text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden bg-lumera-ivory"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-lumera-charcoal/10">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center"
              >
                <Image
                  src="/images/logo-flame.png"
                  alt="Lumera"
                  width={32}
                  height={40}
                  className="h-8 w-auto object-contain -mr-2.5"
                />
                <Image
                  src="/images/logo-text.png"
                  alt="Lumera"
                  width={110}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-lumera-charcoal"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col h-[calc(100vh-64px)] px-6 py-8 overflow-y-auto">
              {/* Main Navigation Links */}
              <nav className="flex-1 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 min-h-[48px] font-serif text-2xl text-lumera-charcoal hover:text-lumera-burgundy transition-colors border-b border-lumera-charcoal/10"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Secondary Links */}
              <div className="py-6 space-y-3 border-t border-lumera-charcoal/10">
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 min-h-[48px] text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full bg-lumera-burgundy flex items-center justify-center text-sm font-sans font-medium"
                      style={{ color: '#C9A24D' }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-sans text-base tracking-wider">{user?.name || 'My Account'}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsAuthModalOpen(true)
                    }}
                    className="flex items-center gap-3 py-3 min-h-[48px] text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors w-full"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-sans text-base tracking-wider">Sign In</span>
                  </button>
                )}
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 min-h-[48px] text-lumera-charcoal/70 hover:text-lumera-burgundy transition-colors"
                >
                  <Heart className="w-6 h-6" />
                  <span className="font-sans text-base tracking-wider">
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </span>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="py-6 border-t border-lumera-charcoal/10">
                <p className="text-xs font-sans tracking-wider uppercase text-lumera-charcoal/50 mb-4">
                  Get in Touch
                </p>
                <a
                  href="mailto:lumeracandlesinfo@gmail.com"
                  className="block text-base font-sans text-lumera-charcoal/70 hover:text-lumera-burgundy mb-3"
                >
                  lumeracandlesinfo@gmail.com
                </a>
                <a
                  href="tel:+919625205260"
                  className="block text-base font-sans text-lumera-charcoal/70 hover:text-lumera-burgundy"
                >
                  +91 9625205260
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
