'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCart, useWishlist } from '@/context'

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  tagline?: string
  price: number
  compareAtPrice?: number
  image: string
  hoverImage?: string
  productCollection?: string
  fragrance?: {
    topNotes?: string[]
    heartNotes?: string[]
    baseNotes?: string[]
  }
  specifications?: {
    burnTime?: {
      minimum: number
      maximum: number
    }
    weight?: {
      value: number
      unit: string
    }
    waxType?: string
  }
  isNew?: boolean
  isBestSeller?: boolean
  inStock?: boolean
  promoTag?: string
}

export default function ProductCard({
  id,
  name,
  slug,
  tagline,
  price,
  compareAtPrice,
  image,
  hoverImage,
  productCollection,
  fragrance,
  specifications,
  isNew = false,
  isBestSeller = false,
  inStock = true,
  promoTag,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const isWishlisted = isInWishlist(id)

  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inStock) {
      addToCart({
        id,
        name,
        slug,
        price,
        compareAtPrice,
        image,
        collection: productCollection,
      })
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist({
      id,
      name,
      slug,
      price,
      compareAtPrice,
      image,
      collection: productCollection,
      tagline,
    })
  }

  return (
    <motion.article
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Image Container - Full width on mobile, aspect-square */}
      <div className="relative aspect-square md:aspect-product overflow-hidden bg-lumera-beige mb-4">
        {/* Main Image */}
        <Link href={`/products/${slug}`} className="block h-full">
          <Image
            src={image}
            alt={name}
            fill
            priority={false}
            className={`object-cover transition-all duration-700 ${
              isHovered && hoverImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Hover Image */}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={`${name} - alternate view`}
              fill
              className={`object-cover transition-all duration-700 absolute inset-0 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </Link>

        {/* Badges - Gold accent for "New Arrival" */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {promoTag && (
            <span 
              className="px-3 py-1 text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase shadow-md animate-pulse"
              style={{ 
                backgroundColor: '#1e3a5f', /* Lumera Deep Blue */
                color: '#FFFFFF',
                border: '1px solid #1e3a5f'
              }}
            >
              {promoTag}
            </span>
          )}
          {isNew && (
            <span 
              className="px-3 py-1 text-xs font-sans tracking-wider uppercase"
              style={{ 
                backgroundColor: '#C9A24D', /* Champagne Gold */
                color: '#1C1C1C',
                border: '1px solid #C9A24D'
              }}
            >
              New Arrival
            </span>
          )}
          {isBestSeller && (
            <span 
              className="px-3 py-1 text-xs font-sans tracking-wider uppercase"
              style={{ 
                backgroundColor: '#800020', /* Burgundy 815 */
                color: '#F6F1EB'
              }}
            >
              Best Seller
            </span>
          )}
          {discount > 0 && (
            <span 
              className="px-3 py-1 text-xs font-sans tracking-wider"
              style={{ 
                backgroundColor: '#800020', /* Burgundy 815 */
                color: '#F6F1EB'
              }}
            >
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="px-3 py-1 bg-gray-600 text-white text-xs font-sans tracking-wider uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button - Always visible on mobile, hover on desktop */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-burgundy-800 text-lumera-ivory'
              : 'bg-white/90 text-lumera-charcoal md:opacity-0 md:group-hover:opacity-100'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Add to Cart Button - Visible only on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-3 min-h-[48px] flex items-center justify-center gap-2 text-sm font-sans font-medium tracking-wider uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              inStock
                ? 'bg-lumera-burgundy text-lumera-gold hover:bg-burgundy-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Collection Tag */}
        {productCollection && (
          <p className="text-xs font-sans tracking-wider uppercase text-lumera-charcoal/50">
            {productCollection}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${slug}`}>
          <h3 className="font-serif text-lg md:text-xl text-burgundy-815 hover:text-burgundy-700 transition-colors duration-300 leading-relaxed">
            {name}
          </h3>
        </Link>

        {/* Tagline */}
        {tagline && (
          <p className="text-sm font-sans text-lumera-charcoal/60 italic leading-relaxed">{tagline}</p>
        )}

        {/* Fragrance Notes Preview */}
        {fragrance?.topNotes && fragrance.topNotes.length > 0 && (
          <p className="text-xs font-sans text-lumera-charcoal/50">
            {fragrance.topNotes.slice(0, 3).join(' · ')}
          </p>
        )}

        {/* Specifications */}
        {specifications && (
          <div className="flex items-center gap-4 text-xs font-sans text-lumera-charcoal/50">
            {specifications.burnTime && (
              <span>{specifications.burnTime.minimum}-{specifications.burnTime.maximum}h burn</span>
            )}
            {specifications.weight && (
              <span>{specifications.weight.value}{specifications.weight.unit}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 pt-2">
          <span className="font-sans font-medium text-base text-lumera-charcoal">
            {formatPrice(price)}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="font-sans text-sm text-lumera-charcoal/40 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
