import { Container, Grid, Typography, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUpload, Share, Download } from "@mui/icons-material";

const StepCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  height: "100%",
  padding: theme.spacing(3),
  position: "relative",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: `0 8px 16px ${theme.palette.primary.main}20`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "rotate(10deg) scale(1.1)",
  },
}));

const steps = [
  {
    icon: <FileUpload sx={{ fontSize: 40, color: "white" }} />,
    title: "Upload Files",
    description: "Select the files you want to share. Our platform supports all file types and sizes.",
  },
  {
    icon: <Share sx={{ fontSize: 40, color: "white" }} />,
    title: "Share Link",
    description: "Get a secure, encrypted link to share with your recipient. No registration required.",
  },
  {
    icon: <Download sx={{ fontSize: 40, color: "white" }} />,
    title: "Download Instantly",
    description: "Recipients can download files instantly through a direct peer-to-peer connection.",
  },
];

const HowItWorks = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 10,
        background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, transparent)`,
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 8,
            background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          How It Works
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <StepCard>
                <IconContainer>
                  {step.icon}
                </IconContainer>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    mb: 2,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "30%",
                      right: { xs: "auto", sm: "-16px" },
                      bottom: { xs: "-16px", sm: "auto" },
                      left: { xs: "50%", sm: "auto" },
                      width: { xs: "2px", sm: "32px" },
                      height: { xs: "32px", sm: "2px" },
                      background: `linear-gradient(${index % 2 === 0 ? "90deg" : "270deg"}, ${theme.palette.primary.main}40, transparent)`,
                      transform: { xs: "translateX(-50%)", sm: "none" },
                      display: { xs: "none", sm: "block" },
                      zIndex: 1,
                    }}
                  />
                )}
              </StepCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
