import { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { sendMail } from '../../lib/sendMail'

const sendOrderConfirmation: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  if (operation === 'create') {
    try {
      const itemsList = doc.items
        .map(
          (item: any) =>
            `- ${item.productName} (x${item.quantity}): ₹${item.totalPrice}`,
        )
        .join('\n')

      await sendMail({
        to: doc.customer.email,
        subject: `Order Confirmation - ${doc.orderNumber}`,
        message: `Dear ${doc.customer.firstName},\n\nThank you for your order!\n\nOrder Number: ${doc.orderNumber}\n\nItems:\n${itemsList}\n\nTotal Amount: ₹${doc.pricing.total}\n\nWe will notify you when your order is shipped.\n\nBest regards,\nLumera Candles`,
      })
    } catch (error) {
      console.error('Error sending order confirmation:', error)
    }
  }
  return doc
}


export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer.firstName', 'pricing.total', 'status', 'payment.status', 'createdAt'],
    listSearchableFields: ['orderNumber', 'customer.email', 'customer.phone'],
    group: 'Shop',
    description: 'View and manage customer orders',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true, // Allow order creation from frontend
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // Order Identification
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order Number',
      admin: {
        readOnly: true,
        description: 'Auto-generated order number',
      },
    },

    // Customer Information
    {
      type: 'group',
      name: 'customer',
      label: 'Customer Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'Email Address',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Phone Number',
          admin: {
            description: 'Indian mobile number',
          },
        },
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          label: 'Registered User',
          admin: {
            description: 'Link to user account if logged in',
          },
        },
      ],
    },

    // Shipping Address
    {
      type: 'group',
      name: 'shippingAddress',
      label: 'Shipping Address',
      fields: [
        {
          name: 'addressLine1',
          type: 'text',
          required: true,
          label: 'Address Line 1',
        },
        {
          name: 'addressLine2',
          type: 'text',
          label: 'Address Line 2',
        },
        {
          name: 'landmark',
          type: 'text',
          label: 'Landmark',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'state',
          type: 'select',
          required: true,
          label: 'State',
          options: [
            { label: 'Andhra Pradesh', value: 'AP' },
            { label: 'Arunachal Pradesh', value: 'AR' },
            { label: 'Assam', value: 'AS' },
            { label: 'Bihar', value: 'BR' },
            { label: 'Chhattisgarh', value: 'CT' },
            { label: 'Delhi', value: 'DL' },
            { label: 'Goa', value: 'GA' },
            { label: 'Gujarat', value: 'GJ' },
            { label: 'Haryana', value: 'HR' },
            { label: 'Himachal Pradesh', value: 'HP' },
            { label: 'Jharkhand', value: 'JH' },
            { label: 'Karnataka', value: 'KA' },
            { label: 'Kerala', value: 'KL' },
            { label: 'Madhya Pradesh', value: 'MP' },
            { label: 'Maharashtra', value: 'MH' },
            { label: 'Manipur', value: 'MN' },
            { label: 'Meghalaya', value: 'ML' },
            { label: 'Mizoram', value: 'MZ' },
            { label: 'Nagaland', value: 'NL' },
            { label: 'Odisha', value: 'OR' },
            { label: 'Punjab', value: 'PB' },
            { label: 'Rajasthan', value: 'RJ' },
            { label: 'Sikkim', value: 'SK' },
            { label: 'Tamil Nadu', value: 'TN' },
            { label: 'Telangana', value: 'TG' },
            { label: 'Tripura', value: 'TR' },
            { label: 'Uttar Pradesh', value: 'UP' },
            { label: 'Uttarakhand', value: 'UK' },
            { label: 'West Bengal', value: 'WB' },
          ],
        },
        {
          name: 'pincode',
          type: 'text',
          required: true,
          label: 'PIN Code',
          validate: (value: string | null | undefined) => {
            if (!value) return 'PIN code is required'
            if (!/^[1-9][0-9]{5}$/.test(value)) {
              return 'Please enter a valid 6-digit PIN code'
            }
            return true
          },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'India',
          label: 'Country',
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // Billing Address
    {
      name: 'sameAsShipping',
      type: 'checkbox',
      label: 'Billing address same as shipping',
      defaultValue: true,
    },
    {
      type: 'group',
      name: 'billingAddress',
      label: 'Billing Address',
      admin: {
        condition: (data) => !data.sameAsShipping,
      },
      fields: [
        {
          name: 'addressLine1',
          type: 'text',
          label: 'Address Line 1',
        },
        {
          name: 'addressLine2',
          type: 'text',
          label: 'Address Line 2',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State',
        },
        {
          name: 'pincode',
          type: 'text',
          label: 'PIN Code',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'India',
          label: 'Country',
        },
      ],
    },

    // Order Items
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Order Items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          label: 'Product Name (Snapshot)',
          admin: {
            description: 'Stored name at time of order',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Quantity',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: 'Unit Price (INR)',
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
          label: 'Total Price (INR)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
        },
      ],
    },

    // Pricing Summary
    {
      type: 'group',
      name: 'pricing',
      label: 'Order Summary',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          label: 'Subtotal (INR)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'discount',
          type: 'group',
          label: 'Discount',
          fields: [
            {
              name: 'code',
              type: 'text',
              label: 'Coupon Code',
            },
            {
              name: 'amount',
              type: 'number',
              label: 'Discount Amount',
              defaultValue: 0,
            },
            {
              name: 'percentage',
              type: 'number',
              label: 'Discount Percentage',
            },
          ],
        },
        {
          name: 'shipping',
          type: 'group',
          label: 'Shipping',
          fields: [
            {
              name: 'method',
              type: 'select',
              label: 'Shipping Method',
              options: [
                { label: 'Standard Delivery (5-7 days)', value: 'standard' },
                { label: 'Express Delivery (2-3 days)', value: 'express' },
                { label: 'Free Shipping', value: 'free' },
              ],
              defaultValue: 'standard',
            },
            {
              name: 'cost',
              type: 'number',
              label: 'Shipping Cost (INR)',
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'tax',
          type: 'group',
          label: 'Tax',
          fields: [
            {
              name: 'rate',
              type: 'number',
              label: 'GST Rate (%)',
              defaultValue: 18,
            },
            {
              name: 'amount',
              type: 'number',
              label: 'Tax Amount (INR)',
            },
          ],
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          label: 'Total Amount (INR)',
          admin: {
            description: 'Final amount charged',
          },
        },
      ],
    },

    // Payment Information
    {
      type: 'group',
      name: 'payment',
      label: 'Payment Details',
      fields: [
        {
          name: 'method',
          type: 'select',
          required: true,
          label: 'Payment Method',
          options: [
            { label: 'PhonePe (UPI)', value: 'phonepe_upi' },
            { label: 'Google Pay', value: 'gpay' },
            { label: 'Paytm', value: 'paytm' },
            { label: 'Credit/Debit Card', value: 'card' },
            { label: 'Net Banking', value: 'netbanking' },
            { label: 'Cash on Delivery', value: 'cod' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          label: 'Payment Status',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Refunded', value: 'refunded' },
            { label: 'Partially Refunded', value: 'partial_refund' },
          ],
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'transactionId',
          type: 'text',
          label: 'Transaction ID',
          admin: {
            description: 'Payment gateway transaction reference',
          },
        },
        {
          name: 'phonePeTransactionId',
          type: 'text',
          label: 'PhonePe Transaction ID',
        },
        {
          name: 'merchantTransactionId',
          type: 'text',
          label: 'Merchant Transaction ID',
        },
        {
          name: 'paidAt',
          type: 'date',
          label: 'Payment Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },

    // Order Status
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Order Status',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Packed', value: 'packed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Out for Delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Return Requested', value: 'return_requested' },
        { label: 'Returned', value: 'returned' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // Fulfillment
    {
      type: 'group',
      name: 'fulfillment',
      label: 'Fulfillment',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
          label: 'Tracking Number',
        },
        {
          name: 'carrier',
          type: 'select',
          label: 'Shipping Carrier',
          options: [
            { label: 'Delhivery', value: 'delhivery' },
            { label: 'BlueDart', value: 'bluedart' },
            { label: 'DTDC', value: 'dtdc' },
            { label: 'Shiprocket', value: 'shiprocket' },
            { label: 'India Post', value: 'indiapost' },
            { label: 'Ecom Express', value: 'ecom' },
          ],
        },
        {
          name: 'shippedAt',
          type: 'date',
          label: 'Shipped Date',
        },
        {
          name: 'deliveredAt',
          type: 'date',
          label: 'Delivered Date',
        },
        {
          name: 'estimatedDelivery',
          type: 'date',
          label: 'Estimated Delivery',
        },
      ],
    },

    // Notes
    {
      name: 'customerNotes',
      type: 'textarea',
      label: 'Customer Notes',
      admin: {
        description: 'Special instructions from customer',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Admin-only notes (not visible to customer)',
      },
    },

    // Gift Options
    {
      type: 'group',
      name: 'giftOptions',
      label: 'Gift Options',
      fields: [
        {
          name: 'isGift',
          type: 'checkbox',
          label: 'This is a gift',
          defaultValue: false,
        },
        {
          name: 'giftMessage',
          type: 'textarea',
          label: 'Gift Message',
          admin: {
            condition: (data) => data.giftOptions?.isGift,
          },
        },
        {
          name: 'giftWrap',
          type: 'checkbox',
          label: 'Add gift wrapping (+₹50)',
          defaultValue: false,
        },
      ],
    },

    // Status History
    {
      name: 'statusHistory',
      type: 'array',
      label: 'Status History',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'status',
          type: 'text',
          label: 'Status',
        },
        {
          name: 'changedAt',
          type: 'date',
          label: 'Changed At',
        },
        {
          name: 'note',
          type: 'text',
          label: 'Note',
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generate order number
        if (operation === 'create' && !data.orderNumber) {
          const date = new Date()
          const year = date.getFullYear().toString().slice(-2)
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const random = Math.random().toString(36).substring(2, 8).toUpperCase()
          data.orderNumber = `LUM${year}${month}${random}`
        }

        // Calculate item totals
        if (data.items) {
          data.items = data.items.map((item: { quantity: number; unitPrice: number }) => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice,
          }))

          // Calculate subtotal
          data.pricing = {
            ...data.pricing,
            subtotal: data.items.reduce(
              (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
              0
            ),
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        // Track status changes
        if (
          operation === 'update' &&
          previousDoc &&
          doc.status !== previousDoc.status
        ) {
          // Add to status history (would need to be saved separately)
          console.log(`Order ${doc.orderNumber} status changed: ${previousDoc.status} → ${doc.status}`)
        }
      },
      sendOrderConfirmation,
    ],
  },
}
