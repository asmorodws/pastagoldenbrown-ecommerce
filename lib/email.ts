import nodemailer from "nodemailer"

// Check if email is configured
const isEmailConfigured = 
  process.env.EMAIL_SERVER_HOST && 
  process.env.EMAIL_SERVER_USER && 
  process.env.EMAIL_SERVER_PASSWORD

let transporter: nodemailer.Transporter | null = null

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  // Skip email sending if not configured (development mode)
  if (!isEmailConfigured || !transporter) {
    console.log("⚠️  Email not configured. Skipping email verification.")
    console.log(`📧 Verification URL: ${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`)
    return // Skip email sending but don't throw error
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verifikasi Email Anda",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verifikasi Email Anda</h2>
        <p>Terima kasih telah mendaftar! Silakan klik tombol di bawah ini untuk memverifikasi email Anda:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Verifikasi Email
        </a>
        <p>Atau salin dan tempel link berikut ke browser Anda:</p>
        <p style="color: #666;">${verificationUrl}</p>
        <p>Link ini akan kadaluarsa dalam 24 jam.</p>
        <p>Jika Anda tidak mendaftar untuk akun ini, abaikan email ini.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("✅ Verification email sent successfully to:", email)
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Gagal mengirim email verifikasi")
  }
}
