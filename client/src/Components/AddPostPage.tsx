import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Rating,
  TextField,
} from "@mui/material";
import SignPageWrapper from "./CardWrapper";
import { useMemo, useState } from "react";
import { Close } from "@mui/icons-material";
import ImagesList from "./ImagesList";
import { useAuthenticatedServerRequest } from "../Services/authenticatedServerRequest";
import { uploadPostPictures } from "../Services/serverRequests";
import dataUrlToFile from "../Services/fileConvertorService";
import { Post } from "../Types/postTypes";
import axios from "axios";

type AddPostPageProps = {
  setIsAddingPost: React.Dispatch<React.SetStateAction<boolean>>;
  isNewPost: boolean;
};

const AddPostPage = ({ setIsAddingPost, isNewPost }: AddPostPageProps) => {
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imagesUrl, setImagesUrl] = useState<any[]>([]);

  const { addNewPost, updatePost } = useAuthenticatedServerRequest();

  const handleAddPost = async () => {
    setIsLoading(true);
    if (isNewPost) {
      const response = await addNewPost({
        description,
        restaurantName,
        rating,
        googleApiRating: 4,
        photosUrl: [],
      });

      if (axios.isAxiosError(response)) {
        setErrorMessage("חלה תקלה בשמירת הפוסט");
        return;
      }

      const postId = (response as Post)._id;
      const files = await Promise.all(
        imagesUrl.map((imageUrl, index) =>
          dataUrlToFile(imageUrl, index.toString())
        )
      );

      const photosUrl = files.map((file) => postId + "_" + file.name);

      await uploadPostPictures(postId, files);

      await updatePost(postId, { photosUrl });
    } else {
    }

    setIsLoading(false);
  };

  const isAbleToSave = useMemo(
    () =>
      restaurantName.trim().length &&
      description.trim().length &&
      !!imagesUrl.length,
    [restaurantName, description, imagesUrl]
  );

  return (
    <>
      <SignPageWrapper
        title={"הוסף פוסט"}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      >
        <IconButton
          sx={{
            position: "absolute",
          }}
          onClick={() => setIsAddingPost(false)}
        >
          <Close />
        </IconButton>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ImagesList
            isAbleToAdd={!isLoading}
            imagesUrl={imagesUrl}
            setImagesUrl={setImagesUrl}
            setErrorMessage={setErrorMessage}
          />
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl
              sx={{
                gap: 1.5,
              }}
            >
              <Rating
                value={rating}
                precision={0.5}
                onChange={(_, newRating) => {
                  setRating(newRating ?? 0);
                }}
                disabled={isLoading}
              />
              <TextField
                id="name"
                autoFocus
                fullWidth
                variant="outlined"
                label="שם מסעדה"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 20 } }}
                disabled={isLoading}
              />
              <TextField
                id="name"
                fullWidth
                variant="outlined"
                label="תיאור"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={2}
                maxRows={5}
                slotProps={{ htmlInput: { maxLength: 400 } }}
                disabled={isLoading}
              />
            </FormControl>
            <Button
              variant="outlined"
              disabled={!isAbleToSave || isLoading}
              onClick={handleAddPost}
              sx={{
                width: "fitContent",
                alignSelf: "center",
              }}
            >
              הוסף פוסט
            </Button>
          </Box>
        </div>
        {isLoading && (
          <CircularProgress
            sx={{
              position: "absolute",
              alignSelf: "center",
              top: "40%",
              zIndex: 1000,
            }}
            size={100}
          />
        )}
      </SignPageWrapper>
    </>
  );
};

export default AddPostPage;
