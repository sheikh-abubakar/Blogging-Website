import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Get all posts
export const getPosts = async (req, res) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        author_id,
        created_at,
        tags,
        feature_image,
        profiles (
          full_name,
          username
        )
      `)
      .order("created_at", { ascending: false });
    
    // Add these lines for debugging
    console.log("Supabase posts data:", data);
    console.log("Supabase posts error:", error);
    
    if (error) return res.status(400).json({ error: error.message });

    // Ensure data is always an array
    const posts = (Array.isArray(data) ? data : []).map(post => ({
      ...post,
      author_name: post.profiles?.full_name || post.profiles?.username || post.author_id || "Unknown"
    }));

    res.json(posts);
  } catch (err) {
    console.error("Error in getPosts:", err);
    // Return empty array on error instead of error object
    res.status(500).json([]);
  }
};

// Create a post
export const createPost = async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) return res.status(401).json({ error: "Invalid user" });

    const { title, content, tags, feature_image } = req.body;
    const author_id = userData.user.id;

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, author_id, tags, feature_image }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  const { id } = req.params;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      content,
      author_id,
      created_at,
      tags,
      feature_image,
      profiles (
        full_name,
        username
      )
    `)
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });

  res.json({
    ...data,
    author_name: data?.profiles?.full_name || data?.profiles?.username || data.author_id || "Unknown"
  });
};

// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};