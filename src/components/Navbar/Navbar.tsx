import { Box, Grid, Typography } from "@mui/material"
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <>
    <Box sx={{bgcolor: 'background.paper', width:'100%', alignItems:'center', display: 'flex', flexDirection: 'row', padding: '1rem', justifyContent: 'center'}}>
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center'}}>
            <img src={logo} height={'50rem'} width={'50rem'}/>
            <Typography variant="h4" color='textSecondary' fontWeight={600} letterSpacing={'0.2rem'}>
                SendEase
            </Typography>
        </Box>
    </Box>
    </>
  )
}

export default Navbar