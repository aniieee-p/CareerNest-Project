import express from 'express';
import { sendSubscriptionConfirmEmail } from '../utils/sendgrid-mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Valid email is required.', success: false });
        }
        
        console.log('Attempting to send subscription email to:', email);
        await sendSubscriptionConfirmEmail({ email });
        console.log('Subscription email sent successfully');
        
        return res.status(200).json({ message: 'Subscribed successfully.', success: true });
    } catch (error) {
        console.error('Subscription error:', error.message);
        console.error('Full error:', error);
        return res.status(500).json({ 
            message: 'Failed to subscribe.', 
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
