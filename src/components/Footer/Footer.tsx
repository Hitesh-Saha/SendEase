import { Box, Typography } from "@mui/material"

const Footer = () => {
  return (
    <Box sx={{bgcolor: 'background.paper', width:'100%', alignItems:'center', display: 'flex', flexDirection:'column', padding: '1rem', justifyContent: 'center'}}>
      <Typography variant="body1" color="" align="center">
        Developed with 💓 from Hitesh Coder 👨‍💻 
      </Typography>
      <Typography variant='body1'>
        Copyright @ Hitesh Saha | 2024
      </Typography>
    </Box>
  )
}

export default Footer