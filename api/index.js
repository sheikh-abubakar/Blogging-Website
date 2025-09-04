import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from "../backend/routes/auth.routes.js";
import postRoutes from "../backend/routes/post.routes.js";
import fileUpload from "express-fileupload";
import { uploadImage } from "../backend/controllers/image.controller.js";

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../backend/.env') });

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.post("/api/upload", uploadImage);

// Health check
app.get("/api", (req, res) => {
  res.send("Mini Blog API up 🚀");
});

export default app;