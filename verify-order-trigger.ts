
import config from './src/payload.config'
import { getPayload } from 'payload'
import svpath from 'path' // Renamed to avoid conflict if any? No, just path.
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = svpath.dirname(filename)

const verifyOrder = async () => {
  console.log('Initializing Payload...')
  // @ts-ignore
  const payload = await getPayload({ config })

  let productId: string
  let productName: string

  const products = await payload.find({ collection: 'products', limit: 1 })

  if (products.docs.length > 0) {
    const product = products.docs[0]
    productId = product.id
    productName = product.name
    console.log(`Using existing product: ${productName}`)
  } else {
    console.log('No products found. Creating dependencies...')
    
    // Create Collection
    const collection = await payload.create({
      collection: 'collections',
      data: {
        name: 'Test Collection', 
        slug: `test-col-${Date.now()}`,
        collectionType: 'signature', 
        status: 'active',
      }
    })
    console.log('Created dummy collection:', collection.slug)
    
    // Find Media or Create using favicon.svg
    const media = await payload.find({ collection: 'media', limit: 1 })
    let mediaId: string
    
    if (media.docs.length > 0) {
        mediaId = media.docs[0].id
    } else {
        console.log('Creating dummy media using favicon.svg...')
        const filePath = svpath.resolve(dirname, 'public/favicon.svg')
        try {
            const newMedia = await payload.create({
                collection: 'media',
                data: {
                    alt: 'Test Image'
                },
                filePath: filePath
            })
            mediaId = newMedia.id
            console.log('Created dummy media:', mediaId)
        } catch (e) {
            console.error('Failed to create media:', e)
            return
        }
    }

    const product = await payload.create({
      collection: 'products',
      data: {
        name: `Test Candle`,
        slug: `test-candle-${Date.now()}`,
        description: 'Test description',
        shortDescription: 'Short test',
        pricing: { price: 500, compareAtPrice: 600, costPrice: 200 },
        inventory: { quantity: 100, sku: `TEST-${Date.now()}` },
        status: 'active',
        collection: collection.id,
        fragrance: { 
            fragranceFamily: 'fresh', 
            scentIntensity: 'moderate',
            topNotes: [{note: 'Lemon'}],
            heartNotes: [{note: 'Rose'}],
            baseNotes: [{note: 'Musk'}]
        },
        specifications: {
            waxType: 'soy',
            wickType: 'cotton',
            burnTime: { minimum: 10, maximum: 20 },
            weight: { value: 200, unit: 'g' },
            dimensions: { height: 10, diameter: 5 },
            containerMaterial: 'glass',
        },
        careInstructions: [{instruction: 'Trim wick'}],
        images: [{ image: mediaId, isPrimary: true, alt: 'Test' }]
      }
    })
    productId = product.id
    productName = product.name
    console.log(`Created dummy product: ${productName}`)
  }

  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: `TEST-ORDER-${Date.now()}`,
        status: 'pending',
        customer: {
          email: 'shivampaul2319@gmail.com',
          firstName: 'Shivam',
          lastName: 'Paul',
          phone: '9876543210'
        },
        shippingAddress: {
            addressLine1: '123 Test St',
            city: 'Mumbai',
            state: 'MH',
            pincode: '400001',
            country: 'India'
        },
        items: [
          {
            product: productId,
            productName: productName,
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          }
        ],
        pricing: {
            subtotal: 500,
            total: 500,
        },
        payment: {
            method: 'cod',
            status: 'pending'
        }
      },
    })
    console.log(`Order created with ID: ${order.id}`)
    console.log('Check above for "Message sent" log.')
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

verifyOrder()
