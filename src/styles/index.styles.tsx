import { SxProps, Theme } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

// Animations
export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const shine = keyframes`
  to {
    background-position: 200% center;
  }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const countUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Menu styles
export const glassMenu: SxProps<Theme> = {
  '& .MuiPaper-root': {
    background: (theme) => `${theme.palette.background.paper}CC`,
    backdropFilter: 'blur(8px)',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
  }
};

// Card styles
export const gradientCard: SxProps<Theme> = {
  background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  borderRadius: (theme) => theme.shape.borderRadius * 3,
  padding: (theme) => theme.spacing(6),
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: (theme) => `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
  }
};

// Floating icon styles
export const floatingIcon: SxProps<Theme> = {
  animation: `${float} 3s ease-in-out infinite`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 3,
  "& svg": {
    fontSize: 48,
    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: "50%",
    p: 2,
    color: "white",
  }
};

// Shimmer button styles
export const shimmerButton: SxProps<Theme> = {
  background: (theme) => `linear-gradient(90deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main}, 
    ${theme.palette.primary.main})`,
  backgroundSize: "200% auto",
  transition: "all 0.3s ease-in-out",
  borderRadius: "50px",
  px: 4,
  py: 1.5,
  fontSize: "1.1rem",
  color: "white",
  textTransform: "none",
  boxShadow: (theme) => `0 4px 15px ${theme.palette.primary.main}40`,
  "&:hover": {
    animation: `${shine} 2s linear infinite`,
    transform: "translateY(-2px)",
    boxShadow: (theme) => `0 8px 25px ${theme.palette.primary.main}60`,
  }
};

// Stat card styles
export const statCard: SxProps<Theme> = {
  p: 4,
  borderRadius: (theme) => theme.shape.borderRadius * 2,
  background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
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
    background: (theme) => `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
  }
};

// Status indicator styles
export const statusIndicator = (isConnected: boolean): SxProps<Theme> => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: (theme) => isConnected ? theme.palette.success.main : theme.palette.text.disabled,
  boxShadow: (theme) => isConnected ? `0 0 12px ${theme.palette.success.main}` : "none",
  transition: "all 0.3s ease"
});

// Container styles
export const pageContainer: SxProps<Theme> = {
  minHeight: "calc(100vh - 64px)",
  background: (theme) =>
    `linear-gradient(145deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
  py: { xs: 2, sm: 3, md: 4 },
  px: { xs: 1, sm: 2 },
};

// Glass morphism styles
export const glassBackground: SxProps<Theme> = {
  background: (theme) =>
    `linear-gradient(145deg, ${theme.palette.background.paper}80, ${theme.palette.background.default}40)`,
  backdropFilter: "blur(8px)",
  borderRadius: 2,
  p: { xs: 2, sm: 3, md: 4 },
  boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}10`,
};

export const glassBackgroundLight: SxProps<Theme> = {
  background: (theme) => `${theme.palette.background.paper}60`,
  backdropFilter: "blur(8px)",
  borderRadius: 2,
  p: { xs: 2, sm: 3 },
};

// Button styles
export const gradientButton: SxProps<Theme> = {
  background: (theme) =>
    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: "white",
  px: { xs: 3, sm: 4 },
  py: 1.5,
  borderRadius: 2,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
  },
};

// Text field styles
export const textField: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    background: (theme) => `${theme.palette.background.paper}80`,
    backdropFilter: "blur(8px)",
    borderRadius: 2,
  },
};

// Avatar styles
export const gradientAvatar: SxProps<Theme> = {
  width: { xs: 48, sm: 56 },
  height: { xs: 48, sm: 56 },
  boxShadow: (theme) => `0 0 0 4px ${theme.palette.background.paper}`,
  background: (theme) =>
    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
};

// Typography styles
export const gradientText: SxProps<Theme> = {
  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
  fontWeight: 700,
  background: (theme) =>
    `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

// Status message styles
export const statusMessage = (props: { status: string }): SxProps<Theme> => ({
  p: 2,
  borderRadius: 2,
  background: (theme) =>
    props.status.includes("Successfully")
      ? `${theme.palette.success.main}10`
      : props.status.includes("error")
      ? `${theme.palette.error.main}10`
      : `${theme.palette.info.main}10`,
  border: (theme) =>
    `1px solid ${
      props.status.includes("Successfully")
        ? theme.palette.success.main
        : props.status.includes("error")
        ? theme.palette.error.main
        : theme.palette.info.main
    }20`,
  color: "text.secondary",
  display: "flex",
  alignItems: "center",
  gap: 1,
});

// Progress bar styles
export const progressBar: SxProps<Theme> = {
  height: 12,
  borderRadius: 6,
  backgroundColor: (theme) => `${theme.palette.primary.main}20`,
  "& .MuiLinearProgress-bar": {
    background: (theme) =>
      `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: 6,
  },
};

// Dialog styles
export const glassDialog: SxProps<Theme> = {
  '& .MuiDialog-paper': {
    background: (theme) => `${theme.palette.background.paper}CC`,
    backdropFilter: "blur(8px)",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
  }
};

// Responsive section styles
export const sectionContainer: SxProps<Theme> = {
  py: { xs: 8, sm: 12, md: 15 },
  background: (theme) => `linear-gradient(180deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.background.paper} 50%,
    ${theme.palette.background.default} 100%)`,
};

// Connected button styles
export const connectedButton = (isDisconnect: boolean): SxProps<Theme> => ({
  borderRadius: 2,
  px: 4,
  py: 1.2,
  background: (theme) => isDisconnect
    ? `linear-gradient(120deg, ${theme.palette.secondary.main}, ${theme.palette.error.main})`
    : `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}30`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}40`,
  },
  transition: 'all 0.3s ease'
});

// Icon button styles
export const iconButton: SxProps<Theme> = {
  minWidth: 'auto',
  p: 1,
  borderRadius: 1,
  transition: 'all 0.2s',
  '&:hover': {
    background: (theme) => `${theme.palette.primary.main}20`,
    transform: 'scale(1.05)',
  }
};

// Heading styles for each section
export const sectionHeading: SxProps<Theme> = {
  fontWeight: 700,
  mb: { xs: 4, sm: 6, md: 8 },
  background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textAlign: 'center'
};

// Panel container styles
export const panelContainer: SxProps<Theme> = {
  background: (theme) => `${theme.palette.background.paper}40`,
  backdropFilter: "blur(12px)",
  borderRadius: 2,
  p: { xs: 2, sm: 3 },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: (theme) => `linear-gradient(90deg, transparent, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40, transparent)`,
  }
};
