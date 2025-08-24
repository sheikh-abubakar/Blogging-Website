import type { Post } from "../types";

export default function PostCard({ post, mine }: { post: Post; mine?: boolean }) {
  // Ensure tags is always an array of strings
  let tags: string[] = [];
  if (Array.isArray(post.tags)) {
    tags = post.tags as string[];
  } else if (typeof post.tags === "string") {
    tags = (post.tags as string).split(",").map((tag: string) => tag.trim()).filter(Boolean);
  }

  return (
    <article className="card hover:shadow-lg transition">
      {post.feature_image && (
        <img src={post.feature_image} alt="Feature" className="w-full h-48 object-cover rounded" />
      )}
      <header className="flex items-start justify-between">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        {mine && <span className="text-xs rounded-full bg-gray-100 px-2 py-1">My post</span>}
      </header>
      {tags.length > 0 && (
        <div className="flex gap-2 mt-2">
          {tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-200 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}
      <p className="mt-3 text-gray-700 whitespace-pre-wrap">{post.content}</p>
      <footer className="mt-4 text-xs text-gray-500">
        {new Date(post.created_at).toLocaleString()}
      </footer>
    </article>
  );
}