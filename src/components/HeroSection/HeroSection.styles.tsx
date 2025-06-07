import { styled, keyframes } from "@mui/material/styles";
import { Box } from "@mui/material";

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

export const GlowingBox = styled(Box)(({ theme }) => ({
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

export const HeroImageContainer = styled(Box)(({ theme }) => ({
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

export const FloatingBox = styled(Box)(() => ({
  animation: `${float} 6s ease-in-out infinite`,
}));