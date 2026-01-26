import { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: 'Collection',
    plural: 'Collections',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'productCount'],
    group: 'Shop',
    description: 'Manage product collections (Serene, Essence, Signature)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Collection Name',
      admin: {
        description: 'e.g., Serene, Essence, Signature',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) {
              return value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            if (data?.name) {
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
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'Short poetic tagline for the collection',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Full collection description',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      maxLength: 300,
      admin: {
        description: 'Brief description for collection cards',
      },
    },

    // Visual Identity
    {
      type: 'group',
      name: 'visual',
      label: 'Visual Identity',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Featured Image',
          admin: {
            description: 'Main collection image',
          },
        },
        {
          name: 'bannerImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Banner Image',
          admin: {
            description: 'Wide banner for collection page',
          },
        },
        {
          name: 'thumbnailImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Thumbnail',
          admin: {
            description: 'Small image for navigation',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          label: 'Accent Color',
          admin: {
            description: 'Hex color code for collection accent (e.g., #800020)',
          },
        },
        {
          name: 'mood',
          type: 'select',
          label: 'Collection Mood',
          options: [
            { label: 'Calm & Serene', value: 'serene' },
            { label: 'Warm & Inviting', value: 'warm' },
            { label: 'Bold & Luxurious', value: 'luxurious' },
            { label: 'Fresh & Energizing', value: 'fresh' },
            { label: 'Romantic & Soft', value: 'romantic' },
            { label: 'Cozy & Comforting', value: 'cozy' },
          ],
        },
      ],
    },

    // Collection Type
    {
      name: 'collectionType',
      type: 'select',
      label: 'Collection Type',
      required: true,
      options: [
        { label: 'Signature Collection', value: 'signature' },
        { label: 'Seasonal Collection', value: 'seasonal' },
        { label: 'Limited Edition', value: 'limited' },
        { label: 'Gift Sets', value: 'gift' },
        { label: 'Essentials', value: 'essentials' },
      ],
      defaultValue: 'signature',
      admin: {
        position: 'sidebar',
      },
    },

    // Pricing Tier
    {
      name: 'priceTier',
      type: 'select',
      label: 'Price Tier',
      options: [
        { label: 'Entry Level', value: 'entry' },
        { label: 'Mid Range', value: 'mid' },
        { label: 'Premium', value: 'premium' },
        { label: 'Luxury', value: 'luxury' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Helps customers understand pricing expectations',
      },
    },

    // Status & Display
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Coming Soon', value: 'coming-soon' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Collection',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display prominently on homepage',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
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
        },
      ],
    },
  ],
  timestamps: true,
}
