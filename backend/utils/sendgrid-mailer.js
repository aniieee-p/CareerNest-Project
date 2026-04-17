import sgMail from '@sendgrid/mail';

// ✅ Your verified sender email
const SENDER_EMAIL = "ani9391singh120@gmail.com";

// ✅ Ensure API key is set properly
if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Email Template Wrapper
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

        <tr>
          <td style="background:linear-gradient(135deg,#27bbd2 0%,#6366f1 100%);padding:36px 40px;">
            <span style="font-size:20px;font-weight:800;color:#ffffff;">CareerNest</span>
          </td>
        </tr>

        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            ${content}
          </td>
        </tr>

        <tr>
          <td style="background:#f8fafc;padding:20px;text-align:center;">
            <p style="font-size:12px;color:#94a3b8;">
              © ${new Date().getFullYear()} CareerNest
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const sendSubscriptionConfirmEmail = async ({ email }) => {
    try {
        const msg = {
            to: email,
            from: SENDER_EMAIL,
            subject: "You're subscribed to CareerNest!",
            html: emailWrapper(`<h2>🎉 You're in!</h2><p>Thanks for subscribing.</p>`)
        };

        const res = await sgMail.send(msg);
        console.log("✅ Subscription email sent:", res[0].statusCode);
        return res;

    } catch (error) {
        console.error("❌ SendGrid ERROR:", error.response?.body || error.message);
        throw error;
    }
};

export const sendContactEmail = async ({ name, email, message }) => {
    try {
        const msg = {
            to: SENDER_EMAIL,
            from: SENDER_EMAIL,
            replyTo: email,
            subject: `New message from ${name}`,
            html: emailWrapper(`
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b> ${message}</p>
            `)
        };

        const res = await sgMail.send(msg);
        console.log("✅ Contact email sent:", res[0].statusCode);
        return res;

    } catch (error) {
        console.error("❌ SendGrid ERROR:", error.response?.body || error.message);
        throw error;
    }
};

export const sendResetEmail = async ({ email, resetUrl }) => {
    try {
        const msg = {
            to: email,
            from: SENDER_EMAIL,
            subject: "Reset your password",
            html: emailWrapper(`
                <h2>Reset Password</h2>
                <a href="${resetUrl}">Click here to reset</a>
            `)
        };

        const res = await sgMail.send(msg);
        console.log("✅ Reset email sent:", res[0].statusCode);
        return res;

    } catch (error) {
        console.error("❌ SendGrid ERROR:", error.response?.body || error.message);
        throw error;
    }
};

export const sendApplicationStatusEmail = async ({ email, applicantName, jobTitle, companyName, status }) => {
    try {
        const statusConfig = {
            accepted: {
                emoji: "🎉",
                subject: `Congratulations! Your application for "${jobTitle}" was accepted`,
                heading: "You got accepted!",
                badgeText: "Accepted",
            },
            rejected: {
                emoji: "📋",
                subject: `Update on your application for "${jobTitle}"`,
                heading: "Application update",
                badgeText: "Not Selected",
            },
            shortlisted: {
                emoji: "⭐",
                subject: `You've been shortlisted for "${jobTitle}"`,
                heading: "You're shortlisted!",
                badgeText: "Shortlisted",
            },
        };

        const cfg = statusConfig[status] ?? {
            emoji: "🔔",
            subject: `Your application status was updated`,
            heading: "Application update",
            badgeText: status,
        };

        const msg = {
            to: email,
            from: SENDER_EMAIL,
            subject: cfg.subject,
            html: emailWrapper(`
                <div style="text-align:center;margin-bottom:28px;">
                    <span style="font-size:36px;">${cfg.emoji}</span>
                    <h2>${cfg.heading}</h2>
                    <span style="padding:4px 14px;border-radius:999px;font-size:13px;font-weight:700;background:#f0f0f0;">${cfg.badgeText}</span>
                </div>
                <p>Hi <strong>${applicantName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to <strong>${status}</strong>.</p>
            `)
        };

        const res = await sgMail.send(msg);
        console.log("✅ Application status email sent:", res[0].statusCode);
        return res;

    } catch (error) {
        console.error("❌ SendGrid ERROR:", error.response?.body || error.message);
        throw error;
    }
};