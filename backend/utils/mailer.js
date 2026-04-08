import nodemailer from 'nodemailer';

const getTransporter = () => nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const sendResetEmail = async ({ email, resetUrl }) => {
    await getTransporter().sendMail({
        from: `"CareerNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h2>Reset Your Password</h2>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="background:#6c47ff;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
            <p>If you didn't request this, ignore this email.</p>
        `
    });
};

export const sendSubscriptionConfirmEmail = async ({ email }) => {
    await getTransporter().sendMail({
        from: `"CareerNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'You\'re subscribed to CareerNest updates!',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#080f1e;color:#e2e8f0;border-radius:12px;">
                <h2 style="color:#27bbd2;margin-bottom:8px;">You're in! 🎉</h2>
                <p style="color:#94a3b8;">Thanks for subscribing to <strong style="color:#fff;">CareerNest</strong> updates.</p>
                <p style="color:#94a3b8;">You'll be the first to know about new job opportunities, career tips, and platform updates.</p>
                <hr style="border-color:#1e293b;margin:24px 0;" />
                <p style="font-size:12px;color:#475569;">If you didn't subscribe, you can safely ignore this email.</p>
            </div>
        `
    });
};

export const sendContactEmail = async ({ name, email, message }) => {
    await getTransporter().sendMail({
        from: `"CareerNest Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        html: `
            <h2>New message from CareerNest Contact Form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    });
};
