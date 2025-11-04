import nodemailer from "nodemailer"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function testEmail() {
  console.log("🔧 Testing Gmail SMTP Configuration...\n")

  // Display configuration (hide password)
  console.log("📧 Email Configuration:")
  console.log(`   Host: ${process.env.EMAIL_SERVER_HOST}`)
  console.log(`   Port: ${process.env.EMAIL_SERVER_PORT}`)
  console.log(`   User: ${process.env.EMAIL_SERVER_USER}`)
  console.log(`   Password: ${process.env.EMAIL_SERVER_PASSWORD ? '****' + process.env.EMAIL_SERVER_PASSWORD.slice(-4) : 'Not set'}`)
  console.log(`   From: ${process.env.EMAIL_FROM}\n`)

  // Check if all required fields are set
  if (!process.env.EMAIL_SERVER_HOST || 
      !process.env.EMAIL_SERVER_USER || 
      !process.env.EMAIL_SERVER_PASSWORD) {
    console.error("❌ Error: Email configuration is incomplete!")
    console.log("\nPlease set the following in .env:")
    console.log("  - EMAIL_SERVER_HOST")
    console.log("  - EMAIL_SERVER_USER")
    console.log("  - EMAIL_SERVER_PASSWORD (Gmail App Password)")
    process.exit(1)
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    debug: true, // Enable debug output
  })

  try {
    // Step 1: Verify connection
    console.log("⏳ Step 1: Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully!\n")

    // Step 2: Send test email
    console.log("⏳ Step 2: Sending test email...")
    const testRecipient = process.env.EMAIL_SERVER_USER // Send to self
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
      to: testRecipient,
      subject: "🧪 Test Email - E-Commerce Application",
      text: "This is a test email from your e-commerce application. If you receive this, SMTP is working correctly!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #334155;">🎉 SMTP Test Successful!</h2>
          <p>Congratulations! Your email configuration is working correctly.</p>
          
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #475569;">Configuration Details:</h3>
            <ul style="color: #64748b;">
              <li><strong>SMTP Host:</strong> ${process.env.EMAIL_SERVER_HOST}</li>
              <li><strong>Port:</strong> ${process.env.EMAIL_SERVER_PORT}</li>
              <li><strong>User:</strong> ${process.env.EMAIL_SERVER_USER}</li>
              <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>

          <p style="color: #64748b;">
            This test email was sent from your e-commerce application to verify that 
            email verification and notifications will work correctly.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
            <p>This is an automated test message. No action is required.</p>
          </div>
        </div>
      `,
    })

    console.log("✅ Test email sent successfully!\n")
    console.log("📬 Email Details:")
    console.log(`   Message ID: ${info.messageId}`)
    console.log(`   Recipient: ${testRecipient}`)
    console.log(`   Response: ${info.response}\n`)

    console.log("🎉 All tests passed! Your Gmail SMTP is configured correctly.")
    console.log(`\n📧 Please check your inbox at: ${testRecipient}`)
    
  } catch (error) {
    console.error("\n❌ Error occurred during testing:\n")
    
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      
      // Provide helpful troubleshooting tips
      if (error.message.includes("Invalid login")) {
        console.log("\n💡 Troubleshooting Tips:")
        console.log("   1. Make sure you're using Gmail App Password, not your regular password")
        console.log("   2. Generate App Password at: https://myaccount.google.com/apppasswords")
        console.log("   3. You need to enable 2-Factor Authentication first")
        console.log("   4. Remove spaces from the App Password (should be 16 characters)")
      } else if (error.message.includes("ECONNREFUSED")) {
        console.log("\n💡 Troubleshooting Tips:")
        console.log("   1. Check your internet connection")
        console.log("   2. Make sure port 587 is not blocked by firewall")
        console.log("   3. Try using port 465 with secure: true")
      } else if (error.message.includes("ETIMEDOUT")) {
        console.log("\n💡 Troubleshooting Tips:")
        console.log("   1. Check your internet connection")
        console.log("   2. Your ISP might be blocking SMTP ports")
        console.log("   3. Try using a VPN")
      }
    } else {
      console.error(error)
    }
    
    process.exit(1)
  }
}

// Run test
testEmail().catch(console.error)
