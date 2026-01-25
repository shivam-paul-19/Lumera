import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
})

export interface CreateOrderRequest {
  amount: number // Amount in rupees
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

/**
 * Create a Razorpay order
 * @param request - Order details including amount in rupees
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
  request: CreateOrderRequest
): Promise<RazorpayOrder> {
  const options = {
    amount: Math.round(request.amount * 100), // Convert to paise
    currency: request.currency || 'INR',
    receipt: request.receipt,
    notes: request.notes || {},
  }

  const order = await razorpayInstance.orders.create(options)
  return order as RazorpayOrder
}

/**
 * Verify Razorpay payment signature
 * @param params - Payment verification parameters
 * @returns boolean indicating if signature is valid
 */
export function verifyPaymentSignature(
  params: PaymentVerificationRequest
): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params

  // Create the signature string
  const body = razorpay_order_id + '|' + razorpay_payment_id

  // Generate expected signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  // Compare signatures
  return expectedSignature === razorpay_signature
}

/**
 * Fetch payment details from Razorpay
 * @param paymentId - Razorpay payment ID
 * @returns Payment details
 */
export async function fetchPaymentDetails(paymentId: string) {
  const payment = await razorpayInstance.payments.fetch(paymentId)
  return payment
}

/**
 * Fetch order details from Razorpay
 * @param orderId - Razorpay order ID
 * @returns Order details
 */
export async function fetchOrderDetails(orderId: string) {
  const order = await razorpayInstance.orders.fetch(orderId)
  return order
}

/**
 * Initiate a refund
 * @param paymentId - Razorpay payment ID
 * @param amount - Refund amount in rupees (optional, full refund if not provided)
 * @param notes - Optional notes for the refund
 * @returns Refund details
 */
export async function initiateRefund(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  const refundOptions: {
    amount?: number
    speed?: 'normal' | 'optimum'
    notes?: Record<string, string>
  } = {
    speed: 'normal',
    notes: notes || {},
  }

  if (amount) {
    refundOptions.amount = Math.round(amount * 100) // Convert to paise
  }

  const refund = await razorpayInstance.payments.refund(paymentId, refundOptions)
  return refund
}

/**
 * Generate a unique order receipt ID
 * @returns Unique receipt string
 */
export function generateReceiptId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `LUM${timestamp}${random}`.toUpperCase()
}

export { razorpayInstance }
