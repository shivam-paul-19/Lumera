import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, otp } = await req.json()

    if (!rawEmail || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const email = rawEmail.trim().toLowerCase()
    const payload = await getPayload({ config })

    // 1. Find OTP entry
    const otps = await payload.find({
      collection: 'otps',
      where: {
        and: [
          { email: { equals: email } },
          { otp: { equals: otp } },
        ],
      },
    })

    if (otps.docs.length === 0) {
      return NextResponse.json({ error: 'invalid_otp' }, { status: 400 })
    }

    const otpData = otps.docs[0]

    // 2. Check expiration
    if (new Date(otpData.expiresAt as string) < new Date()) {
      // Clean up expired OTP
      await payload.delete({
        collection: 'otps',
        id: otpData.id,
      })
      return NextResponse.json({ error: 'otp_expired' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'OTP verified successfully' })
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
