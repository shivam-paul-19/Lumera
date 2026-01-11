'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Header, Footer } from '@/components/layout'
import ProductCard, { ProductCardProps } from '@/components/ui/ProductCard'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import CustomSelect from '@/components/ui/CustomSelect'
import { placeholderImages } from '@/lib/placeholders'

// Extended product type with filter attributes
interface ExtendedProduct extends ProductCardProps {
  mood?: string[]
  occasion?: string[]
  fragranceFamily?: string
}

// Sample products data - in production this would come from Payload CMS
const allProducts: ExtendedProduct[] = [
  {
    id: '1',
    name: 'Vanilla Dreams',
    slug: 'vanilla-dreams',
    tagline: 'A warm embrace of comfort',
    price: 1299,
    compareAtPrice: 1599,
    image: placeholderImages.products.vanillaDreams,
    hoverImage: placeholderImages.products.vanillaDreamsAlt,
    collection: 'Signature',
    fragrance: {
      topNotes: ['Vanilla Bean', 'Caramel'],
      heartNotes: ['Sandalwood', 'Coconut'],
      baseNotes: ['Musk', 'Amber'],
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
    },
    isBestSeller: true,
    inStock: true,
    mood: ['calm', 'romantic'],
    occasion: ['self-rituals', 'home-ambience'],
    fragranceFamily: 'woody',
  },
  {
    id: '2',
    name: 'Rose Garden',
    slug: 'rose-garden',
    tagline: 'Petals of pure elegance',
    price: 1499,
    image: placeholderImages.products.roseGarden,
    collection: 'Moments',
    fragrance: {
      topNotes: ['Bulgarian Rose', 'Peony'],
      heartNotes: ['Jasmine', 'Lily'],
      baseNotes: ['White Musk', 'Cedar'],
    },
    specifications: {
      burnTime: { minimum: 50, maximum: 60 },
      weight: { value: 250, unit: 'g' },
    },
    isNew: true,
    inStock: true,
    mood: ['romantic', 'uplifting'],
    occasion: ['gifting', 'self-rituals'],
    fragranceFamily: 'floral',
  },
  {
    id: '3',
    name: 'Midnight Oud',
    slug: 'midnight-oud',
    tagline: 'Mystery in every flame',
    price: 2499,
    image: placeholderImages.products.midnightOud,
    collection: 'Signature',
    fragrance: {
      topNotes: ['Bergamot', 'Saffron'],
      heartNotes: ['Oud', 'Rose'],
      baseNotes: ['Sandalwood', 'Amber'],
    },
    specifications: {
      burnTime: { minimum: 55, maximum: 65 },
      weight: { value: 300, unit: 'g' },
    },
    inStock: true,
    mood: ['grounding', 'romantic'],
    occasion: ['festive', 'gifting'],
    fragranceFamily: 'woody',
  },
  {
    id: '4',
    name: 'Citrus Burst',
    slug: 'citrus-burst',
    tagline: 'Morning sunshine captured',
    price: 999,
    image: placeholderImages.products.citrusBurst,
    collection: 'Ritual',
    fragrance: {
      topNotes: ['Lemon', 'Orange', 'Grapefruit'],
      heartNotes: ['Green Tea', 'Mint'],
      baseNotes: ['White Cedar', 'Musk'],
    },
    specifications: {
      burnTime: { minimum: 35, maximum: 45 },
      weight: { value: 150, unit: 'g' },
    },
    inStock: true,
    mood: ['uplifting', 'celebratory'],
    occasion: ['home-ambience', 'self-rituals'],
    fragranceFamily: 'fruity',
  },
  {
    id: '5',
    name: 'Lavender Fields',
    slug: 'lavender-fields',
    tagline: 'Peace in purple blooms',
    price: 1199,
    image: placeholderImages.products.lavenderFields,
    collection: 'Ritual',
    fragrance: {
      topNotes: ['French Lavender', 'Eucalyptus'],
      heartNotes: ['Chamomile', 'Violet'],
      baseNotes: ['Vanilla', 'Tonka Bean'],
    },
    specifications: {
      burnTime: { minimum: 40, maximum: 50 },
      weight: { value: 180, unit: 'g' },
    },
    inStock: true,
    mood: ['calm', 'grounding'],
    occasion: ['self-rituals', 'home-ambience'],
    fragranceFamily: 'floral',
  },
  {
    id: '6',
    name: 'Ocean Breeze',
    slug: 'ocean-breeze',
    tagline: 'Waves of tranquility',
    price: 1099,
    image: placeholderImages.products.oceanBreeze,
    collection: 'Ritual',
    fragrance: {
      topNotes: ['Sea Salt', 'Bergamot'],
      heartNotes: ['Jasmine', 'Lily of the Valley'],
      baseNotes: ['Driftwood', 'White Musk'],
    },
    specifications: {
      burnTime: { minimum: 40, maximum: 50 },
      weight: { value: 180, unit: 'g' },
    },
    inStock: true,
    mood: ['calm', 'uplifting'],
    occasion: ['home-ambience', 'self-rituals'],
    fragranceFamily: 'fresh',
  },
  {
    id: '7',
    name: 'Warm Amber',
    slug: 'warm-amber',
    tagline: 'Golden warmth within',
    price: 1399,
    image: placeholderImages.products.warmAmber,
    collection: 'Moments',
    fragrance: {
      topNotes: ['Orange Zest', 'Cinnamon'],
      heartNotes: ['Amber', 'Honey'],
      baseNotes: ['Vanilla', 'Sandalwood'],
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
    },
    isBestSeller: true,
    inStock: true,
    mood: ['romantic', 'grounding'],
    occasion: ['festive', 'home-ambience'],
    fragranceFamily: 'woody',
  },
  {
    id: '8',
    name: 'Forest Pine',
    slug: 'forest-pine',
    tagline: 'Nature\'s embrace',
    price: 1299,
    image: placeholderImages.products.forestPine,
    collection: 'Moments',
    fragrance: {
      topNotes: ['Pine Needle', 'Eucalyptus'],
      heartNotes: ['Cedarwood', 'Fir Balsam'],
      baseNotes: ['Moss', 'Vetiver'],
    },
    specifications: {
      burnTime: { minimum: 45, maximum: 55 },
      weight: { value: 200, unit: 'g' },
    },
    inStock: true,
    mood: ['grounding', 'calm'],
    occasion: ['home-ambience', 'self-rituals'],
    fragranceFamily: 'fresh',
  },
  {
    id: '9',
    name: 'Royal Jasmine',
    slug: 'royal-jasmine',
    tagline: 'Elegance personified',
    price: 2999,
    image: placeholderImages.products.royalJasmine,
    collection: 'Signature',
    fragrance: {
      topNotes: ['Indian Jasmine', 'Neroli'],
      heartNotes: ['Tuberose', 'Ylang Ylang'],
      baseNotes: ['Sandalwood', 'White Musk'],
    },
    specifications: {
      burnTime: { minimum: 60, maximum: 70 },
      weight: { value: 350, unit: 'g' },
    },
    isNew: true,
    inStock: true,
    mood: ['romantic', 'celebratory'],
    occasion: ['gifting', 'festive'],
    fragranceFamily: 'floral',
  },
]

