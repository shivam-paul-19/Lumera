import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    const collections = await payload.find({
      collection: 'collections',
      limit: 100,
      sort: 'name',
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Dynamically import Payload
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config')
    const payload = await getPayload({ config: config.default })

    const collection = await payload.create({
      collection: 'collections',
      data: {
        name: body.name,
        slug: body.slug,
        collectionType: 'signature',
        status: 'draft',
      },
      overrideAccess: true, // Bypass access control for dashboard
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error: any) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create collection' },
      { status: 500 }
    )
  }
}
