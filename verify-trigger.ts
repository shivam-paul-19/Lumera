import config from './src/payload.config'
import { getPayload } from 'payload'

const verify = async () => {
  console.log('Initializing Payload...')
  // @ts-ignore
  const payload = await getPayload({ config })
  
  const testEmail = `shivampaul2319+${Date.now()}@gmail.com`
  console.log(`Creating user with email ${testEmail}...`)

  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: testEmail,
        password: 'password123',
        name: 'Test Trigger User',
        role: 'customer',
      },
    })
    console.log(`User created with ID: ${user.id}`)
    console.log('Check above for "Message sent" log.')
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

verify()
