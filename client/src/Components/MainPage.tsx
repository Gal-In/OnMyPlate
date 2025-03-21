import { useEffect, useState } from "react";
import ApplicationBar from "./ApplicationBar";
import AddPostPage from "./AddPostPage";
import { useUser } from "../Context/useUser";
import SignUpPage from "./SignPage/SignUpPage";
import { Post } from "../Types/postTypes";
import { Box, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostTeaser from "./PostTeaser";
import { getPagedPosts, getPostCount } from "../Services/serverRequests";
import { useNavigate } from 'react-router-dom';
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter(post => post.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

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
            onScroll={handleScroll}
          >
            <TextField
              sx={{
                border: "1px solid white",
                //   outline: 0,
                borderRadius: "5px",
                height: "13vh",
                width: "30vw",
                position: "relative",
              }}
              value={searchTerm} 
              onChange={handleSearchChange} 
              placeholder="חיפוש"
            />
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={8}>
                {filteredPosts.map((post, i) => (
                  <Grid size={4} key={post._id}>
                    <PostTeaser post={post} onPostClick={onPostClick} isEditable={true}
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
