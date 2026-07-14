import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Ensure uploads dir exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "15mb" })); // large limit for base64 captured images
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Serve uploaded images statically
app.use("/uploads", express.static(uploadDir));

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Product Management API is running");
});

// Basic error handler (e.g. multer errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
