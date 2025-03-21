import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { Post } from "../Types/postTypes";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getCommentsById, getLikeAmount } from "../Services/serverRequests";
import axios from "axios";
import { useUser } from "../Context/useUser";
import { useAuthenticatedServerRequest } from "../Services/useAuthenticatedServerRequest";

type PostTeaserProps = {
  post: Post;
  onPostClick: (postId: string) => void;
};

const PostTeaser = ({ post, onPostClick }: PostTeaserProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { addLike, deleteLike, getIsLikedByUser } = useAuthenticatedServerRequest();
  const [commentsCount, setCommentsCount] = useState(0);

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
    <Card sx={{ cursor: "pointer", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
      <CardContent onClick={() => onPostClick(post._id)}>
        <Typography variant="h5">שם המסעדה: {post.restaurantName}</Typography>

        <Typography variant="body2">
          {`${likesCount} תגובות  ${commentsCount} לייקים`}
        </Typography>

        <img
          alt="post"
          src={`${process.env.REACT_APP_SERVER_URL}/media/posts/${post.photosUrl[0]}`}
          style={{
            maxHeight: "100px",
            maxWidth: "100px",
          }}
        />

        <Typography variant="body2">{post.description}</Typography>
      </CardContent>
      <CardActions onClick={() => toggleLike()}>
        {isLiked ? <Favorite /> : <FavoriteBorder />}
      </CardActions>
    </Card>
  );
};

export default PostTeaser;
