'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  image: string
  quantity: number
  collection?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  orderNote: string
  setOrderNote: (note: string) => void
  orderNoteFee: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'lumera-cart'

const ORDER_NOTE_STORAGE_KEY = 'lumera-order-note'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [orderNote, setOrderNote] = useState('')

  // Load cart and order note from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    const savedNote = localStorage.getItem(ORDER_NOTE_STORAGE_KEY)
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart from localStorage')
      }
    }
    if (savedNote) {
      setOrderNote(savedNote)
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  // Save order note to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ORDER_NOTE_STORAGE_KEY, orderNote)
    }
  }, [orderNote, isLoaded])

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }

      return [...prevItems, { ...item, quantity }]
    })

    // Open cart drawer when adding item
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = items.find((i) => i.id === id)
    return item?.quantity || 0
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Charge ₹49 if order note is filled
  const orderNoteFee = orderNote.trim().length > 0 ? 49 : 0

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        orderNote,
        setOrderNote,
        orderNoteFee,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
