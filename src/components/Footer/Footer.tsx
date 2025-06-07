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
  X
} from "@mui/icons-material";
import { socialLinks } from "../../lib/constants";

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
              <IconButton
                href={socialLinks.medium}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
                sx={{ color: 'text.secondary' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"></path></svg>
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
            Made by Hitesh Saha
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;