'use client'

import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import clsx from 'clsx'
// CandlePreview component available if needed
// import { CandlePreview } from './CandlePreview'
import { useCart } from '@/context/CartContext'

// Types
type StepId = 1 | 2 | 3 | 4 | 5
type VesselId = 'obsidian-matte' | 'ivory-frost' | 'champagne-gold' | 'ceramic-artisan' | 'hammered-brass'
type FragranceFamily = 'floral' | 'woody' | 'fresh' | 'oriental' | 'gourmand'
type FragranceMode = 'single' | 'blend'
type WaxType = 'soy' | 'beeswax' | 'coconut-blend' | 'coconut-luxe'
type WickType = 'cotton' | 'wooden-crackle' | 'dual-wick'
type WaxColorId = 'natural' | 'warm-grey' | 'rose-mist' | 'champagne-cream'
type FoilFinish = 'gold' | 'rose-gold' | 'matte-black' | 'none'
type PackagingId = 'burgundy-keepsake' | 'silk-potli' | 'ivory-box' | 'no-packaging'

interface CandleConfig {
  vessel: VesselId | null
  fragranceFamily: FragranceFamily
  fragranceMode: FragranceMode
  primaryScent: string | null
  secondaryScent: string | null
  waxType: WaxType
  waxColor: WaxColorId
  wickType: WickType
  labelText: string
  foilFinish: FoilFinish
  packaging: PackagingId | null
  includeCard: boolean
  waxSeal: boolean
  finishingTouches: string[]
}

// Step definitions
const steps: { id: StepId; label: string }[] = [
  { id: 1, label: 'Jar' },
  { id: 2, label: 'Fragrance' },
  { id: 3, label: 'Wax' },
  { id: 4, label: 'Label' },
  { id: 5, label: 'Finishing' },
]

// Vessel options
const vesselOptions: {
  id: VesselId
  name: string
  material: string
  priceDelta: number
  description: string
  imageSrc: string
}[] = [
  {
    id: 'ivory-frost',
    name: 'Ivory Frost',
    material: 'Soft matte frosted glass',
    priceDelta: 0,
    description: 'Our signature jar with diffused glow.',
    imageSrc: '/images/custom/vessels/frosted-glass.png',
  },
  {
    id: 'obsidian-matte',
    name: 'Obsidian Matte',
    material: 'Hand-finished black glass',
    priceDelta: 200,
    description: 'Deep, mysterious, and endlessly elegant.',
    imageSrc: '/images/custom/vessels/frosted-glass.png',
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold',
    material: 'Metallic-finished glass',
    priceDelta: 350,
    description: 'Celebratory and luminous.',
    imageSrc: '/images/custom/vessels/frosted-glass.png',
  },
  {
    id: 'ceramic-artisan',
    name: 'Ceramic Artisan',
    material: 'Hand-glazed stoneware',
    priceDelta: 400,
    description: 'Tactile, weighty, perfect for re-use.',
    imageSrc: '/images/custom/vessels/ceramic.png',
  },
  {
    id: 'hammered-brass',
    name: 'Hammered Brass',
    material: 'Hand-hammered brass finish',
    priceDelta: 600,
    description: 'Reflective, festive, statement-making.',
    imageSrc: '/images/custom/vessels/hammered-metal.png',
  },
]

// Fragrance families
const fragranceFamilies: Record<FragranceFamily, {
  name: string
  description: string
  scents: { id: string; name: string; notes: string; priceDelta: number }[]
}> = {
  floral: {
    name: 'Floral',
    description: 'Delicate blooms and garden whispers',
    scents: [
      { id: 'bulgarian-rose', name: 'Bulgarian Rose', notes: 'Rose, peony, pink pepper', priceDelta: 300 },
      { id: 'jasmine-night', name: 'Jasmine Night', notes: 'Jasmine, tuberose, musk', priceDelta: 350 },
      { id: 'lavender-dreams', name: 'Lavender Dreams', notes: 'Lavender, vanilla, sandalwood', priceDelta: 250 },
    ],
  },
  woody: {
    name: 'Woody',
    description: 'Grounding earth and ancient trees',
    scents: [
      { id: 'sacred-oud', name: 'Sacred Oud', notes: 'Oud, rose, saffron', priceDelta: 500 },
      { id: 'sandalwood-silk', name: 'Sandalwood Silk', notes: 'Sandalwood, vanilla, amber', priceDelta: 350 },
      { id: 'cedarwood-mist', name: 'Cedarwood Mist', notes: 'Cedar, vetiver, moss', priceDelta: 300 },
    ],
  },
  fresh: {
    name: 'Fresh',
    description: 'Crisp mornings and ocean breeze',
    scents: [
      { id: 'morning-dew', name: 'Morning Dew', notes: 'Green tea, bergamot, mint', priceDelta: 250 },
      { id: 'sea-salt', name: 'Sea Salt & Sage', notes: 'Sea salt, sage, driftwood', priceDelta: 280 },
      { id: 'citrus-grove', name: 'Citrus Grove', notes: 'Grapefruit, lemon, basil', priceDelta: 250 },
    ],
  },
  oriental: {
    name: 'Oriental',
    description: 'Mysterious spice and warmth',
    scents: [
      { id: 'amber-nights', name: 'Amber Nights', notes: 'Amber, vanilla, cinnamon', priceDelta: 350 },
      { id: 'saffron-rose', name: 'Saffron Rose', notes: 'Saffron, rose, oud', priceDelta: 450 },
      { id: 'mystic-incense', name: 'Mystic Incense', notes: 'Frankincense, myrrh, sandalwood', priceDelta: 380 },
    ],
  },
  gourmand: {
    name: 'Gourmand',
    description: 'Sweet indulgence and comfort',
    scents: [
      { id: 'vanilla-bean', name: 'Vanilla Bean', notes: 'Vanilla, tonka, caramel', priceDelta: 280 },
      { id: 'honey-almond', name: 'Honey & Almond', notes: 'Honey, almond, warm milk', priceDelta: 300 },
      { id: 'coffee-cream', name: 'Coffee & Cream', notes: 'Coffee, cream, hazelnut', priceDelta: 320 },
    ],
  },
}

