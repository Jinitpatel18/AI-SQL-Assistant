import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

export const sendOtpEmail = async (to, otp) => {
    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: 'AI SQL Assistant',
            },
            to: [{ email: to }],
            subject: 'Your OTP Code - AI SQL Assistant',
            htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>AI SQL Assistant - OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
          <p>This code is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
        });

        console.log('✅ Email sent:', result);
        return result;
    } catch (error) {
        console.error('❌ Brevo email error:', error.message);
        throw error;
    }
};