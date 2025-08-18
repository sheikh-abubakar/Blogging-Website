import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // optionally pass { origin: "http://localhost:5173", credentials: true }
app.use(express.json());

// Health
app.get("/", (_req, res) => res.send("Mini Blog API up 🚀"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
