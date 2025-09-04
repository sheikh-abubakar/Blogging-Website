import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Post } from "../types";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/posts")
      .then((res) => {
        const data = res.data;
        console.log("Home API response:", data);

        if (Array.isArray(data)) {
          // case 1: backend returns raw array
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          // case 2: backend wraps posts inside "posts"
          setPosts(data.posts);
        } else {
          setPosts([]);
          setError("Received invalid data format from server");
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <header className="text-center">
        <h1 className="mt-2 text-4xl font-extrabold text-blue-700">
          Explore posts
        </h1>
        <p className="mt-2 text-gray-600 text-lg">
          Read what others are writing.
        </p>
      </header>

      {loading && <div className="card">Loading…</div>}

      {error && (
        <div className="card bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="card text-center text-gray-600 col-span-full">
              No posts yet—be the first!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
