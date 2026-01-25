
import { sendMail } from '../src/lib/sendMail';

const test = async () => {
  console.log('Testing email sending...');
  try {
    const result = await sendMail({
      to: 'shivampaul2319@gmail.com', // User's email from verify-trigger.ts
      subject: 'Test Email from Script',
      message: 'This is a direct test of the sendMail function.',
    });
    console.log('SUCCESS: Email sent successfully.');
    console.log('Result:', result);
  } catch (error) {
    console.error('FAILURE: Failed to send email.');
    console.error(error);
  }
};

test();
