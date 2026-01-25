import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendMail } from '@/lib/sendMail'

// Development fallback secret - in production, always use NEXTAUTH_SECRET env variable
const authSecret = process.env.NEXTAUTH_SECRET || 'lumera-dev-secret-key-change-in-production'

const handler = NextAuth({
  providers: [
    // Only add Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isSignup: { label: 'isSignup', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const payload = await getPayload({ config })
          const { password, name, isSignup } = credentials
          const email = credentials.email.trim().toLowerCase()

          if (isSignup === 'true') {
            // Create new user
            const user = await payload.create({
              collection: 'users',
              data: {
                email,
                password,
                name: name || email.split('@')[0],
                role: 'customer',
              },
            })

            // Send welcome email after successful signup
            try {
              await sendMail({
                to: user.email,
                subject: 'Welcome to Lumera Candles!',
                message: `Hi ${user.name || 'there'},\n\nWelcome to Lumera Candles! We are excited to have you on board.\n\nExplore our collection of premium candles at proper pricing.\n\nBest regards,\nThe Lumera Team`,
              })
            } catch (mailError) {
              console.error('Failed to send welcome email:', mailError)
              // Don't fail the signup if the email fails
            }

            return {
              id: user.id.toString(),
              name: (user.name as string) || '',
              email: user.email,
            }
          } else {
            // Login existing user
            const result = await payload.login({
              collection: 'users',
              data: {
                email,
                password,
              },
            })

            if (result.user) {
              return {
                id: result.user.id.toString(),
                name: (result.user.name as string) || '',
                email: result.user.email,
              }
            }
          }
          return null
        } catch (error: any) {
          console.error('Auth error full object:', JSON.stringify(error, null, 2))
          console.error('Auth error message:', error.message)
          if (error.data) console.error('Auth error data:', error.data)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/', // We use a custom modal, so redirect to home
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: authSecret,
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }