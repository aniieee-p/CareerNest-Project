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
