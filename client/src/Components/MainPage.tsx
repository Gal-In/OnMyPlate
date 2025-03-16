import { useState } from "react";
import ApplicationBar from "./ApplicationBar";
import AddPostPage from "./AddPostPage";
import { useUser } from "../Context/useUser";
import SignUpPage from "./SignPage/SignUpPage";

const MainPage = () => {
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const { user } = useUser();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isAddingPost ? (
        <AddPostPage setIsAddingPost={setIsAddingPost} isNewPost={true} />
      ) : isEditingProfile ? (
        <SignUpPage user={user!} onFinish={() => setIsEditingProfile(false)} />
      ) : (
        <ApplicationBar
          setIsAddingPost={setIsAddingPost}
          setIsEditingProfile={setIsEditingProfile}
        />
      )}
    </div>
  );
};

export default MainPage;
