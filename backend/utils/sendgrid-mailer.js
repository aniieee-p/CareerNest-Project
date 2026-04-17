// import sgMail from '@sendgrid/mail';

// const SENDER_EMAIL = "ani9391singh120@gmail.com";

// // Initialize SendGrid
// if (!process.env.SENDGRID_API_KEY) {
//     throw new Error("SENDGRID_API_KEY is not configured");
// }

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const emailWrapper = (content) => `
// <!DOCTYPE html>
// <html>
// <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
// <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" style="max-width:520px;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

//         <!-- Header -->
//         <tr>
//           <td style="background:linear-gradient(135deg,#27bbd2 0%,#6366f1 100%);padding:36px 40px 32px;">
//             <table width="100%" cellpadding="0" cellspacing="0">
//               <tr>
//                 <td>
//                   <table cellpadding="0" cellspacing="0">
//                     <tr>
//                       <td style="background:rgba(255,255,255,0.2);border-radius:10px;padding:8px 10px;vertical-align:middle;">
//                         <span style="font-size:18px;">💼</span>
//                       </td>
//                       <td style="padding-left:10px;vertical-align:middle;">
//                         <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">CareerNest</span>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- Body -->
//         <tr>
//           <td style="background:#ffffff;padding:36px 40px;">
//             ${content}
//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;">
//             <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
//               © ${new Date().getFullYear()} CareerNest · Find your next dream role
//             </p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;

// export const sendSubscriptionConfirmEmail = async ({ email }) => {
//     try {
//         if (!process.env.SENDGRID_API_KEY) {
//             throw new Error('SENDGRID_API_KEY environment variable not configured');
//         }

//         const msg = {
//             to: email,
//             from: {
//                 email: SENDER_EMAIL,
//                 name: 'CareerNest'
//             },
//             subject: "You're subscribed to CareerNest updates!",
//             html: emailWrapper(`
//                 <div style="text-align:center;margin-bottom:28px;">
//                   <div style="display:inline-block;background:linear-gradient(135deg,rgba(39,187,210,0.12),rgba(99,102,241,0.12));border-radius:50%;padding:18px;margin-bottom:16px;">
//                     <span style="font-size:36px;">🎉</span>
//                   </div>
//                   <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">You're in!</h2>
//                   <p style="margin:0;font-size:15px;color:#64748b;line-height:1.6;">
//                     Thanks for subscribing to <strong style="color:#0f172a;">CareerNest</strong> updates.
//                   </p>
//                 </div>

//                 <div style="background:#f8fafc;border-radius:14px;padding:20px 24px;margin-bottom:24px;border:1px solid #e2e8f0;">
//                   <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">What to expect</p>
//                   <table cellpadding="0" cellspacing="0" width="100%">
//                     ${[
//                       ["🚀", "New job opportunities tailored to your skills"],
//                       ["💡", "Career tips and industry insights"],
//                       ["🔔", "Platform updates and new features"],
//                     ].map(([icon, text]) => `
//                       <tr>
//                         <td style="padding:6px 0;vertical-align:top;width:28px;font-size:15px;">${icon}</td>
//                         <td style="padding:6px 0;font-size:14px;color:#475569;line-height:1.5;">${text}</td>
//                       </tr>
//                     `).join("")}
//                   </table>
//                 </div>

//                 <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;">
//                   Didn't subscribe? You can safely ignore this email.
//                 </p>
//             `)
//         };

//         console.log('Sending subscription email via SendGrid to:', email);
//         const result = await sgMail.send(msg);
//         console.log('SendGrid email sent successfully:', result[0].statusCode);
//         return result;
//     } catch (error) {
//         console.error('SendGrid email error:', error.message);
//         throw error;
//     }
// };

// export const sendApplicationStatusEmail = async ({ email, applicantName, jobTitle, companyName, status }) => {
//     try {
//         if (!process.env.SENDGRID_API_KEY) {
//             throw new Error('SENDGRID_API_KEY environment variable not configured');
//         }

//         const statusConfig = {
//             accepted: {
//                 emoji: "🎉",
//                 subject: `Congratulations! Your application for "${jobTitle}" was accepted`,
//                 heading: "You got accepted!",
//                 body: `Great news, <strong style="color:#0f172a;">${applicantName}</strong>! Your application for <strong style="color:#0f172a;">${jobTitle}</strong> at <strong style="color:#0f172a;">${companyName}</strong> has been <strong style="color:#10b981;">accepted</strong>. The recruiter will be in touch with next steps soon.`,
//                 badgeColor: "#10b981",
//                 badgeBg: "rgba(16,185,129,0.1)",
//                 badgeText: "Accepted",
//             },
//             rejected: {
//                 emoji: "📋",
//                 subject: `Update on your application for "${jobTitle}"`,
//                 heading: "Application update",
//                 body: `Hi <strong style="color:#0f172a;">${applicantName}</strong>, thank you for applying for <strong style="color:#0f172a;">${jobTitle}</strong> at <strong style="color:#0f172a;">${companyName}</strong>. After careful consideration, the team has decided not to move forward with your application at this time. Don't be discouraged — keep applying!`,
//                 badgeColor: "#ef4444",
//                 badgeBg: "rgba(239,68,68,0.1)",
//                 badgeText: "Not Selected",
//             },
//             shortlisted: {
//                 emoji: "⭐",
//                 subject: `You've been shortlisted for "${jobTitle}"`,
//                 heading: "You're shortlisted!",
//                 body: `Hi <strong style="color:#0f172a;">${applicantName}</strong>, exciting news — you've been <strong style="color:#6366f1;">shortlisted</strong> for <strong style="color:#0f172a;">${jobTitle}</strong> at <strong style="color:#0f172a;">${companyName}</strong>. Stay tuned, the recruiter will reach out with further details.`,
//                 badgeColor: "#6366f1",
//                 badgeBg: "rgba(99,102,241,0.1)",
//                 badgeText: "Shortlisted",
//             },
//         };

