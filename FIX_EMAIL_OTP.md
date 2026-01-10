# 🔧 Fix OTP Email Issue

## Problem
OTP emails are not being sent because `.env` file is not being loaded properly.

## Solution

### Step 1: Edit `.env` File

Open `healthcare-app/backend/.env` and make sure it has **EXACTLY** this format:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/docnear
JWT_SECRET=your-secret-key
EMAIL=rehansanadi007@gmail.com
EMAIL_PASS=fxnnsibogaztdham
GOOGLE_AI_KEY=AIzaSyCLnY_Cv0AE3i_kqQwzgmtw_ZPSuZnb5bM
NODE_ENV=development
```

**Important:**
- ✅ No spaces around `=`
- ✅ No quotes around values
- ✅ No trailing spaces
- ✅ Each variable on its own line
- ✅ App password should be 16 characters (no spaces)

### Step 2: Verify .env File Format

Your `.env` should look like this (no extra formatting):
```
EMAIL=rehansanadi007@gmail.com
EMAIL_PASS=fxnnsibogaztdham
```

**NOT like this:**
```
EMAIL = rehansanadi007@gmail.com  ❌ (spaces)
EMAIL="rehansanadi007@gmail.com"  ❌ (quotes)
EMAIL=rehansanadi007@gmail.com   ❌ (trailing space)
```

### Step 3: Test Email Configuration

```bash
cd healthcare-app/backend
node test-email.js
```

This will:
- Check if credentials are loaded
- Test sending an email
- Show any errors

### Step 4: Restart Backend Server

After updating `.env`, **restart the backend**:

```bash
# Stop backend
pkill -f "node.*server.js"

# Start backend
cd healthcare-app/backend
PORT=5001 npm start
```

### Step 5: Check Logs

Watch the backend logs when signing up:

```bash
tail -f /tmp/backend.log
```

Look for:
- `✅ OTP email sent successfully` - Email worked!
- `⚠️ Email credentials not configured` - .env not loaded
- `❌ Failed to send OTP email` - Check error message

---

## Common Issues

### Issue 1: "Email credentials not configured"
**Cause:** `.env` file not being read
**Fix:**
1. Check file location: `healthcare-app/backend/.env`
2. Verify no syntax errors
3. Restart backend server

### Issue 2: "Invalid login: 535-5.7.8"
**Cause:** Wrong app password or 2FA not enabled
**Fix:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate new app password
3. Copy 16-character password (no spaces)
4. Update `.env` file
5. Restart backend

### Issue 3: Email sent but not received
**Fix:**
1. Check spam/junk folder
2. Check "All Mail" in Gmail
3. Wait 1-2 minutes (sometimes delayed)
4. Verify email address is correct

---

## Quick Test

1. **Update .env** with your credentials
2. **Restart backend**: `pkill -f "node.*server.js" && cd healthcare-app/backend && PORT=5001 npm start`
3. **Sign up** a new user
4. **Check logs**: `tail -f /tmp/backend.log`
5. **Check email** inbox (and spam folder)

---

## Alternative: Use Console OTP (Development)

If email still doesn't work, the OTP is always logged to console:

```bash
tail -f /tmp/backend.log | grep "OTP"
```

You'll see: `📧 OTP for your-email@example.com: 123456`

---

**Need Help?** Check backend logs for detailed error messages!
