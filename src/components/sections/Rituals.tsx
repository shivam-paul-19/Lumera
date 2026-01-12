'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Moon, Sun, Heart, ChevronLeft, ChevronRight } from 'lucide-react'

interface Ritual {
  id: number
  icon: React.ReactNode
  title: string
  time: string
  description: string
  image: string
  fragrance: string
}

const rituals: Ritual[] = [
  {
    id: 1,
    icon: <Sun className="w-6 h-6" />,
    title: 'Morning Awakening',
    time: '6 AM - 10 AM',
    description:
      'Begin your day with invigorating citrus and fresh botanical notes. Let the gentle flame guide your morning meditation.',
    image: '/images/rituals/morning.jpg',
    fragrance: 'Citrus · Green Tea · White Jasmine',
  },
  {
    id: 2,
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Afternoon Clarity',
    time: '12 PM - 4 PM',
    description:
      'Create a focused atmosphere with balanced woody and aromatic scents. Perfect for mindful work and creative flow.',
    image: '/images/rituals/afternoon.jpg',
    fragrance: 'Sandalwood · Lavender · Cedar',
  },
  {
    id: 3,
    icon: <Moon className="w-6 h-6" />,
    title: 'Evening Unwind',
    time: '6 PM - 10 PM',
    description:
      'Transition into tranquility with warm, enveloping notes. Transform your space into a sanctuary of calm.',
    image: '/images/rituals/evening.jpg',
    fragrance: 'Vanilla · Amber · Soft Musk',
  },
  {
    id: 4,
    icon: <Heart className="w-6 h-6" />,
    title: 'Night Embrace',
    time: '10 PM - 12 AM',
    description:
      'Drift into peaceful slumber surrounded by soothing, dreamy fragrances. The perfect end to your day.',
    image: '/images/rituals/night.jpg',
    fragrance: 'Rose · Oud · Warm Cashmere',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export default function Rituals() {
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
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="section-spacing bg-ivory-100 overflow-hidden">
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
            The Art of Living
          </p>
          <h2 className="font-serif text-burgundy-700 mb-6">The Rituals</h2>
          <div className="line-accent mx-auto mb-6" />
          <p className="max-w-2xl mx-auto text-burgundy-700/70 font-sans leading-relaxed">
            Transform ordinary moments into extraordinary rituals. Each time of day
            calls for a different essence — discover your perfect fragrance journey.
          </p>
        </motion.div>

        {/* Rituals Grid - Horizontal scroll on mobile */}
        <div className="relative">
          {/* Left Arrow - mobile only */}
          <button
            onClick={() => scroll('left')}
            className={`lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
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
            <ChevronLeft className="w-5 h-5 text-[#C9A24D]" />
          </button>

          {/* Right Arrow - mobile only */}
          <button
            onClick={() => scroll('right')}
            className={`lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
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
            <ChevronRight className="w-5 h-5 text-[#C9A24D]" />
          </button>

          <motion.div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide"
          >
            {rituals.map((ritual) => (
            <motion.div
              key={ritual.id}
              variants={itemVariants}
              className="group flex-shrink-0 w-[280px] sm:w-[300px] lg:w-auto snap-start"
            >
              <div className="relative h-full bg-white/50 border border-burgundy-700/10 hover:border-burgundy-700/20 transition-all duration-500 hover:shadow-luxury">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={ritual.image}
                    alt={ritual.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ivory-100 via-transparent to-transparent" />

                  {/* Time Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-ivory-100/90 backdrop-blur-sm text-xs font-sans tracking-wider text-burgundy-700">
                      {ritual.time}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-ivory-200 flex items-center justify-center text-burgundy-700 mb-4 group-hover:bg-burgundy-700 group-hover:text-ivory-100 transition-all duration-400">
                    {ritual.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-burgundy-700 mb-3">
                    {ritual.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm font-sans text-burgundy-700/60 mb-4 leading-relaxed">
                    {ritual.description}
                  </p>

                  {/* Fragrance Notes */}
                  <div className="pt-4 border-t border-burgundy-700/10">
                    <p className="text-xs font-sans tracking-wider text-champagne-600">
                      {ritual.fragrance}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/rituals"
            className="btn-primary inline-flex items-center gap-2"
          >
            Discover Your Ritual
            <svg
              className="w-4 h-4"
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
          </a>
        </motion.div>
      </div>
    </section>
  )
}
