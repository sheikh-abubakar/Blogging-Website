import type { Post } from "../types";
import { Link } from "react-router-dom";

// Add the mine prop to your component definition with optional flag
export default function PostCard({ post, mine }: { post: Post; mine?: boolean }) {
  let tags: string[] = [];
  
  // Fix TypeScript errors by adding type assertions
  if (Array.isArray(post.tags)) {
    tags = post.tags as string[];
  } else if (typeof post.tags === "string") {
    
    const tagString = post.tags as string;
    
    if (tagString.startsWith('[') && tagString.endsWith(']')) {
      try {
        const parsedTags = JSON.parse(tagString);
        if (Array.isArray(parsedTags)) {
          tags = parsedTags;
        }
      } catch (e) {
        tags = tagString.split(",").map((tag: string) => tag.trim()).filter(Boolean);
      }
    } else {
      tags = tagString.split(",").map((tag: string) => tag.trim()).filter(Boolean);
    }
  }

  tags = tags.map(tag => {
    if (typeof tag === 'string') {
      return tag.replace(/^["'\[\]]+|["'\[\]]+$/g, '').trim();
    }
    return tag;
  });

  return (
    <article className="card hover:shadow-xl transition rounded-lg overflow-hidden bg-white">
      {/* Optionally display a badge if it's the user's own post */}
      {mine && (
        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 absolute top-2 right-2 rounded">
          My Post
        </div>
      )}
      
      {post.feature_image && (
        <img src={post.feature_image} alt="Feature" className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map((tag: string, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors duration-200"
            >
              #{tag}
            </span>
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