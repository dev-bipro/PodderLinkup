import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { globalStyles } from "../../styles/globalStyles"; // Adjust the import path
import theme from "../../styles/theme"; // Adjust the import path
import Nav from "../nav/Nav"; // Adjust the import path
// import { Global } from "@emotion/react";
import { Outlet } from "react-router-dom";
import { Global } from "@emotion/react";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <Nav />
      <Outlet />
      {/* Other components */}
    </ThemeProvider>
  );
};

export default App;
