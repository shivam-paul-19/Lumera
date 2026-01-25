'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  cta: {
    text: string
    href: string
  }
  image: string
  imageAlt: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Light Meets Soul',
    subtitle: 'LUMERA COLLECTION',
    description:
      'A redefined balance of fragrance, craftsmanship, and quiet luxury — created to elevate everyday moments.',
    cta: {
      text: 'Explore Collection',
      href: '/collections',
    },
    image: '/images/linger-candle.jpg',
    imageAlt: 'Lumera luxury candle with warm ambient lighting',
  },
  {
    id: 2,
    title: 'Melt Into Luxury',
    subtitle: 'SIGNATURE SERIES',
    description:
      'Handcrafted with intention. Each flame tells a story of serenity, warmth, and timeless elegance.',
    cta: {
      text: 'Shop Signature',
      href: '/collections/signature',
    },
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1920&h=1080&fit=crop&q=80',
    imageAlt: 'Signature collection candles in elegant setting',
  },
  {
    id: 3,
    title: 'Essence of Calm',
    subtitle: 'NEW ARRIVALS',
    description:
      'Discover our newest fragrances — thoughtfully curated to transform your space into a sanctuary.',
    cta: {
      text: 'Discover New',
      href: '/collections/new-arrivals',
    },
    image: 'https://images.unsplash.com/photo-1608181831688-ba943e05dff4?w=1920&h=1080&fit=crop&q=80',
    imageAlt: 'New arrival candles with botanical elements',
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-lumera-ivory">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Gradient Overlays - Optimized for mobile readability */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-lumera-ivory/95 via-lumera-ivory/80 to-lumera-ivory/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-lumera-ivory/90 via-transparent to-lumera-ivory/30 z-10" />

          {/* Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].imageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content - Mobile-first with better padding */}
      <div className="relative z-20 h-full flex items-center">
        <div className="px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="max-w-lg md:max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xs md:text-sm font-sans font-medium tracking-[0.2em] uppercase mb-4"
                  style={{ color: 'rgba(128, 0, 32, 0.7)' }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* Title - Mobile-first sizing */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-serif font-medium mb-4 md:mb-6 leading-tight"
                  style={{ 
                    color: '#800020',
                    fontSize: 'clamp(2rem, 8vw, 4.5rem)'
                  }}
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>

                {/* Description - 16px base for readability */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-base md:text-lg font-sans mb-8 md:mb-10 max-w-md md:max-w-lg leading-relaxed"
                  style={{ color: 'rgba(128, 0, 32, 0.8)' }}
                >
                  {heroSlides[currentSlide].description}
                </motion.p>

                {/* CTA Button - Touch-friendly */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link
                    href={heroSlides[currentSlide].cta.href}
                    className="group inline-flex items-center gap-3"
                  >
                    <span 
                      className="inline-flex items-center justify-center px-6 md:px-8 py-4 min-h-[48px] font-sans font-medium text-sm tracking-wider uppercase transition-all duration-300"
                      style={{ backgroundColor: '#800020', color: '#C9A24D' }}
                    >
                      {heroSlides[currentSlide].cta.text}
                    </span>
                    <span 
                      className="hidden md:flex w-12 h-12 min-w-[48px] min-h-[48px] rounded-full border items-center justify-center group-hover:bg-lumera-burgundy transition-all duration-300"
                      style={{ borderColor: 'rgba(128, 0, 32, 0.3)' }}
                    >
                      <svg
                        className="w-5 h-5 text-lumera-burgundy group-hover:text-lumera-ivory transition-colors duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Touch-friendly */}
      <div className="absolute bottom-24 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-500"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`relative block h-1 overflow-hidden rounded-full transition-all duration-500 ${
                index === currentSlide ? 'w-10 md:w-12' : 'w-5 md:w-6'
              }`}
              style={{ backgroundColor: 'rgba(128, 0, 32, 0.2)' }}
            >
              {index === currentSlide && (
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ backgroundColor: '#800020' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 7, ease: 'linear' }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 p-2 min-w-[48px] min-h-[48px] transition-colors cursor-pointer"
        style={{ color: 'rgba(128, 0, 32, 0.6)' }}
        aria-label="Scroll to content"
      >
        <span className="text-xs font-sans tracking-[0.15em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Decorative Elements - Hidden on mobile */}
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none z-10 hidden md:block">
        <div className="absolute top-1/4 right-20 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)' }} />
        <div className="absolute bottom-1/3 right-40 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(128, 0, 32, 0.05)' }} />
      </div>

      {/* Side Text - Desktop only */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <p 
          className="text-xs font-sans tracking-[0.2em] transform -rotate-90 whitespace-nowrap"
          style={{ color: 'rgba(128, 0, 32, 0.4)' }}
        >
          EXCLUSIVELY ON LUMERA.COM
        </p>
      </div>
    </section>
  )
}
