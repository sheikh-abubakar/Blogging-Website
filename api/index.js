import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "../backend/routes/auth.routes.js";
import postRoutes from "../backend/routes/post.routes.js";
import fileUpload from "express-fileupload";
import { uploadImage } from "../backend/controllers/image.controller.js";

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../backend/.env") });

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routes
app.get("/", (req, res) => res.send("Mini Blog API up 🚀"));
app.get("/debug", (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
    headers: req.headers,
    url: req.url,
    supabaseUrl: process.env.SUPABASE_URL ? "Set" : "Not set",
    supabaseKey: process.env.SUPABASE_KEY ? "Set" : "Not set",
  });
});

app.use((req, res, next) => {
  // Strip /api prefix if present for Vercel deployment
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api/', '/');
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.post("/upload", uploadImage);

// For Vercel serverless deployment
export default function handler(req, res) {
  return app(req, res);
}

// For local development
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export { app };
