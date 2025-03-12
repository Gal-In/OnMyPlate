import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContextProvider } from "./Context/useUser";
import { CookiesProvider } from "react-cookie";
import { AuthApiContextProvider } from "./Context/useAuthApi";

const GOOGLE_CLIENT_ID =
  "593169361117-6o3lgqtkfplns34gj0g2k3ququvv3527.apps.googleusercontent.com";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Assistant",
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          font: "Assistant",
        },
      },
    },
  },
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <UserContextProvider>
          <AuthApiContextProvider>
            <CookiesProvider>
              <App />
            </CookiesProvider>
          </AuthApiContextProvider>
        </UserContextProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </CacheProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
