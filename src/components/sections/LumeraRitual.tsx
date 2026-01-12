'use client'

import { motion } from 'framer-motion'
import { Package, Scissors, Flame, Sofa, Clock } from 'lucide-react'

// Lumera brand colors - Using Burgundy 815
const colors = {
  burgundy815: '#800020',
  champagneGold: '#C9A24D',
  charcoalBlack: '#1C1C1C',
  softIvory: '#F6F1EB',
}

// The 5 ritual steps
const ritualSteps = [
  {
    id: 1,
    icon: <Package className="w-6 h-6" />,
    title: 'Unbox',
    description: 'Slowly. Let the anticipation be part of the experience.',
  },
  {
    id: 2,
    icon: <Scissors className="w-6 h-6" />,
    title: 'Trim',
    description: 'The wick to ¼ inch. Precision is an act of care.',
  },
  {
    id: 3,
    icon: <Flame className="w-6 h-6" />,
    title: 'Light',
    description: 'With intention. Hold the flame. Set your purpose.',
  },
  {
    id: 4,
    icon: <Sofa className="w-6 h-6" />,
    title: 'Sit',
    description: 'With the fragrance. Let each layer tell its story.',
  },
  {
    id: 5,
    icon: <Clock className="w-6 h-6" />,
    title: 'Linger',
    description: 'In the moment. Time slows. This is your sanctuary.',
  },
]

export default function LumeraRitual() {
  return (
    <section 
      className="py-16 md:py-20 lg:py-24 overflow-hidden"
      style={{ backgroundColor: colors.softIvory }}
    >
      <div className="px-6 md:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <p 
            className="text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4"
            style={{ color: colors.champagneGold }}
          >
            The Sacred Process
          </p>
          {/* Heading: text-3xl on mobile, larger on desktop */}
          <h2 
            className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6"
            style={{ color: colors.burgundy815 }}
          >
            The Lumera Ritual
          </h2>
          <div 
            className="w-16 h-0.5 mx-auto"
            style={{ background: `linear-gradient(to right, ${colors.burgundy815}, ${colors.champagneGold})` }}
          />
        </motion.div>

        {/* Ritual Steps Container */}
        {/* Mobile: Vertical timeline on left, Desktop: Horizontal centered */}
        <div className="relative">
          {/* Timeline Line */}
          {/* Mobile: Vertical line on left - stops before last item */}
          <div
            className="absolute left-8 top-0 w-[1px] -translate-x-1/2 md:hidden"
            style={{ backgroundColor: `${colors.champagneGold}`, height: 'calc(100% - 5rem)' }}
          />
          {/* Desktop: Horizontal line */}
          <div
            className="absolute top-8 left-0 right-0 h-[1px] hidden md:block"
            style={{ backgroundColor: `${colors.champagneGold}50` }}
          />

          {/* Steps */}
          <div className="flex flex-col md:flex-row md:justify-between relative">
            {ritualSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative pb-10 md:pb-0 md:flex-1 md:flex md:flex-col md:items-center md:text-center"
              >
                {/* Icon Circle */}
                {/* Mobile: Absolute on left timeline, Desktop: Relative centered */}
                <div
                  className="absolute left-8 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 md:mb-4"
                  style={{
                    backgroundColor: colors.burgundy815,
                    color: colors.softIvory,
                  }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                {/* Mobile: Right of icon, Desktop: Below icon centered */}
                <div className="ml-20 md:ml-0">
                  {/* Step Number */}
                  <span
                    className="text-xs font-sans tracking-widest mb-1 block"
                    style={{ color: colors.champagneGold }}
                  >
                    0{step.id}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-serif text-xl md:text-2xl mb-2"
                    style={{ color: colors.burgundy815 }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm md:text-base font-sans leading-relaxed max-w-[220px] md:max-w-[180px]"
                    style={{ color: colors.charcoalBlack }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 md:mt-16"
        >
          <a
            href="/rituals"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[48px] font-sans font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-lg"
            style={{ 
              backgroundColor: colors.burgundy815,
              color: colors.champagneGold,
            }}
          >
            Explore Our Rituals
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


