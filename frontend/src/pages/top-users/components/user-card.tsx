import { useState, useEffect } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  postCount: number;
}

interface UserPost {
  _id: string;
  content: string;
  createdAt: string;
}

interface UserCardProps {
  user: User;
  expanded: boolean;
  onClick: () => void;
  onClose: () => void;
}

export const UserCard = ({ user, expanded, onClick, onClose }: UserCardProps) => {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded) {
      const fetchUserPosts = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/users/${user._id}/posts`);
          if (!response.ok) throw new Error("Failed to fetch user posts");
          const data = await response.json();
          setUserPosts(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserPosts();
    }
  }, [expanded, user._id]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={`border rounded-md transition-all duration-300 dark:border-slate-700 overflow-hidden ${
        expanded ? "scale-100 shadow-lg" : "hover:shadow-md hover:scale-[1.02]"
      }`}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">@{user.username}</h2>
              <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          {expanded && (
            <button onClick={handleCloseClick} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Close details">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          )}
        </div>

        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded-full">{user.postCount} posts</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t dark:border-slate-700 p-4">
          <h3 className="font-medium mb-3">Recent Posts</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading posts...</p>
          ) : userPosts.length > 0 ? (
            <div className="space-y-3">
              {userPosts.slice(0, 3).map((post) => (
                <div key={post._id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <p className="text-sm">{post.content}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No posts yet</p>
          )}
        </div>
      )}
    </div>
  );
};
