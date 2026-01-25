import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature, fetchPaymentDetails } from '@/lib/razorpay'
import { sendMail } from '@/lib/sendMail'

// State code mapping for Payload CMS
const stateCodeMap: Record<string, string> = {
  'Delhi': 'DL',
  'Maharashtra': 'MH',
  'Karnataka': 'KA',
  'Tamil Nadu': 'TN',
  'Telangana': 'TG',
  'Gujarat': 'GJ',
  'Rajasthan': 'RJ',
  'Uttar Pradesh': 'UP',
  'West Bengal': 'WB',
  'Madhya Pradesh': 'MP',
  'Bihar': 'BR',
  'Punjab': 'PB',
  'Haryana': 'HR',
  'Kerala': 'KL',
  'Andhra Pradesh': 'AP',
  'Odisha': 'OR',
  'Assam': 'AS',
  'Jharkhand': 'JH',
  'Chhattisgarh': 'CT',
  'Uttarakhand': 'UK',
  'Goa': 'GA',
  'Tripura': 'TR',
  'Meghalaya': 'ML',
  'Manipur': 'MN',
  'Nagaland': 'NL',
  'Himachal Pradesh': 'HP',
  'Arunachal Pradesh': 'AR',
  'Mizoram': 'MZ',
  'Sikkim': 'SK',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body

    console.log('Verify payment request received:', {
      razorpay_order_id,
      razorpay_payment_id,
      hasSignature: !!razorpay_signature,
    })

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing payment parameters')
      return NextResponse.json(
        { success: false, error: 'Missing payment verification parameters' },
        { status: 400 }
      )
    }

    // Verify the payment signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })

    console.log('Signature verification result:', isValid)

    if (!isValid) {
      console.error('Invalid payment signature')
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Fetch payment details from Razorpay to confirm payment status
    let paymentStatus = 'captured'
    try {
      const paymentDetails = await fetchPaymentDetails(razorpay_payment_id)
      paymentStatus = paymentDetails.status
      console.log('Payment details fetched:', { status: paymentStatus })
    } catch (fetchError) {
      console.warn('Could not fetch payment details, proceeding with verified signature')
    }

    // Generate order number
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const orderNumber = `LUM${year}${month}${random}`

    // Try to save to database, but don't fail if it doesn't work
    try {
      const { getPayload } = await import('payload')
      const config = (await import('@payload-config')).default
      const payload = await getPayload({ config })

      // Convert state name to code if needed
      const stateValue = orderData?.shippingAddress?.state || 'DL'
      const stateCode = stateCodeMap[stateValue] || stateValue

      await payload.create({
        collection: 'orders',
        data: {
          orderNumber,
          customer: {
            email: orderData?.email || '',
            phone: orderData?.phone || '',
            firstName: orderData?.firstName || '',
            lastName: orderData?.lastName || '',
          },
          shippingAddress: {
            addressLine1: orderData?.shippingAddress?.addressLine1 || '',
            addressLine2: orderData?.shippingAddress?.addressLine2 || '',
            city: orderData?.shippingAddress?.city || '',
            state: stateCode,
            pincode: orderData?.shippingAddress?.pincode || '',
            country: 'India',
          },
          sameAsShipping: true,
          items: (orderData?.items || []).map((item: {
            id: string
            name: string
            quantity: number
            price: number
          }) => ({
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.quantity * item.price,
          })),
          pricing: {
            subtotal: orderData?.subtotal || 0,
            discount: {
              code: orderData?.couponCode || '',
              amount: orderData?.couponDiscount || 0,
            },
            shipping: {
              method: orderData?.shippingCost === 0 ? 'free' : 'standard',
              cost: orderData?.shippingCost || 0,
            },
            total: orderData?.total || 0,
          },
          payment: {
            method: 'card',
            status: 'completed',
            transactionId: razorpay_payment_id,
            merchantTransactionId: razorpay_order_id,
            paidAt: new Date().toISOString(),
          },
          status: 'confirmed',
          customerNotes: orderData?.orderNote || '',
        },
      })
      console.log('Order saved to database:', orderNumber)

      // Send order confirmation email
      try {
        const itemsList = (orderData?.items || []).map((item: any) => 
          `- ${item.name} (x${item.quantity}): ₹${item.price * item.quantity}`
        ).join('\n')

        const emailMessage = `Dear ${orderData?.firstName || 'Customer'},\n\n` +
          `Thank you for your order with Lumera Candles! Your order has been successfully placed.\n\n` +
          `Order Number: ${orderNumber}\n` +
          `Order Total: ₹${orderData?.total || 0}\n\n` +
          `Items Ordered:\n${itemsList}\n\n` +
          `Shipping Address:\n` +
          `${orderData?.shippingAddress?.addressLine1}\n` +
          `${orderData?.shippingAddress?.addressLine2 ? orderData.shippingAddress.addressLine2 + '\n' : ''}` +
          `${orderData?.shippingAddress?.city}, ${stateValue} - ${orderData?.shippingAddress?.pincode}\n\n` +
          `We will notify you once your order is shipped.\n\n` +
          `Best regards,\nThe Lumera Team`

        await sendMail({
          to: orderData?.email || '',
          subject: `Order Confirmed - ${orderNumber}`,
          message: emailMessage,
        })
        console.log('Order confirmation email sent to:', orderData?.email)
      } catch (mailError) {
        console.error('Failed to send order confirmation email (non-fatal):', mailError)
      }
    } catch (dbError: any) {
      // Log the error but don't fail the payment verification
      console.error('Database save error (non-fatal):', dbError.message)
    }

    // Return success - payment was verified
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: orderNumber,
      paymentId: razorpay_payment_id,
      paymentStatus,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Payment verification failed',
      },
      { status: 500 }
    )
  }
}
