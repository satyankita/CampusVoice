
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Reuse the MongoDB connection across serverless requests
let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
  cachedConnection = global.mongooseConnection = {
    connection: null,
    promise: null,
  };
}

async function connectDB() {
  if (cachedConnection.connection) {
    return cachedConnection.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cachedConnection.promise = null;
        throw error;
      });
  }

  cachedConnection.connection = await cachedConnection.promise;
  return cachedConnection.connection;
}

// Connect to the database before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      message: "Database connection failed. Check server configuration.",
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Student Feedback Manager API is running!" });
});

// Feedback routes
app.use("/api/feedback", feedbackRoutes);

// Run a local server during development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;
