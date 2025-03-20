import { useState, useEffect } from "react";
import { BackButton } from "../../components/back-button";
import { ThemeToggle } from "../../components/theme-toggle";
import { FeedItem } from "./components/feed-item";

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

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts/feed?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error("Failed to fetch feed");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Failed to load feed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [page]);

  const handleCardClick = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleCloseCard = () => {
    setExpandedPostId(null);
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="min-h-screen p-8 dark:bg-slate-950 dark:text-white transition-colors">
      <div className="flex justify-between mb-6">
        <BackButton />
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-8">Feed</h1>

      {loading && page === 1 && <p>Loading feed...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6">
        {posts.map((post) => (
          <FeedItem
            key={post._id}
            post={post}
            expanded={expandedPostId === post._id}
            onClick={() => handleCardClick(post._id)}
            onClose={handleCloseCard}
          />
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMorePosts}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {loading && page > 1 ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
