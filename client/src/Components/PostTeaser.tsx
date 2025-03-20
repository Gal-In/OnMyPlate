import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { Post } from "../Types/postTypes";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { addLike, deleteLike, getIsLikedByUser, getLikeAmount } from "../Services/serverRequests";
import axios from "axios";
import { useUser } from "../Context/useUser";

type PostTeaserProps = {
  post: Post;
  onPostClick: (postId: string) => void;
};

const PostTeaser = ({ post, onPostClick }: PostTeaserProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const getLikes = async () => {
      const response = await getLikeAmount(post._id);
      if (!axios.isAxiosError(response))
        setLikesCount((response as number));
    }

    getLikes();
  }, []);

  useEffect(() => {
    const getIsLiked = async() => {
      if (user?._id) {
        const response = await getIsLikedByUser(post._id, user?._id)
        if (!axios.isAxiosError(response))
          setIsLiked((response as boolean));
      }
    }

    getIsLiked();
  }, []);

  const toggleLike = () => {
    if(user)
    isLiked ? deleteLike(post._id, user?._id) : addLike(post._id, user?._id)
  }

  return (
    <Card sx={{ cursor: "pointer" }} >
      <CardContent onClick={() => onPostClick(post._id)}>
        <Typography variant="h5">שם המסעדה: {post.restaurantName}</Typography>

        <Typography variant="body2">
          {`${likesCount} לייקים`}
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
        {isLiked ?  <Favorite /> : <FavoriteBorder /> }
      </CardActions>
    </Card>
  );
};

export default PostTeaser;
