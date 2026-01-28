'use client'

import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Clock,
  Share2,
  Check
} from 'lucide-react'
import { useCart, useWishlist } from '@/context'

interface Product {
  id: string
  name: string
  slug: string
  tagline?: string
  description: string
  pricing: {
    price: number
    compareAtPrice?: number
  }
  images: Array<{
    image: {
      id: string
      url: string
      alt?: string
    }
    isPrimary?: boolean
  }>
  productCollection?: {
    name: string
    slug: string
  }
  fragrance?: {
    topNotes?: Array<{ note: string }>
    heartNotes?: Array<{ note: string }>
    baseNotes?: Array<{ note: string }>
    family?: string
    intensity?: string
    fragranceFamily?: string
    scentIntensity?: string
  }
  specifications: {
    burnTime: { minimum: number; maximum: number }
    weight: { value: number; unit: string }
    dimensions: { height: number; diameter: number }
    waxType: string
    wickType: string
    containerMaterial?: string 
    isHandmade?: boolean
    isVegan?: boolean
    isCrueltyFree?: boolean
  }
  careInstructions?: Array<{ instruction: string }>
  isNew?: boolean // newArrival
  newArrival?: boolean
  isBestSeller?: boolean // bestSeller
  bestSeller?: boolean
  inventory?: {
    quantity: number
  }
  promoTag?: string
}

