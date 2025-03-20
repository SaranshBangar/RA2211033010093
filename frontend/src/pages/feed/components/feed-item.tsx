import { useState, useEffect } from "react";

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

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  userId: User;
}

interface FeedItemProps {
  post: Post;
  expanded: boolean;
  onClick: () => void;
  onClose: () => void;
}

export const FeedItem = ({ post, expanded, onClick, onClose }: FeedItemProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded) {
      const fetchComments = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/posts/${post._id}/comments`);
          if (!response.ok) throw new Error("Failed to fetch comments");
          const data = await response.json();
          setComments(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchComments();
    }
  }, [expanded, post._id]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`border rounded-md transition-all duration-300 dark:border-slate-700 ${
        expanded ? "scale-100 shadow-lg" : "hover:shadow-md hover:scale-[1.01]"
      }`}
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {post.userId.profilePicture ? (
              <img src={post.userId.profilePicture} alt={post.userId.username} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300">
                {post.userId.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="font-semibold">@{post.userId.username}</h2>
              <p className="text-sm text-slate-500">{formattedDate}</p>
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

        <div className="mb-4">
          <p className="text-slate-800 dark:text-slate-200">{post.content}</p>
          {post.media && <img src={post.media} alt="Post media" className="mt-4 rounded-md max-h-72 w-full object-cover" />}
        </div>

        <div className="flex items-center text-slate-500">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {post.commentCount} comments
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t dark:border-slate-700 p-5">
          <h3 className="font-medium mb-4">Comments</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  {comment.userId.profilePicture ? (
                    <img src={comment.userId.profilePicture} alt={comment.userId.username} className="w-8 h-8 rounded-full object-cover mt-1" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm mt-1">
                      {comment.userId.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <p className="font-medium text-sm">@{comment.userId.username}</p>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-2">{new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No comments yet</p>
          )}
        </div>
      )}
    </div>
  );
};
