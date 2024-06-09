import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import BreadCrumb from "../components/BreadCrumb/BreadCrumb";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Grid
        container
        spacing={1}
        direction='column'
        padding='1rem'
        justifyContent={"flex-start"}
        // alignItems={"center"}
        min-width='100vw'
        minHeight='83vh'
      >
        {/* <Grid item xs={12}>
          <Typography variant="h3" gutterBottom color={'text.secondary'} paddingTop='0.5rem' fontWeight={'800'} letterSpacing={'2px'} textTransform={'uppercase'}>Welcome to SendEase</Typography>
        </Grid> */}
        {/* <Grid item xs={12} width='100%' height='100%'> */}
          <BreadCrumb />
          <Outlet />
        {/* </Grid> */}
      </Grid>
      <Footer />
    </>
  );
};

export default Landing;
