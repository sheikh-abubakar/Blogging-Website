import { supabase } from "../services/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

export const uploadImage = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file.data, { contentType: file.mimetype });

    if (error) {
      console.error(error); // Log the error for debugging
      return res.status(400).json({ error: error.message });
    }

    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err); // Log unexpected errors
    res.status(500).json({ error: "Image upload failed" });
  }
};