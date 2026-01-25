import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
    group: 'Admin',
    description: 'Admin users and customer accounts',
  },
  hooks: {
    afterChange: [],
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        id: { equals: user?.id },
      }
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        id: { equals: user?.id },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      admin: {
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Subscribed to Newsletter',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    // Saved Addresses
    {
      name: 'addresses',
      type: 'array',
      label: 'Saved Addresses',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Address Label',
          admin: {
            description: 'e.g., Home, Office',
          },
        },
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
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          label: 'State',
        },
        {
          name: 'pincode',
          type: 'text',
          required: true,
          label: 'PIN Code',
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          label: 'Default Address',
          defaultValue: false,
        },
      ],
    },
  ],
  timestamps: true,
}
