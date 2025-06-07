import { createTheme, alpha } from "@mui/material";

// Modern dark theme color palette
const primaryColor = "#6C63FF"; // Modern indigo
const secondaryColor = "#00BFA6"; // Bright teal
const backgroundDark = "#1A1A2E"; // Deep navy
const surfaceColor = "#232339"; // Slightly lighter navy
const errorColor = "#FF4B6E"; // Soft red
const successColor = "#2AC769"; // Vibrant green
const warningColor = "#FFB547"; // Warm amber

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor,
      light: alpha(primaryColor, 0.8),
      dark: alpha(primaryColor, 0.9),
    },
    secondary: {
      main: secondaryColor,
      light: alpha(secondaryColor, 0.8),
      dark: alpha(secondaryColor, 0.9),
    },
    error: {
      main: errorColor,
    },
    warning: {
      main: warningColor,
    },
    success: {
      main: successColor,
    },
    background: {
      default: backgroundDark,
      paper: surfaceColor,
    },
    text: {
      primary: "#FFFFFF",
      secondary: alpha("#FFFFFF", 0.7),
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "1.125rem",
      lineHeight: 1.75,
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    `0 2px 4px ${alpha("#000", 0.02)}, 0 1px 2px ${alpha("#000", 0.06)}`,
    `0 4px 8px ${alpha("#000", 0.04)}, 0 2px 4px ${alpha("#000", 0.08)}`,
    `0 8px 16px ${alpha("#000", 0.06)}, 0 4px 8px ${alpha("#000", 0.1)}`,
    `0 12px 24px ${alpha("#000", 0.08)}, 0 6px 12px ${alpha("#000", 0.12)}`,
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 24px",
          fontSize: "0.95rem",
        },
        contained: {
          boxShadow: `0 4px 8px ${alpha("#000", 0.1)}, 0 2px 4px ${alpha(
            "#000",
            0.06
          )}`,
          "&:hover": {
            boxShadow: `0 8px 16px ${alpha("#000", 0.1)}, 0 4px 8px ${alpha(
              "#000",
              0.06
            )}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: `0 4px 8px ${alpha("#000", 0.1)}, 0 2px 4px ${alpha(
            "#000",
            0.06
          )}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha(surfaceColor, 0.8),
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: surfaceColor,
        },
      },
    },
  },
});

export default theme;
