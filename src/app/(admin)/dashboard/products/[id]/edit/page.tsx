'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Save, Loader2, Trash2 } from 'lucide-react'

interface ProductForm {
  name: string
  slug: string
  tagline: string
  description: string
  price: string
  compareAtPrice: string
  collection: string
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  quantity: string
  waxType: string
  burnTimeMin: string
  burnTimeMax: string
  weight: string
  topNotes: string
  heartNotes: string
  baseNotes: string
}

interface ExistingImage {
  id: string
  url: string
  isPrimary: boolean
}

const initialForm: ProductForm = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  price: '',
  compareAtPrice: '',
  collection: '',
  status: 'draft',
  featured: false,
  bestSeller: false,
  newArrival: false,
  quantity: '0',
  waxType: 'soy',
  burnTimeMin: '',
  burnTimeMax: '',
  weight: '',
  topNotes: '',
  heartNotes: '',
  baseNotes: '',
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ProductForm>(initialForm)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    fetchProduct()
    fetchCollections()
  }, [productId])

  async function fetchProduct() {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const product = await response.json()

        // Map product data to form
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          tagline: product.tagline || '',
          description: product.description || '',
          price: product.pricing?.price?.toString() || '',
          compareAtPrice: product.pricing?.compareAtPrice?.toString() || '',
          collection: product.collection?.id || product.collection || '',
          status: product.status || 'draft',
          featured: product.featured || false,
          bestSeller: product.bestSeller || false,
          newArrival: product.newArrival || false,
          quantity: product.inventory?.quantity?.toString() || '0',
          waxType: product.specifications?.waxType || 'soy',
          burnTimeMin: product.specifications?.burnTime?.minimum?.toString() || '',
          burnTimeMax: product.specifications?.burnTime?.maximum?.toString() || '',
          weight: product.specifications?.weight?.value?.toString() || '',
          topNotes: product.fragrance?.topNotes?.map((n: any) => n.note).join(', ') || '',
          heartNotes: product.fragrance?.heartNotes?.map((n: any) => n.note).join(', ') || '',
          baseNotes: product.fragrance?.baseNotes?.map((n: any) => n.note).join(', ') || '',
        })

        // Map existing images
        if (product.images && product.images.length > 0) {
          const imgs = product.images.map((img: any) => ({
            id: img.image?.id || img.image,
            url: img.image?.url || '',
            isPrimary: img.isPrimary || false,
          })).filter((img: ExistingImage) => img.url)
          setExistingImages(imgs)
        }
      } else {
        setError('Product not found')
      }
    } catch (err) {
      console.error('Failed to fetch product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCollections() {
    try {
      const response = await fetch('/api/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to fetch collections:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const totalImages = existingImages.length - imagesToDelete.length + newImages.length + files.length
    const availableSlots = 5 - (existingImages.length - imagesToDelete.length + newImages.length)
    const filesToAdd = files.slice(0, availableSlots)

    if (filesToAdd.length === 0) return

    setNewImages(prev => [...prev, ...filesToAdd])

    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file))
    setNewImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeExistingImage = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId])
  }

  const restoreImage = (imageId: string) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId))
  }

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      // First upload new images
      const uploadedImageIds: string[] = []

      for (const image of newImages) {
        const formData = new FormData()
        formData.append('file', image)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          uploadedImageIds.push(uploadData.id)
        }
      }

      // Build the images array - keep existing (not deleted) + new
      const keptImages = existingImages
        .filter(img => !imagesToDelete.includes(img.id))
        .map((img, index) => ({
          image: img.id,
          isPrimary: index === 0 && uploadedImageIds.length === 0,
        }))

      const newImageEntries = uploadedImageIds.map((id, index) => ({
        image: id,
        isPrimary: keptImages.length === 0 && index === 0,
      }))

      const allImages = [...keptImages, ...newImageEntries]
      // Ensure at least one primary
      if (allImages.length > 0 && !allImages.some(img => img.isPrimary)) {
        allImages[0].isPrimary = true
      }

      // Update the product
      const productData = {
        name: form.name,
        slug: form.slug,
        tagline: form.tagline,
        description: form.description,
        pricing: {
          price: parseFloat(form.price) || 0,
          compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        },
        collection: form.collection || undefined,
        status: form.status,
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        inventory: {
          quantity: parseInt(form.quantity) || 0,
          trackInventory: true,
        },
        specifications: {
          waxType: form.waxType,
          burnTime: {
            minimum: parseInt(form.burnTimeMin) || 0,
            maximum: parseInt(form.burnTimeMax) || 0,
          },
          weight: {
            value: parseInt(form.weight) || 0,
            unit: 'g',
          },
        },
        fragrance: {
          topNotes: form.topNotes ? form.topNotes.split(',').map(n => ({ note: n.trim() })) : [],
          heartNotes: form.heartNotes ? form.heartNotes.split(',').map(n => ({ note: n.trim() })) : [],
          baseNotes: form.baseNotes ? form.baseNotes.split(',').map(n => ({ note: n.trim() })) : [],
        },
        images: allImages,
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        router.push('/dashboard/products')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update product')
      }
    } catch (err) {
      setError('An error occurred while updating the product')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/products')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete product')
      }
    } catch (err) {
      setError('An error occurred while deleting the product')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f] mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    )
  }

  const totalImages = existingImages.length - imagesToDelete.length + newImages.length

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update product details and images.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Lavender Dreams"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="lavender-dreams"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="e.g., A calming embrace"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your candle..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Existing Images */}
              {existingImages.map((img, index) => {
                const isDeleted = imagesToDelete.includes(img.id)
                return (
                  <div
                    key={img.id}
                    className={`relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 ${isDeleted ? 'opacity-40' : ''}`}
                  >
                    <Image
                      src={img.url}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {isDeleted ? (
                      <button
                        type="button"
                        onClick={() => restoreImage(img.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium"
                      >
                        Restore
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {img.isPrimary && (
                          <span className="absolute bottom-1 left-1 text-[10px] bg-[#1e3a5f] text-white px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )
              })}

              {/* New Image Previews */}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={preview}
                    alt={`New ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="absolute bottom-1 left-1 text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded">
                    New
                  </span>
                </div>
              ))}

              {/* Upload Button */}
              {totalImages < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              Upload up to 5 images. The first image will be the primary image.
            </p>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="999"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare at Price (₹)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={form.compareAtPrice}
                onChange={handleChange}
                min="0"
                placeholder="1299"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                placeholder="10"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection
              </label>
              <select
                name="collection"
                value={form.collection}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                <option value="">Select a collection</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={form.bestSeller}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                />
                <span className="text-sm text-gray-700">Best Seller</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={form.newArrival}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                />
                <span className="text-sm text-gray-700">New Arrival</span>
              </label>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wax Type
              </label>
              <select
                name="waxType"
                value={form.waxType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                <option value="soy">Soy Wax</option>
                <option value="coconut">Coconut Wax</option>
                <option value="soy-coconut">Soy & Coconut Blend</option>
                <option value="beeswax">Beeswax</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                min="0"
                placeholder="200"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burn Time Min (hours)
              </label>
              <input
                type="number"
                name="burnTimeMin"
                value={form.burnTimeMin}
                onChange={handleChange}
                min="0"
                placeholder="40"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burn Time Max (hours)
              </label>
              <input
                type="number"
                name="burnTimeMax"
                value={form.burnTimeMax}
                onChange={handleChange}
                min="0"
                placeholder="50"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>

        {/* Fragrance Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Fragrance Notes</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top Notes
              </label>
              <input
                type="text"
                name="topNotes"
                value={form.topNotes}
                onChange={handleChange}
                placeholder="Lavender, Bergamot, Lemon (comma separated)"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Notes
              </label>
              <input
                type="text"
                name="heartNotes"
                value={form.heartNotes}
                onChange={handleChange}
                placeholder="Rose, Jasmine, Geranium (comma separated)"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Notes
              </label>
              <input
                type="text"
                name="baseNotes"
                value={form.baseNotes}
                onChange={handleChange}
                placeholder="Sandalwood, Vanilla, Musk (comma separated)"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/products"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2a4d7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
