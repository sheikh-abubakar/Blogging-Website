import { supabase } from "../services/supabaseClient.js";

/**
 * POST /api/auth/register
 * body: { email, password, full_name? }
 */
export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: full_name || "" }
      }
    });

    if (error) return res.status(400).json({ error: error.message });

    // Insert profile row after successful registration
    if (data.user) {
      const { id } = data.user;
      await supabase
        .from("profiles")
        .insert([
          {
            id,
            username: email.split("@")[0], // or use a username field from req.body if you have one
            full_name: full_name || ""
          }
        ]);
    }

    // For email confirmation ON projects, user must verify email in inbox
    res.status(201).json({
      message: "Registration successful",
      user: data.user
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { access_token, user }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(400).json({ error: error.message });

    const { session, user } = data;
    if (!session) {
      return res.status(400).json({ error: "No session created" });
    }

    res.json({
      message: "Login successful",
      access_token: session.access_token,
      user
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /api/auth/logout
 * Client-side logout is sufficient (discard token).
 * This endpoint is optional; here we just respond OK.
 */
export const logout = async (_req, res) => {
  return res.json({ message: "Logout on client by discarding token" });
};