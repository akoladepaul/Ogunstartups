import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"OgunStartups" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset your OgunStartups password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <div style="margin-bottom:24px">
          <span style="font-size:20px;font-weight:bold;color:#15803d">Ogun</span>
          <span style="font-size:20px;font-weight:bold;color:#111">Startups</span>
        </div>
        <h2 style="color:#111;margin:0 0 12px">Reset your password</h2>
        <p style="color:#555;margin:0 0 24px">
          Click the button below to reset your password. This link expires in <strong>1 hour</strong>.
        </p>
        <a href="${resetUrl}"
          style="display:inline-block;background:#15803d;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
          Reset Password
        </a>
        <p style="color:#888;font-size:13px;margin-top:24px">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color:#aaa;font-size:12px;margin-top:8px;word-break:break-all">
          Or paste this link: ${resetUrl}
        </p>
      </div>
    `,
  });
}
