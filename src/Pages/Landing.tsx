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
        min-width='100vw'
        minHeight='83vh'
      >
        <BreadCrumb />
        <Outlet />
      </Grid>
      <Footer />
    </>
  );
};

export default Landing;