// Wax colors
const waxColors: {
  id: WaxColorId
  name: string
  hex: string
  priceDelta: number
}[] = [
  { id: 'natural', name: 'Natural', hex: '#F6F1EB', priceDelta: 0 },
  { id: 'warm-grey', name: 'Warm Grey', hex: '#D4CEC6', priceDelta: 100 },
  { id: 'rose-mist', name: 'Rose Mist', hex: '#F2D5D8', priceDelta: 150 },
  { id: 'champagne-cream', name: 'Champagne Cream', hex: '#E2C89F', priceDelta: 150 },
]

// Wax types
const waxTypes: {
  id: WaxType
  name: string
  priceDelta: number
}[] = [
  { id: 'soy', name: 'Pure Soy Wax', priceDelta: 0 },
  { id: 'beeswax', name: 'Natural Beeswax', priceDelta: 200 },
  { id: 'coconut-blend', name: 'Coconut & Soy Blend', priceDelta: 100 },
  { id: 'coconut-luxe', name: 'Coconut & Soy Luxe', priceDelta: 180 },
]

// Wick types
const wickTypes: {
  id: WickType
  name: string
  priceDelta: number
}[] = [
  { id: 'cotton', name: 'Braided Cotton', priceDelta: 0 },
  { id: 'wooden-crackle', name: 'Wooden Crackle', priceDelta: 150 },
  { id: 'dual-wick', name: 'Dual Wick', priceDelta: 200 },
]

// Foil finishes
const foilFinishes: {
  id: FoilFinish
  name: string
  priceDelta: number
}[] = [
  { id: 'none', name: 'No Foil', priceDelta: 0 },
  { id: 'gold', name: 'Gold Foil', priceDelta: 100 },
  { id: 'rose-gold', name: 'Rose Gold', priceDelta: 100 },
  { id: 'matte-black', name: 'Matte Black', priceDelta: 100 },
]

// Finishing touch add-ons (checkbox style)
const finishingTouchOptions: {
  id: string
  name: string
  description: string
  priceDelta: number
}[] = [
  {
    id: 'engraved-wooden-lid',
    name: 'Engraved Wooden Lid',
    description: 'Custom engraved wooden lid with your initials.',
    priceDelta: 250,
  },
  {
    id: 'gold-metal-lid',
    name: 'Gold Metal Lid',
    description: 'Luxurious gold-plated metal lid.',
    priceDelta: 350,
  },
  {
    id: 'wax-seal',
    name: 'Wax Seal',
    description: 'Hand-stamped wax seal on packaging.',
    priceDelta: 150,
  },
  {
    id: 'handwritten-note',
    name: 'Handwritten Note',
    description: 'Personal handwritten message card.',
    priceDelta: 100,
  },
  
]

// Legacy packaging options (kept for compatibility)
const packagingOptions: {
  id: PackagingId
  name: string
  description: string
  priceDelta: number
}[] = [
  {
    id: 'burgundy-keepsake',
    name: 'Burgundy Keepsake Box',
    description: 'Magnetic closure with champagne foil logo.',
    priceDelta: 500,
  },
  {
    id: 'silk-potli',
    name: 'Silk Potli',
    description: 'Hand-stitched silk bag with tassel.',
    priceDelta: 350,
  },
  {
    id: 'ivory-box',
    name: 'Classic Ivory Box',
    description: 'Rigid box with Lumera monogram.',
    priceDelta: 0,
  },
  {
    id: 'no-packaging',
    name: 'No Gift Packaging',
    description: 'Planet-first minimal packing.',
    priceDelta: -150,
  },
]

const BASE_PRICE = 1999

