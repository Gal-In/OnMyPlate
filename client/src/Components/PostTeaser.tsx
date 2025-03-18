import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { Post } from "../Types/postTypes";
import PostPage from "./PostPage/PostPage";

type PostTeaserProps = {
  post: Post;
};

const PostTeaser = ({ post }: PostTeaserProps) => {
  return (
    <Card sx={{ cursor: "pointer" }}>
      <CardContent>
        <Typography variant="h5" component="div" >
          {post.restaurantName}
        </Typography>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {post.description}
        </Typography>

        <div style={{ height: '20vh', width: '20vh' }} onClick={() => <PostPage/>}>
          <img
            alt="post"
            src={`${process.env.REACT_APP_SERVER_URL}/media/posts/${post.photosUrl[0]}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTeaser;
