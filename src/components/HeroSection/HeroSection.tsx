import { Button, Container, Grid, Typography, Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Send, Download } from "@mui/icons-material";

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const GlowingBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
    animation: `${pulse} 3s ease-in-out infinite`,
    zIndex: -1,
  }
}));

const HeroImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '80%',
    background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
    filter: 'blur(40px)',
    animation: `${pulse} 3s ease-in-out infinite`,
    zIndex: -1,
  }
}));

const FloatingBox = styled(Box)(() => ({
  animation: `${float} 6s ease-in-out infinite`,
}));

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 12 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <GlowingBox>
            <Typography
              component="h1"
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 3,
              }}
            >
              Share Files Securely & Instantly
            </Typography>
          </GlowingBox>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Experience the future of file sharing with end-to-end encryption and peer-to-peer technology. No size limits, no cloud storage.
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/sender")}
                startIcon={<Send />}
                sx={{
                  minWidth: 180,
                  height: 48,
                  fontSize: "1.1rem",
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
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/receiver")}
                startIcon={<Download />}
                sx={{
                  minWidth: 180,
                  height: 48,
                  fontSize: "1.1rem",
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
      </Grid>
    </Container>
  );
};

export default HeroSection;
