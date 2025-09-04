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
      .get("/api/posts")
      .then((res) => {
        // Add extensive logging to debug production issues
        console.log("Home API response type:", typeof res.data);
        console.log("Is Array?", Array.isArray(res.data));
        console.log("Home API response structure:", JSON.stringify(res.data).substring(0, 200) + "...");
        
        let postsData: Post[] = [];
        
        try {
          const data = res.data;
          
          // Handle different possible response formats
          if (data === null || data === undefined) {
            throw new Error("Received null or undefined data");
          }
          else if (Array.isArray(data)) {
            // case 1: backend returns raw array
            postsData = data;
          } 
          else if (data && typeof data === 'object') {
            if (Array.isArray(data.posts)) {
              // case 2: backend wraps posts inside "posts" property
              postsData = data.posts;
            } 
            else if (data.data && Array.isArray(data.data)) {
              // case 3: backend wraps posts inside "data" property
              postsData = data.data;
            }
            else {
              // case 4: try to extract posts from unknown structure
              const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
              if (possibleArrays.length > 0) {
                // Use the first array found
                postsData = possibleArrays[0] as Post[];
              } else {
                throw new Error("Could not find posts array in response");
              }
            }
          } 
          else {
            throw new Error(`Unexpected data type: ${typeof data}`);
          }
          
          // Validate each post object
          postsData = postsData.filter(post => post && typeof post === 'object');
          console.log("Processed posts array:", postsData);
          
          setPosts(postsData);
        } catch (parseError) {
          console.error("Error parsing posts data:", parseError);
          setError(`Failed to parse data: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError(`Failed to load posts: ${err.message || err.toString() || "Unknown error"}`);
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
        <div className="card bg-red-50 text-red-700 border border-red-200 p-4">
          <strong>Error:</strong> {error}
          <p className="text-sm mt-2">Check the browser console for more details.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((p) => (
              <PostCard key={p.id || Math.random().toString()} post={p} />
            ))
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