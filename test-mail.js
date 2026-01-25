import { sendMail } from './src/lib/sendMail.ts';

const test = async () => {
    console.log("Starting email test...");
    try {
        await sendMail({
            to: "shivampaul2319@gmail.com",
            subject: "Test Email from Lumera",
            message: "This is a test message to verify the sendMail function."
        });
        console.log("Email test completed successfully.");
    } catch (error) {
        console.log("Email test failed (expected if credentials are invalid).");
    }
};

test();
