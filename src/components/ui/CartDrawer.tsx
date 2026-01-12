'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { useCart } from '@/context'

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    orderNote,
    setOrderNote,
    orderNoteFee,
  } = useCart()

  const [isNoteOpen, setIsNoteOpen] = useState(false)

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const shippingThreshold = 999
  const freeShipping = subtotal >= shippingThreshold
  const amountToFreeShipping = shippingThreshold - subtotal

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-lumera-charcoal/20 backdrop-blur-sm z-50"
          />

          {/* Slide-in Drawer - Full width on mobile */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full md:max-w-md bg-lumera-ivory z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-lumera-charcoal/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-lumera-burgundy" />
                <h2 className="font-serif text-xl text-lumera-burgundy">
                  Your Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-lumera-charcoal/60 hover:text-lumera-charcoal transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {!freeShipping && items.length > 0 && (
              <div className="px-4 md:px-6 py-3 bg-lumera-beige/50 border-b border-lumera-charcoal/10">
                <p className="text-sm font-sans text-lumera-charcoal/70 mb-2">
                  Add {formatPrice(amountToFreeShipping)} more for free shipping!
                </p>
                <div className="h-2 bg-lumera-charcoal/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#800020' }}
                  />
                </div>
              </div>
            )}

            {freeShipping && items.length > 0 && (
              <div className="px-4 md:px-6 py-3 border-b" style={{ backgroundColor: 'rgba(201, 162, 77, 0.1)', borderColor: 'rgba(201, 162, 77, 0.3)' }}>
                <p className="text-sm font-sans text-lumera-charcoal flex items-center gap-2">
                  <span style={{ color: '#C9A24D' }}>✓</span> You've unlocked free shipping!
                </p>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-lumera-charcoal/20 mb-4" />
                  <p className="font-serif text-xl text-lumera-burgundy mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-base font-sans text-lumera-charcoal/60 mb-6 leading-relaxed">
                    Discover our handcrafted candles and add some luxury to your life.
                  </p>
                  <Link
                    href="/collections"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center justify-center px-8 py-4 min-h-[48px] font-sans font-medium text-sm tracking-wider uppercase transition-all duration-300"
                    style={{ backgroundColor: '#4A0404', color: '#C9A24D' }}
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-lumera-beige overflow-hidden"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div>
                            {item.collection && (
                              <p className="text-xs font-sans text-lumera-charcoal/50 uppercase tracking-wider">
                                {item.collection}
                              </p>
                            )}
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={() => setIsCartOpen(false)}
                              className="font-serif text-lg text-lumera-burgundy hover:text-burgundy-700 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-lumera-charcoal/40 hover:text-lumera-charcoal transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="font-serif text-base text-lumera-charcoal">
                            {formatPrice(item.price)}
                          </span>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <>
                              <span className="font-serif text-sm text-lumera-charcoal/40 line-through">
                                {formatPrice(item.compareAtPrice)}
                              </span>
                              <span className="text-xs font-sans font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                {Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quantity - Touch-friendly buttons */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-lumera-charcoal/20">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-lumera-beige transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-lumera-charcoal" />
                            </button>
                            <span className="w-10 text-center text-base font-sans text-lumera-charcoal">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-lumera-beige transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-lumera-charcoal" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <p className="text-sm text-lumera-charcoal/60 mt-2">
                          <span className="font-sans mr-1">Total:</span>
                          <span className="font-serif">{formatPrice(item.price * item.quantity)}</span>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-lumera-charcoal/10 bg-lumera-ivory">
                {/* Leave A Note With Order */}
                <div className="px-4 md:px-6 pt-4 pb-2">
                  <button
                    onClick={() => setIsNoteOpen(!isNoteOpen)}
                    className="flex items-center gap-2 py-2 min-h-[44px] text-sm font-sans text-lumera-charcoal hover:text-lumera-burgundy transition-colors"
                  >
                    <span>Leave A Note With Order</span>
                    <span className="text-xs font-sans px-2 py-0.5" style={{ backgroundColor: 'rgba(201, 162, 77, 0.2)', color: '#800020' }}>₹49</span>
                    {isNoteOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isNoteOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <textarea
                          value={orderNote}
                          onChange={(e) => setOrderNote(e.target.value)}
                          placeholder="Add gift messages..."
                          className="w-full mt-3 p-4 min-h-[100px] bg-lumera-beige/50 border border-lumera-charcoal/10 text-lumera-charcoal placeholder:text-lumera-charcoal/40 font-sans text-base resize-none focus:outline-none focus:border-lumera-burgundy transition-colors"
                          rows={3}
                          maxLength={500}
                        />
                        <p className="text-xs text-lumera-charcoal/40 mt-1 text-right">
                          {orderNote.length}/500
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subtotal & Shipping */}
                <div className="px-4 md:px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sans text-base text-lumera-charcoal/70">Subtotal</span>
                    <span className="font-serif font-medium text-lg text-lumera-charcoal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {orderNoteFee > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-base text-lumera-charcoal/70">Gift Note</span>
                      <span className="font-serif text-lumera-charcoal">
                        {formatPrice(orderNoteFee)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-sans text-base text-lumera-charcoal/70">Shipping</span>
                    <span className="font-serif text-lumera-charcoal">
                      {freeShipping ? (
                        <span style={{ color: '#C9A24D' }}>Free</span>
                      ) : (
                        'Calculated at checkout'
                      )}
                    </span>
                  </div>

                  {/* Checkout Button - Burgundy 900 with Gold text, prominent */}
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full flex items-center justify-center py-4 min-h-[56px] text-base font-sans font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg mb-3"
                    style={{ backgroundColor: '#4A0404', color: '#C9A24D' }}
                  >
                    Checkout - {formatPrice(subtotal + orderNoteFee)}
                  </Link>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3 min-h-[48px] text-center text-base font-sans text-lumera-charcoal/60 hover:text-lumera-burgundy transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
