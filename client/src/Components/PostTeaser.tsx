import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { Post } from "../Types/postTypes";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getCommentsById, getLikeAmount } from "../Services/serverRequests";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import { useAuthenticatedServerRequest } from "../Services/useAuthenticatedServerRequest";

type PostTeaserProps = {
  post: Post;
  isEditable: boolean;
  onPostClick: (postId: string) => void;
  setIsAddingPost: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewPost: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
};

const PostTeaser = ({ post, onPostClick, isEditable, setIsAddingPost, setIsNewPost, setEditPost }: PostTeaserProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { addLike, deleteLike, getIsLikedByUser } = useAuthenticatedServerRequest();
  const [commentsCount, setCommentsCount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const getLikes = async () => {
      const response = await getLikeAmount(post._id);
      if (!axios.isAxiosError(response))
        setLikesCount((response as number));
    }

    getLikes();
  }, []);

  useEffect(() => {
    const getComments = async () => {
      if (post?._id) {
        const response = await getCommentsById(post._id);
        if (!axios.isAxiosError(response))
          setCommentsCount((response as Comment[]).length)
      }
    };

    getComments();
  }, [post])

  useEffect(() => {
    const getIsLiked = async () => {
      const response = await getIsLikedByUser(post._id)
      if (!axios.isAxiosError(response))
        setIsLiked((response as boolean));
    }

    getIsLiked();
  }, []);

  const toggleEditMode = () => {
    setIsNewPost(false);
    setIsAddingPost(true);
    setEditPost({...post, photosUrl: post.photosUrl.map(photo => `${process.env.REACT_APP_SERVER_URL}/media/posts/${photo}`)});
  }

  const add = () => {
    addLike(post._id);
    setIsLiked(true);
    setLikesCount(likesCount + 1);
  }

  const remove = () => {
    deleteLike(post._id);
    setIsLiked(false);
    setLikesCount(likesCount - 1);
  }
  const toggleLike = () => {
    isLiked ? remove() : add()
  }

  return (
    <Card sx={{ direction: 'rtl', height: "38vh", width: "25vw", cursor: "pointer", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h5">שם המסעדה: {post.restaurantName}</Typography>
            <CardActions onClick={() => toggleLike()}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </CardActions>

            { isEditable && <CardActions onClick={toggleEditMode}>
              <EditIcon/>
            </CardActions>}
          </div>
          <Typography variant="body2">{post.description}</Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2vh' }} onClick={() => onPostClick(post._id)}>
          <img
            alt="post"
            src={`${process.env.REACT_APP_SERVER_URL}/media/posts/${post.photosUrl[0]}`}
            style={{
              height: "15vh",
              width: "15vh",
            }}
          />
          <Typography variant="body2">
            {`לייקים ${likesCount} `}
            </Typography>
           <Typography variant="body2"> 
            {`תגובות ${commentsCount} `}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTeaser;