const collections = [
  { name: 'All', slug: 'all' },
  { name: 'Signature', slug: 'signature' },
  { name: 'Moments', slug: 'moments' },
  { name: 'Ritual', slug: 'ritual' },
]

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]

const filterOptions = {
  mood: {
    label: 'By Mood',
    options: [
      { label: 'Calm', value: 'calm' },
      { label: 'Romantic', value: 'romantic' },
      { label: 'Grounding', value: 'grounding' },
      { label: 'Uplifting', value: 'uplifting' },
      { label: 'Celebratory', value: 'celebratory' },
    ],
  },
  occasion: {
    label: 'By Occasion',
    options: [
      { label: 'Gifting', value: 'gifting' },
      { label: 'Self Rituals', value: 'self-rituals' },
      { label: 'Home Ambience', value: 'home-ambience' },
      { label: 'Festive', value: 'festive' },
    ],
  },
  fragranceFamily: {
    label: 'By Fragrance Family',
    options: [
      { label: 'Floral', value: 'floral' },
      { label: 'Fruity', value: 'fruity' },
      { label: 'Woody', value: 'woody' },
      { label: 'Fresh', value: 'fresh' },
    ],
  },
  price: {
    label: 'By Price',
    options: [
      { label: '₹499–₹999', value: '499-999' },
      { label: '₹999–₹1,499', value: '999-1499' },
      { label: '₹1,499+', value: '1499+' },
    ],
  },
}

