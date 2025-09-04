import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import fileUpload from "express-fileupload";
import { uploadImage } from "./controllers/image.controller.js";

dotenv.config();

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173", // Development frontend
    process.env.FRONTEND_URL || "https://your-production-frontend-url.com" // Production frontend
  ],
  credentials: true
}));

app.use(express.json());
app.use(fileUpload());

// Health
app.get("/", (_req, res) => res.send("Mini Blog API up 🚀"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.post("/api/upload", uploadImage);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});