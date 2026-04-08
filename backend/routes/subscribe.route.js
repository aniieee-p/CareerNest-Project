import express from 'express';
import { sendSubscriptionConfirmEmail } from '../utils/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Valid email is required.', success: false });
        }
        await sendSubscriptionConfirmEmail({ email });
        return res.status(200).json({ message: 'Subscribed successfully.', success: true });
    } catch (error) {
        console.log('Subscribe mailer error:', error.message);
        return res.status(500).json({ message: 'Failed to subscribe.', success: false });
    }
});

export default router;
