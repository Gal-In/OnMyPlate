import { Box, Button, FormControl, IconButton, TextField } from "@mui/material";
import SignPageWrapper from "./CardWrapper";
import { useMemo, useState } from "react";
import { Close } from "@mui/icons-material";
import ImagesList from "./ImagesList";

type AddPostPageProps = {
  setIsAddingPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddPostPage = ({ setIsAddingPost }: AddPostPageProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imagesUrl, setImagesUrl] = useState<any[]>([]);

  const handleAddPost = () => {};

  const isAbleToSave = useMemo(() => {
    return title.trim().length && description.trim().length;
  }, [title, description]);

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
            isAbleToAdd={true}
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
              <TextField
                id="name"
                autoFocus
                fullWidth
                variant="outlined"
                label="כותרת"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 20 } }}
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
              />
            </FormControl>
            <Button
              variant="outlined"
              disabled={!isAbleToSave}
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
      </SignPageWrapper>
    </>
  );
};

export default AddPostPage;
