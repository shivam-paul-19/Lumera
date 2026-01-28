import { CollectionConfig } from 'payload'
import path from 'path'
import os from 'os'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    group: 'Content',
    description: 'Upload and manage images and files',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'public/media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 600,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'banner',
        width: 1920,
        height: 600,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/mp4', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Describe the image for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Product Image', value: 'product' },
        { label: 'Collection Banner', value: 'collection' },
        { label: 'Hero Image', value: 'hero' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'About/Brand', value: 'brand' },
        { label: 'Icon', value: 'icon' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fileData',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'mimeType',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (req.file && req.file.data) {
          const base64Data = req.file.data.toString('base64');
          data.fileData = base64Data;
          data.mimeType = req.file.mimetype;
        }
        return data;
      },
    ],
  },
}
