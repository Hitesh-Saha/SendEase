import { Box } from "@mui/material";
import HeroSection from "../components/HeroSection/HeroSection";
import Features from "../components/Features/Features";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import StatsSection from "../components/StatsSection/StatsSection";
import FAQ from "../components/FAQ/FAQ";
import CallToAction from "../components/CallToAction/CallToAction";

const HomePage = () => {
  return (    <Box sx={{ 
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #1A1A2E 0%, #232339 100%)',
      color: '#fff'
    }}>
      <HeroSection />      
      <Features />      
      <HowItWorks />
      <StatsSection />
      <FAQ />
      <CallToAction />
    </Box>
  );
};

export default HomePage;
