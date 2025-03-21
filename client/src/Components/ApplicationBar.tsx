import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../Context/useUser";
import { useCookies } from "react-cookie";
import { useMemo } from "react";
import { logoutUser } from "../Services/serverRequests";
import { Add } from "@mui/icons-material";
import { Post } from "../Types/postTypes";
import { useNavigate } from "react-router-dom";
import { useAuthApi } from "../Context/useAuthApi";

type ApplicationBarProps = {
  setIsAddingPost: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewPost: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5c5b5c",
    },
  },
});

const ApplicationBar = ({
  setIsAddingPost,
  setIsEditingProfile,
  setIsNewPost,
  setEditPost,
}: ApplicationBarProps) => {
  const [{ refreshToken }, _, removeCookie] = useCookies(["refreshToken"]);
  const { user, setUser } = useUser();
  const authInstance = useAuthApi();
  const navigate = useNavigate();

  const logout = () => {
    logoutUser(refreshToken);

    navigate("/signIn");
    removeCookie("refreshToken");

    authInstance.setAccessTokenFunc("");
    authInstance.setRefreshTokenFunc("");
    setUser(null);
  };

  const imageUrl = useMemo(
    () =>
      user?.profilePictureExtension
        ? `${process.env.REACT_APP_SERVER_URL}/media/profile/${user.email}.${user.profilePictureExtension}`
        : "/projectLogo.svg",
    [user]
  );

  const onAddPostClick = () => {
    setIsNewPost(true);
    setIsAddingPost(true);
    setEditPost(undefined);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky" dir="rtl">
        <Toolbar>
          <Tooltip title={"התנתק"}>
            <IconButton sx={{ p: 1 }} onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"ערוך פרופיל"}>
            <IconButton sx={{ p: 1 }} onClick={() => setIsEditingProfile(true)}>
              <img
                alt="appBar"
                src={imageUrl}
                style={{
                  objectFit: "fill",
                  maxHeight: "50px",
                }}
              />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            style={{ marginRight: "10vh", backgroundColor: "darkviolet" }}
            startIcon={<Add />}
            onClick={() => onAddPostClick()}
          >
            הוסף פוסט
          </Button>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{ marginRight: "50vh" }}
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            On My Plate
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default ApplicationBar;
