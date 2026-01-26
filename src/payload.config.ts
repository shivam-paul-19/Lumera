import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import {
  Products,
  Collections,
  Orders,
  Media,
  Users,
  Subscribers,
  Coupons,
} from './payload/collections'
import { Settings } from './payload/globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Lumera Shop Manager',
      icons: [{
        url: '/favicon.ico',
      }],
      openGraph: {
        images: [{ url: '/og-image.jpg' }],
      },
    },
    components: {
      // Custom logo in the nav
      graphics: {
        Logo: '@/payload/components/Logo#Logo',
        Icon: '@/payload/components/Icon#Icon',
      },
      // Add welcome banner after dashboard and inject admin styles
      afterDashboard: [
        '@/payload/components/DashboardBanner#DashboardBanner',
        '@/payload/components/AdminStyles#AdminStyles',
      ],
    },
    // Organize navigation into logical groups
    // Groups are defined in each collection's admin.group property
  },
  collections: [
    // Shop Management
    Products,
    Collections,
    Orders,
    // Content
    Media,
    // Admin
    Users,
    // Marketing
    Subscribers,
    Coupons,
  ],
  globals: [
    Settings,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'lumera-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI environment variable is missing! Please set it in your deployment settings.')
      }
      return 'mongodb://127.0.0.1:27017/lumera'
    })()
  }),
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
  plugins: [
    // Only use S3 in production or if explicitly configured
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.S3_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION || 'ap-south-1',
            },
          }),
        ]
      : []),
  ],
  sharp,
})
