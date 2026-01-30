import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  Products,
  Collections,
  Orders,
  Media,
  Users,
  Subscribers,
  Coupons,
  OTPs,
} from './payload/collections'


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
    Coupons,
    // Content
    Media,
    // Admin
    Users,
    OTPs,
    // Marketing
    Subscribers,

  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'lumera-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/lumera',
  }),
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
})