const { clerkClient } = require("@clerk/backend");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Lab = require("../models/lab");

// Initialize Clerk client
const getClerkClient = () => {
  return clerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
  });
};

// Sync Clerk user with our database
exports.syncUser = async (req, res) => {
  try {
    const { clerkId, role } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const clerk = getClerkClient();
    const session = await clerk.verifyToken(token);

    if (!session || session.sub !== clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user from Clerk
    const clerkUser = await clerk.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = clerkUser.fullName || clerkUser.firstName || email;

    if (!email) {
      return res.status(400).json({ message: "User email not found" });
    }

    // Determine which model to use
    const userRole = role || clerkUser.publicMetadata?.role || 'patient';
    let Model;
    let userData = {};

    if (userRole === 'doctor') {
      Model = Doctor;
      userData = {
        name,
        email,
        verified: true,
        active: true,
        rating: 0
      };
    } else if (userRole === 'lab') {
      Model = Lab;
      userData = {
        name,
        email,
        verified: true,
        active: true
      };
    } else {
      Model = Patient;
      userData = {
        name,
        email,
        verified: true
      };
    }

    // Check if user exists, if not create, if yes update
    let user = await Model.findOne({ email });
    
    if (!user) {
      user = await Model.create(userData);
    } else {
      // Update existing user
      user.name = name;
      user.verified = true;
      await user.save();
    }

    // Update Clerk metadata with our database ID
    await clerk.users.updateUser(clerkId, {
      publicMetadata: {
        role: userRole,
        dbId: user._id.toString()
      }
    });

    res.json({
      success: true,
      message: "User synced successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: userRole
      }
    });
  } catch (error) {
    console.error("Sync user error:", error);
    res.status(500).json({ message: error.message || "Failed to sync user" });
  }
};

// Get current user from Clerk token
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const clerk = getClerkClient();
    const session = await clerk.verifyToken(token);

    if (!session || !session.sub) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const clerkUser = await clerk.users.getUser(session.sub);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const role = clerkUser.publicMetadata?.role || 'patient';
    const dbId = clerkUser.publicMetadata?.dbId;

    // Try to get user from our database
    let user = null;
    if (dbId) {
      if (role === 'doctor') {
        user = await Doctor.findById(dbId);
      } else if (role === 'lab') {
        user = await Lab.findById(dbId);
      } else {
        user = await Patient.findById(dbId);
      }
    } else {
      // Fallback: search by email
      if (role === 'doctor') {
        user = await Doctor.findOne({ email });
      } else if (role === 'lab') {
        user = await Lab.findOne({ email });
      } else {
        user = await Patient.findOne({ email });
      }
    }

    res.json({
      success: true,
      user: user ? {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: role,
        verified: user.verified || true
      } : {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || email,
        email: email,
        role: role,
        verified: true
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: error.message || "Failed to get user" });
  }
};
