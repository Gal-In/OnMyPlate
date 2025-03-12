import { useState } from "react";
import ApplicationBar from "./ApplicationBar";
import AddPostPage from "./AddPostPage";

const MainPage = () => {
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isAddingPost ? (
        <AddPostPage setIsAddingPost={setIsAddingPost} isNewPost={true} />
      ) : (
        <ApplicationBar setIsAddingPost={setIsAddingPost} />
      )}
    </div>
  );
};

export default MainPage;
