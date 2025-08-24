import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Get all posts
export const getPosts = async (req, res) => {
  const { data, error } = await createClient(supabaseUrl, supabaseKey)
    .from("posts")
    .select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
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
  const { data, error } = await createClient(supabaseUrl, supabaseKey)
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });

  res.json(data);
};

// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await createClient(supabaseUrl, supabaseKey)
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};