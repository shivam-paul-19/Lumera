'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  tagline?: string
  pricing: {
    price: number
    compareAtPrice?: number
  }
  images: Array<{
    image: {
      url: string
      alt?: string
    }
    isPrimary?: boolean
  }>
  productCollection?: {
    name: string
  }
  bestSeller?: boolean
  newArrival?: boolean
  inventory?: {
    quantity: number
  }
  promoTag?: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?featured=true&limit=4')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.docs || [])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Don't render the section if no products
  if (!loading && products.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-lumera-ivory">
      <div className="px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <p
            className="text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4"
            style={{ color: 'rgba(128, 0, 32, 0.6)' }}
          >
            Handpicked for You
          </p>
          <h2
            className="font-serif mb-4 md:mb-6"
            style={{ color: '#800020' }}
          >
            Featured Candles
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mb-4 md:mb-6"
            style={{ background: 'linear-gradient(to right, #800020, #C9A24D)' }}
          />
          <p
            className="max-w-xl md:max-w-2xl mx-auto font-sans text-base leading-relaxed"
            style={{ color: 'rgba(128, 0, 32, 0.7)' }}
          >
            Discover our most loved fragrances — each one crafted to transform your
            space and elevate your everyday moments.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => {
              const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
              const imageUrl = primaryImage?.image?.url || '/placeholder-candle.jpg'

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Link href={`/products/${product.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-200 mb-4">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.promoTag && (
                          <span className="px-2 py-1 text-[10px] tracking-wider uppercase bg-[#1e3a5f] text-white font-bold animate-pulse">
                            {product.promoTag}
                          </span>
                        )}
                        {product.bestSeller && (
                          <span className="px-2 py-1 text-[10px] tracking-wider uppercase bg-[#800020] text-[#C9A24D]">
                            Best Seller
                          </span>
                        )}
                        {product.newArrival && (
                          <span className="px-2 py-1 text-[10px] tracking-wider uppercase bg-[#C9A24D] text-[#800020]">
                            New
                          </span>
                        )}
                        {product.pricing.compareAtPrice && product.pricing.compareAtPrice > product.pricing.price && (
                          <span className="px-2 py-1 text-[10px] tracking-wider uppercase bg-green-600 text-white">
                            Sale
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                      {product.productCollection && (
                        <p className="text-[10px] tracking-widest uppercase text-[#C9A24D] mb-1">
                          {product.productCollection.name}
                        </p>
                      )}
                      <h3 className="font-serif text-lg text-[#800020] mb-1 group-hover:text-[#C9A24D] transition-colors">
                        {product.name}
                      </h3>
                      {product.tagline && (
                        <p className="text-sm text-[#800020]/60 mb-2 italic">
                          {product.tagline}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium text-[#800020]">
                          ₹{product.pricing.price.toLocaleString('en-IN')}
                        </span>
                        {product.pricing.compareAtPrice && product.pricing.compareAtPrice > product.pricing.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.pricing.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 md:mt-12"
        >
          <Link
            href="/collections"
            className="btn-primary"
            style={{ backgroundColor: '#800020', color: '#C9A24D' }}
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
