# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the DocNear healthcare application.

## 📋 Prerequisites

1. A Clerk account (sign up at https://clerk.com)
2. Node.js and npm installed
3. Access to your backend and frontend environment variables

## 🔧 Setup Steps

### 1. Create a Clerk Application

1. Go to https://clerk.com and sign up/login
2. Click "Create Application"
3. Choose your application name (e.g., "DocNear")
4. Select authentication methods:
   - Email/Password (required)
   - Social providers (optional): Google, GitHub, etc.
5. Complete the setup wizard

### 2. Get Your Clerk Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Frontend Environment Variables

Create or update `.env` file in `healthcare-app/frontend/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:5001/api
```

### 4. Configure Backend Environment Variables

Create or update `.env` file in `healthcare-app/backend/`:

```env
CLERK_SECRET_KEY=sk_test_your_secret_key_here
MONGO_URI=your_mongodb_connection_string
PORT=5001
```

### 5. Configure Clerk Dashboard Settings

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable email verification
3. Go to **Paths** and configure:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

### 6. Set Up User Metadata (for Roles)

1. Go to **User & Authentication** → **Metadata**
2. Add custom metadata field:
   - **Key**: `role`
   - **Type**: String
   - **Default**: `patient`
   - **Allowed values**: `patient`, `doctor`, `lab`

### 7. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
# Frontend
cd healthcare-app/frontend
npm install @clerk/clerk-react

# Backend
cd healthcare-app/backend
npm install @clerk/backend
```

## 🚀 Testing the Integration

1. **Start the backend server:**
   ```bash
   cd healthcare-app/backend
   npm start
   ```

2. **Start the frontend server:**
   ```bash
   cd healthcare-app/frontend
   npm run dev
   ```

3. **Test the flow:**
   - Navigate to http://localhost:3000
   - Click "Sign Up"
   - Create a new account
   - Verify email (if required)
   - Sign in
   - Check that you're redirected to the dashboard

## 🔄 Syncing Users with Database

When a user signs up with Clerk, you need to sync them with your MongoDB database. This happens automatically when they:

1. Sign up for the first time
2. Access protected routes

The sync endpoint (`/api/clerk/sync`) will:
- Create a user record in MongoDB (Patient, Doctor, or Lab model)
- Link Clerk user ID with database ID
- Store role in Clerk metadata

## 📝 API Endpoints

### Clerk Sync Endpoint
- `POST /api/clerk/sync` - Sync Clerk user with database
- `GET /api/clerk/me` - Get current user info

### Authentication
All protected routes now use Clerk tokens. The backend middleware automatically:
- Verifies Clerk tokens
- Extracts user information
- Sets `req.user` with user ID, email, and role

## 🎨 Customization

### Customize Sign-In/Sign-Up Pages

Edit these files:
- `frontend/src/pages/SignIn.tsx`
- `frontend/src/pages/SignUp.tsx`

You can customize Clerk components using the `appearance` prop:

```tsx
<SignIn 
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-2xl border-0",
      // Add more customizations
    }
  }}
/>
```

### User Button Customization

The UserButton in the Navbar can be customized:

```tsx
<UserButton 
  afterSignOutUrl="/"
  appearance={{
    elements: {
      avatarBox: "w-10 h-10"
    }
  }}
/>
```

## 🔒 Security Notes

1. **Never commit** `.env` files with real keys
2. Use **test keys** for development
3. Use **live keys** only in production
4. Keep your **Secret Key** secure - never expose it in frontend code
5. Clerk handles password hashing, email verification, and session management automatically

## 🐛 Troubleshooting

### "VITE_CLERK_PUBLISHABLE_KEY is not set"
- Make sure you've added the key to `frontend/.env`
- Restart the frontend dev server after adding env variables

### "Invalid token" errors
- Check that `CLERK_SECRET_KEY` is set in backend `.env`
- Verify the key matches your Clerk dashboard
- Make sure you're using the correct environment (test vs live)

### Users not syncing with database
- Check backend logs for sync errors
- Verify MongoDB connection
- Ensure the sync endpoint is being called after sign-up

### Role not persisting
- Check Clerk dashboard → User metadata settings
- Verify role is set in `publicMetadata` when syncing
- Check that role is being read correctly in frontend

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Backend SDK](https://clerk.com/docs/references/backend/overview)

## ✅ Checklist

- [ ] Clerk account created
- [ ] Application created in Clerk dashboard
- [ ] Publishable key added to frontend `.env`
- [ ] Secret key added to backend `.env`
- [ ] User metadata (role) configured
- [ ] Paths configured in Clerk dashboard
- [ ] Dependencies installed
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Verify user sync with database

---

**Need Help?** Check the Clerk documentation or create an issue in the repository.