function ImageWithFallback(props: any) {
  const { src, fallbackSrc, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...rest}
      src={imgSrc || (fallbackSrc || '/favicon.svg')}
      onError={() => {
        setImgSrc(fallbackSrc || '/favicon.svg')
      }}
    />
  )
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'care'>('description')
  const [isAdded, setIsAdded] = useState(false)
  
  const { addToCart, setIsCartOpen } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await fetch(`/api/products?slug=${slug}`)
        if (!res.ok) {
           setError(true)
           setLoading(false)
           return
        }
        const data = await res.json()
        if (data.docs && data.docs.length > 0) {
          setProduct(data.docs[0])
        } else {
          setError(true)
        }
      } catch (err) {
        console.error("Failed to fetch product", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
     return (
        <>
            <Header />
            <main className="pt-20 min-h-screen flex items-center justify-center bg-cream-100">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-burgundy-700/20 rounded-full mb-4"></div>
                    <p className="font-serif text-burgundy-700">Loading candle...</p>
                </div>
            </main>
            <Footer />
        </>
     )
  }

  if (error || !product) {
    return notFound()
  }

  // Derived Values
  const price = product.pricing.price || 0
  const compareAtPrice = product.pricing.compareAtPrice
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  
  const collectionName = product.productCollection?.name || 'Collection'
  const collectionSlug = product.productCollection?.slug || 'all'
  
  // Normalize fragrance data
  const fragranceFamily = product.fragrance?.fragranceFamily || product.fragrance?.family || 'Signature' 
  const fragranceIntensity = product.fragrance?.scentIntensity || product.fragrance?.intensity || 'Moderate'
  const topNotes = product.fragrance?.topNotes?.map(n => n.note).join(', ') || ''
  const heartNotes = product.fragrance?.heartNotes?.map(n => n.note).join(', ') || ''
  const baseNotes = product.fragrance?.baseNotes?.map(n => n.note).join(', ') || ''

  // Normalize Images
  // Ensure we have at least one image
  const displayImages = product.images && product.images.length > 0 
    ? product.images.map(img => `/api/media/${img.image.id}/view`) 
    : ['/placeholder-candle.jpg']

  // Ensure stock
  const stockQty = product.inventory?.quantity || 0
  const inStock = stockQty > 0
  
  // Normalize features from specs
  const features = []
  if (product.specifications.waxType) features.push(product.specifications.waxType) // e.g. "Soy & Coconut Blend"
  if (product.specifications.isHandmade) features.push('Hand-poured in small batches')
  if (product.specifications.wickType) features.push(product.specifications.wickType)
  features.push('Phthalate-free fragrance') // Assumption based on brand
  if (product.specifications.isVegan) features.push('Vegan & Cruelty-free')
  if (product.specifications.containerMaterial) features.push(`Reusable ${product.specifications.containerMaterial} container`)


  const isNew = product.newArrival || product.isNew
  const isBestSeller = product.bestSeller || product.isBestSeller

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-cream-200/50 py-4">
          <div className="section-container">
            <nav className="flex items-center gap-2 text-sm font-sans">
              <Link href="/" className="text-burgundy-700/50 hover:text-burgundy-700">
                Home
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <Link href="/collections" className="text-burgundy-700/50 hover:text-burgundy-700">
                Collections
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <Link href={`/collections?collection=${collectionSlug}`} className="text-burgundy-700/50 hover:text-burgundy-700">
                {collectionName}
              </Link>
              <span className="text-burgundy-700/30">/</span>
              <span className="text-burgundy-700">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="section-spacing bg-cream-100">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden bg-cream-200 mb-4">
                  <ImageWithFallback
                    src={displayImages[selectedImage] || '/placeholder-candle.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.promoTag && (
                      <span className="px-3 py-1 bg-[#1e3a5f] text-white text-xs font-sans font-bold tracking-wider uppercase animate-pulse">
                        {product.promoTag}
                      </span>
                    )}
                    {isNew && (
                      <span className="px-3 py-1 bg-burgundy-700 text-cream-100 text-xs font-sans tracking-wider uppercase">
                        New
                      </span>
                    )}
                    {isBestSeller && (
                      <span className="px-3 py-1 bg-champagne-500 text-burgundy-700 text-xs font-sans tracking-wider uppercase">
                        Best Seller
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-3 py-1 bg-burgundy-700/90 text-cream-100 text-xs font-sans tracking-wider">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnails - Larger on mobile for touch targets */}
                {displayImages.length > 1 && (
                    <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    {displayImages.map((image, index) => (
                        <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-all ${
                            selectedImage === index
                            ? 'border-burgundy-700'
                            : 'border-transparent hover:border-burgundy-700/30'
                        }`}
                        >
                        <ImageWithFallback
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                        </button>
                    ))}
                    </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link
                  href={`/collections?collection=${collectionSlug}`}
                  className="text-sm font-sans tracking-wider uppercase text-burgundy-700/50 hover:text-burgundy-700 transition-colors"
                >
                  {collectionName} Collection
                </Link>

                <h1 className="font-serif text-3xl md:text-4xl text-burgundy-700 mt-2 mb-2">
                  {product.name}
                </h1>
                
                {product.tagline && (
                    <p className="font-serif text-lg text-champagne-600 italic mb-4">
                    {product.tagline}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-serif text-3xl text-burgundy-700">
                    {formatPrice(price)}
                  </span>
                  {compareAtPrice && compareAtPrice > price && (
                    <span className="font-sans text-lg text-burgundy-700/40 line-through">
                      {formatPrice(compareAtPrice)}
                    </span>
                  )}
                </div>

                {/* Fragrance Family */}
                {product.fragrance && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-sm font-sans">
                      <div className="flex items-center gap-2">
                        <span className="text-burgundy-700/60">Fragrance Family:</span>
                        <span className="text-burgundy-700 capitalize">{fragranceFamily}</span>
                      </div>
                      <span className="hidden sm:inline text-burgundy-700/30">|</span>
                      <div className="flex items-center gap-2">
                        <span className="text-burgundy-700/60">Intensity:</span>
                        <span className="text-burgundy-700 capitalize">{fragranceIntensity}</span>
                      </div>
                    </div>
                )}

                {/* Fragrance Notes */}
                {product.fragrance && (
                    <div className="mb-6 p-4 bg-cream-200/50 border border-burgundy-700/10">
                    <p className="text-xs font-sans tracking-wider uppercase text-burgundy-700/50 mb-3">
                        Fragrance Notes
                    </p>
                    <div className="space-y-2 text-sm font-sans">
                        {topNotes && (
                            <p>
                                <span className="text-burgundy-700/60">Top:</span>{' '}
                                <span className="text-burgundy-700">{topNotes}</span>
                            </p>
                        )}
                        {heartNotes && (
                        <p>
                            <span className="text-burgundy-700/60">Heart:</span>{' '}
                            <span className="text-burgundy-700">{heartNotes}</span>
                        </p>
                        )}
                        {baseNotes && (
                        <p>
                            <span className="text-burgundy-700/60">Base:</span>{' '}
                            <span className="text-burgundy-700">{baseNotes}</span>
                        </p>
                        )}
                    </div>
                    </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Quantity - Touch-friendly buttons */}
                  <div className="flex items-center border border-burgundy-700/20">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 min-w-[48px] min-h-[48px] hover:bg-burgundy-700/5 transition-colors flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-burgundy-700" />
                    </button>
                    <span className="w-14 text-center font-sans text-burgundy-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(stockQty, quantity + 1))}
                      className="p-4 min-w-[48px] min-h-[48px] hover:bg-burgundy-700/5 transition-colors flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-burgundy-700" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    disabled={!inStock || isAdded}
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        slug: slug,
                        price: price,
                        image: displayImages[0],
                        collection: collectionName,
                      }, quantity)
                      setIsAdded(true)
                      setTimeout(() => {
                        setIsAdded(false)
                        setIsCartOpen(true)
                      }, 500)
                    }}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id)
                      } else {
                        addToWishlist({
                          id: product.id,
                          name: product.name,
                          slug: slug,
                          price: price,
                          image: displayImages[0],
                          collection: collectionName,
                        })
                      }
                    }}
                    className={`p-3 border transition-all duration-300 ${
                      isInWishlist(product.id)
                        ? 'bg-burgundy-700 border-burgundy-700 text-cream-100'
                        : 'border-burgundy-700/20 text-burgundy-700 hover:border-burgundy-700'
                    }`}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Stock Status */}
                {inStock && stockQty <= 10 && (
                  <p className="text-sm font-sans text-burgundy-700/70 mb-6">
                    Only {stockQty} left in stock
                  </p>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <Truck className="w-5 h-5 text-burgundy-700" />
                    <span>Free shipping over ₹999</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <RotateCcw className="w-5 h-5 text-burgundy-700" />
                    <span>7-day returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <Shield className="w-5 h-5 text-burgundy-700" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                    <Clock className="w-5 h-5 text-burgundy-700" />
                    <span>{product.specifications?.burnTime?.minimum || 40}-{product.specifications?.burnTime?.maximum || 60}h burn time</span>
                  </div>
                </div>

                {/* Share */}
                <button className="flex items-center gap-2 text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share this product
                </button>
              </motion.div>
            </div>

            {/* Tabs */}
            <div className="mt-16">
              <div className="flex border-b border-burgundy-700/10">
                {(['description', 'details', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-sans tracking-wider uppercase transition-all ${
                      activeTab === tab
                        ? 'text-burgundy-700 border-b-2 border-burgundy-700'
                        : 'text-burgundy-700/50 hover:text-burgundy-700'
                    }`}
                  >
                    {tab === 'description' ? 'Description' : tab === 'details' ? 'Details' : 'Care Instructions'}
                  </button>
                ))}
              </div>

                <div className="py-8">
                    {activeTab === 'description' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-sans text-burgundy-700/80 leading-relaxed max-w-3xl"
                        >
                            <p>{product.description}</p>
                            
                            {features.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="font-serif text-xl text-burgundy-700 mb-4">Why you'll love it</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-700" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'details' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-sans text-burgundy-700/80 max-w-3xl"
                        >
                           <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                               {product.specifications?.weight && (
                                   <div className="flex justify-between border-b border-burgundy-700/10 pb-2">
                                       <dt className="text-burgundy-700/60">Weight</dt>
                                       <dd className="font-medium text-burgundy-700">
                                            {product.specifications.weight.value} {product.specifications.weight.unit}
                                       </dd>
                                   </div>
                               )}
                               {product.specifications?.dimensions && (
                                   <div className="flex justify-between border-b border-burgundy-700/10 pb-2">
                                       <dt className="text-burgundy-700/60">Dimensions</dt>
                                       <dd className="font-medium text-burgundy-700">
                                           {product.specifications.dimensions.height}cm H x {product.specifications.dimensions.diameter}cm D
                                       </dd>
                                   </div>
                               )}
                               {product.specifications?.waxType && (
                                   <div className="flex justify-between border-b border-burgundy-700/10 pb-2">
                                       <dt className="text-burgundy-700/60">Wax Type</dt>
                                       <dd className="font-medium text-burgundy-700 capitalize">
                                           {product.specifications.waxType.replace('-', ' ')}
                                       </dd>
                                   </div>
                               )}
                               {product.specifications?.wickType && (
                                   <div className="flex justify-between border-b border-burgundy-700/10 pb-2">
                                       <dt className="text-burgundy-700/60">Wick Type</dt>
                                       <dd className="font-medium text-burgundy-700 capitalize">
                                            {product.specifications.wickType.replace('-', ' ')}
                                       </dd>
                                   </div>
                               )}
                               {product.specifications?.containerMaterial && (
                                   <div className="flex justify-between border-b border-burgundy-700/10 pb-2">
                                       <dt className="text-burgundy-700/60">Container</dt>
                                       <dd className="font-medium text-burgundy-700 capitalize">
                                           {product.specifications.containerMaterial}
                                       </dd>
                                   </div>
                               )}
                           </dl>
                        </motion.div>
                    )}

                    {activeTab === 'care' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-sans text-burgundy-700/80 max-w-3xl"
                        >
                            <h3 className="font-serif text-xl text-burgundy-700 mb-4">Candle Care Tips</h3>
                             <ul className="space-y-3">
                                {product.careInstructions && product.careInstructions.map((item, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-burgundy-700/10 text-burgundy-700 text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <p>{item.instruction}</p>
                                    </li>
                                ))}
                                {(!product.careInstructions || product.careInstructions.length === 0) && (
                                    <p>No specific care instructions provided.</p>
                                )}
                             </ul>
                        </motion.div>
                    )}
                </div>
            </div>
          </div>
        </section>
        </main>
      <Footer />
    </>
  )
}
