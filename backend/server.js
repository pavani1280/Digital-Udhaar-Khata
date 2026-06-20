import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
//app.use(cors());
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
  "https://digital-udhaar-khata-wheat.vercel.app/"
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (
            ALLOWED_ORIGINS.includes(origin) ||
            /\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }

        return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

if (process.env.NODE_ENV === "production") {
  app.use("/api", limiter);
} else {
  const devLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000
  });
  app.use("/api", devLimiter);
}

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);

// Root endpoint / health check
app.get("/", (req, res) => {
  res.send("MyKhata Backend API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation error occurred", error: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID parameter", error: err.message });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate value entered, record already exists" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error occurred",
    error: process.env.NODE_ENV === "development" ? err.stack : {}
  });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/digital-udhaar-khata";

const startServer = async () => {
  try {
    await connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);

      // Keep Render free instance warm with a self-ping every 14 minutes
      if (process.env.NODE_ENV === "production" && process.env.RENDER_EXTERNAL_URL) {
        setInterval(() => {
          fetch(`${process.env.RENDER_EXTERNAL_URL}/api/health`)
            .then(() => console.log("Keep-alive ping sent"))
            .catch((err) => console.error("Keep-alive ping failed:", err.message));
        }, 14 * 60 * 1000);
      }
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
