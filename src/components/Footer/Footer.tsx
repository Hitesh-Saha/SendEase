import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton,
  useTheme,
  Divider
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Email,
  Instagram,
  X,
} from "@mui/icons-material";
import { socialLinks } from "../../utils/utils";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderRadius: "15px 15px 0 0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              About SendEase
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SendEase is a modern file sharing platform that enables secure, fast, and easy peer-to-peer file transfers without the need for cloud storage.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Connect With Me
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                sx={{ color: 'text.secondary' }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                sx={{ color: 'text.secondary' }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                sx={{ color: 'text.secondary' }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                sx={{ color: 'text.secondary' }}
              >
                <X />
              </IconButton>
              <IconButton
                href={`mailto:${socialLinks.email}`}
                aria-label="Email"
                sx={{ color: 'text.secondary' }}
              >
                <Email />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} SendEase. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 1, sm: 0 } }}>
            Made with ❤️ by Hitesh Saha
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;