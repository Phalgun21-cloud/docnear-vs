const { clerkClient } = require("@clerk/backend");

// Verify Clerk token and extract user info
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token with Clerk (secret key is read from CLERK_SECRET_KEY env var)
    const clerk = clerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    });
    
    if (!process.env.CLERK_SECRET_KEY) {
      console.warn("⚠️ CLERK_SECRET_KEY is not set. Clerk authentication may not work.");
    }
    
    const session = await clerk.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get user details from Clerk
    const clerkUser = await clerk.users.getUser(session.sub);
    
    // Extract user info
    req.user = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      role: clerkUser.publicMetadata?.role || 'patient', // Default to patient
      clerkId: clerkUser.id
    };

    next();
  } catch (error) {
    console.error("Clerk authentication error:", error);
    if (error.status === 401 || error.message?.includes('token')) {
      return res.status(401).json({ message: "Invalid or expired token. Please sign in again." });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
};
