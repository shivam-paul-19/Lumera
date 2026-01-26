import 'dotenv/config';
import nodemailer from 'nodemailer';

export const sendMail = async ({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP configuration in environment variables');
    throw new Error('Email configuration is incomplete');
  }

  try {
    const port = parseInt(SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: port,
      secure: port === 465, // true for 465, false for other ports (like 587)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Lumera Candles" <${SMTP_USER}>`,
      to,
      subject,
      text: message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw error;
  }
};
