import { Button, Container, Grid, Typography, Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Send, Download } from "@mui/icons-material";
import { GlowingBox, HeroImageContainer, FloatingBox } from "./HeroSection.styles";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 6, md: 12 } }}>
      <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
      <Grid item xs={12} md={6}>
          <HeroImageContainer>
            <FloatingBox>
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Modern 3D Illustration */}
                <svg
                  viewBox="0 0 500 500"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '600px',
                  }}
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop
                        offset="0%"
                        style={{
                          stopColor: '#6C63FF',
                          stopOpacity: 1
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: '#00BFA6',
                          stopOpacity: 1
                        }}
                      />
                    </linearGradient>
                  </defs>
                  {/* Central Circle */}
                  <circle cx="250" cy="250" r="100" fill="url(#grad1)" opacity="0.2">
                    <animate
                      attributeName="r"
                      values="100;120;100"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Orbiting Elements */}
                  <g>
                    <circle cx="250" cy="100" r="20" fill="url(#grad1)">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 250 250"
                        to="360 250 250"
                        dur="10s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="400" cy="250" r="15" fill="url(#grad1)">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 250 250"
                        to="360 250 250"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="250" cy="400" r="25" fill="url(#grad1)">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 250 250"
                        to="360 250 250"
                        dur="12s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                  {/* Connecting Lines */}
                  <g opacity="0.3">
                    <path d="M250 150 L250 350" stroke="url(#grad1)" strokeWidth="2">
                      <animate
                        attributeName="d"
                        values="M250 150 L250 350;M200 200 L300 300;M250 150 L250 350"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path d="M150 250 L350 250" stroke="url(#grad1)" strokeWidth="2">
                      <animate
                        attributeName="d"
                        values="M150 250 L350 250;M200 200 L300 300;M150 250 L350 250"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </svg>
              </Box>
            </FloatingBox>
          </HeroImageContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <GlowingBox>
            <Typography
              component="h1"
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: { xs: 2, md: 3 },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Share Files Securely & Instantly
            </Typography>
          </GlowingBox>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ 
              mb: { xs: 3, md: 4 }, 
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Experience the future of file sharing with end-to-end encryption and peer-to-peer technology. No size limits, no cloud storage.
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Grid item xs={12} sm="auto">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/sender")}
                startIcon={<Send />}
                fullWidth={window.innerWidth < 600}
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                  height: 48,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  }
                }}
              >
                Start Sending
              </Button>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/receiver")}
                startIcon={<Download />}
                fullWidth={window.innerWidth < 600}
                sx={{
                  minWidth: { xs: '100%', sm: 180 },
                  height: 48,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  borderColor: 'primary.main',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'secondary.main',
                  }
                }}
              >
                Receive Files
              </Button>
            </Grid>
          </Grid>
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default HeroSection;
