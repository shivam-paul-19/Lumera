import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    const media = (await payload.findByID({
      collection: 'media',
      id,
    })) as any

    if (!media || !media.fileData) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(media.fileData, 'base64')
    const mimeType = media.mimeType || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving media:', error)
    return NextResponse.json(
      { error: 'Failed to serve media' },
      { status: 500 }
    )
  }
}
