require("dotenv").config({ path: require('path').resolve(__dirname, '.env') });
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Debug: Log environment variables (masked)
console.log("🔍 Environment Check:");
console.log("  PORT:", process.env.PORT || "5001 (default)");
console.log("  EMAIL:", process.env.EMAIL ? `${process.env.EMAIL.substring(0, 5)}***` : "NOT SET");
console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
console.log("  MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");

const app = express();
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/clerk", require("./routes/clerkroutes"));
app.use("/api/doctors", require("./routes/doctorroutes"));
app.use("/api/appointments", require("./routes/appointmentroutes"));
app.use("/api/emi", require("./routes/emiroutes"));
app.use("/api/services", require("./routes/serviceroutes"));
app.use("/api/payments", require("./routes/paymentroutes"));
app.use("/api/lab", require("./routes/labroutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
