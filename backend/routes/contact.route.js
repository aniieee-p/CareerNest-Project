import express from 'express';
import { sendContactEmail } from '../utils/sendgrid-mailer.js';

const router = express.Router();

router.post('/send', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.', success: false });
        }
        await sendContactEmail({ name, email, message });
        return res.status(200).json({ message: 'Message sent successfully.', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send message.', success: false });
    }
});

export default router;
