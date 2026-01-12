'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Header, Footer } from '@/components/layout'
import { MessageCircle, Package, Scissors, Flame, Sofa, Clock } from 'lucide-react'

// Color palette - Using Burgundy 900 throughout (darker shade)
const colors = {
  champagneGold: '#C9A24D',
  softIvory: '#F6F1EB',
  burgundy: '#800020',         // Burgundy 900 - Darker burgundy color
  velvetBeige: '#E7DED4',
  mutedRoseGold: '#B8A090',
  warmGrey: '#6E6E6E',
}

// Ritual steps data with icons
const ritualSteps = [
  {
    id: 1,
    number: '01',
    title: 'Unbox',
    subtitle: 'Slowly',
    description: 'Slowly. Let the anticipation be part of the experience.',
    icon: <Package className="w-6 h-6" />,
  },
  {
    id: 2,
    number: '02',
    title: 'Trim',
    subtitle: 'The Wick',
    description: 'The wick to ¼ inch. Precision is an act of care.',
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    id: 3,
    number: '03',
    title: 'Light',
    subtitle: 'With Intention',
    description: 'With intention. Hold the flame. Set your purpose.',
    icon: <Flame className="w-6 h-6" />,
  },
  {
    id: 4,
    number: '04',
    title: 'Sit',
    subtitle: 'With the Fragrance',
    description: 'With the fragrance. Let each layer tell its story.',
    icon: <Sofa className="w-6 h-6" />,
  },
  {
    id: 5,
    number: '05',
    title: 'Linger',
    subtitle: 'In the Moment',
    description: 'In the moment. Time slows. This is your sanctuary.',
    icon: <Clock className="w-6 h-6" />,
  },
]

// Mood rituals data
const moodRituals = [
  {
    id: 1,
    title: 'Morning Calm',
    poeticLine: 'A gentle dawn that unfurls like a soft inhale',
    description: 'Begin your day with intention. As the first light filters through, let invigorating notes guide your morning meditation.',
    mood: 'Energizing & Fresh',
    scents: ['Citrus Burst', 'Ocean Breeze', 'Lavender Fields'],
    image: 'https://images.unsplash.com/photo-1608181831688-ba943e1d5d37?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Evening Stillness',
    poeticLine: 'A slow exhale, the house settling into quiet grace',
    description: 'Transition from the demands of the day into tranquility. Warm, enveloping notes signal release.',
    mood: 'Warm & Relaxing',
    scents: ['Vanilla Dreams', 'Rose Garden', 'Warm Amber'],
    image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Celebration Glow',
    poeticLine: 'A warm twinkle that gathers hearts in soft light',
    description: 'Mark the special moments. Let dancing flames create an atmosphere of joy and connection.',
    mood: 'Joyful & Connected',
    scents: ['Royal Jasmine', 'Midnight Oud', 'Rose Garden'],
    image: 'https://images.unsplash.com/photo-1603905179674-0d5c5c8e4f9b?w=800&h=600&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Self-Love Ritual',
    poeticLine: 'A tender pause to honor your own quiet worth',
    description: 'This is your sanctuary. Let the fragrance remind you that you are worthy of peace.',
    mood: 'Nurturing & Peaceful',
    scents: ['Lavender Fields', 'Vanilla Dreams', 'Forest Pine'],
    image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800&h=600&fit=crop&q=80',
  },
]

