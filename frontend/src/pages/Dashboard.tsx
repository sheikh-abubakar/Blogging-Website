import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import PostCard from "../components/PostCard";
import Button from "../components/Button";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import type { Post } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        // Ensure posts is always an array
        const postsData = Array.isArray(response.data) ? response.data : [];
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Make sure myPosts is always an array
  const myPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.filter(p => p.author_id === user?.id);
  }, [posts, user?.id]);

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/create">
          <Button>Create Post</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">My Posts</h2>
          {Array.isArray(myPosts) && myPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPosts.map(p => <PostCard key={p.id} post={p} mine={true} />)}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">You haven't created any posts yet.</p>
          )}
        </>
      )}
    </Container>
  );
}