// styles/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00adb5",
    },
    secondary: {
      main: "#ff3e3e",
    },
    background: {
      default: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
});

export default theme;