// Fade-in animation wrapper for scroll
const FadeInOnScroll = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export default function RitualsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <>
      <Header />
      <main style={{ backgroundColor: colors.softIvory }}>

        {/* ============================================
            SECTION 1: HERO - FULL HEIGHT WITH CENTERED TEXT
            Mobile: 100vh, centered heading, dimmed candle flame background
            ============================================ */}
        <section
          ref={heroRef}
          className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: colors.burgundy }}
        >
          {/* Background Image - Candle Flame (Dimmed) */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=1920&h=1080&fit=crop&q=90"
              alt="Candle flame flickering"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </div>

          {/* Centered Text - Mobile optimized */}
          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="relative z-10 text-center px-6 max-w-lg mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="font-serif leading-[1.4] tracking-wide"
              style={{
                color: colors.softIvory,
                fontSize: '32px',
              }}
            >
              Light is not just seen.
              <br />
              <span className="italic font-light">It is felt.</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="w-16 h-[1px] mx-auto mt-8"
              style={{ backgroundColor: colors.champagneGold }}
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5"
            >
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-0.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.champagneGold }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================
            SECTION 2: VERTICAL TIMELINE WITH ICONS
            Matches the home page style but in vertical layout
            ============================================ */}
        <section className="py-16 md:py-24" style={{ backgroundColor: colors.softIvory }}>
          <div className="px-4 md:px-6 max-w-4xl mx-auto">
            {/* Section Header */}
            <FadeInOnScroll>
              <div className="text-center mb-12 md:mb-16">
                <p
                  className="text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4"
                  style={{ color: colors.champagneGold }}
                >
                  The Sacred Process
                </p>
                <h2
                  className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6"
                  style={{ color: colors.burgundy }}
                >
                  The Lumera Ritual
                </h2>
                <div
                  className="w-16 h-0.5 mx-auto"
                  style={{ background: `linear-gradient(to right, ${colors.burgundy}, ${colors.champagneGold})` }}
                />
              </div>
            </FadeInOnScroll>

            {/* Vertical Timeline with Icons */}
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div
                className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] md:-translate-x-1/2"
                style={{ backgroundColor: `${colors.champagneGold}50` }}
              />

              {/* Steps */}
              <div className="space-y-0">
                {ritualSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative py-8 md:py-12"
                  >
                    {/* Icon Circle - Centered on desktop */}
                    <div className="absolute left-8 md:left-1/2 top-8 md:top-12 -translate-x-1/2 z-10">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                        style={{
                          backgroundColor: colors.burgundy,
                          color: colors.softIvory,
                        }}
                      >
                        {step.icon}
                      </div>
                    </div>

                    {/* Content - Mobile: Right of icon, Desktop: Alternating sides */}
                    <div className={`ml-20 md:ml-0 md:w-[45%] ${
                      index % 2 === 0
                        ? 'md:mr-auto md:pr-8 md:text-right'
                        : 'md:ml-auto md:pl-8 md:text-left'
                    }`}>
                      {/* Step Number */}
                      <span
                        className="text-xs font-sans tracking-widest mb-1 block"
                        style={{ color: colors.champagneGold }}
                      >
                        {step.number}
                      </span>

                      {/* Title */}
                      <h3
                        className="font-serif text-2xl md:text-3xl mb-3"
                        style={{ color: colors.burgundy }}
                      >
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm md:text-base font-sans leading-relaxed"
                        style={{ color: '#1C1C1C' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gold Divider */}
        <div className="w-full flex items-center justify-center py-8 md:py-16">
          <div
            className="w-24 md:w-32 h-[0.5px]"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.champagneGold}, transparent)` }}
          />
        </div>

        {/* ============================================
            SECTION 3: RITUALS BY MOOD - SINGLE COLUMN CARDS
            Mobile: 100% width minus 32px (16px padding each side)
            Velvet Beige card backgrounds
            ============================================ */}
        <section className="py-16 md:py-24" style={{ backgroundColor: colors.softIvory }}>
          <div className="px-4 md:px-6 max-w-7xl mx-auto">
            {/* Section Header */}
            <FadeInOnScroll>
              <div className="text-center mb-12 md:mb-20">
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: colors.champagneGold }}
                >
                  Find Your Moment
                </p>
                <h2
                  className="font-serif text-3xl md:text-5xl"
                  style={{ color: colors.burgundy }}
                >
                  Rituals by Mood
                </h2>
              </div>
            </FadeInOnScroll>

            {/* Single Column Cards for Mobile */}
            <div className="space-y-8 md:space-y-16">
              {moodRituals.map((ritual, index) => (
                <FadeInOnScroll key={ritual.id} delay={0.15}>
                  <div
                    className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500"
                    style={{ backgroundColor: colors.velvetBeige }}
                  >
                    {/* Image - Full Width on Mobile */}
                    <div className="relative h-56 md:h-72 lg:h-80 overflow-hidden">
                      <Image
                        src={ritual.image}
                        alt={ritual.title}
                        fill
                        className="object-cover"
                      />
                      <div
                        className="absolute top-3 left-3 px-3 py-1.5 text-[10px] tracking-widest uppercase rounded-sm"
                        style={{
                          backgroundColor: colors.burgundy,
                          color: colors.champagneGold,
                        }}
                      >
                        {ritual.mood}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 lg:p-10">
                      <h3
                        className="font-serif text-xl md:text-2xl mb-2"
                        style={{ color: colors.burgundy }}
                      >
                        {ritual.title}
                      </h3>

                      {/* Poetic One-liner */}
                      <p
                        className="text-sm italic mb-4"
                        style={{ color: colors.warmGrey }}
                      >
                        {ritual.poeticLine}
                      </p>

                      <p
                        className="text-sm leading-relaxed mb-6"
                        style={{ color: `${colors.burgundy}CC` }}
                      >
                        {ritual.description}
                      </p>

                      {/* Recommended Scents */}
                      <div>
                        <p
                          className="text-[10px] tracking-widest uppercase mb-3"
                          style={{ color: colors.champagneGold }}
                        >
                          Recommended Scents
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ritual.scents.map((scent) => (
                            <Link
                              key={scent}
                              href={`/products/${scent.toLowerCase().replace(/\s+/g, '-')}`}
                              className="px-4 py-2.5 text-xs border transition-all duration-300 min-h-[44px] flex items-center justify-center"
                              style={{
                                borderColor: colors.burgundy,
                                color: colors.burgundy,
                              }}
                            >
                              {scent}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Gold Divider */}
        <div className="w-full flex items-center justify-center py-8 md:py-16">
          <div
            className="w-24 md:w-32 h-[0.5px]"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.champagneGold}, transparent)` }}
          />
        </div>

        {/* ============================================
            SECTION 4: GIFTING - STACKED LAYOUT FOR MOBILE
            Mobile: Image on top, text below
            ============================================ */}
        <section className="py-16 md:py-24" style={{ backgroundColor: colors.softIvory }}>
          <div className="px-4 md:px-6 max-w-7xl mx-auto">
            <FadeInOnScroll>
              <div className="rounded-lg overflow-hidden shadow-lg">
                {/* Image - Stacked on top for mobile */}
                <div
                  className="relative h-72 md:h-96 lg:h-[500px] overflow-hidden"
                  style={{ backgroundColor: colors.velvetBeige }}
                >
                  <div className="absolute inset-0 p-8 md:p-12 flex items-center justify-center">
                    {/* Flat-lay composition */}
                    <div className="relative w-full h-full max-w-md">
                      {/* Box */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-[5%] left-[5%] w-28 md:w-40 h-36 md:h-48 rounded-lg shadow-2xl overflow-hidden"
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=500&fit=crop&q=80"
                          alt="Lumera Gift Box"
                          fill
                          className="object-cover"
                        />
                      </motion.div>

                      {/* Potli */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-[25%] right-[5%] w-24 md:w-32 h-28 md:h-36 rounded-lg shadow-2xl overflow-hidden"
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1603905179674-0d5c5c8e4f9b?w=400&h=450&fit=crop&q=80"
                          alt="Silk Potli Bag"
                          fill
                          className="object-cover"
                        />
                      </motion.div>

                      {/* Thank You Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                        className="absolute bottom-[5%] left-[15%] w-32 md:w-44 h-20 md:h-28 rounded shadow-xl overflow-hidden"
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=400&h=250&fit=crop&q=80"
                          alt="Handwritten Thank You Card"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Text Content - Below image on mobile */}
                <div
                  className="p-8 md:p-12 lg:p-16"
                  style={{ backgroundColor: colors.burgundy }}
                >
                  <p
                    className="text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ color: colors.champagneGold }}
                  >
                    The Art of Giving
                  </p>
                  <h2
                    className="font-serif text-2xl md:text-4xl lg:text-5xl mb-6 leading-tight"
                    style={{ color: colors.softIvory }}
                  >
                    Gifting as a<br />
                    <span className="italic">Ritual</span>
                  </h2>
                  <p
                    className="text-sm md:text-base leading-relaxed mb-6"
                    style={{ color: `${colors.softIvory}CC` }}
                  >
                    When you gift Lumera, you gift a pause — a breath — a moment of
                    warmth wrapped in intention.
                  </p>
                  <p
                    className="text-sm md:text-base leading-relaxed mb-8 italic"
                    style={{ color: colors.mutedRoseGold }}
                  >
                    "To give light is to receive it tenfold."
                  </p>

                  {/* CTA Button - Min tap target 44px */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:shadow-xl min-h-[44px]"
                    style={{
                      backgroundColor: colors.champagneGold,
                      color: colors.burgundy,
                    }}
                  >
                    Request Bespoke Gifting
                  </Link>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Gold Divider */}
        <div className="w-full flex items-center justify-center py-8 md:py-16">
          <div
            className="w-24 md:w-32 h-[0.5px]"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.champagneGold}, transparent)` }}
          />
        </div>

        {/* ============================================
            FINAL CTA SECTION
            ============================================ */}
        <section className="py-20 md:py-32" style={{ backgroundColor: colors.softIvory }}>
          <div className="px-4 md:px-6 max-w-4xl mx-auto text-center">
            <FadeInOnScroll>
              <h2
                className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 md:mb-8"
                style={{ color: colors.burgundy }}
              >
                Begin Your Ritual
              </h2>
              <p
                className="text-sm md:text-lg leading-relaxed mb-10 md:mb-12 max-w-xl mx-auto"
                style={{ color: `${colors.burgundy}99` }}
              >
                Every candle holds a moment waiting to be discovered.
                Find the fragrance that speaks to your soul.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-10 py-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:shadow-2xl min-h-[44px]"
                style={{
                  backgroundColor: colors.burgundy,
                  color: colors.champagneGold,
                }}
              >
                Explore Collections
              </Link>
            </FadeInOnScroll>
          </div>
        </section>

      </main>

      {/* Floating WhatsApp Button - 48x48px, 24px offset from edges */}
      <a
        href="https://wa.me/919625205260"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-50 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl rounded-full"
        style={{
          backgroundColor: '#25D366',
          width: '48px',
          height: '48px',
          bottom: '24px',
          right: '24px',
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </a>

      <Footer />
    </>
  )
}