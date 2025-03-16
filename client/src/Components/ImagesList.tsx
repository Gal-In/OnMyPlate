import {
  AddAPhoto,
  ChevronLeft,
  ChevronRight,
  Delete,
} from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useState } from "react";

type ImagesListProps = {
  isAbleToAdd: boolean;
  imagesUrl: string[];
  setImagesUrl: React.Dispatch<React.SetStateAction<string[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  maxImagesToAdd?: number;
};

const ImagesList = ({
  isAbleToAdd,
  imagesUrl,
  setImagesUrl,
  setErrorMessage,
  maxImagesToAdd = 5,
}: ImagesListProps) => {
  const [currImageIndex, setCurrImageIndex] = useState<number>(0);

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const file = target.files?.[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setImagesUrl((prev) => prev.concat(e.target?.result as string));
          setCurrImageIndex(imagesUrl.length);
        }
      };
    } else setErrorMessage("חלה שגיאה בהעלאת התמונה");
  };

  return (
    <>
      {
        <>
          {!!imagesUrl.length && (
            <Typography
              sx={{
                borderRadius: "10px",
                padding: "1px 20px",
                background: "#80808085",
                color: "white",
              }}
            >
              {imagesUrl.length} / {currImageIndex + 1}
            </Typography>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              sx={{
                height: "fitContent",
                visibility: currImageIndex === 0 ? "hidden" : "auto",
              }}
              onClick={() => setCurrImageIndex((prev) => prev - 1)}
            >
              <ChevronRight />
            </IconButton>
            <Box
              sx={{
                width: "100%",
                height: "20vh",
                padding: "10px",
              }}
            >
              {!!imagesUrl.length && (
                <IconButton
                  sx={{
                    position: "absolute",
                  }}
                  onClick={() => {
                    const originalIndex = currImageIndex;
                    if (originalIndex >= imagesUrl.length - 1)
                      setCurrImageIndex((prev) => prev - 1);
                    if (imagesUrl.length - 1 === 0) setCurrImageIndex(0);
                    setImagesUrl((prev) =>
                      prev.filter((_, index) => index !== originalIndex)
                    );
                  }}
                >
                  <Delete />
                </IconButton>
              )}
              <img
                src={
                  imagesUrl.length ? imagesUrl[currImageIndex] : "/noImage.png"
                }
                alt="some"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                key={currImageIndex}
              />
            </Box>
            <IconButton
              sx={{
                height: "fitContent",
                visibility:
                  currImageIndex >= imagesUrl.length - 1 ? "hidden" : "auto",
              }}
              onClick={() => setCurrImageIndex((prev) => prev + 1)}
            >
              <ChevronLeft />
            </IconButton>
          </div>
        </>
      }
      {isAbleToAdd && (
        <>
          <Button
            component="label"
            variant="outlined"
            startIcon={<AddAPhoto />}
            disabled={imagesUrl.length === maxImagesToAdd}
          >
            הוסף תמונה
            <input
              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
              id="add-post-picture"
              onChange={handleCapture}
              type="file"
              hidden
            />
          </Button>
        </>
      )}
    </>
  );
};

export default ImagesList;
