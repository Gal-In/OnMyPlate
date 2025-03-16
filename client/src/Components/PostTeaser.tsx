import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import { Post } from "../Types/postTypes";

type PostTeaserProps = {
  post: Post;
};

const PostTeaser = ({ post }: PostTeaserProps) => {
  return (
    <Card sx={{ cursor: "pointer" }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {post.restaurantName}
        </Typography>
        <Typography variant="h5" component="div">
          something
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>

        <img
          alt="post"
          src={`${process.env.REACT_APP_SERVER_URL}/media/posts/${
            post.photosUrl ? post.photosUrl[0] : ""
          }`}
        />
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default PostTeaser;
