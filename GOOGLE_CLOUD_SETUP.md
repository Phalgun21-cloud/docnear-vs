# Google Cloud Setup Guide for DocNear

## 🔑 API Key Configuration

Your Google AI API key has been configured:
- **API Key**: `AIzaSyCLnY_Cv0AE3i_kqQwzgmtw_ZPSuZnb5bM`
- **Location**: `healthcare-app/backend/.env`
- **Variable**: `GOOGLE_AI_KEY`

## 🚀 Required Google Cloud APIs to Enable

To use Google Generative AI (Gemini) in your DocNear application, you need to enable the following APIs in Google Cloud Console:

### 1. **Generative Language API** (Primary)
   - **API Name**: `generativelanguage.googleapis.com`
   - **Purpose**: Access to Gemini Pro model for AI-powered doctor recommendations
   - **Enable URL**: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

### 2. **AI Platform API** (Optional but Recommended)
   - **API Name**: `ml.googleapis.com`
   - **Purpose**: Additional AI/ML capabilities
   - **Enable URL**: https://console.cloud.google.com/apis/library/ml.googleapis.com

## 📋 Step-by-Step Setup Instructions

### Step 1: Enable Generative Language API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for **"Generative Language API"**
5. Click on **"Generative Language API"**
6. Click **"Enable"** button
7. Wait for the API to be enabled (usually takes 1-2 minutes)

### Step 2: Verify API Key Permissions

1. Go to **APIs & Services** > **Credentials**
2. Find your API key: `AIzaSyCLnY_Cv0AE3i_kqQwzgmtw_ZPSuZnb5bM`
3. Click on the key to edit it
4. Under **API restrictions**, select **"Restrict key"**
5. Check **"Generative Language API"** in the list
6. Click **"Save"**

### Step 3: Set Application Restrictions (Recommended for Security)

1. In the same API key edit page
2. Under **Application restrictions**, select **"IP addresses"**
3. Add your server IP address (or leave unrestricted for development)
4. Click **"Save"**

## 🔒 Security Best Practices

### API Key Restrictions

**Application Restrictions:**
- **For Development**: Leave unrestricted or use IP address restriction
- **For Production**: Restrict to specific IP addresses or HTTP referrers

**API Restrictions:**
- ✅ **Enable**: Generative Language API only
- ❌ **Disable**: All other APIs to prevent unauthorized use

### Billing & Quotas

1. Go to **APIs & Services** > **Dashboard**
2. Check your **Quotas** for Generative Language API
3. Set up **Billing Alerts** to monitor usage
4. Default free tier: 60 requests per minute

## 🧪 Testing the Connection

After enabling the API, test the connection:

```bash
# Test the doctors search endpoint
curl "http://localhost:5001/api/doctors/search?specialist=Cardiologist"
```

Expected response should include:
- `success: true`
- `doctors`: Array of doctors
- `topDoctors`: AI-recommended top 3 doctors

## 📊 Current Implementation

The Google AI integration is used in:
- **File**: `backend/controllers/doctorcontroller.js`
- **Function**: `searchDoctors()`
- **Model**: `gemini-pro`
- **Purpose**: AI-powered doctor recommendations based on ratings

## ⚠️ Troubleshooting

### Error: "API key not valid"
- Verify the API key is correct in `.env` file
- Check that Generative Language API is enabled
- Verify API key has proper permissions

### Error: "Quota exceeded"
- Check your quota limits in Google Cloud Console
- Consider upgrading your plan or implementing rate limiting

### Error: "Permission denied"
- Ensure the API key has access to Generative Language API
- Check API restrictions in Google Cloud Console

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Generative Language API Documentation](https://ai.google.dev/docs)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Gemini API Reference](https://ai.google.dev/api)

## ✅ Verification Checklist

- [ ] Generative Language API is enabled
- [ ] API key is configured in `.env` file
- [ ] API key has proper restrictions set
- [ ] Backend server is running on port 5001
- [ ] Test endpoint returns successful response
- [ ] AI recommendations are working

---

**Note**: Keep your API key secure and never commit it to version control. The `.env` file is already in `.gitignore`.
