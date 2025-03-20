import { useState, useEffect } from "react";
import { BackButton } from "../../components/back-button";
import { ThemeToggle } from "../../components/theme-toggle";
import { PostCard } from "./components/post-card";

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  commentCount: number;
  userId: User;
  media?: string;
}

const TrendingPostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/posts/trending?limit=10");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Failed to load trending posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCardClick = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleCloseCard = () => {
    setExpandedPostId(null);
  };

  return (
    <div className="min-h-screen p-8 dark:bg-slate-950 dark:text-white transition-colors">
      <div className="flex justify-between mb-6">
        <BackButton />
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-8">Trending Posts</h1>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            expanded={expandedPostId === post._id}
            onClick={() => handleCardClick(post._id)}
            onClose={handleCloseCard}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingPostsPage;
