import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Get all posts
export const getPosts = async (req, res) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Debug environment variables
  console.log("Supabase URL available:", !!supabaseUrl);
  console.log("Supabase Key available:", !!supabaseKey);
  
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    
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
    
    // Enhanced debugging
    console.log("Supabase posts response type:", typeof data);
    console.log("Supabase posts is array:", Array.isArray(data));
    console.log("Supabase posts sample:", data && data.length > 0 ? JSON.stringify(data[0]).substring(0, 100) : "No posts");
    console.log("Supabase posts error:", error);
    
    if (error) {
      console.error("Supabase error:", error);
      return res.status(400).json([]);  // Return empty array on error
    }

    if (!data || !Array.isArray(data)) {
      console.warn("Data is not an array, returning empty array");
      return res.json([]);
    }

    // Process each post and handle potential missing fields
    const posts = data.map(post => {
      if (!post) return null;
      
      try {
        return {
          id: post.id || "",
          title: post.title || "",
          content: post.content || "",
          author_id: post.author_id || "",
          created_at: post.created_at || new Date().toISOString(),
          tags: Array.isArray(post.tags) ? post.tags : 
                (typeof post.tags === 'string' ? [post.tags] : []),
          feature_image: post.feature_image || "",
          author_name: post.profiles?.full_name || 
                      post.profiles?.username || 
                      post.author_id || 
                      "Unknown"
        };
      } catch (e) {
        console.error("Error processing post:", e);
        return null;
      }
    }).filter(Boolean); // Remove any null entries

    console.log(`Sending ${posts.length} processed posts`);
    return res.json(posts);
  } catch (err) {
    console.error("Error in getPosts:", err);
    // Return empty array on error instead of error object
    return res.status(500).json([]);
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
      .insert([{ title, content, author_id, tags, feature_image }])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
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

    if (!data) return res.status(404).json({ error: "Post not found" });

    res.json({
      ...data,
      author_name: data?.profiles?.full_name || data?.profiles?.username || data.author_id || "Unknown"
    });
  } catch (err) {
    console.error("Get post by ID error:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data || []);
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};