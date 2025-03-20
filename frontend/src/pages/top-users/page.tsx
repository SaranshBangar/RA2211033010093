import { useState, useEffect } from "react";
import { BackButton } from "../../components/back-button";
import { ThemeToggle } from "../../components/theme-toggle";
import { UserCard } from "./components/user-card";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  postCount: number;
}

const TopUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/top?limit=10");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to load top users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCardClick = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const handleCloseCard = () => {
    setExpandedUserId(null);
  };

  return (
    <div className="min-h-screen p-8 dark:bg-slate-950 dark:text-white transition-colors">
      <div className="flex justify-between mb-6">
        <BackButton />
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-8">Top Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            expanded={expandedUserId === user._id}
            onClick={() => handleCardClick(user._id)}
            onClose={handleCloseCard}
          />
        ))}
      </div>
    </div>
  );
};

export default TopUsersPage;
