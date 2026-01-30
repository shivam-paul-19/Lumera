import { CollectionConfig } from 'payload'

export const OTPs: CollectionConfig = {
  slug: 'otps',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    description: 'Temporary OTPs for password resets',
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'otp',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true,
    },
  ],
}
