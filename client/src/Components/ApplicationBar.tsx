import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Tooltip,
  Avatar,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../Context/useUser";
import { useCookies } from "react-cookie";
import { useMemo } from "react";
import { logoutUser } from "../Services/serverRequests";
import { Add } from "@mui/icons-material";

type ApplicationBarProps = {
  setIsAddingPost: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

const ApplicationBar = ({
  setIsAddingPost,
  setIsEditingProfile,
}: ApplicationBarProps) => {
  const [{ refreshToken }, _, removeCookie] = useCookies(["refreshToken"]);
  const { user, setUser, setAccessToken } = useUser();

  const logout = () => {
    logoutUser(refreshToken);

    removeCookie("refreshToken");
    setAccessToken(null);
    setUser(null);
  };

  const imageUrl = useMemo(
    () =>
      user?.profilePictureExtension
        ? `${process.env.REACT_APP_SERVER_URL}/media/profile/${user.email}.${user.profilePictureExtension}`
        : "/projectLogo.svg",
    [user]
  );

  return (
    <AppBar position="sticky" dir="rtl">
      <Toolbar>
        <Tooltip title={"התנתק"}>
          <IconButton sx={{ p: 1 }} onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={"ערוך פרופיל"}>
          <IconButton sx={{ p: 1 }} onClick={() => setIsEditingProfile(true)}>
            <Avatar
              src={imageUrl}
              sx={{
                "& img": { objectFit: "fill" },
              }}
            />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddingPost(true)}
        >
          הוסף פוסט
        </Button>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          On My Plate
        </Typography>
        <TextField
          sx={{
            border: "1px solid white",
            //   outline: 0,
            borderRadius: "5px",
            position: "relative",

            height: "50%",
          }}
          placeholder="חיפוש"
        />
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