// Filter section component
function FilterSection({
  title,
  options,
  selected,
  onChange,
  isOpen,
  onToggle,
}: {
  title: string
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (value: string) => void
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-burgundy-700/10 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-sm font-sans font-medium tracking-wide uppercase text-burgundy-700">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-burgundy-700/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-burgundy-700/60" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => onChange(option.value)}
                    className="w-4 h-4 rounded border-burgundy-700/30 text-burgundy-700 focus:ring-burgundy-700 focus:ring-offset-0"
                  />
                  <span className="text-sm font-sans text-burgundy-700/70 group-hover:text-burgundy-700 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CollectionsContent() {
  const searchParams = useSearchParams()
  const collectionParam = searchParams.get('collection')

  const [activeCollection, setActiveCollection] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>(['mood', 'occasion', 'fragranceFamily', 'price'])
  const [selectedFilters, setSelectedFilters] = useState({
    mood: [] as string[],
    occasion: [] as string[],
    fragranceFamily: [] as string[],
    price: [] as string[],
  })

  // Set active collection from URL parameter
  useEffect(() => {
    if (collectionParam && ['signature', 'moments', 'ritual'].includes(collectionParam)) {
      setActiveCollection(collectionParam)
    }
  }, [collectionParam])

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category as keyof typeof prev]
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [category]: currentFilters.filter((f) => f !== value),
        }
      } else {
        return {
          ...prev,
          [category]: [...currentFilters, value],
        }
      }
    })
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const clearFilters = () => {
    setSelectedFilters({
      mood: [],
      occasion: [],
      fragranceFamily: [],
      price: [],
    })
  }

  const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr.length > 0)
  const activeFilterCount = Object.values(selectedFilters).flat().length

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Collection filter
    if (activeCollection !== 'all' && product.collection?.toLowerCase() !== activeCollection) {
      return false
    }

    // Mood filter
    if (selectedFilters.mood.length > 0) {
      if (!product.mood || !selectedFilters.mood.some((m) => product.mood?.includes(m))) {
        return false
      }
    }

    // Occasion filter
    if (selectedFilters.occasion.length > 0) {
      if (!product.occasion || !selectedFilters.occasion.some((o) => product.occasion?.includes(o))) {
        return false
      }
    }

    // Fragrance Family filter
    if (selectedFilters.fragranceFamily.length > 0) {
      if (!product.fragranceFamily || !selectedFilters.fragranceFamily.includes(product.fragranceFamily)) {
        return false
      }
    }

    // Price filter
    if (selectedFilters.price.length > 0) {
      const matchesPrice = selectedFilters.price.some((range) => {
        if (range === '499-999') return product.price >= 499 && product.price <= 999
        if (range === '999-1499') return product.price >= 999 && product.price <= 1499
        if (range === '1499+') return product.price >= 1499
        return false
      })
      if (!matchesPrice) return false
    }

    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'newest':
        return a.isNew ? -1 : 1
      default:
        return a.isBestSeller ? -1 : 1
    }
  })

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative h-64 md:h-80 bg-cream-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-700/10 to-transparent" />
          <div className="section-container h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm font-sans tracking-wide-luxury uppercase text-burgundy-700/60 mb-2">
                Explore Our
              </p>
              <h1 className="font-serif text-burgundy-700 mb-4">Collections</h1>
              <p className="text-burgundy-700/70 font-sans max-w-md">
                Discover handcrafted candles designed to elevate every moment of your day.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="section-spacing">
          <div className="section-container">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4 mb-8 md:mb-10 pb-6 border-b border-burgundy-700/10">
              {/* Collection Tabs - Scrollable on mobile */}
              <div className="-mx-6 px-6 overflow-x-auto scrollbar-hide md:mx-0 md:px-0">
                <div className="flex gap-2 min-w-max md:flex-wrap">
                  {collections.map((collection) => (
                    <button
                      key={collection.slug}
                      onClick={() => setActiveCollection(collection.slug)}
                      className={`px-4 py-3 min-h-[48px] text-sm font-sans tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                        activeCollection === collection.slug
                          ? 'bg-burgundy-700 border border-burgundy-700'
                          : 'bg-transparent text-burgundy-700 border border-burgundy-700/20 hover:border-burgundy-700'
                      }`}
                      style={activeCollection === collection.slug ? { color: '#FFFFFF' } : undefined}
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort & Filter Options */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 md:justify-end">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 min-h-[48px] border transition-all duration-300 ${
                    showFilters || hasActiveFilters
                      ? 'bg-burgundy-700 border-burgundy-700'
                      : 'bg-transparent text-burgundy-700 border-burgundy-700/20 hover:border-burgundy-700'
                  }`}
                  style={showFilters || hasActiveFilters ? { color: '#FFFFFF' } : undefined}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-sans tracking-wider uppercase">
                    Filters
                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                  </span>
                </button>

                <CustomSelect
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="min-w-[180px]"
                />

                <span className="text-sm text-burgundy-700/60 ml-auto md:ml-0">
                  {sortedProducts.length} products
                </span>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="bg-cream-100 border border-burgundy-700/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-serif text-xl text-burgundy-700">Filter By</h3>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 underline transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Mood Filter */}
                      <FilterSection
                        title={filterOptions.mood.label}
                        options={filterOptions.mood.options}
                        selected={selectedFilters.mood}
                        onChange={(value) => handleFilterChange('mood', value)}
                        isOpen={openSections.includes('mood')}
                        onToggle={() => toggleSection('mood')}
                      />

                      {/* Occasion Filter */}
                      <FilterSection
                        title={filterOptions.occasion.label}
                        options={filterOptions.occasion.options}
                        selected={selectedFilters.occasion}
                        onChange={(value) => handleFilterChange('occasion', value)}
                        isOpen={openSections.includes('occasion')}
                        onToggle={() => toggleSection('occasion')}
                      />

                      {/* Fragrance Family Filter */}
                      <FilterSection
                        title={filterOptions.fragranceFamily.label}
                        options={filterOptions.fragranceFamily.options}
                        selected={selectedFilters.fragranceFamily}
                        onChange={(value) => handleFilterChange('fragranceFamily', value)}
                        isOpen={openSections.includes('fragranceFamily')}
                        onToggle={() => toggleSection('fragranceFamily')}
                      />

                      {/* Price Filter */}
                      <FilterSection
                        title={filterOptions.price.label}
                        options={filterOptions.price.options}
                        selected={selectedFilters.price}
                        onChange={(value) => handleFilterChange('price', value)}
                        isOpen={openSections.includes('price')}
                        onToggle={() => toggleSection('price')}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(selectedFilters).map(([category, values]) =>
                  values.map((value) => {
                    const filterGroup = filterOptions[category as keyof typeof filterOptions]
                    const option = filterGroup.options.find((o) => o.value === value)
                    return (
                      <button
                        key={`${category}-${value}`}
                        onClick={() => handleFilterChange(category, value)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-700/10 text-burgundy-700 text-sm font-sans rounded-full hover:bg-burgundy-700/20 transition-colors"
                      >
                        <span>{option?.label}</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )
                  })
                )}
              </div>
            )}

            {/* Products Grid */}
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8"
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </motion.div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-burgundy-700/60 font-sans mb-4">
                  No products found matching your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-sans text-burgundy-700 underline hover:no-underline transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-100" />}>
      <CollectionsContent />
    </Suspense>
  )
}