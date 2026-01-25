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
  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net", // CHANGE THIS (was smtp.titan.email)
      port: 465,
      secure: true,          // CHANGE to false
      auth: {
        user: 'Info@lumeracandles.in',
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: '"Lumera Candles" <info@lumeracandles.in>',
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
