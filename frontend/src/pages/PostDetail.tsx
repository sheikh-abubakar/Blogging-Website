import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import type { Post } from "../types";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/posts/${id}`)
      .then(res => setPost(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="card">Loading…</div>;
  if (!post) return <div className="card">Post not found.</div>;

  let tags: string[] = [];
  if (Array.isArray(post.tags)) {
    tags = post.tags as string[];
  } else if (typeof post.tags === "string") {
    tags = (post.tags as string).split(",").map((tag: string) => tag.trim()).filter(Boolean);
  }

  // Use post.author_name if available, else fallback to post.author_id
  const author = (post as any).author_name || post.author_id || "Unknown";

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to posts</Link>
      <article className="card bg-white rounded-lg shadow-lg p-6">
        {post.feature_image && (
          <img src={post.feature_image} alt="Feature" className="w-full h-64 object-cover rounded mb-4" />
        )}
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{tag}</span>
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span>{new Date(post.created_at).toLocaleString()}</span>
          <span>By {author}</span>
        </div>
        <div className="text-gray-800 whitespace-pre-line text-lg">{post.content}</div>
      </article>
    </div>
  );
}