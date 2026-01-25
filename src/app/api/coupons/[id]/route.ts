import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const payload = await getPayload({ config })
    
    const coupon = await payload.update({
      collection: 'coupons',
      id,
      data: body,
      overrideAccess: true,
    })

    return NextResponse.json(coupon)
  } catch (error: any) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update coupon' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'coupons',
      id,
      overrideAccess: true,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}
