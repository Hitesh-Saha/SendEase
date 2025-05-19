import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { Send, Download, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as Styles from "./CallToAction.styles";

const CallToAction = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      id="cta"
      sx={{
        py: 15,
        background: `linear-gradient(180deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.background.paper} 50%,
          ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Styles.GradientText
          variant="h2"
          align="center"
        >
          Start Sharing Now
        </Styles.GradientText>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}
        >
          Experience secure, lightning-fast file sharing with end-to-end encryption
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Styles.GradientBox>
              <Styles.FloatingIcon>
                <Send />
              </Styles.FloatingIcon>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Share Files
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 4 }}
              >
                Start sharing files securely with anyone, anywhere. No registration required.
              </Typography>
              <Box display="flex" justifyContent="center">
                <Styles.GradientButton
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/sender')}
                >
                  Start Sharing
                </Styles.GradientButton>
              </Box>
            </Styles.GradientBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <Styles.GradientBox>
              <Styles.FloatingIcon>
                <Download />
              </Styles.FloatingIcon>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Receive Files
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 4 }}
              >
                Got a share code? Receive your files instantly with full encryption.
              </Typography>
              <Box display="flex" justifyContent="center">
                <Styles.GradientButton
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/receiver')}
                >
                  Receive Files
                </Styles.GradientButton>
              </Box>
            </Styles.GradientBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CallToAction;