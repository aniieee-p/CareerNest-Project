import dotenv from 'dotenv';
dotenv.config();

import { sendResetEmail } from './utils/mailer.js';

// Change this to your own email to receive the test
const TEST_EMAIL = process.env.EMAIL_USER;

try {
    await sendResetEmail({
        email: TEST_EMAIL,
        resetUrl: 'https://example.com/reset?token=test123'
    });
    console.log(`Test email sent successfully to ${TEST_EMAIL}`);
} catch (err) {
    console.error('Failed to send test email:', err.message);
}
