import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pricing.price', 'inventory.quantity', 'status', 'productCollection'],
    listSearchableFields: ['name', 'slug', 'tagline'],
    group: 'Shop',
    description: 'Manage Lumera candle products',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // Basic Information
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
      admin: {
        description: 'The display name of the candle',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier (e.g., "serenity-vanilla-rose")',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'promoTag',
      type: 'text',
      label: 'Promo Tag',
      admin: {
        description: 'Highlight offers (e.g., "Buy 1 Get 1 Free", "Flash Sale")',
        placeholder: 'e.g., Free Shipping',
        position: 'sidebar',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'Short poetic description (e.g., "Where serenity meets soul")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Full Description',
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      maxLength: 200,
      admin: {
        description: 'Brief description for product cards (max 200 chars)',
      },
    },

    // Fragrance Details
    {
      type: 'group',
      name: 'fragrance',
      label: 'Fragrance Profile',
      fields: [
        {
          name: 'topNotes',
          type: 'array',
          label: 'Top Notes',
          admin: {
            description: 'Initial scents (first 15-30 minutes)',
          },
          fields: [
            {
              name: 'note',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'heartNotes',
          type: 'array',
          label: 'Heart Notes',
          admin: {
            description: 'Core fragrance (after top notes fade)',
          },
          fields: [
            {
              name: 'note',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'baseNotes',
          type: 'array',
          label: 'Base Notes',
          admin: {
            description: 'Foundation scents (long-lasting)',
          },
          fields: [
            {
              name: 'note',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'fragranceFamily',
          type: 'select',
          label: 'Fragrance Family',
          options: [
            { label: 'Floral', value: 'floral' },
            { label: 'Oriental', value: 'oriental' },
            { label: 'Woody', value: 'woody' },
            { label: 'Fresh', value: 'fresh' },
            { label: 'Citrus', value: 'citrus' },
            { label: 'Gourmand', value: 'gourmand' },
            { label: 'Aromatic', value: 'aromatic' },
            { label: 'Spicy', value: 'spicy' },
          ],
        },
        {
          name: 'scentIntensity',
          type: 'select',
          label: 'Scent Intensity',
          options: [
            { label: 'Light & Subtle', value: 'light' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Strong', value: 'strong' },
          ],
        },
      ],
    },

    // Product Specifications
    {
      type: 'group',
      name: 'specifications',
      label: 'Product Specifications',
      fields: [
        {
          name: 'waxType',
          type: 'select',
          label: 'Wax Type',
          required: true,
          options: [
            { label: 'Soy Wax', value: 'soy' },
            { label: 'Coconut Wax', value: 'coconut' },
            { label: 'Soy & Coconut Blend', value: 'soy-coconut' },
            { label: 'Beeswax', value: 'beeswax' },
            { label: 'Paraffin-Free Blend', value: 'paraffin-free' },
          ],
          defaultValue: 'soy-coconut',
        },
        {
          name: 'wickType',
          type: 'select',
          label: 'Wick Type',
          options: [
            { label: 'Cotton Wick', value: 'cotton' },
            { label: 'Wooden Wick', value: 'wooden' },
            { label: 'Hemp Wick', value: 'hemp' },
          ],
          defaultValue: 'cotton',
        },
        {
          name: 'burnTime',
          type: 'group',
          label: 'Burn Time',
          fields: [
            {
              name: 'minimum',
              type: 'number',
              label: 'Minimum Hours',
              required: true,
              min: 1,
            },
            {
              name: 'maximum',
              type: 'number',
              label: 'Maximum Hours',
              required: true,
              min: 1,
            },
          ],
        },
        {
          name: 'weight',
          type: 'group',
          label: 'Product Weight',
          fields: [
            {
              name: 'value',
              type: 'number',
              label: 'Weight',
              required: true,
            },
            {
              name: 'unit',
              type: 'select',
              label: 'Unit',
              options: [
                { label: 'Grams (g)', value: 'g' },
                { label: 'Ounces (oz)', value: 'oz' },
              ],
              defaultValue: 'g',
            },
          ],
        },
        {
          name: 'dimensions',
          type: 'group',
          label: 'Dimensions',
          fields: [
            {
              name: 'height',
              type: 'number',
              label: 'Height (cm)',
            },
            {
              name: 'diameter',
              type: 'number',
              label: 'Diameter (cm)',
            },
          ],
        },
        {
          name: 'containerMaterial',
          type: 'select',
          label: 'Container Material',
          options: [
            { label: 'Glass Jar', value: 'glass' },
            { label: 'Ceramic', value: 'ceramic' },
            { label: 'Metal Tin', value: 'tin' },
            { label: 'Concrete', value: 'concrete' },
            { label: 'Terracotta', value: 'terracotta' },
          ],
          defaultValue: 'glass',
        },
        {
          name: 'isHandmade',
          type: 'checkbox',
          label: 'Handmade',
          defaultValue: true,
        },
        {
          name: 'isVegan',
          type: 'checkbox',
          label: 'Vegan Friendly',
          defaultValue: true,
        },
        {
          name: 'isCrueltyFree',
          type: 'checkbox',
          label: 'Cruelty Free',
          defaultValue: true,
        },
      ],
    },

    // Pricing
    {
      type: 'group',
      name: 'pricing',
      label: 'Pricing',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Price (INR)',
          required: true,
          min: 0,
          admin: {
            description: 'Regular selling price in Indian Rupees',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          label: 'Compare at Price (INR)',
          min: 0,
          admin: {
            description: 'Original price for showing discounts',
          },
        },
        {
          name: 'costPrice',
          type: 'number',
          label: 'Cost Price (INR)',
          min: 0,
          admin: {
            description: 'Your cost for profit calculations (hidden from customers)',
            position: 'sidebar',
          },
        },
      ],
    },

    // Media
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          admin: {
            description: 'Describe the image for accessibility',
          },
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          label: 'Primary Image',
          defaultValue: false,
        },
      ],
    },

    // Inventory
    {
      type: 'group',
      name: 'inventory',
      label: 'Inventory',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          unique: true,
          admin: {
            description: 'Stock Keeping Unit',
          },
        },
        {
          name: 'barcode',
          type: 'text',
          label: 'Barcode',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Stock Quantity',
          required: true,
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          label: 'Low Stock Alert',
          defaultValue: 10,
          admin: {
            description: 'Alert when stock falls below this',
          },
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          label: 'Track Inventory',
          defaultValue: true,
        },
      ],
    },

    // Categorization
    {
      name: 'productCollection',
      type: 'relationship',
      relationTo: 'collections',
      required: true,
      hasMany: false,
      label: 'Collection',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },

    // Status
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage',
      },
    },
    {
      name: 'newArrival',
      type: 'checkbox',
      label: 'New Arrival',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      label: 'Best Seller',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },

    // Care Instructions
    {
      name: 'careInstructions',
      type: 'array',
      label: 'Care Instructions',
      fields: [
        {
          name: 'instruction',
          type: 'text',
          required: true,
        },
      ],
    },

    // SEO
    {
      type: 'group',
      name: 'seo',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Comma-separated keywords',
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generate SKU if not provided
        if (operation === 'create' && !data.inventory?.sku) {
          const prefix = 'LUM'
          const timestamp = Date.now().toString(36).toUpperCase()
          data.inventory = {
            ...data.inventory,
            sku: `${prefix}-${timestamp}`,
          }
        }
        return data
      },
    ],
  },
}
