import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0d47a1",
    },
    secondary: {
      main: "#82b1ff",
    },
    background: {
      paper: "#424242",
    },
    text: {
      primary: "#ffffff", // White text
      secondary: "#82b1ff", // Light gray text
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
