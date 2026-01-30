import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendMail } from '@/lib/sendMail'

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = await req.json()
    
    if (!rawEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const email = rawEmail.trim().toLowerCase()
    const payload = await getPayload({ config })

    // 1. Check if user exists
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // 3. Store OTP in database (clear old ones for same email first)
    await payload.delete({
      collection: 'otps',
      where: {
        email: {
          equals: email,
        },
      },
    })

    await payload.create({
      collection: 'otps',
      data: {
        email,
        otp,
        expiresAt: expiresAt.toISOString(),
      },
    })

    // 4. Send email
    await sendMail({
      to: email,
      subject: 'Your Lumera Password Reset OTP',
      message: `Your one-time password (OTP) for resetting your password is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    })

    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
