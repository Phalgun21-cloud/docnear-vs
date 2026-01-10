# Email Setup Guide for DocNear

## Problem: OTP emails not being sent

The error shows: `535-5.7.8 Username and Password not accepted`

This means Gmail credentials are missing or incorrect in your `.env` file.

## Solution: Configure Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter "DocNear" as the name
4. Click **Generate**
5. Copy the 16-character password (no spaces)

### Step 3: Update .env File

Add these to your `healthcare-app/backend/.env` file:

```env
EMAIL=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Example:**
```env
EMAIL=john.doe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

⚠️ **Important**: Use the App Password, NOT your regular Gmail password!

### Step 4: Restart Backend Server

```bash
cd healthcare-app/backend
# Stop the server (Ctrl+C)
npm start
```

## Alternative: Use Development Mode (No Email Setup)

If you don't want to configure email right now, the system will:
- ✅ Still generate OTPs
- ✅ Save OTPs in database
- ✅ Log OTPs to console
- ✅ Return OTP in API response (development only)

You can manually check the console/logs for the OTP.

## Testing Email Configuration

After setting up, test by:
1. Signing up a new user
2. Check your email inbox
3. Check backend console for any errors

## Troubleshooting

### Error: "Invalid login"
- ✅ Make sure you're using App Password, not regular password
- ✅ Check that 2FA is enabled
- ✅ Verify email and password in .env (no extra spaces)

### Error: "Less secure app access"
- ✅ Use App Password instead (more secure)
- ✅ Don't enable "Less secure app access"

### Still not working?
1. Check backend logs: `tail -f /tmp/backend.log`
2. Verify .env file has correct values
3. Restart backend server
4. Try generating a new App Password

## Current Status

The system now:
- ✅ Logs OTP to console if email fails
- ✅ Returns OTP in response (development mode)
- ✅ Better error messages
- ✅ HTML email template (when working)

---

**Note**: In production, always use proper email configuration. The console logging is only for development.
