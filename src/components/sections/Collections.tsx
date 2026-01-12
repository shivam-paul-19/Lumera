'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Collection {
  id: number
  name: string
  slug: string
  tagline: string
  description: string
  image: string
  productCount: number
  priceRange: string
  mood: string
}

const collections: Collection[] = [
  {
    id: 1,
    name: 'The Signature Collection',
    slug: 'signature',
    tagline: 'Luxury Redefined',
    description:
      'Our most exquisite creations. Complex, sophisticated fragrances for those who demand excellence.',
    image: '/images/collections/signature.jpg',
    productCount: 3,
    priceRange: '₹1,499 - ₹4,999',
    mood: 'Bold & Luxurious',
  },
  {
    id: 2,
    name: 'Moments Collection',
    slug: 'moments',
    tagline: 'Gift a Pause',
    description:
      'Thoughtfully curated candles perfect for gifting. Create lasting memories with every flame.',
    image: '/images/collections/essence.jpg',
    productCount: 3,
    priceRange: '₹999 - ₹2,499',
    mood: 'Heartfelt & Celebratory',
  },
  {
    id: 3,
    name: 'The Ritual Edit',
    slug: 'ritual',
    tagline: 'Daily Sacred Moments',
    description:
      'Candles designed for your daily rituals and self-care. Make the ordinary extraordinary.',
    image: '/images/collections/serene.jpg',
    productCount: 3,
    priceRange: '₹899 - ₹1,999',
    mood: 'Calm & Intentional',
  },
]

export default function CollectionsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.85
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="section-spacing bg-gradient-to-b from-cream-100 to-cream-200 overflow-hidden">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-sans tracking-wide-luxury uppercase text-burgundy-700/60 mb-4">
            Our Collections
          </p>
          <h2 className="font-serif text-burgundy-700 mb-6">
            Curated for Every Moment
          </h2>
          <div className="line-accent mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-burgundy-700/70 font-sans leading-relaxed">
            Three distinctive collections, each crafted to evoke a unique atmosphere.
            Find the perfect fragrance to complement your lifestyle.
          </p>
        </motion.div>

        {/* Collections - Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Left Arrow - mobile only */}
          <button
            onClick={() => scroll('left')}
            className={`lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              canScrollLeft
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            style={{
              backgroundColor: '#800020',
              border: '1px solid rgba(201, 162, 77, 0.4)'
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-[#C9A24D]" />
          </button>

          {/* Right Arrow - mobile only */}
          <button
            onClick={() => scroll('right')}
            className={`lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              canScrollRight
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            style={{
              backgroundColor: '#800020',
              border: '1px solid rgba(201, 162, 77, 0.4)'
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-[#C9A24D]" />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide"
          >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-auto snap-center"
            >
              <Link href={`/collections?collection=${collection.slug}`} className="block h-full">
                <div className="relative overflow-hidden bg-white border border-burgundy-700/10 hover:border-burgundy-700/20 transition-all duration-500 hover:shadow-luxury-lg h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 sm:h-80 overflow-hidden flex-shrink-0">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                      sizes="(max-width: 1024px) 85vw, 33vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy-700/80 via-burgundy-700/20 to-transparent" />

                    {/* Collection Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs font-sans tracking-wider uppercase text-cream-100/70 mb-2">
                        {collection.mood}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl text-cream-100 mb-1">
                        {collection.name}
                      </h3>
                      <p className="font-serif text-base sm:text-lg text-champagne-400 italic">
                        {collection.tagline}
                      </p>
                    </div>

                    {/* Product Count Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-cream-100/90 backdrop-blur-sm text-xs font-sans tracking-wider text-burgundy-700">
                        {collection.productCount} Products
                      </span>
                    </div>
                  </div>

                  {/* Content - flex-grow to ensure equal height */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Description - fixed height with line clamp */}
                    <p className="text-sm font-sans text-burgundy-700/70 mb-4 leading-relaxed line-clamp-3 flex-grow">
                      {collection.description}
                    </p>

                    {/* Price Range & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-burgundy-700/10 mt-auto">
                      <span className="text-sm font-sans text-burgundy-700/60">
                        {collection.priceRange}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-sans font-medium text-burgundy-700 group-hover:text-burgundy-600 transition-colors">
                        Explore
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Featured Products CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/collections" className="btn-primary">
            View All Collections
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
