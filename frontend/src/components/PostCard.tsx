import type { Post } from "../types";
import { Link } from "react-router-dom";

export default function PostCard({ post }: { post: Post }) {
  let tags: string[] = [];
  if (Array.isArray(post.tags)) {
    tags = post.tags as string[];
  } else if (typeof post.tags === "string") {
    tags = (post.tags as string).split(",").map((tag: string) => tag.trim()).filter(Boolean);
  }

  return (
    <article className="card hover:shadow-xl transition rounded-lg overflow-hidden bg-white">
      {post.feature_image && (
        <img src={post.feature_image} alt="Feature" className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{tag}</span>
          ))}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>{new Date(post.created_at).toLocaleString()}</span>
          <span>By {(post as any).author_name || post.author_id || "Unknown"}</span>
        </div>
        <Link to={`/post/${post.id}`} className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Read More
        </Link>
      </div>
    </article>
  );
}