import * as SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

export const sendOtpEmail = async (to, otp) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
            email: process.env.BREVO_SENDER_EMAIL,   // tumhara verified email
            name: 'AI SQL Assistant',
        };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = 'Your OTP Code - AI SQL Assistant';
        sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>AI SQL Assistant - OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
        <p>This code is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent:', result.body?.messageId || 'success');
        return result;
    } catch (error) {
        console.error('❌ Brevo email error:', error.message);
        throw error;
    }
};