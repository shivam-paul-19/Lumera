'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  Smartphone,
  MapPin,
  Check,
  Loader2,
  Tag,
} from 'lucide-react'
import { useCart, useAuth, useOrders } from '@/context'
import CustomSelect from '@/components/ui/CustomSelect'

interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
}

const indianStates = [
  'Delhi'
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart, orderNote, orderNoteFee } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { addOrder } = useOrders()

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'cod'>('phonepe')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))

      // Use default address if available
      const defaultAddress = user.addresses?.find((addr) => addr.isDefault)
      if (defaultAddress) {
        setShippingAddress({
          fullName: defaultAddress.name || user.name || '',
          phone: defaultAddress.phone || user.phone || '',
          email: user.email || '',
          addressLine1: defaultAddress.addressLine1 || '',
          addressLine2: defaultAddress.addressLine2 || '',
          city: defaultAddress.city || '',
          state: defaultAddress.state || '',
          pincode: defaultAddress.pincode || '',
        })
      }
    }
  }, [isAuthenticated, user])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/collections')
    }
  }, [items, router, orderPlaced])

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const shippingThreshold = 999
  const shippingCost = subtotal >= shippingThreshold ? 0 : 99
  const totalAmount = subtotal + shippingCost + orderNoteFee - couponDiscount

  const validateShipping = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {}

    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number'
    }

    if (!shippingAddress.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!shippingAddress.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required'
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!shippingAddress.state) {
      newErrors.state = 'State is required'
    }

    if (!shippingAddress.pincode.trim()) {
      newErrors.pincode = 'PIN code is required'
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit PIN code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep('payment')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const applyCoupon = () => {
    // Demo coupon logic
    if (couponCode.toUpperCase() === 'LUMERA10') {
      setCouponDiscount(Math.round(subtotal * 0.1))
      setCouponApplied(true)
    } else if (couponCode.toUpperCase() === 'FIRST20') {
      setCouponDiscount(Math.round(subtotal * 0.2))
      setCouponApplied(true)
    } else {
      alert('Invalid coupon code')
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order ID
    const newOrderId = 'LUM' + Date.now().toString(36).toUpperCase()
    setOrderId(newOrderId)

    // Save order to local history
    addOrder({
      id: newOrderId,
      items,
      total: totalAmount,
      paymentMethod,
      shippingAddress,
    })

    if (paymentMethod === 'phonepe') {
      // Simulate PhonePe payment redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Clear cart and show confirmation
    clearCart()
    setOrderPlaced(true)
    setStep('confirmation')
    setIsProcessing(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Order confirmation view
  if (step === 'confirmation' && orderPlaced) {
    return (
      <div className="min-h-screen bg-cream-100 pt-24 pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{
              backgroundColor: 'rgba(201, 162, 77, 0.15)', // Light Golden Mist
              border: '1px solid #C9A24D'               // Elegant Gold Border
            }}>
              <Check className="w-10 h-10" style={{ color: '#800020' }} />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-burgundy-700 mb-4">
              Thank You for Your Order!
            </h1>

            <p className="text-lg font-sans text-burgundy-700/70 mb-2">
              Your order has been placed successfully.
            </p>

            <p className="font-sans text-burgundy-700 mb-8">
              Order ID: <span className="font-medium">{orderId}</span>
            </p>

            <div className="bg-cream-200/50 p-6 mb-8 text-left">
              <h3 className="font-serif text-lg text-burgundy-700 mb-4">
                Shipping Address
              </h3>
              <p className="font-sans text-burgundy-700/80">
                {shippingAddress.fullName}
                <br />
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 && (
                  <>
                    <br />
                    {shippingAddress.addressLine2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state} -{' '}
                {shippingAddress.pincode}
                <br />
                Phone: {shippingAddress.phone}
              </p>
            </div>

            <p className="text-sm font-sans text-burgundy-700/60 mb-8">
              A confirmation email has been sent to{' '}
              <span className="text-burgundy-700">{shippingAddress.email}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collections" className="btn-primary">
                Continue Shopping
              </Link>
              {isAuthenticated && (
                <Link
                  href="/account"
                  className="btn-secondary"
                >
                  View Orders
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-sans text-burgundy-700/70 hover:text-burgundy-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <h1 className="font-serif text-3xl md:text-4xl text-burgundy-700">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans ${
                  step === 'shipping'
                    ? 'bg-burgundy-700 text-cream-100'
                    : 'bg-burgundy-700/20 text-burgundy-700'
                }`}
              >
                {step !== 'shipping' ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-sans text-burgundy-700">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-burgundy-700/20" />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans ${
                  step === 'payment'
                    ? 'bg-burgundy-700 text-cream-100'
                    : 'bg-burgundy-700/20 text-burgundy-700'
                }`}
              >
                2
              </div>
              <span className="text-sm font-sans text-burgundy-700">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Form */}
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 md:p-8 shadow-luxury"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-burgundy-700" />
                  <h2 className="font-serif text-xl text-burgundy-700">
                    Shipping Address
                  </h2>
                </div>

                {/* Saved Addresses */}
                {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                  <div className="mb-6 p-4 bg-cream-100 border border-burgundy-700/10">
                    <p className="text-sm font-sans text-burgundy-700/70 mb-3">
                      Select from saved addresses:
                    </p>
                    <div className="space-y-2">
                      {user.addresses.map((addr) => (
                        <button
                          key={addr.id}
                          onClick={() =>
                            setShippingAddress({
                              fullName: addr.name || user.name || '',
                              phone: addr.phone || user.phone || '',
                              email: user.email || '',
                              addressLine1: addr.addressLine1 || '',
                              addressLine2: addr.addressLine2 || '',
                              city: addr.city || '',
                              state: addr.state || '',
                              pincode: addr.pincode || '',
                            })
                          }
                          className="w-full text-left p-3 border border-burgundy-700/10 hover:border-burgundy-700/30 transition-colors text-sm font-sans text-burgundy-700/80"
                        >
                          <span className="font-medium">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="ml-2 text-xs bg-burgundy-700/10 px-2 py-0.5">
                              Default
                            </span>
                          )}
                          <br />
                          {addr.addressLine1}, {addr.city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          fullName: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 bg-cream-100 border ${
                        errors.fullName
                          ? 'border-red-500'
                          : 'border-burgundy-700/10'
                      } text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                        })
                      }
                      className={`w-full px-4 py-3 bg-cream-100 border ${
                        errors.phone
                          ? 'border-red-500'
                          : 'border-burgundy-700/10'
                      } text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30`}
                      placeholder="10-digit phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 bg-cream-100 border ${
                        errors.email
                          ? 'border-red-500'
                          : 'border-burgundy-700/10'
                      } text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          addressLine1: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 bg-cream-100 border ${
                        errors.addressLine1
                          ? 'border-red-500'
                          : 'border-burgundy-700/10'
                      } text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30`}
                      placeholder="House/Flat No., Building, Street"
                    />
                    {errors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine2}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          addressLine2: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-cream-100 border border-burgundy-700/10 text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30"
                      placeholder="Near landmark, Area"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 bg-cream-100 border ${
                        errors.city ? 'border-red-500' : 'border-burgundy-700/10'
                      } text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30`}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      State *
                    </label>
                    <CustomSelect
                      options={indianStates.map((state) => ({ label: state, value: state }))}
                      value={shippingAddress.state}
                      onChange={(value) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: value,
                        })
                      }
                      placeholder="Select state"
                      error={!!errors.state}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
                        })
                      }
                      className={`w-full px-4 py-3 bg-cream-100 border ${
                        errors.pincode
                          ? 'border-red-500'
                          : 'border-burgundy-700/10'
                      } text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30`}
                      placeholder="6-digit PIN code"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  className="btn-primary w-full mt-8"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Payment Section */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 md:p-8 shadow-luxury"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5 text-burgundy-700" />
                  <h2 className="font-serif text-xl text-burgundy-700">
                    Payment Method
                  </h2>
                </div>

                {/* Shipping Address Summary */}
                <div className="mb-6 p-4 bg-cream-100 border border-burgundy-700/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-sans text-burgundy-700/50 mb-1">
                        Shipping to:
                      </p>
                      <p className="font-sans text-burgundy-700">
                        {shippingAddress.fullName}
                        <br />
                        {shippingAddress.addressLine1}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state} -{' '}
                        {shippingAddress.pincode}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-sm font-sans text-burgundy-700 underline hover:no-underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  {/* PhonePe */}
                  <label
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'phonepe'
                        ? 'border-burgundy-700 bg-burgundy-700/5'
                        : 'border-burgundy-700/10 hover:border-burgundy-700/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="phonepe"
                      checked={paymentMethod === 'phonepe'}
                      onChange={() => setPaymentMethod('phonepe')}
                      className="w-4 h-4 text-burgundy-700"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-sans font-medium text-burgundy-700">
                          PhonePe / UPI
                        </p>
                        <p className="text-sm font-sans text-burgundy-700/60">
                          Pay using UPI, Cards, or Net Banking
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-sans px-2 py-1" style={{ backgroundColor: 'rgba(201, 162, 77, 0.2)', color: '#800020' }}>
                      Recommended
                    </span>
                  </label>

                  {/* Cash on Delivery */}
                  {/* <label
                    className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-burgundy-700 bg-burgundy-700/5'
                        : 'border-burgundy-700/10 hover:border-burgundy-700/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-burgundy-700"
                    /> */}
                    {/* <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-burgundy-700/10 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-burgundy-700" />
                      </div>
                      <div> */}
                        {/* <p className="font-sans font-medium text-burgundy-700">
                          Cash on Delivery
                        </p> */}
                        {/* <p className="text-sm font-sans text-burgundy-700/60">
                          Pay when your order arrives
                        </p> */}
                      {/* </div>
                    </div>
                  </label> */}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep('shipping')}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order - {formatPrice(totalAmount)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar - Luxury Redesign */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 md:p-8 shadow-luxury sticky top-24">
              {/* Header with elegant typography */}
              <h2 className="font-serif text-xl md:text-2xl tracking-wide text-burgundy-700 mb-6 md:mb-8 text-center">
                Order Summary
              </h2>

              {/* Items - Image | Name | Qty | Price all on same line */}
              <div className="space-y-3 mb-8 max-h-72 overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {/* Product image */}
                    <div
                      className="relative flex-shrink-0 rounded-sm overflow-hidden"
                      style={{
                        width: '48px',
                        height: '48px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(201, 162, 77, 0.3)'
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Product name */}
                    <p className="flex-1 min-w-0 font-serif text-sm text-burgundy-700 line-clamp-1">
                      {item.name}
                    </p>
                    {/* Quantity */}
                    <p className="text-xs font-sans text-warmgray-800/50 flex-shrink-0">
                      x{item.quantity}
                    </p>
                    {/* Price */}
                    <p className="font-sans text-sm font-medium text-burgundy-700 flex-shrink-0 min-w-[70px] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code - Refined styling */}
              <div className="mb-6 md:mb-8">
                {!couponApplied ? (
                  <div className="flex gap-2 md:gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#C9A24D' }} />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="w-full pl-10 pr-4 py-3 min-h-[48px] bg-ivory-100 text-sm font-sans text-burgundy-700 placeholder:text-burgundy-700/40 focus:outline-none transition-all"
                        style={{
                          border: '0.5px solid rgba(201, 162, 77, 0.4)',
                          backgroundColor: '#F6F1EB'
                        }}
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode}
                      className="px-4 md:px-5 py-3 min-h-[48px] text-sm font-sans font-medium tracking-wider uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: '#800020',
                        color: '#F6F1EB'
                      }}
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between p-3.5 rounded-sm"
                    style={{
                      backgroundColor: 'rgba(201, 162, 77, 0.1)',
                      border: '0.5px solid rgba(201, 162, 77, 0.3)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: '#C9A24D' }} />
                      <span className="text-sm font-sans text-burgundy-700">
                        {couponCode} applied
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCouponApplied(false)
                        setCouponCode('')
                        setCouponDiscount(0)
                      }}
                      className="text-sm font-sans text-burgundy-700/60 hover:text-burgundy-700 transition-colors underline-offset-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-xs font-sans text-burgundy-700/40 mt-2.5 tracking-wide">
                  Try: LUMERA10 or FIRST20
                </p>
              </div>

              {/* Pricing - with elegant gold dividers */}
              <div className="space-y-3 pt-6" style={{ borderTop: '0.5px solid rgba(201, 162, 77, 0.3)' }}>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-burgundy-700/60 tracking-wide">Subtotal</span>
                  <span className="text-burgundy-700">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm font-sans">
                  <span className="text-burgundy-700/60 tracking-wide">Shipping</span>
                  <span className="text-burgundy-700">
                    {shippingCost === 0 ? (
                      <span style={{ color: '#C9A24D' }}>Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {orderNoteFee > 0 && (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-burgundy-700/60 tracking-wide">Gift Note</span>
                    <span className="text-burgundy-700">{formatPrice(orderNoteFee)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm font-sans">
                    <span style={{ color: '#C9A24D' }}>Discount</span>
                    <span style={{ color: '#C9A24D' }}>
                      -{formatPrice(couponDiscount)}
                    </span>
                  </div>
                )}

                {/* Total with prominent styling */}
                <div
                  className="flex justify-between items-baseline pt-4 mt-2"
                  style={{ borderTop: '0.5px solid rgba(201, 162, 77, 0.3)' }}
                >
                  <span className="font-serif text-lg tracking-wide text-burgundy-700">Total</span>
                  <span className="font-sans text-xl font-semibold text-burgundy-700">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Trust Badges - Luxury colors */}
              <div
                className="mt-8 pt-6 space-y-3"
                style={{ borderTop: '0.5px solid rgba(201, 162, 77, 0.3)' }}
              >
                <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                  <Shield className="w-4 h-4" style={{ color: '#C9A24D' }} />
                  <span className="tracking-wide">Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-sans text-burgundy-700/70">
                  <Truck className="w-4 h-4" style={{ color: '#1C1C1C' }} />
                  <span className="tracking-wide">
                    {shippingCost === 0
                      ? 'Free shipping on this order'
                      : 'Free shipping on orders above ₹999'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}