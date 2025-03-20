import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/home/page";
import TopUsersPage from "./pages/top-users/page";
import TrendingPostsPage from "./pages/trending-posts/page";
import FeedPage from "./pages/feed/page";
import ClickSpark from "./components/click-spark";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ClickSpark sparkColor="purple" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <HomePage />
              </ClickSpark>
            }
          />
          <Route
            path="/top-users"
            element={
              <ClickSpark sparkColor="purple" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <TopUsersPage />
              </ClickSpark>
            }
          />
          <Route
            path="/trending-posts"
            element={
              <ClickSpark sparkColor="purple" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <TrendingPostsPage />
              </ClickSpark>
            }
          />
          <Route
            path="/feed"
            element={
              <ClickSpark sparkColor="purple" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <FeedPage />
              </ClickSpark>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
