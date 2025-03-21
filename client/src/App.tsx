import "./App.css";
import SignUpPage from "./Components/SignPage/SignUpPage";
import { Routes, Route } from "react-router-dom";
import MainPage from "./Components/MainPage";
import PostPage from "./Components/PostPage/PostPage";
import SignInPage from "./Components/SignPage/SignInPage";

const App = () => {
  return (
    <Routes>
      <Route path="/restaurant/edit/:id" element={<PostPage />} />
      <Route path="/restaurant/:id" element={<PostPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/" element={<SignInPage />} />
    </Routes>
  );
};

export default App;
