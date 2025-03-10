import { useEffect } from "react";
import "./App.css";
import SignUpPage from "./Components/SignPage/SignUpPage";
import { useUser } from "./Hooks/useUser";
import MainPage from "./Components/MainPage";

const App = () => {
  const { user } = useUser();
  useEffect(() => {
    // check if there are tokens in storage etc
  }, []);

  return <div className="App">{user ? <MainPage /> : <SignUpPage />}</div>;
};

export default App;
