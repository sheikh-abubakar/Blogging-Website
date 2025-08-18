import type { Post } from "../types";

export default function PostCard({ post, mine }: { post: Post; mine?: boolean }) {
  return (
    <article className="card hover:shadow-lg transition">
      <header className="flex items-start justify-between">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        {mine && <span className="text-xs rounded-full bg-gray-100 px-2 py-1">My post</span>}
      </header>
      <p className="mt-3 text-gray-700 whitespace-pre-wrap">{post.content}</p>
      <footer className="mt-4 text-xs text-gray-500">
        {new Date(post.created_at).toLocaleString()}
      </footer>
    </article>
  );
}
