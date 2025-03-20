import { Link } from "react-router-dom";
import { ThemeToggle } from "../../components/theme-toggle";

const HomePage = () => {
  return (
    <div className="min-h-screen p-8 dark:bg-slate-950 dark:text-white transition-colors">
      <div className="flex justify-end mb-8">
        <ThemeToggle />
      </div>

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Social Media Analytics Microservice</h1>

        <div className="grid grid-cols-1 gap-4">
          <Link to="/top-users" className="p-6 border rounded-md text-center hover:bg-slate-100 dark:hover:bg-slate-800">
            Top Users
          </Link>

          <Link to="/trending-posts" className="p-6 border rounded-md text-center hover:bg-slate-100 dark:hover:bg-slate-800">
            Trending Posts
          </Link>

          <Link to="/feed" className="p-6 border rounded-md text-center hover:bg-slate-100 dark:hover:bg-slate-800">
            Feed
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
