import {
  Email,
  GitHub,
  Instagram,
  LinkedIn,
  SaveAlt,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileSharingImage from "../assets/fileSharingImage.png";
import logo from "../assets/logo.png";
import share from "../assets/shared.png";
import connect from "../assets/connect.png";
import upload from "../assets/upload.png";
import serverless from "../assets/computer.png";
import transfer from "../assets/data-exchange.png";
import crossPlatform from "../assets/cross-platform.png";
import collaboration from "../assets/collaborations.png";
import anonymous from "../assets/hacker.png";
import encrypt from "../assets/encrypt.png";

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
        item
        sx={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "3rem !important",
          paddingBottom: "2rem",
        }}
      >
        <img src={logo} height="60rem" width="60rem" />
        <Typography
          variant="h3"
          color={"text.secondary"}
          fontWeight={"800"}
          letterSpacing={"2px"}
          textTransform={"uppercase"}
        >
          SendEase
        </Typography>
      </Grid>

      <Grid item paddingBottom={"2rem"}>
        {/* <Typography>Seamless, Secure, and Decentralized File Sharing</Typography>
        <Typography>Effortlessly share your files with anyone, anywhere.</Typography> */}
        <Typography
          component="h1"
          variant="h5"
          align="center"
          color="text.primary"
          fontWeight={500}
          gutterBottom
        >
          Seamless, Secure, and Decentralized File Sharing
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.primary"
          fontWeight={500}
          paragraph
        >
          Easily upload and share your files with anyone, anywhere. Our secure
          platform ensures your data is always safe.
        </Typography>
      </Grid>

      <Grid
        item
        height="35rem"
        width="70rem"
        margin={"auto"}
        paddingBottom={"2rem"}
      >
        <img
          src={FileSharingImage}
          alt="Hero"
          height="100%"
          width="100%"
          style={{ borderRadius: "1rem" }}
        />
      </Grid>

      <Grid item>
        <Typography
          variant="h4"
          gutterBottom
          color={"text.secondary"}
          paddingTop="0.5rem"
          fontWeight={"800"}
          letterSpacing={"2px"}
          textTransform={"uppercase"}
          align="center"
        >
          get started
        </Typography>
        <Typography variant="h5" align="center" paddingTop={"1rem"}>
          Experience the future of file sharing. Start sharing files directly
          with your peers today.
        </Typography>
        <Grid
          container
          spacing={4}
          direction="row"
          paddingTop={"3rem"}
          paddingBottom={"4rem"}
          width={"50%"}
          marginX={"auto"}
        >
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
                  <Typography
                    variant="h6"
                    color={"text.secondary"}
                    textTransform={"uppercase"}
                    fontWeight={"800"}
                    letterSpacing={"2px"}
                  >
                    SEND
                  </Typography>
                }
              />
            </Card>
          </Grid>
          <Grid item xs={6} onClick={handleReceiver} sx={{ cursor: "pointer" }}>
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
                  <Typography
                    variant="h6"
                    color={"text.secondary"}
                    textTransform={"uppercase"}
                    fontWeight={"800"}
                    letterSpacing={"2px"}
                  >
                    RECEIVE
                  </Typography>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item width={"80%"} marginX={"auto"}>
        <Typography
          variant="h4"
          gutterBottom
          color={"text.secondary"}
          paddingTop="3rem"
          fontWeight={800}
          letterSpacing={"2px"}
          textTransform={"uppercase"}
          align="center"
        >
          Key Features
        </Typography>
        <Grid
          container
          direction={"column"}
          spacing={6}
          paddingTop={"4rem"}
          paddingBottom={"6rem"}
          width={"50%"}
          marginX={"auto"}
        >
          <Grid
            item
            sx={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <img src={serverless} height="90rem" width="90rem" />
            <Box>
              <Typography
                variant="h5"
                color="textSecondary"
                textTransform="uppercase"
                letterSpacing="0.2rem"
                fontWeight={600}
              >
                Serverless Architecture:{" "}
              </Typography>
              <Typography variant="h6">
                {" "}
                Direct peer-to-peer sharing without reliance on central servers.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <img src={encrypt} height="90rem" width="90rem" />
            <Box>
              <Typography
                variant="h5"
                color="textSecondary"
                textTransform="uppercase"
                letterSpacing="0.2rem"
                fontWeight={600}
              >
                End-to-End Encryption:{" "}
              </Typography>
              <Typography variant="h6">
                {" "}
                Ensure your files are secure from sender to receiver.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <img src={transfer} height="90rem" width="90rem" />
            <Box>
              <Typography
                variant="h5"
                color="textSecondary"
                textTransform="uppercase"
                letterSpacing="0.2rem"
                fontWeight={600}
              >
                Instant Transfers:{" "}
              </Typography>
              <Typography variant="h6">
                {" "}
                Fast and reliable file transfers, directly between devices.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <img src={crossPlatform} height="90rem" width="90rem" />
            <Box>
              <Typography
                variant="h5"
                color="textSecondary"
                textTransform="uppercase"
                letterSpacing="0.2rem"
                fontWeight={600}
              >
                Cross-Platform Compatibility:{" "}
              </Typography>
              <Typography variant="h6">
                {" "}
                Seamlessly share files across all your devices.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <img src={anonymous} height="90rem" width="90rem" />
            <Box>
              <Typography
                variant="h5"
                color="textSecondary"
                textTransform="uppercase"
                letterSpacing="0.2rem"
                fontWeight={600}
              >
                Anonymous Sharing:{" "}
              </Typography>
              <Typography variant="h6">
                {" "}
                No sign-ups, no tracking, just pure sharing.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", gap: "2rem", alignItems: "center" }}
          >
            <img src={collaboration} height="90rem" width="90rem" />
            <Box>
              <Typography
                variant="h5"
                color="textSecondary"
                textTransform="uppercase"
                letterSpacing="0.2rem"
                fontWeight={600}
              >
                Easy Collaboration:{" "}
              </Typography>
              <Typography variant="h6">
                {" "}
                Share files and collaborate with your team in real-time.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Typography
          variant="h4"
          gutterBottom
          color={"text.secondary"}
          fontWeight={"800"}
          letterSpacing={"2px"}
          textTransform={"uppercase"}
          align="center"
        >
          How it works
        </Typography>
        <Grid
          container
          justifyContent={"space-between"}
          paddingTop={"4rem"}
          paddingBottom={"4rem"}
          flexWrap={"nowrap"}
        >
          <Grid
            item
            xs={4}
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <img src={share} height="80rem" width="80rem" />
            <Typography variant="h5">Share the Sender Id</Typography>
            <Typography variant="h6">
              Sender have to share a unique Id with others.
            </Typography>
          </Grid>
          <Divider variant="fullWidth" orientation="vertical" flexItem />
          <Grid
            item
            xs={4}
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <img src={connect} height="80rem" width="80rem" />
            <Typography variant="h5">Connect to the Sender</Typography>
            <Typography variant="h6">
              Recievers need to connect to the sender and wait for approval.
            </Typography>
          </Grid>
          <Divider variant="fullWidth" orientation="vertical" flexItem />
          <Grid
            item
            xs={4}
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <img src={upload} height="80rem" width="80rem" />
            <Typography variant="h5">Upload Your Files</Typography>
            <Typography variant="h6">
              Use the upload button to upload the files and click on send.
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid>
        <Typography
          variant="h4"
          gutterBottom
          color={"text.secondary"}
          fontWeight={"800"}
          letterSpacing={"2px"}
          textTransform={"uppercase"}
          align="center"
        >
          Reach me
        </Typography>
        <Typography variant="h5" align="center">
          If you have any questions or need assistance, feel free to reach out.
        </Typography>
        <Grid
          container
          justifyContent={"center"}
          spacing={4}
          paddingTop={"2rem"}
          paddingBottom={"4rem"}
        >
          <Grid item>
            <IconButton
              href={"mailto:rupam367ro@gmail.com"}
              target={"_blank"}
              rel={"noreferrer"}
            >
              <Email fontSize="large" color="secondary" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              href={"https://www.instagram.com/storm_charger_03"}
              target={"_blank"}
              rel={"noreferrer"}
            >
              <Instagram fontSize="large" color="secondary" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              href={"https://www.linkedin.com/in/hitesh-saha-5401671b3/"}
              target={"_blank"}
              rel={"noreferrer"}
            >
              <LinkedIn fontSize="large" color="secondary" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              href={"https://github.com/Hitesh-Saha"}
              target={"_blank"}
              rel={"noreferrer"}
            >
              <GitHub fontSize="large" color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default HomePage;
