import Header from "./Header/Header";
import SearchResults from "./SearchResult/SearchResults";
import Home from "./Home/Home";
import Comment from "./Comment/Comment";
import SubReddits from "./SubReddits/SubReddits";
import ErrorPage from "./ErrorPage/ErrorPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="r/:subReddit/:postId" element={<Comment />} />
        <Route path="r/:subReddit" element={<SubReddits />} />
        <Route path="/:option" element={<SubReddits />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="*" element={<Navigate to="/error" />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
