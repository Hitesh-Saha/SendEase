import { Box, Button } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

export const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`,
  },
}));

export const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  '& svg': {
    fontSize: 48,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '50%',
    padding: theme.spacing(2),
    color: 'white',
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main}, 
    ${theme.palette.primary.main})`,
  backgroundSize: '200% auto',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '50px',
  padding: '12px 32px',
  fontSize: '1.1rem',
  color: 'white',
  textTransform: 'none',
  boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
  '&:hover': {
    animation: `${shine} 2s linear infinite`,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${theme.palette.primary.main}60`,
  },
}));

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