//         const cfg = statusConfig[status] ?? {
//             emoji: "🔔",
//             subject: `Your application status was updated`,
//             heading: "Application update",
//             body: `Hi <strong style="color:#0f172a;">${applicantName}</strong>, your application for <strong style="color:#0f172a;">${jobTitle}</strong> at <strong style="color:#0f172a;">${companyName}</strong> has been updated to <strong>${status}</strong>.`,
//             badgeColor: "#64748b",
//             badgeBg: "rgba(100,116,139,0.1)",
//             badgeText: status,
//         };

//         const msg = {
//             to: email,
//             from: {
//                 email: SENDER_EMAIL,
//                 name: 'CareerNest'
//             },
//             subject: cfg.subject,
//             html: emailWrapper(`
//                 <div style="text-align:center;margin-bottom:28px;">
//                   <div style="display:inline-block;background:${cfg.badgeBg};border-radius:50%;padding:18px;margin-bottom:16px;">
//                     <span style="font-size:36px;">${cfg.emoji}</span>
//                   </div>
//                   <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">${cfg.heading}</h2>
//                   <span style="display:inline-block;padding:4px 14px;border-radius:999px;font-size:13px;font-weight:700;color:${cfg.badgeColor};background:${cfg.badgeBg};">${cfg.badgeText}</span>
//                 </div>

//                 <div style="background:#f8fafc;border-radius:14px;padding:20px 24px;border:1px solid #e2e8f0;margin-bottom:24px;">
//                   <p style="margin:0;font-size:15px;color:#475569;line-height:1.7;">${cfg.body}</p>
//                 </div>

//                 <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;">
//                   You're receiving this because you applied via CareerNest.
//                 </p>
//             `)
//         };

//         console.log('Sending application status email via SendGrid to:', email);
//         const result = await sgMail.send(msg);
//         console.log('SendGrid status email sent successfully:', result[0].statusCode);
//         return result;
//     } catch (error) {
//         console.error('SendGrid status email error:', error.message);
//         throw error;
//     }
// };

// export const sendContactEmail = async ({ name, email, message }) => {
//     try {
//         if (!process.env.SENDGRID_API_KEY) {
//             throw new Error('SENDGRID_API_KEY environment variable not configured');
//         }

//         const msg = {
//             to: process.env.EMAIL_USER || 'noreply@careernest.com',
//             from: {
//                 email: SENDER_EMAIL,
//                 name: 'CareerNest'
//             },
//             replyTo: email,
//             subject: `New message from ${name} via CareerNest`,
//             html: emailWrapper(`
//                 <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">New contact message 📬</h2>
//                 <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Someone reached out via the CareerNest contact form.</p>

//                 <div style="background:#f8fafc;border-radius:14px;padding:20px 24px;border:1px solid #e2e8f0;margin-bottom:20px;">
//                   <table cellpadding="0" cellspacing="0" width="100%">
//                     <tr>
//                       <td style="padding:8px 0;font-size:13px;color:#94a3b8;font-weight:600;width:80px;">Name</td>
//                       <td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;">${name}</td>
//                     </tr>
//                     <tr>
//                       <td style="padding:8px 0;font-size:13px;color:#94a3b8;font-weight:600;">Email</td>
//                       <td style="padding:8px 0;font-size:14px;color:#27bbd2;">${email}</td>
//                     </tr>
//                   </table>
//                 </div>

//                 <div style="background:#f8fafc;border-radius:14px;padding:20px 24px;border:1px solid #e2e8f0;">
//                   <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
//                   <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;">${message}</p>
//                 </div>
//             `)
//         };

//         console.log('Sending contact email via SendGrid');
//         const result = await sgMail.send(msg);
//         console.log('SendGrid contact email sent successfully:', result[0].statusCode);
//         return result;
//     } catch (error) {
//         console.error('SendGrid contact email error:', error.message);
//         throw error;
//     }
// };

// export const sendResetEmail = async ({ email, resetUrl }) => {
//     try {
//         if (!process.env.SENDGRID_API_KEY) {
//             throw new Error('SENDGRID_API_KEY environment variable not configured');
//         }

//         const msg = {
//             to: email,
//             from: {
//                 email: SENDER_EMAIL,
//                 name: 'CareerNest'
//             },
//             subject: 'Reset your CareerNest password',
//             html: emailWrapper(`
//                 <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">Reset your password 🔐</h2>
//                 <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
//                     We received a request to reset your password. Click the button below — this link expires in <strong style="color:#0f172a;">1 hour</strong>.
//                 </p>
//                 <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//                   <tr>
//                     <td style="border-radius:12px;background:linear-gradient(135deg,#27bbd2,#6366f1);">
//                       <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">
//                         Reset Password →
//                       </a>
//                     </td>
//                   </tr>
//                 </table>
//                 <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;border:1px solid #e2e8f0;">
//                   <p style="margin:0;font-size:13px;color:#94a3b8;">
//                     If you didn't request a password reset, you can safely ignore this email. Your password won't change.
//                   </p>
//                 </div>
//             `)
//         };

//         console.log('Sending reset email via SendGrid to:', email);
//         const result = await sgMail.send(msg);
//         console.log('SendGrid reset email sent successfully:', result[0].statusCode);
//         return result;
//     } catch (error) {
//         console.error('SendGrid reset email error:', error.message);
//         throw error;
//     }
// };


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