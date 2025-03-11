import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Tooltip,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../Hooks/useUser";
import { useCookies } from "react-cookie";
import { useMemo } from "react";

const ApplicationBar = () => {
  const [_, _1, removeCookie] = useCookies(["refreshToken"]);
  const { user, setUser } = useUser();

  const logout = () => {
    // delete access token too
    removeCookie("refreshToken");
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
    <AppBar position="static" dir="rtl">
      <Toolbar>
        <Tooltip title={"התנתק"}>
          <IconButton sx={{ p: 1 }} onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={"ערוך פרופיל"}>
          <IconButton sx={{ p: 1 }}>
            <Avatar
              src={imageUrl}
              sx={{
                "& img": { objectFit: "contain" },
              }}
            />
          </IconButton>
        </Tooltip>
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
        {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search> */}
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
