import { SaveAlt, Send } from "@mui/icons-material";
import { Card, CardHeader, Grid, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileSharingImage from '../assets/fileSharingImage.png';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSender = () => {
    navigate("/sender");
  };

  const handleReceiver = () => {
    navigate("/receiver");
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={3}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item>
          <Typography
            component="h1"
            variant="h5"
            align="center"
            color="text.primary"
            fontWeight={600}
            gutterBottom
          >
            Share Your Files Securely
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color='text.primary'
            fontWeight={600}
            paragraph
          >
            Easily upload and share your files with anyone, anywhere. Our secure
            platform ensures your data is always safe.
          </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={4} direction="row">
            <Grid item xs={6} onClick={handleSender} sx={{ cursor: "pointer" }}>
              <Card
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  paddingX: "1rem",
                }}
              >
                <CardHeader
                  avatar={
                    <IconButton>
                      <Send color="secondary" />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" color={"text.secondary"} textTransform={'uppercase'} fontWeight={'800'} letterSpacing={'2px'}>
                      SEND
                    </Typography>
                  }
                />
              </Card>
            </Grid>
            <Grid
              item
              xs={6}
              onClick={handleReceiver}
              sx={{ cursor: "pointer" }}
            >
              <Card
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  paddingX: "1rem",
                }}
              >
                <CardHeader
                  avatar={
                    <IconButton>
                      <SaveAlt color="secondary" />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" color={"text.secondary"} textTransform={'uppercase'} fontWeight={'800'} letterSpacing={'2px'}>
                      RECEIVE
                    </Typography>
                  }
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item height="20rem" width="40rem">
          <img
            src={FileSharingImage}
            alt="Hero"
            height="100%"
            width="100%"
            style={{ borderRadius: "1rem" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
