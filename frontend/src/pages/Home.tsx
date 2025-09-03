import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Post } from "../types";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/posts")
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <header className="text-center">
        <h1 className="mt-2 text-4xl font-extrabold text-blue-700">Explore posts</h1>
        <p className="mt-2 text-gray-600 text-lg">Read what others are writing.</p>
      </header>

      {loading && <div className="card">Loading…</div>}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>

      {!loading && posts.length === 0 && (
        <div className="card text-center text-gray-600">No posts yet—be the first!</div>
      )}
    </div>
  );
}