import { supabase } from "../services/supabaseClient.js";

/**
 * Expect "Authorization: Bearer <access_token>"
 * Verifies token with Supabase and attaches user to req.user
 */
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = data.user; // { id, email, ... }
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
