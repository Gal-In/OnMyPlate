import { useEffect, useState } from "react";
import ApplicationBar from "./ApplicationBar";
import AddPostPage from "./AddPostPage";
import { useUser } from "../Context/useUser";
import SignUpPage from "./SignPage/SignUpPage";
import { Post } from "../Types/postTypes";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostTeaser from "./PostTeaser";
import { getPagedPosts, getPostCount } from "../Services/serverRequests";
import axios from "axios";

const MainPage = () => {
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [isFetchingPosts, setIsFetchingPosts] = useState<boolean>(false);

  const { user } = useUser();

  useEffect(() => {
    fetchPosts(10);
  }, []);

  useEffect(() => {
    const getAmountOfPosts = async () => {
      const response = await getPostCount();
      if (!axios.isAxiosError(response))
        setMaxAmount((response as { amount: number }).amount);
    };

    getAmountOfPosts();
  }, [posts]);

  const fetchPosts = async (limit: number = 4) => {
    setIsFetchingPosts(true);

    const newPosts = await getPagedPosts(posts.length, limit);

    if (newPosts.length) setPosts((prev) => prev.concat(newPosts));

    setIsFetchingPosts(false);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      !isFetchingPosts &&
      posts.length <= maxAmount
    ) {
      fetchPosts();
    }
  };

  const onPostClick = (postId: string) => {
    const clickedPost = posts.find(({ _id }) => postId === _id);
    if (clickedPost) {
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {isAddingPost ? (
        <AddPostPage setIsAddingPost={setIsAddingPost} isNewPost={true} />
      ) : isEditingProfile ? (
        <SignUpPage user={user!} onFinish={() => setIsEditingProfile(false)} />
      ) : (
        <>
          <ApplicationBar
            setIsAddingPost={setIsAddingPost}
            setIsEditingProfile={setIsEditingProfile}
          />
          <div
            style={{
              margin: "20px 20px",
              overflowY: "auto",
              height: "90vh",
            }}
            onScroll={handleScroll}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={8}>
                {posts.map((post, i) => (
                  <Grid size={4} key={post._id}>
                    <PostTeaser post={post} onPostClick={onPostClick} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPage;
