import express from "express";
import { getPosts, createPost, getPostById, deletePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);          
router.post("/", createPost);       
router.get("/:id", getPostById);    
router.delete("/:id", deletePost);

export default router;
