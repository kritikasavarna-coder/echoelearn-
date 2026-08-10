import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "EchoeLearn Backend Running",
  });
});

// API routes
app.use("/api", apiRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});