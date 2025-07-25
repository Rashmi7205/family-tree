// Utility to send email using Gmail SMTP
export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  // Placeholder - implement with your email service

  // Example with a hypothetical email service:
  // await emailService.send({
  //   to: email,
  //   subject: 'Verify your email address',
  //   html: `
  //     <h1>Verify your email address</h1>
  //     <p>Click the link below to verify your email address:</p>
  //     <a href="${verificationUrl}">Verify Email</a>
  //   `
  // })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;

  // Placeholder - implement with your email servic

  // Example with a hypothetical email service:
  // await emailService.send({
  //   to: email,
  //   subject: 'Reset your password',
  //   html: `
  //     <h1>Reset your password</h1>
  //     <p>Click the link below to reset your password:</p>
  //     <a href="${resetUrl}">Reset Password</a>
  //   `
  // })
}
