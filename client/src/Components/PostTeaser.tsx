import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { Post } from "../Types/postTypes";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

type PostTeaserProps = {
  post: Post;
  onPostClick: (postId: string) => void;
};

const PostTeaser = ({ post, onPostClick }: PostTeaserProps) => {
  return (
    <Card sx={{ cursor: "pointer" }} onClick={() => onPostClick(post._id)}>
      <CardContent>
        <Typography variant="h5">שם המסעדה: {post.restaurantName}</Typography>

        <Typography variant="body2">
          פה יופיעו כמות התגובות ואולי גם האם אהבתי את הפוסט
        </Typography>

        <img
          alt="post"
          src={`${process.env.REACT_APP_SERVER_URL}/media/posts/${
            post.photosUrl ? post.photosUrl[0] : ""
          }`}
          style={{
            maxHeight: "100px",
            maxWidth: "100px",
          }}
        />

        <Typography variant="body2">{post.description}</Typography>
      </CardContent>
      <CardActions>
        {/* {post.isLiked && <FavoriteBorder />} */}
        <Favorite />
      </CardActions>
    </Card>
  );
};

export default PostTeaser;
