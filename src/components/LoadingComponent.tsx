import { Box, Container, Grid, Skeleton } from "@mui/material";
import { pageContainer, glassBackground } from '../styles/index.styles';

const LoadingComponent = () => {
  return (
    <Box sx={pageContainer}>
        <Container maxWidth="xl">
          <Box sx={glassBackground}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Skeleton variant="circular" width={56} height={56} />
                <Skeleton variant="text" sx={{ fontSize: '2rem', width: 200, mt: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            </Grid>
          </Box>
        </Container>
    </Box>
  )
}

export default LoadingComponent