import { useEffect, useState } from "react";
import ApplicationBar from "./ApplicationBar";
import AddPostPage from "./AddPostPage";
import { useUser } from "../Context/useUser";
import SignUpPage from "./SignPage/SignUpPage";
import { Post } from "../Types/postTypes";
import { Box, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostTeaser from "./PostTeaser";
import {
  getPagedPosts,
  getPagedPostsByUser,
  getPostCount,
} from "../Services/serverRequests";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainPage = () => {
  const [isAddingPost, setIsAddingPost] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [isFetchingPosts, setIsFetchingPosts] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPost, setIsNewPost] = useState(true);
  const [editPost, setEditPost] = useState<Post>();
  const [gridState, setGridState] = useState<string>("allPosts");

  const navigate = useNavigate();
  const { user } = useUser();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setPosts([]);
    fetchPosts(9, 0);
  }, [gridState, isAddingPost]);

  useEffect(() => {
    const getAmountOfPosts = async () => {
      const response = await getPostCount();
      if (!axios.isAxiosError(response))
        setMaxAmount((response as { amount: number }).amount);
    };

    getAmountOfPosts();
  }, [posts]);

  const fetchPosts = async (limit: number, amountOfFetchedPosts: number) => {
    let newPosts: Post[] = [];

    setIsFetchingPosts(true);

    if (gridState === "allPosts") {
      newPosts = await getPagedPosts(amountOfFetchedPosts, limit);
    } else {
      newPosts = await getPagedPostsByUser(
        user?._id as string,
        amountOfFetchedPosts,
        limit
      );
    }

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
      fetchPosts(3, posts.length);
    }
  };

  const onPostClick = (postId: string) => {
    const clickedPost = posts.find(({ _id }) => postId === _id);
    if (clickedPost) {
      navigate(`/restaurant/${clickedPost._id}`);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {isAddingPost ? (
        <AddPostPage setIsAddingPost={setIsAddingPost} isNewPost={isNewPost} post={editPost}/>
      ) : isEditingProfile ? (
        <SignUpPage user={user!} onFinish={() => setIsEditingProfile(false)} />
      ) : (
        <>
          <ApplicationBar
            setIsAddingPost={setIsAddingPost}
            setIsNewPost={setIsNewPost}
            setIsEditingProfile={setIsEditingProfile}
            setEditPost={setEditPost}
          />
          <div
            style={{
              margin: "20px 20px",
              overflowY: "auto",
              height: "90vh",
            }}
            dir="rtl"
            onScroll={handleScroll}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TextField
                sx={{
                  border: "1px solid white",
                  borderRadius: "5px",
                  height: "13vh",
                  width: "30vw",
                  position: "relative",
                  justifyContent: "space-around",
                }}
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="חיפוש"
              />

              <ToggleButtonGroup
                value={gridState}
                onChange={(_, value) => {
                  if (value) {
                    setGridState(value);
                    setSearchTerm("");
                  }
                }}
                exclusive
              >
                <ToggleButton
                  value="myPosts"
                  sx={{
                    "&.Mui-selected, &.Mui-selected:hover": {
                      color: "white",
                      backgroundColor: "darkviolet",
                    },
                  }}
                >
                  הפוסטים שלי
                </ToggleButton>
                <ToggleButton
                  value="allPosts"
                  sx={{
                    "&.Mui-selected, &.Mui-selected:hover": {
                      color: "white",
                      backgroundColor: "darkviolet",
                    },
                  }}
                >
                  כל הפוסטים
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={8}>
                {filteredPosts.map((post) => (
                  <Grid size={4} key={post._id}>
                    <PostTeaser post={post} onPostClick={onPostClick} isEditable={gridState === "myPosts"}
                      setIsAddingPost={setIsAddingPost} setIsNewPost={setIsNewPost} setEditPost={setEditPost}/>
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
