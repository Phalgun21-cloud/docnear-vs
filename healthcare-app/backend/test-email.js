// Test Email Configuration
require("dotenv").config({ path: require('path').resolve(__dirname, '.env') });
const { sendOtp } = require("./utils/mailer");

async function testEmail() {
  console.log("🧪 Testing Email Configuration...\n");
  
  console.log("Environment Variables:");
  console.log("  EMAIL:", process.env.EMAIL || "NOT SET");
  console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "SET (length: " + process.env.EMAIL_PASS.length + ")" : "NOT SET");
  console.log("");
  
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.error("❌ Email credentials not configured!");
    console.log("\nPlease add to .env file:");
    console.log("  EMAIL=your-email@gmail.com");
    console.log("  EMAIL_PASS=your-app-password");
    process.exit(1);
  }
  
  const testEmail = process.env.EMAIL; // Send to yourself
  const testOtp = "123456";
  
  console.log(`📧 Sending test OTP to: ${testEmail}`);
  console.log(`   OTP: ${testOtp}\n`);
  
  try {
    const result = await sendOtp(testEmail, testOtp);
    if (result.sent) {
      console.log("✅ Test email sent successfully!");
      console.log("   Check your inbox:", testEmail);
    } else {
      console.log("⚠️  Email not sent:", result.message);
    }
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    console.error("\nCommon issues:");
    console.error("  1. App Password incorrect");
    console.error("  2. 2-Step Verification not enabled");
    console.error("  3. Gmail account security settings");
    console.error("  4. Network/firewall blocking SMTP");
  }
  
  process.exit(0);
}

testEmail();
