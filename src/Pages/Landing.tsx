import { Outlet } from "react-router-dom";
import { Grid, Typography } from "@mui/material";

const Landing = () => {
  return (
    <>
      <Grid
        container
        spacing={1}
        direction='column'
        padding='1rem'
        justifyContent={"center"}
        alignItems={"center"}
        min-width='100vw'
        min-height='100vh'
      >
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom color={'text.secondary'} paddingTop='0.5rem' fontWeight={'800'} letterSpacing={'2px'} textTransform={'uppercase'}>Welcome to SendEase</Typography>
        </Grid>
        <Grid item xs={12} width='90%' height='100%'>
          <Outlet />
        </Grid>
      </Grid>

    </>
  );
};

export default Landing;
