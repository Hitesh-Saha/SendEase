import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const Landing = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar />
      <Box sx={{ 
        flex: 1,
        width: '100%',
      }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Landing;
