import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import type { Post } from "../types";
import PostCard from "../components/PostCard";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/posts")
      .then(res => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const myPosts = useMemo(() => posts.filter(p => p.author_id === user?.id), [posts, user?.id]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-gray-600">Manage your posts</p>
        </div>
        <Link className="btn-primary" to="/create">Create Post</Link>
      </header>

      {loading && <div className="card">Loading…</div>}

      <section className="grid gap-5 md:grid-cols-2">
        {myPosts.map(p => <PostCard key={p.id} post={p} mine={true} />)}
      </section>

      {!loading && myPosts.length === 0 && (
        <div className="card text-gray-600">No posts yet. Click “Create Post”.</div>
      )}
    </div>
  );
}