export default function CustomCandleBuilder() {
  const { addToCart } = useCart()
  const [showBuilder, setShowBuilder] = useState(false)
  const [step, setStep] = useState<StepId>(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const incrementQty = () => setQuantity(prev => Math.min(prev + 1, 10))
  const decrementQty = () => setQuantity(prev => Math.max(prev - 1, 1))
  const [config, setConfig] = useState<CandleConfig>({
    vessel: 'ivory-frost',
    fragranceFamily: 'floral',
    fragranceMode: 'single',
    primaryScent: null,
    secondaryScent: null,
    waxType: 'soy',
    waxColor: 'warm-grey',
    wickType: 'cotton',
    labelText: '',
    foilFinish: 'gold',
    packaging: null,
    includeCard: false,
    waxSeal: false,
    finishingTouches: [],
  })

  const goToStep = useCallback((next: StepId) => setStep(next), [])
  const goNext = useCallback(() => setStep((prev) => (prev < 5 ? ((prev + 1) as StepId) : prev)), [])
  const goBack = useCallback(() => setStep((prev) => (prev > 1 ? ((prev - 1) as StepId) : prev)), [])

  const updateConfig = useCallback(<K extends keyof CandleConfig>(key: K, value: CandleConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }, [])

  const formattedPrice = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)

  const liveTotal = useMemo(() => {
    let total = BASE_PRICE

    if (config.vessel) {
      const vessel = vesselOptions.find((v) => v.id === config.vessel)
      if (vessel) total += vessel.priceDelta
    }

    if (config.primaryScent) {
      const family = fragranceFamilies[config.fragranceFamily]
      const scent = family.scents.find((s) => s.id === config.primaryScent)
      if (scent) total += scent.priceDelta
    }

    const waxColor = waxColors.find((w) => w.id === config.waxColor)
    if (waxColor) total += waxColor.priceDelta

    const waxType = waxTypes.find((w) => w.id === config.waxType)
    if (waxType) total += waxType.priceDelta

    const wick = wickTypes.find((w) => w.id === config.wickType)
    if (wick) total += wick.priceDelta

    const foil = foilFinishes.find((f) => f.id === config.foilFinish)
    if (foil) total += foil.priceDelta

    // Add finishing touches prices
    config.finishingTouches.forEach((touchId) => {
      const touch = finishingTouchOptions.find((t) => t.id === touchId)
      if (touch) total += touch.priceDelta
    })

    return total
  }, [config])

  const canSubmit =
    !!config.vessel &&
    !!config.primaryScent &&
    !!config.waxType &&
    !!config.wickType

  const handleAddToCart = useCallback(() => {
    if (!canSubmit || isAddingToCart) return

    setIsAddingToCart(true)

    const vessel = vesselOptions.find((v) => v.id === config.vessel)
    const configHash = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

    const cartItem = {
      id: configHash,
      name: `Custom Candle: "${config.labelText}"`,
      slug: 'custom-candle',
      price: liveTotal,
      image: vessel?.imageSrc || '/images/custom/vessels/frosted-glass.png',
      collection: 'Custom',
    }

    addToCart(cartItem, quantity)

    setTimeout(() => {
      setIsAddingToCart(false)
      setQuantity(1) // Reset quantity after adding to cart
    }, 500)
  }, [config, canSubmit, isAddingToCart, liveTotal, addToCart])

  // Hero Section
  if (!showBuilder) {
    return <HeroSection onStart={() => setShowBuilder(true)} />
  }

  return (
    <div className="min-h-screen bg-[#F6F1EB] pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      {/* Main Builder Layout - Two Column */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Summary Sidebar - Collapsible on mobile */}
        <div className="lg:w-[35%] bg-[#F6F1EB] p-3 sm:p-4 md:p-8 lg:p-10 lg:border-r border-[#1C1C1C]/10">
          <div className="lg:sticky lg:top-36">
            {/* Mobile: Horizontal compact layout */}
            <div className="lg:hidden">
              <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-[#1C1C1C]/5">
                {/* Candle Preview - Small */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0">
                  <Image
                    src={vesselOptions.find((v) => v.id === config.vessel)?.imageSrc || '/images/custom/vessels/frosted-glass.png'}
                    alt="Candle Preview"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Summary Info - Compact */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm sm:text-base text-[#800020] mb-1 truncate">
                    {config.vessel ? vesselOptions.find((v) => v.id === config.vessel)?.name : 'Select Jar'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#1C1C1C]/60 truncate mb-2">
                    {config.primaryScent ? (() => {
                      const selectedIds = config.fragranceMode === 'blend'
                        ? config.primaryScent.split(',').filter(id => id.trim())
                        : [config.primaryScent]
                      const allScents = Object.values(fragranceFamilies).flatMap(f => f.scents)
                      const names = selectedIds.map(id => allScents.find(s => s.id === id)?.name).filter(Boolean)
                      return names.join(' + ')
                    })() : 'Select Fragrance'}
                  </p>

                  {/* Quantity Controls - Inline */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-[#1C1C1C]/50">Qty:</span>
                    <button
                      type="button"
                      onClick={decrementQty}
                      disabled={quantity <= 1}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#1C1C1C]/20 flex items-center justify-center text-[#1C1C1C]/60 disabled:opacity-30"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-[#800020] text-sm font-medium w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={incrementQty}
                      disabled={quantity >= 10}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#1C1C1C]/20 flex items-center justify-center text-[#1C1C1C]/60 disabled:opacity-30"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Live Total - Right */}
                <div className="text-right flex-shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-sans tracking-wider uppercase text-[#1C1C1C]/50 block">
                    Total
                  </span>
                  <span className="font-serif text-base sm:text-lg text-[#800020]">
                    {formattedPrice(liveTotal * quantity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop: Full layout */}
            <div className="hidden lg:block">
              {/* Candle Preview */}
              <div className="flex justify-center items-center mb-6">
                <div className="relative w-72 h-80">
                  <Image
                    src={vesselOptions.find((v) => v.id === config.vessel)?.imageSrc || '/images/custom/vessels/frosted-glass.png'}
                    alt="Candle Preview"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Title Above Card */}
              <h3 className="text-center font-serif text-xl text-[#800020] mb-6">
                Order Summary
              </h3>

              {/* Summary Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#1C1C1C]/5 mb-6">
                <div className="space-y-3">
                  {/* Jar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1C1C]/60 text-sm">Jar</span>
                    <span className="text-[#800020] text-sm font-medium">
                      {config.vessel ? vesselOptions.find((v) => v.id === config.vessel)?.name : '—'}
                    </span>
                  </div>

                  {/* Fragrance */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1C1C]/60 text-sm">Fragrance</span>
                    <span className="text-[#800020] text-sm font-medium text-right max-w-[60%]">
                      {config.primaryScent ? (() => {
                        const selectedIds = config.fragranceMode === 'blend'
                          ? config.primaryScent.split(',').filter(id => id.trim())
                          : [config.primaryScent]
                        const allScents = Object.values(fragranceFamilies).flatMap(f => f.scents)
                        const names = selectedIds.map(id => allScents.find(s => s.id === id)?.name).filter(Boolean)
                        return names.join(' + ')
                      })() : '—'}
                    </span>
                  </div>

                  {/* Wax */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1C1C]/60 text-sm">Wax</span>
                    <span className="text-[#800020] text-sm font-medium">
                      {waxTypes.find((w) => w.id === config.waxType)?.name || '—'}
                    </span>
                  </div>

                  {/* Wick */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1C1C]/60 text-sm">Wick</span>
                    <span className="text-[#800020] text-sm font-medium">
                      {config.wickType === 'cotton'
                        ? 'Cotton'
                        : config.wickType === 'wooden-crackle'
                        ? 'Soft Crackle'
                        : 'Dual Wick'}
                    </span>
                  </div>

                  {/* Finishing Touches */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C1C1C]/60 text-sm">Finishing</span>
                    <span className={config.finishingTouches.length > 0 ? 'text-[#800020] text-sm font-medium' : 'text-[#1C1C1C]/40 text-sm'}>
                      {config.finishingTouches.length > 0
                        ? `${config.finishingTouches.length} add-on${config.finishingTouches.length > 1 ? 's' : ''}`
                        : '—'}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1C1C1C]/10">
                    <span className="text-[#1C1C1C]/60 text-sm">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={decrementQty}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-full border border-[#1C1C1C]/20 flex items-center justify-center text-[#1C1C1C]/60 hover:border-[#800020] hover:text-[#800020] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-[#800020] text-sm font-medium w-8 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={incrementQty}
                        disabled={quantity >= 10}
                        className="w-8 h-8 rounded-full border border-[#1C1C1C]/20 flex items-center justify-center text-[#1C1C1C]/60 hover:border-[#800020] hover:text-[#800020] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Total */}
              <div className="text-center">
                <span className="text-xs font-sans tracking-[0.15em] uppercase text-[#1C1C1C]/50">
                  LIVE TOTAL:
                </span>
                <span className="font-serif text-xl text-[#1C1C1C] ml-2">
                  {formattedPrice(liveTotal * quantity)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-[#1C1C1C]/50 ml-2">
                    ({formattedPrice(liveTotal)} × {quantity})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Steps */}
        <div className="flex-1 bg-[#F6F1EB] flex flex-col min-h-[50vh] lg:min-h-[calc(100vh-7rem)]">
          {/* Step Header - Always scrollable to handle zoom */}
          <div className="bg-[#F6F1EB] border-b border-[#C9A24D]/20 sticky top-16 sm:top-20 lg:top-0 z-20">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-center justify-center px-4 py-3 sm:py-4 min-w-fit mx-auto">
                {steps.map((s, index) => (
                  <div key={s.id} className="flex items-center flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => goToStep(s.id)}
                      className="flex items-center gap-1.5 sm:gap-2 group px-2 sm:px-3 py-2 min-h-[44px]"
                      aria-label={`Go to ${s.label}`}
                    >
                      {/* Circle indicator */}
                      <span
                        className={clsx(
                          'w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border-2 flex-shrink-0',
                          s.id === step
                            ? 'bg-[#C9A24D] border-[#C9A24D]'
                            : s.id < step
                            ? 'bg-[#C9A24D]/50 border-[#C9A24D]/50'
                            : 'bg-transparent border-[#C9A24D]/30'
                        )}
                      />
                      {/* Step name - always visible */}
                      <span
                        className={clsx(
                          'text-[11px] sm:text-xs md:text-sm font-sans transition-all duration-300 whitespace-nowrap',
                          s.id === step
                            ? 'text-[#C9A24D] font-medium'
                            : s.id < step
                            ? 'text-[#C9A24D]/60'
                            : 'text-[#C9A24D]/40'
                        )}
                      >
                        {s.label}
                      </span>
                    </button>

                    {/* Connecting line */}
                    {index < steps.length - 1 && (
                      <div
                        className={clsx(
                          'w-6 sm:w-8 md:w-10 lg:w-12 h-[2px] flex-shrink-0 transition-all duration-300',
                          s.id < step
                            ? 'bg-[#C9A24D]/50'
                            : 'bg-[#C9A24D]/20'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 p-4 sm:p-6 md:p-10 pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <StepVessel config={config} updateConfig={updateConfig} onNext={goNext} />
                )}
                {step === 2 && (
                  <StepFragrance config={config} updateConfig={updateConfig} onNext={goNext} onBack={goBack} />
                )}
                {step === 3 && (
                  <StepWax config={config} updateConfig={updateConfig} onNext={goNext} onBack={goBack} />
                )}
                {step === 4 && (
                  <StepLabel config={config} updateConfig={updateConfig} onNext={goNext} onBack={goBack} />
                )}
                {step === 5 && (
                  <StepPackaging
                    config={config}
                    updateConfig={updateConfig}
                    onBack={goBack}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={isAddingToCart}
                    canSubmit={canSubmit}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed Navigation Bar */}
          <div className="sticky bottom-0 bg-[#F6F1EB] border-t border-[#C9A24D]/20 px-4 sm:px-6 md:px-10 py-3 sm:py-4">
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              {step === 1 ? (
                <span />
              ) : (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-3 sm:px-6 py-3 min-h-[44px] text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.05em] sm:tracking-[0.1em] uppercase text-[#1C1C1C]/60 border border-[#1C1C1C]/20 rounded-full hover:border-[#1C1C1C]/40 transition-all"
                >
                  <span className="hidden sm:inline">
                    {step === 2 && 'BACK • JAR'}
                    {step === 3 && 'BACK • FRAGRANCE'}
                    {step === 4 && 'BACK • WAX'}
                    {step === 5 && 'BACK • LABEL'}
                  </span>
                  <span className="sm:hidden">BACK</span>
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={
                    (step === 1 && !config.vessel) ||
                    (step === 2 && !config.primaryScent) ||
                    (step === 3 && (!config.waxType || !config.wickType))
                  }
                  className={clsx(
                    'px-3 sm:px-6 py-3 min-h-[44px] text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.05em] sm:tracking-[0.1em] uppercase transition-all rounded-full',
                    ((step === 1 && config.vessel) ||
                     (step === 2 && config.primaryScent) ||
                     (step === 3 && config.waxType && config.wickType) ||
                     (step === 4))
                      ? 'bg-[#800020] text-[#C9A24D] hover:bg-[#5c0017]'
                      : 'bg-[#1C1C1C]/20 text-[#1C1C1C]/40 cursor-not-allowed'
                  )}
                >
                  <span className="hidden sm:inline">
                    {step === 1 && 'NEXT • FRAGRANCE'}
                    {step === 2 && 'NEXT • WAX'}
                    {step === 3 && 'NEXT • LABEL'}
                    {step === 4 && 'NEXT • FINISHING'}
                  </span>
                  <span className="sm:hidden">NEXT</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canSubmit || isAddingToCart}
                  className={clsx(
                    'px-4 sm:px-6 py-3 min-h-[44px] text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.05em] sm:tracking-[0.1em] uppercase transition-all rounded-full',
                    canSubmit && !isAddingToCart
                      ? 'bg-[#800020] text-[#C9A24D] hover:bg-[#5c0017]'
                      : 'bg-[#1C1C1C]/20 text-[#1C1C1C]/40 cursor-not-allowed'
                  )}
                >
                  {isAddingToCart ? 'ADDING...' : 'ADD TO BAG'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============== HERO SECTION ==============

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[#F6F1EB] pt-20 sm:pt-24 md:pt-28">
      <section className="min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] flex flex-col lg:flex-row">
        {/* Left: Typography */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:p-12 lg:p-16 order-2 lg:order-1">
          <div className="max-w-lg w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <p className="text-[10px] sm:text-xs font-sans tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#C9A24D] mb-2 sm:mb-4">
                Lumera Custom
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#800020] leading-[1.2] sm:leading-[1.15] mb-3 sm:mb-6">
                Crafted by you.
                <br />
                <span className="text-[#C9A24D]">Poured by Lumera.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#1C1C1C]/70 leading-relaxed mb-5 sm:mb-8 max-w-md mx-auto lg:mx-0">
                Design a candle that speaks your story. Choose every detail — from the jar that holds it
                to the fragrance that fills your space.
              </p>
              <motion.button
                type="button"
                onClick={onStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] bg-[#800020] text-[#C9A24D] font-sans text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#5c0017]"
              >
                <span>Start Designing Your Candle</span>
                <span>→</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Right: Visual - Video */}
        <div className="flex-1 relative bg-gradient-to-br from-[#E7DED4] to-[#D4CEC6] overflow-hidden min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-0 order-1 lg:order-2">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/candle-hero.mp4" type="video/mp4" />
            <source src="/videos/candle-hero.webm" type="video/webm" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Optional overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>
    </div>
  )
}

// ============== STEP COMPONENTS ==============

interface StepProps {
  config: CandleConfig
  updateConfig: <K extends keyof CandleConfig>(key: K, value: CandleConfig[K]) => void
  onNext?: () => void
  onBack?: () => void
}

function StepVessel({ config, updateConfig, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <header>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#800020] mb-2 sm:mb-3">
          Choose Your Foundation
        </h2>
        <p className="text-xs sm:text-sm text-[#1C1C1C]/70 max-w-lg leading-relaxed">
          The jar is more than a container — it's the first thing you see, touch and keep.
        </p>
      </header>

      {/* Vessel Cards - Always horizontal scroll on mobile, grid on desktop */}
      <div className="relative -mx-4 sm:-mx-2 lg:mx-0">
        {/* Scroll hint gradient - mobile only */}
        <div className="lg:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F6F1EB] to-transparent z-10 pointer-events-none" />

        <div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible px-4 sm:px-2 lg:px-0 py-2 snap-x snap-mandatory scrollbar-hide">
          {vesselOptions.map((vessel) => {
            const isSelected = config.vessel === vessel.id
            return (
              <button
                key={vessel.id}
                type="button"
                onClick={() => updateConfig('vessel', vessel.id)}
                className={clsx(
                  'relative p-3 sm:p-4 md:p-5 text-center transition-all duration-300 bg-white rounded-xl sm:rounded-2xl snap-start overflow-hidden',
                  'w-[160px] sm:w-[180px] flex-shrink-0 lg:flex-shrink lg:w-auto',
                  isSelected
                    ? 'ring-2 ring-inset ring-[#800020] shadow-sm'
                    : 'border border-[#1C1C1C]/10 hover:border-[#800020]/30'
                )}
              >
                {/* Checkmark for selected */}
                {isSelected && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-[#C9A24D] rounded-full flex items-center justify-center z-10">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Vessel Image */}
                <div className="h-24 sm:h-28 md:h-32 mb-3 flex items-center justify-center">
                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28">
                    <Image
                      src={vessel.imageSrc}
                      alt={vessel.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Vessel Info */}
                <h3 className="font-serif text-xs sm:text-sm text-[#800020] mb-1 sm:mb-2 break-words px-1">
                  {vessel.name}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-[#1C1C1C]/50 mb-2 sm:mb-3 leading-relaxed break-words px-1">
                  {vessel.material}
                </p>
                <p className="text-[10px] sm:text-xs text-[#800020]">
                  {vessel.priceDelta === 0 ? 'Included' : `+ ₹${vessel.priceDelta}`}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Scroll indicator - mobile only */}
      <p className="lg:hidden text-center text-[10px] sm:text-xs text-[#C9A24D]/70">
        ← Scroll to see more options →
      </p>
    </div>
  )
}

function StepFragrance({ config, updateConfig, onNext, onBack }: StepProps) {
  const currentFamily = fragranceFamilies[config.fragranceFamily]
  const families = Object.entries(fragranceFamilies) as [FragranceFamily, typeof currentFamily][]

  // Fragrance images - uses existing images, falls back to sandalwood for missing ones
  const defaultImage = '/images/custom/fragrances/sandalwood.jpg'
  const fragranceImages: Record<string, string> = {
    'bulgarian-rose': '/images/custom/fragrances/rose.jpg',
    'jasmine-night': '/images/custom/fragrances/jasmine.jpg',
    'lavender-dreams': '/images/custom/fragrances/rose.jpg', // fallback
    'sacred-oud': '/images/custom/fragrances/oud.jpg',
    'sandalwood-silk': '/images/custom/fragrances/sandalwood.jpg',
    'cedarwood-mist': '/images/custom/fragrances/sandalwood.jpg', // fallback to similar
    'morning-dew': '/images/custom/fragrances/jasmine.jpg', // fallback
    'sea-salt': '/images/custom/fragrances/sandalwood.jpg', // fallback
    'citrus-grove': '/images/custom/fragrances/jasmine.jpg', // fallback
    'amber-nights': '/images/custom/fragrances/oud.jpg', // fallback
    'saffron-rose': '/images/custom/fragrances/rose.jpg', // fallback
    'mystic-incense': '/images/custom/fragrances/oud.jpg', // fallback
    'vanilla-bean': '/images/custom/fragrances/sandalwood.jpg', // fallback
    'honey-almond': '/images/custom/fragrances/sandalwood.jpg', // fallback
    'coffee-cream': '/images/custom/fragrances/oud.jpg', // fallback
  }

  // Get all selected scent IDs (stored as comma-separated in primaryScent when blending)
  const getSelectedScents = (): string[] => {
    if (!config.primaryScent) return []
    if (config.fragranceMode === 'blend') {
      return config.primaryScent.split(',').filter(id => id.trim())
    }
    return [config.primaryScent]
  }

  // Handle fragrance selection - multi-select when blending is enabled
  const handleFragranceClick = (scentId: string) => {
    if (config.fragranceMode === 'blend') {
      // In blend mode, allow selecting multiple fragrances
      const currentSelections = getSelectedScents()
      
      if (currentSelections.includes(scentId)) {
        // Deselect - remove from array
        const newSelections = currentSelections.filter(id => id !== scentId)
        updateConfig('primaryScent', newSelections.length > 0 ? newSelections.join(',') : null)
      } else {
        // Select - add to array
        const newSelections = [...currentSelections, scentId]
        updateConfig('primaryScent', newSelections.join(','))
      }
    } else {
      // Single mode - just select one
      updateConfig('primaryScent', scentId)
    }
  }

  const isSelected = (scentId: string) => {
    return getSelectedScents().includes(scentId)
  }

  const getSelectionNumber = (scentId: string) => {
    const selections = getSelectedScents()
    const index = selections.indexOf(scentId)
    return index >= 0 ? index + 1 : 0
  }

  // Get selected scent names for display
  const getSelectedScentNames = () => {
    const selections = getSelectedScents()
    const allScents = Object.values(fragranceFamilies).flatMap(f => f.scents)
    const names = selections.map(id => {
      const scent = allScents.find(s => s.id === id)
      return scent?.name || ''
    }).filter(Boolean)
    return names.join(' + ')
  }

  const selectedCount = getSelectedScents().length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <header>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#800020]">
          Select Your Fragrance
        </h2>
        {config.fragranceMode === 'blend' && (
          <p className="text-xs sm:text-sm text-[#C9A24D] mt-2">
            Blend Mode: Select multiple fragrances to create your unique blend
          </p>
        )}
      </header>

      {/* Family tabs - Horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {families.map(([id, family]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              updateConfig('fragranceFamily', id)
              // Don't clear selections when switching tabs - allow cross-category selection
            }}
            className={clsx(
              'px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-sans transition-all rounded-lg whitespace-nowrap flex-shrink-0',
              config.fragranceFamily === id
                ? 'bg-[#800020] text-white'
                : 'bg-white text-[#1C1C1C]/70 hover:bg-[#1C1C1C]/5'
            )}
          >
            {family.name}
          </button>
        ))}
        {config.fragranceMode === 'blend' && (
          <button
            type="button"
            onClick={() => updateConfig('fragranceFamily', 'all' as FragranceFamily)}
            className={clsx(
              'px-5 py-2.5 text-sm font-sans transition-all rounded-lg',
              config.fragranceFamily === ('all' as FragranceFamily)
                ? 'bg-[#C9A24D] text-white'
                : 'bg-[#C9A24D]/20 text-[#C9A24D] hover:bg-[#C9A24D]/30'
            )}
          >
            All Scents
          </button>
        )}
      </div>

      {/* Selected Blend Display */}
      {config.fragranceMode === 'blend' && selectedCount > 0 && (
        <div className="bg-[#C9A24D]/10 rounded-xl p-4 border border-[#C9A24D]/30">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-[#1C1C1C]/50 uppercase tracking-wider">Your Blend</p>
            <span className="text-xs bg-[#C9A24D] text-white px-2 py-0.5 rounded-full">
              {selectedCount} selected
            </span>
          </div>
          <p className="font-serif text-lg text-[#800020]">{getSelectedScentNames()}</p>
        </div>
      )}

      {/* Fragrance Cards - Horizontal Scroll */}
      {config.fragranceMode === 'blend' && config.fragranceFamily === ('all' as FragranceFamily) ? (
        // Show all scents grouped by family when "All Scents" is selected
        <div className="space-y-6">
          {families.map(([familyId, family]) => (
            <div key={familyId}>
              <h4 className="text-sm font-sans text-[#1C1C1C]/50 uppercase tracking-wider mb-3">
                {family.name}
              </h4>
              <div className="relative -mx-2">
                <div className="flex gap-4 overflow-x-auto px-2 py-2 snap-x snap-mandatory scrollbar-hide">
                  {family.scents.map((scent) => {
                    const selected = isSelected(scent.id)
                    const selectionNum = getSelectionNumber(scent.id)
                    return (
                      <button
                        key={scent.id}
                        type="button"
                        onClick={() => handleFragranceClick(scent.id)}
                        className={clsx(
                          'relative flex-shrink-0 w-[140px] md:w-[160px] text-left transition-all duration-300 bg-white rounded-xl overflow-hidden snap-start',
                          selected
                            ? 'ring-2 ring-[#800020] shadow-md'
                            : 'border border-[#1C1C1C]/10 hover:border-[#800020]/30 hover:shadow-sm'
                        )}
                      >
                        <div className="relative h-24 md:h-28 bg-[#E7DED4] overflow-hidden">
                          <Image
                            src={fragranceImages[scent.id] || defaultImage}
                            alt={scent.name}
                            fill
                            className="object-cover object-center"
                            sizes="160px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#C9A24D] rounded-full flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">{selectionNum}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <h3 className="font-serif text-xs md:text-sm text-[#800020] line-clamp-1">
                            {scent.name}
                          </h3>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show current family scents
        <div className="relative -mx-2">
          <div className="flex gap-4 overflow-x-auto px-2 py-2 snap-x snap-mandatory scrollbar-hide">
            {currentFamily.scents.map((scent) => {
              const selected = isSelected(scent.id)
              const selectionNum = getSelectionNumber(scent.id)
              return (
                <button
                  key={scent.id}
                  type="button"
                  onClick={() => handleFragranceClick(scent.id)}
                className={clsx(
                  'relative flex-shrink-0 w-[160px] md:w-[180px] text-left transition-all duration-300 bg-white rounded-xl snap-start overflow-hidden',
                  selected
                    ? 'ring-2 ring-inset ring-[#800020] shadow-md'
                    : 'border border-[#1C1C1C]/10 hover:border-[#800020]/30 hover:shadow-sm'
                )}
                >
                  {/* Image */}
                  <div className="relative h-32 md:h-36 bg-[#E7DED4]">
                    <Image
                      src={fragranceImages[scent.id] || defaultImage}
                      alt={scent.name}
                      fill
                      className="object-cover object-center"
                      sizes="180px"
                    />
                    {selected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#C9A24D] rounded-full flex items-center justify-center">
                        {config.fragranceMode === 'blend' ? (
                          <span className="text-white text-xs font-bold">{selectionNum}</span>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-serif text-sm md:text-base text-[#800020] mb-1">
                      {scent.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[#1C1C1C]/50 leading-relaxed line-clamp-2 mb-2">
                      {scent.notes}
                    </p>
                    
                    {/* Icons/Tags Row */}
                    <div className="flex items-center gap-2 text-[#1C1C1C]/30">
                      <span className="text-xs">🌿</span>
                      <span className="text-xs">✨</span>
                      {scent.priceDelta >= 400 && <span className="text-xs">💎</span>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Advanced Craft Section */}
      <div className="pt-4 border-t border-[#1C1C1C]/10">
        <h3 className="font-serif text-lg text-[#1C1C1C] mb-3">Advanced Craft</h3>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={config.fragranceMode === 'blend'}
              onChange={(e) => {
                updateConfig('fragranceMode', e.target.checked ? 'blend' : 'single')
                if (!e.target.checked) {
                  // Keep only the first selection when disabling blend mode
                  const selections = getSelectedScents()
                  if (selections.length > 1) {
                    updateConfig('primaryScent', selections[0])
                  }
                }
              }}
              className="sr-only"
            />
            <div className={clsx(
              'w-5 h-5 border-2 rounded transition-all flex items-center justify-center',
              config.fragranceMode === 'blend'
                ? 'bg-[#800020] border-[#800020]'
                : 'border-[#1C1C1C]/30'
            )}>
              {config.fragranceMode === 'blend' && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-[#1C1C1C]/70">
            Blending is recommended for a deeper, more personal fragrance.
          </span>
        </label>
      </div>

    </div>
  )
}

function StepWax({ config, updateConfig, onNext, onBack }: StepProps) {
  // Wax icons and details
  const waxDetails: Record<string, {features: string[] }> = {
    'soy': {features: ['Luxe Scent Throw', 'Premium Blend'] },
    'coconut-blend': {features: ['Luxe Scent Throw', 'Premium Blend'] },
    'coconut-luxe': {features: ['Slow burn', 'Limited seasonal blend'] },
    'beeswax': {features: ['Natural & Rare', 'Golden glow'] },
  }

  // Wick icons and details
  const wickDetails: Record<string, {description: string }> = {
    'cotton': { description: 'Clean, steady flame' },
    'wooden-crackle': {description: 'Warm ambiance' },
    'dual-wick': {description: 'Balanced twin flame' },
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#800020] mb-2">
          Choose Wax & Wick
        </h2>
        <p className="text-xs sm:text-sm text-[#1C1C1C]/60">
          Ignite your ritual with the perfect burn.
        </p>
      </header>

      {/* WAX OPTIONS */}
      <div>
        <p className="text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase text-[#1C1C1C]/60 mb-3 sm:mb-4">
          WAX OPTIONS
        </p>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible">
          {waxTypes.map((wax) => {
            const isSelected = config.waxType === wax.id
            const details = waxDetails[wax.id] || { icon: '🕯️', features: ['Premium quality'] }
            const isLimited = wax.id === 'beeswax'

            return (
              <button
                key={wax.id}
                type="button"
                onClick={() => updateConfig('waxType', wax.id)}
                className={clsx(
                  'relative p-3 sm:p-4 md:p-5 text-center transition-all duration-300 rounded-xl sm:rounded-2xl bg-white',
                  'flex-shrink-0 w-[130px] sm:w-auto snap-start',
                  isSelected
                    ? 'ring-2 ring-inset ring-[#800020] shadow-sm'
                    : 'border border-[#1C1C1C]/10 hover:border-[#800020]/30'
                )}
              >
                {/* Limited Badge */}
                {isLimited && (
                  <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-[#E7DED4] text-[#1C1C1C]/60 text-[9px] uppercase tracking-wider rounded">
                    Limited
                  </span>
                )}
                
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-20 w-5 h-5 bg-[#C9A24D] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Name */}
                <h3 className="font-serif text-base text-[#1C1C1C] mb-2">
                  {wax.name.replace('Pure ', '').replace(' Wax', '').replace(' Blend', ' Soy')}
                </h3>
                
                {/* Features */}
                <div className="space-y-1 mb-3">
                  {details.features.map((feature, idx) => (
                    <p key={idx} className="text-xs text-[#1C1C1C]/50">
                      • {feature}
                    </p>
                  ))}
                </div>
                
                {/* Price */}
                <p className="text-sm text-[#800020]">
                  {wax.priceDelta === 0 ? 'Included' : `+ ₹${wax.priceDelta}`}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* WICK OPTIONS */}
      <div>
        <p className="text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase text-[#1C1C1C]/60 mb-3 sm:mb-4">
          WICK OPTIONS
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {wickTypes.map((wick) => {
            const isSelected = config.wickType === wick.id
            const details = wickDetails[wick.id] || { icon: '🕯️', description: 'Quality wick' }
            
            return (
              <button
                key={wick.id}
                type="button"
                onClick={() => updateConfig('wickType', wick.id)}
                className={clsx(
                  'relative p-3 sm:p-4 md:p-5 text-center transition-all duration-300 rounded-xl sm:rounded-2xl',
                  isSelected
                    ? 'bg-white ring-2 ring-inset ring-[#800020] shadow-sm'
                    : 'bg-white border border-[#1C1C1C]/10 hover:border-[#800020]/30'
                )}
              >
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#C9A24D] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Name */}
                <h3 className="font-serif text-xs sm:text-sm md:text-base text-[#1C1C1C] mb-0.5 sm:mb-1">
                  {wick.id === 'cotton'
                    ? 'Cotton'
                    : wick.id === 'wooden-crackle'
                    ? 'Crackle'
                    : 'Dual'}
                </h3>

                {/* Description - Hidden on very small screens */}
                <p className="hidden sm:block text-[10px] sm:text-xs text-[#1C1C1C]/50">
                  {details.description}
                </p>

                {/* Price (if not included) */}
                {wick.priceDelta > 0 && (
                  <p className="text-[10px] sm:text-xs text-[#800020] mt-1 sm:mt-2">
                    + ₹{wick.priceDelta}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}

function StepLabel({ config, updateConfig, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#800020] mb-2 sm:mb-3">
          Personalize Your Candle
        </h2>
        <p className="text-xs sm:text-sm text-[#1C1C1C]/60 max-w-md">
          Add a name, date, or special message.
        </p>
      </header>

      {/* Label Text */}
      <div>
        <label className="block text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase text-[#1C1C1C]/60 mb-2 sm:mb-3">
          Label Text
        </label>
        <input
          type="text"
          maxLength={40}
          value={config.labelText}
          onChange={(e) => updateConfig('labelText', e.target.value)}
          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white border border-[#1C1C1C]/10 text-[#800020] font-serif text-base sm:text-lg focus:border-[#C9A24D] focus:outline-none transition-colors rounded-lg"
          placeholder="Your Special Moment"
        />
        <p className="mt-2 text-[10px] sm:text-xs text-[#1C1C1C]/40">
          Up to 40 characters
        </p>
      </div>

      {/* Foil Finish */}
      <div>
        <p className="text-[10px] sm:text-xs font-sans tracking-[0.15em] uppercase text-[#1C1C1C]/60 mb-3 sm:mb-4">
          Foil Finish (Optional)
        </p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
          {foilFinishes.map((foil) => {
            const isSelected = config.foilFinish === foil.id
            return (
              <button
                key={foil.id}
                type="button"
                onClick={() => updateConfig('foilFinish', foil.id)}
                className={clsx(
                  'px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-sans tracking-[0.1em] uppercase transition-all rounded-lg',
                  isSelected
                    ? 'bg-[#800020] text-white'
                    : 'bg-white border border-[#1C1C1C]/10 hover:border-[#C9A24D]/50'
                )}
              >
                {foil.name}
                {foil.priceDelta > 0 && (
                  <span className="ml-1 sm:ml-2 text-[#C9A24D]">+₹{foil.priceDelta}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface StepPackagingProps extends StepProps {
  onAddToCart: () => void
  isAddingToCart: boolean
  canSubmit: boolean
}

function StepPackaging({ config, updateConfig }: StepPackagingProps) {
  const toggleFinishingTouch = (touchId: string) => {
    const current = config.finishingTouches
    if (current.includes(touchId)) {
      updateConfig('finishingTouches', current.filter((id) => id !== touchId))
    } else {
      updateConfig('finishingTouches', [...current, touchId])
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#800020] mb-2">
          Finishing Touches
        </h2>
        <p className="text-xs sm:text-sm text-[#1C1C1C]/60">
          Add optional extras to make your candle even more special.
        </p>
      </header>

      {/* Finishing Touch Add-ons - Checkbox Style */}
      <div className="space-y-2 sm:space-y-3">
        {finishingTouchOptions.map((touch) => {
          const isSelected = config.finishingTouches.includes(touch.id)

          return (
            <label
              key={touch.id}
              className={clsx(
                'flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200',
                isSelected
                  ? 'bg-white ring-2 ring-[#800020] shadow-sm'
                  : 'bg-white border border-[#1C1C1C]/10 hover:border-[#C9A24D]/50'
              )}
            >
              {/* Checkbox */}
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleFinishingTouch(touch.id)}
                  className="sr-only"
                />
                <div className={clsx(
                  'w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 transition-all flex items-center justify-center',
                  isSelected
                    ? 'bg-[#C9A24D] border-[#C9A24D]'
                    : 'border-[#1C1C1C]/30'
                )}>
                  {isSelected && (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm sm:text-base text-[#1C1C1C]">
                  {touch.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-[#1C1C1C]/50 mt-0.5 line-clamp-1 sm:line-clamp-none">
                  {touch.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-xs sm:text-sm font-medium text-[#C9A24D] flex-shrink-0">
                + ₹{touch.priceDelta}
              </div>
            </label>
          )
        })}
      </div>

      {/* Selected count */}
      {config.finishingTouches.length > 0 && (
        <div className="text-center text-xs sm:text-sm text-[#1C1C1C]/60">
          {config.finishingTouches.length} finishing touch{config.finishingTouches.length > 1 ? 'es' : ''} selected
        </div>
      )}
    </div>
  )
}
