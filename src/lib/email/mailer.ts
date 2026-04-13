import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function getPasswordResetEmailHtml(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f8; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f766d 0%, #0d5c55 100%); padding: 40px 40px 30px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
    .logo { display: inline-block; margin-bottom: 16px; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 18px; color: #fff; font-size: 18px; font-weight: 800; letter-spacing: 1px; }
    .body { padding: 40px; }
    .body p { color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
    .btn-wrapper { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #0f766d 0%, #0d5c55 100%); color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; }
    .note { background: #f0fdf9; border-left: 4px solid #0f766d; border-radius: 4px; padding: 14px 18px; margin: 24px 0 0; }
    .note p { color: #374151; font-size: 13px; margin: 0; }
    .fallback { margin-top: 20px; }
    .fallback p { font-size: 12px; color: #9ca3af; word-break: break-all; }
    .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">TCL</div>
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password</p>
    </div>
    <div class="body">
      <p>Hi there,</p>
      <p>Someone (hopefully you) requested a password reset for your account on <strong>Top Career Live</strong>. Click the button below to set a new password:</p>
      <div class="btn-wrapper">
        <a href="${resetUrl}" class="btn" style="color: #ffffff; text-decoration: none;">Reset My Password</a>
      </div>
      <div class="note">
        <p>&#9200; This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
      </div>
      <div class="fallback">
        <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Top Career Live. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await transporter.sendMail({
    from: `"Top Career Live" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Your Password – Top Career Live",
    text: `Reset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`,
    html: getPasswordResetEmailHtml(resetUrl),
  });
}

// ── Employer Verification Approval Email ──

function getEmployerApprovalEmailHtml(companyName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verification Approved</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f8; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f766d 0%, #0d5c55 100%); padding: 40px 40px 30px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
    .logo { display: inline-block; margin-bottom: 16px; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 18px; color: #fff; font-size: 18px; font-weight: 800; letter-spacing: 1px; }
    .body { padding: 40px; }
    .body p { color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
    .success-box { background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px; padding: 16px 20px; margin: 24px 0; }
    .success-box p { color: #166534; font-size: 14px; margin: 0; font-weight: 600; }
    .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">TCL</div>
      <h1>Verification Approved &#10003;</h1>
      <p>Your company has been verified successfully</p>
    </div>
    <div class="body">
      <p>Hi there,</p>
      <p>Great news! Your verification request for <strong>${companyName || "your company"}</strong> on <strong>Top Career Live</strong> has been reviewed and <strong>approved</strong>.</p>
      <div class="success-box">
        <p>&#9989; Your account is now verified. You can start posting jobs and accessing all employer features.</p>
      </div>
      <p>If you have any questions, feel free to reach out to our support team. We're excited to have you on board!</p>
      <p>Best regards,<br/><strong>Top Career Live Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Top Career Live. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function sendEmployerApprovalEmail(to: string, companyName: string): Promise<void> {
  await transporter.sendMail({
    from: `"Top Career Live" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verification Approved – Top Career Live",
    text: `Congratulations! Your verification request for ${companyName || "your company"} on Top Career Live has been approved. You can now start posting jobs and accessing all employer features.\n\n— Top Career Live Team`,
    html: getEmployerApprovalEmailHtml(companyName),
  });
}

// ── Employer Verification Rejection Email ──

function getEmployerRejectionEmailHtml(companyName: string, reason: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verification Update</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f8; font-family: Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f766d 0%, #0d5c55 100%); padding: 40px 40px 30px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
    .logo { display: inline-block; margin-bottom: 16px; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 18px; color: #fff; font-size: 18px; font-weight: 800; letter-spacing: 1px; }
    .body { padding: 40px; }
    .body p { color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
    .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 16px 20px; margin: 24px 0; }
    .reason-box .label { color: #991b1b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px; }
    .reason-box .reason { color: #374151; font-size: 14px; margin: 0; line-height: 1.6; }
    .note { background: #f0fdf9; border-left: 4px solid #0f766d; border-radius: 4px; padding: 14px 18px; margin: 24px 0 0; }
    .note p { color: #374151; font-size: 13px; margin: 0; }
    .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">TCL</div>
      <h1>Verification Update</h1>
      <p>An update regarding your verification request</p>
    </div>
    <div class="body">
      <p>Hi there,</p>
      <p>We have reviewed your verification request for <strong>${companyName || "your company"}</strong> on <strong>Top Career Live</strong>. Unfortunately, your request could not be approved at this time.</p>
      <div class="reason-box">
        <p class="label">Reason for rejection</p>
        <p class="reason">${reason}</p>
      </div>
      <div class="note">
        <p>&#128221; You can update your documents and re-submit your verification request. If you believe this was an error, please contact our support team for further assistance.</p>
      </div>
      <p>Best regards,<br/><strong>Top Career Live Team</strong></p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Top Career Live. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function sendEmployerRejectionEmail(to: string, companyName: string, reason: string): Promise<void> {
  await transporter.sendMail({
    from: `"Top Career Live" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verification Update – Top Career Live",
    text: `We have reviewed your verification request for ${companyName || "your company"} on Top Career Live. Unfortunately, your request could not be approved at this time.\n\nReason: ${reason}\n\nYou can update your documents and re-submit your verification request. If you believe this was an error, please contact our support team.\n\n— Top Career Live Team`,
    html: getEmployerRejectionEmailHtml(companyName, reason),
  });
}
