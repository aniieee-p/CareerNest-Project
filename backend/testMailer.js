import dotenv from 'dotenv';
dotenv.config();

import { sendResetEmail, sendSubscriptionConfirmEmail } from './utils/mailer.js';

const TEST_EMAIL = process.env.EMAIL_USER;

// Test subscription email
try {
    await sendSubscriptionConfirmEmail({ email: TEST_EMAIL });
    console.log(`✅ Subscription email sent to ${TEST_EMAIL}`);
} catch (err) {
    console.error('❌ Subscription email failed:', err.message);
}

// Test reset email
try {
    await sendResetEmail({ email: TEST_EMAIL, resetUrl: 'https://example.com/reset?token=test123' });
    console.log(`✅ Reset email sent to ${TEST_EMAIL}`);
} catch (err) {
    console.error('❌ Reset email failed:', err.message);
}
