import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Send", path: "/sender" },
  { label: "Receive", path: "/receiver" },
];

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (path.startsWith("/#")) {
      if (location.pathname === "/") {
        const element = document.querySelector(path.substring(1));
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      sx={{
        borderRadius: "0 0 15px 15px",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {" "}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Box
            component="img"
            src={logo}
            alt="SendEase Logo"
            sx={{
              height: "32px",
              width: "auto",
              marginRight: "8px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                height: "40px",
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.1rem",
              background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            SendEase
          </Typography>
        </Box>
        <List sx={{ display: "flex", gap: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.primary",
                  position: "relative",
                  borderRadius: "8px",
                  mx: 0.5,
                  py: 1,
                  px: 2,
                  background:
                    location.pathname === item.path
                      ? (theme) =>
                          `linear-gradient(90deg, ${theme.palette.background.paper}100, ${theme.palette.background.default}40)`
                      : "transparent",
                  backdropFilter:
                    location.pathname === item.path ? "blur(8px)" : "none",
                  boxShadow:
                    location.pathname === item.path
                      ? (theme) =>
                          `inset 0 0 0 1px ${theme.palette.primary.main}20, 0 4px 12px ${theme.palette.primary.main}10`
                      : "none",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: (theme) =>
                      `${theme.palette.background.paper}40`,
                    backdropFilter: "blur(8px)",
                    "&::after": {
                      width: "100%",
                    },
                  },
                  // "&::after": {
                  //   content: '""',
                  //   position: "absolute",
                  //   bottom: "0",
                  //   left: "0",
                  //   width: location.pathname === item.path ? "100%" : "0%",
                  //   height: "2px",
                  //   background: (theme) =>
                  //     `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  //   transition: "width 0.3s ease-in-out",
                  //   opacity: 0.8,
                  // },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
