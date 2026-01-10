const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure .env is loaded

exports.sendOtp = async (email, otp) => {
  // Debug: Check email configuration
  console.log("🔍 Email Config Check:");
  console.log("  EMAIL:", process.env.EMAIL ? `${process.env.EMAIL.substring(0, 3)}***` : "NOT SET");
  console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "SET (***)" : "NOT SET");
  
  // Check if email credentials are configured
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email credentials not configured. OTP will be logged to console.");
    console.log(`📧 OTP for ${email}: ${otp}`);
    return { sent: false, otp, message: "Email not configured, OTP logged to console" };
  }

  try {
    // Verify credentials before creating transporter
    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not found in environment variables");
    }

    console.log(`📤 Attempting to send OTP email to: ${email}`);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL.trim(),
        pass: process.env.EMAIL_PASS.trim()
      },
      // Add timeout and connection options
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ SMTP server connection verified");

    const mailOptions = {
      from: `"DocNear" <${process.env.EMAIL}>`,
      to: email,
      subject: "DocNear - OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">DocNear</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Email Verification</h2>
            <p style="color: #4b5563; font-size: 16px;">Your OTP for email verification is:</p>
            <div style="background: white; border: 2px dashed #14b8a6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #14b8a6; letter-spacing: 5px; margin: 0;">${otp}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This OTP will expire in 10 minutes. Please do not share this code with anyone.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2024 DocNear. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `Your DocNear OTP is: ${otp}\n\nThis OTP will expire in 10 minutes. Please do not share this code with anyone.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    console.error("   Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // Log OTP to console as fallback
    console.log(`📧 FALLBACK - OTP for ${email}: ${otp}`);
    console.log(`   ⚠️  Email failed, but OTP is saved in database. Use: ${otp}`);
    
    // Don't throw - return error info instead
    return { 
      sent: false, 
      otp, 
      error: error.message,
      message: "Email sending failed. OTP logged to console and saved in database."
    };
  }
};

