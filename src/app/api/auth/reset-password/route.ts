import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, otp, newPassword } = await req.json()

    if (!rawEmail || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const email = rawEmail.trim().toLowerCase()
    const payload = await getPayload({ config })

    // 1. Verify OTP again (to ensure the request is valid)
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
      await payload.delete({
        collection: 'otps',
        id: otpData.id,
      })
      return NextResponse.json({ error: 'otp_expired' }, { status: 400 })
    }

    // 3. Find user
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users.docs[0]

    // 4. Update password
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword, // Payload handles hashing if not already hashed? 
        // Actually Payload's Users collection with auth: true hashes the password field by default on create/update.
      },
      depth: 0,
    })

    // 5. Delete the used OTP
    await payload.delete({
      collection: 'otps',
      id: otpData.id,
    })

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch (error: any) {
    console.error('Reset Password error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
