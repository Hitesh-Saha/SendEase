/**
 * Features component that showcases both product features and security features
 * in a unified, modern design with visual distinction between categories.
 */
import { Box, Container, Grid, Typography, Theme } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { allFeatures } from "../../lib/constants";

interface FeatureProps {
  category: "security" | "feature";
  theme?: Theme;
}

const shine = keyframes`
  0% { background-position: -100% }
  100% { background-position: 200% }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const FeatureCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "category",
})<FeatureProps>(({ theme, category }) => ({
  padding: theme.spacing(4),
  height: "100%",
  minHeight: "280px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, 
    ${theme.palette.background.paper}, 
    ${theme.palette.background.default},
    ${theme.palette.background.paper})`,
  backgroundSize: "200% 200%",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 12px 24px ${theme.palette.primary.main}20`,
    backgroundPosition: "100% 100%",
    "&::after": {
      transform: "rotate(30deg) scale(1.5)",
    },
    "& .feature-icon": {
      transform: "translateY(-5px)",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200px",
    height: "200px",
    background:
      category === "security"
        ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`
        : `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.primary.main}15)`,
    borderRadius: "50%",
    transition: "transform 0.5s ease-in-out",
    zIndex: 0,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background:
      category === "security"
        ? `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`
        : `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, ${theme.palette.primary.main}, transparent)`,
    backgroundSize: "200% 100%",
    animation: `${shine} 3s linear infinite`,
  },
}));

const StyledIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "category",
})<FeatureProps>(({ theme, category }) => ({
  background:
    category === "security"
      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
      : `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  borderRadius: "50%",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: "inline-flex",
  position: "relative",
  zIndex: 1,
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow:
    category === "security"
      ? `0 8px 16px ${theme.palette.primary.main}30`
      : `0 8px 16px ${theme.palette.secondary.main}30`,
}));

const StyledCategoryBadge = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "category",
})<FeatureProps>(({ theme, category }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  padding: "4px 8px",
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  zIndex: 2,
  background:
    category === "security"
      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
      : `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  color: theme.palette.common.white,
  letterSpacing: "0.5px",
}));

const Features = () => {
  return (
    <Box
      component="section"
      id="features"
      sx={{
        py: 15,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)`,
        scrollMarginTop: "64px",
      }}
    >
      <Container maxWidth="lg">
        {" "}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 800,
            mb: 2,
            position: "relative",
            background: (theme) =>
              `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            // "&::after": {
            //   content: '""',
            //   position: "absolute",
            //   bottom: "-16px",
            //   left: "50%",
            //   transform: "translateX(-50%)",
            //   width: "100px",
            //   height: "4px",
            //   background: (theme) =>
            //     `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            //   backgroundSize: "200% 100%",
            //   animation: `${shine} 3s linear infinite`,
            //   borderRadius: (theme) => theme.shape.borderRadius,
            // },
          }}
        >
          Powerful Features & Enterprise Security
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{
            mb: 8,
            maxWidth: 800,
            mx: "auto",
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          Experience lightning-fast file sharing with military-grade security.
          Modern, efficient, and completely private.
        </Typography>
        <Grid container spacing={4}>
          {allFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard
                category={feature.category as "security" | "feature"}
              >
                <StyledCategoryBadge
                  category={feature.category as "security" | "feature"}
                >
                  {feature.category}
                </StyledCategoryBadge>
                <StyledIconWrapper
                  className="feature-icon"
                  category={feature.category as "security" | "feature"}
                >
                  <Icon sx={{ fontSize: 40, color: "white" }}/>
                </StyledIconWrapper>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    position: "relative",
                    zIndex: 1,
                    mb: 2,
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: (theme) =>
                      feature.category === "security"
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          )})}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
