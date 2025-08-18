import { supabase } from "../services/supabaseClient.js";

// Get all posts
export const getPosts = async (req, res) => {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

//  Create a post
export const createPost = async (req, res) => {
  const { title, content, author } = req.body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, author }]);

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
};

//  Get single post by ID
export const getPostById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Post not found" });

  res.json(data);
};

//  Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Post deleted successfully" });
};
