import { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { CloudUpload, People, Speed, Security, Share, CloudDone } from "@mui/icons-material";

const countUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    '& .stats-icon': {
      animation: `${pulse} 0.5s ease-in-out`,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  animation: `${countUp} 1s ease-out forwards`,
}));

const StatsSection = () => {
  const theme = useTheme();
  const [counts, setCounts] = useState({
    files: 0,
    users: 0,
    data: 0,
    speed: 0,
    transfers: 0,
    uptime: 0,
  });

  const targetCounts = {
    files: 1000000,
    users: 50000,
    data: 10000,
    speed: 100,
    transfers: 1000000,
    uptime: 99.99,
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    const incrementCounts = (step: number) => {
      setCounts({
        files: Math.min(Math.floor((targetCounts.files / steps) * step), targetCounts.files),
        users: Math.min(Math.floor((targetCounts.users / steps) * step), targetCounts.users),
        data: Math.min(Math.floor((targetCounts.data / steps) * step), targetCounts.data),
        speed: Math.min(Math.floor((targetCounts.speed / steps) * step), targetCounts.speed),
        transfers: Math.min(Math.floor((targetCounts.transfers / steps) * step), targetCounts.transfers),
        uptime: Math.min(((targetCounts.uptime / steps) * step), targetCounts.uptime),
      });
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      incrementCounts(currentStep);
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: 'white' }} />,
      number: `${(counts.data / 1000).toFixed(1)}TB+`,
      label: 'Data Transferred',
      description: 'Total volume of secure transfers'
    },
    {
      icon: <People sx={{ fontSize: 40, color: 'white' }} />,
      number: `${(counts.users / 1000).toFixed(1)}K+`,
      label: 'Active Users',
      description: 'Growing user community'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'white' }} />,
      number: `${counts.speed}MB/s`,
      label: 'Transfer Speed',
      description: 'Average transfer rate'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'white' }} />,
      number: '256bit',
      label: 'AES Encryption',
      description: 'Military-grade security'
    },
    {
      icon: <Share sx={{ fontSize: 40, color: 'white' }} />,
      number: `${(counts.transfers / 1000000).toFixed(1)}M+`,
      label: 'File Transfers',
      description: 'Successful transfers'
    },
    {
      icon: <CloudDone sx={{ fontSize: 40, color: 'white' }} />,
      number: `${counts.uptime.toFixed(2)}%`,
      label: 'Uptime',
      description: 'Service reliability'
    },
  ];

  return (
    <Box
      component="section"
      id="stats"
      sx={{
        py: 15,
        background: `linear-gradient(180deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.background.paper} 50%,
          ${theme.palette.background.default} 100%)`,
      }}
    //   sx={{
    //     py: 10,
    //     position: 'relative',
    //     scrollMarginTop: "64px",
    //     '&::before': {
    //       content: '""',
    //       position: 'absolute',
    //       top: 0,
    //       left: 0,
    //       right: 0,
    //       height: '1px',
    //       background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, transparent)`,
    //     },
    //   }}
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
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          By the Numbers
        </Typography>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatsCard>
                <IconWrapper className="stats-icon">
                  {stat.icon}
                </IconWrapper>
                <StatNumber variant="h2">
                  {stat.number}
                </StatNumber>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                >
                  {stat.description}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
