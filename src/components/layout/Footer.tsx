'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Tag,
  Gift,
  Truck,
  Package,
  Mail,
  Phone,
} from 'lucide-react'

// Social media icons as components - Champagne Gold fill
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const features = [
  { icon: <Tag className="w-5 h-5 md:w-6 md:h-6" />, title: 'Exclusive Offers' },
  { icon: <Gift className="w-5 h-5 md:w-6 md:h-6" />, title: 'Signature Scents' },
  { icon: <Truck className="w-5 h-5 md:w-6 md:h-6" />, title: 'Handled With Care' },
  { icon: <Package className="w-5 h-5 md:w-6 md:h-6" />, title: 'Made Personal' },
]

const customerServiceLinks = [
  { label: 'Shipping Policy', href: '/policies/shipping' },
  { label: 'Cancellation Policy', href: '/policies/cancellation' },
  { label: 'Return and Exchange Policy', href: '/policies/returns' },
  { label: 'Refund Policy', href: '/policies/refund' },
  { label: 'Product Care and Safety', href: '/policies/candle-care' },
  { label: 'Privacy Policy', href: '/policies/privacy' },
]

const socialLinks = [
  { icon: <WhatsAppIcon />, href: 'https://wa.me/919625205260', label: 'WhatsApp' },
  { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/lumera', label: 'LinkedIn' },
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/lumeracandles.in', label: 'Instagram' },
  { icon: <FacebookIcon />, href: 'https://facebook.com/lumera.candles', label: 'Facebook' },
]

// Lumera Brand Colors
const champagneGold = '#C9A24D'
const burgundy840 = '#70001C' // Burgundy 840 - Footer background

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscribeConsent, setSubscribeConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !subscribeConsent) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-lumera-ivory">
      {/* Features Bar */}
      <div className="border-y border-lumera-charcoal/10">
        <div className="px-6 md:px-8 max-w-7xl mx-auto py-10 md:py-12">
          <div className="text-center mb-8">
            <span className="text-xs font-sans tracking-[0.2em] uppercase text-burgundy-815 font-medium">
              Exclusively on Lumera.com
            </span>
          </div>

          {/* 2x2 grid on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-lumera-beige flex items-center justify-center text-burgundy-815 mb-3">
                  {feature.icon}
                </div>
                <span className="text-xs font-sans tracking-wider uppercase text-lumera-charcoal leading-relaxed">
                  {feature.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer - Burgundy 815 Background */}
      <div style={{ backgroundColor: burgundy840 }}>
        <div className="px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
          {/* Single column on mobile, multi-column on desktop */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 md:gap-10">
            {/* Newsletter Signup */}
            <div className="md:col-span-1">
              <h3 
                className="font-serif text-xl mb-4 font-medium"
                style={{ color: champagneGold }}
              >
                Subscribe to our store
              </h3>
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border"
                  style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', borderColor: champagneGold }}
                >
                  <p 
                    className="text-sm font-sans leading-relaxed"
                    style={{ color: champagneGold }}
                  >
                    Thank you for subscribing! Welcome to the Lumera family.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label
                      htmlFor="footer-email"
                      className="block text-xs font-sans mb-2"
                      style={{ color: champagneGold }}
                    >
                      Email <span style={{ color: champagneGold }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="footer-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 min-h-[48px] bg-transparent border font-sans text-base focus:outline-none transition-colors"
                      style={{ 
                        borderColor: champagneGold,
                        color: champagneGold,
                      }}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscribeConsent}
                      onChange={(e) => setSubscribeConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 min-w-[20px] bg-transparent focus:ring-0 focus:ring-offset-0"
                      style={{ 
                        borderColor: champagneGold,
                        accentColor: champagneGold,
                      }}
                    />
                    <span 
                      className="text-sm font-sans leading-relaxed"
                      style={{ color: champagneGold }}
                    >
                      Yes, subscribe me to your store.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!subscribeConsent || isSubmitting}
                    className="w-full py-4 min-h-[48px] font-sans font-medium text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: champagneGold,
                      color: burgundy840,
                    }}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Submit'}
                  </button>
                </form>
              )}
            </div>

            {/* Customer Services */}
            <div>
              <h3 
                className="font-serif text-xl mb-4 font-medium"
                style={{ color: champagneGold }}
              >
                Customer Services
              </h3>
              <ul className="space-y-3">
                {customerServiceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm md:text-base font-sans transition-colors py-1 inline-block leading-relaxed hover:opacity-80"
                      style={{ color: champagneGold }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect With Us */}
            <div className="md:col-span-2">
              <h3 
                className="font-serif text-xl mb-4 font-medium"
                style={{ color: champagneGold }}
              >
                Connect With Us
              </h3>
              <div className="space-y-4 mb-6">
                <a
                  href="mailto:lumeracandlesinfo@gmail.com"
                  className="flex items-center gap-3 text-sm md:text-base font-sans transition-colors py-1 hover:opacity-80"
                  style={{ color: champagneGold }}
                >
                  <Mail className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} style={{ color: champagneGold }} />
                  lumeracandlesinfo@gmail.com
                </a>
                <a
                  href="tel:+919625205260"
                  className="flex items-center gap-3 text-sm md:text-base font-sans transition-colors py-1 hover:opacity-80"
                  style={{ color: champagneGold }}
                >
                  <Phone className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} style={{ color: champagneGold }} />
                  9625205260, 8178947955
                </a>
              </div>

              {/* Social Links - Touch-friendly 48x48px with Champagne Gold */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:opacity-80"
                    style={{ 
                      borderColor: champagneGold,
                      color: champagneGold,
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t"
          style={{ borderColor: `${champagneGold}30` }}
        >
          <div className="px-6 md:px-8 max-w-7xl mx-auto py-6">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              {/* Copyright */}
              <p 
                className="text-xs font-sans text-center leading-relaxed"
                style={{ color: champagneGold }}
              >
                © {new Date().getFullYear()} Lumera. All rights reserved. Melt into Luxury.
              </p>

              {/* Payment Methods */}
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs font-sans"
                  style={{ color: champagneGold }}
                >
                  Secured Payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
